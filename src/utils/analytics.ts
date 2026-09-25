import { DatabaseState, DesignProject, Order } from '../types';

export interface CategorySummary {
  category: string;
  count: number;
  totalAmount?: number;
  percentage?: number;
  color?: string;
}

export interface DesignerWorkload {
  designerId: string;
  designerName: string;
  department: string;
  role: string;
  activeProjects: number;
  completedProjects: number;
  totalPipelineValue: number;
  projects: DesignProject[];
}

export interface InventoryItemSummary {
  itemId: string;
  itemName: string;
  materialType: string;
  netQuantityChange: number;
  unit: string;
  warehouseBay: string;
  transactionCount: number;
}

export function calculateExecutiveKPIs(db: DatabaseState) {
  const totalOrders = db.orders_data.length;
  const totalRevenue = db.orders_data
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const customProjectsCount = db.design_log.length;
  const customPipelineValue = db.design_log.reduce(
    (acc, d) => acc + (d.estimated_cost || 0),
    0
  );

  const totalEmployees = db.hr_roster.filter(e => e.status === 'Active').length;

  const deliveredOrders = db.orders_data.filter(o => o.status === 'Delivered');
  const onTimeOrders = deliveredOrders.filter(o => o.delivery_status === 'On-Time');
  const onTimeRate =
    deliveredOrders.length > 0
      ? Math.round((onTimeOrders.length / deliveredOrders.length) * 100)
      : 100;

  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / (totalOrders - db.orders_data.filter(o => o.status === 'Cancelled').length || 1)) : 0;

  // Financial Ledger Net
  const ledgerRevenue = db.financial_ledger
    .filter(t => t.type === 'Revenue' || t.amount > 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const ledgerExpenses = db.financial_ledger
    .filter(t => t.type === 'Expense' || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = ledgerRevenue - ledgerExpenses;

  return {
    totalOrders,
    totalRevenue,
    customProjectsCount,
    customPipelineValue,
    totalEmployees,
    onTimeRate,
    avgOrderValue,
    ledgerRevenue,
    ledgerExpenses,
    netIncome
  };
}

export function getOrderStatusBreakdown(orders: Order[]): CategorySummary[] {
  const counts: Record<string, { count: number; amount: number }> = {};
  let total = 0;

  for (const o of orders) {
    const st = o.status || 'Processing';
    if (!counts[st]) counts[st] = { count: 0, amount: 0 };
    counts[st].count += 1;
    counts[st].amount += o.total_amount;
    total += 1;
  }

  const palette: Record<string, string> = {
    Delivered: '#10b981', // emerald-500
    Shipped: '#0ea5e9', // sky-500
    Processing: '#f59e0b', // amber-500
    Pending: '#8b5cf6', // violet-500
    Cancelled: '#ef4444' // red-500
  };

  return Object.entries(counts).map(([status, val]) => ({
    category: status,
    count: val.count,
    totalAmount: val.amount,
    percentage: total > 0 ? Math.round((val.count / total) * 100) : 0,
    color: palette[status] || '#64748b'
  }));
}

export function getDesignStatusBreakdown(designs: DesignProject[]): CategorySummary[] {
  const counts: Record<string, { count: number; cost: number }> = {};
  let total = 0;

  for (const d of designs) {
    const st = d.status || 'Drafting';
    if (!counts[st]) counts[st] = { count: 0, cost: 0 };
    counts[st].count += 1;
    counts[st].cost += d.estimated_cost;
    total += 1;
  }

  const palette: Record<string, string> = {
    Approved: '#10b981',
    'In Production': '#3b82f6',
    'In Review': '#f59e0b',
    Drafting: '#8b5cf6',
    Concept: '#94a3b8'
  };

  return Object.entries(counts).map(([status, val]) => ({
    category: status,
    count: val.count,
    totalAmount: val.cost,
    percentage: total > 0 ? Math.round((val.count / total) * 100) : 0,
    color: palette[status] || '#64748b'
  }));
}

export function getDeliveryPerformanceBreakdown(orders: Order[]): CategorySummary[] {
  const counts: Record<string, number> = {
    'On-Time': 0,
    Delayed: 0,
    'No Due Date / Active': 0
  };

  for (const o of orders) {
    const st = o.delivery_status || 'No Due Date / Active';
    counts[st] = (counts[st] || 0) + 1;
  }

  const palette: Record<string, string> = {
    'On-Time': '#10b981',
    Delayed: '#f43f5e',
    'No Due Date / Active': '#0ea5e9'
  };

  const total = orders.length;

  return Object.entries(counts).map(([cat, count]) => ({
    category: cat,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    color: palette[cat] || '#64748b'
  }));
}

export function getDesignerWorkloads(db: DatabaseState): DesignerWorkload[] {
  const designerMap: Record<string, DesignerWorkload> = {};

  // Index HR roster
  const employeeMap = new Map(db.hr_roster.map(e => [e.employee_id, e]));

  for (const proj of db.design_log) {
    const dId = proj.designer_id || 'UNKNOWN';
    if (!designerMap[dId]) {
      const emp = employeeMap.get(dId);
      designerMap[dId] = {
        designerId: dId,
        designerName: emp ? emp.name : `Designer (${dId})`,
        department: emp ? emp.department : 'Industrial Design',
        role: emp ? emp.role : 'Specialist',
        activeProjects: 0,
        completedProjects: 0,
        totalPipelineValue: 0,
        projects: []
      };
    }

    designerMap[dId].projects.push(proj);
    designerMap[dId].totalPipelineValue += proj.estimated_cost || 0;

    if (proj.status === 'Approved' || proj.completion_date) {
      designerMap[dId].completedProjects += 1;
    } else {
      designerMap[dId].activeProjects += 1;
    }
  }

  return Object.values(designerMap).sort(
    (a, b) => b.activeProjects - a.activeProjects || b.totalPipelineValue - a.totalPipelineValue
  );
}

export function getFinancialCategoryTotals(db: DatabaseState) {
  const catMap: Record<
    string,
    { category: string; count: number; totalAmount: number; type: 'Revenue' | 'Expense' }
  > = {};

  for (const txn of db.financial_ledger) {
    const cat = txn.account_category || 'Miscellaneous';
    if (!catMap[cat]) {
      catMap[cat] = {
        category: cat,
        count: 0,
        totalAmount: 0,
        type: txn.amount >= 0 ? 'Revenue' : 'Expense'
      };
    }
    catMap[cat].count += 1;
    catMap[cat].totalAmount += txn.amount;
  }

  return Object.values(catMap).sort((a, b) => Math.abs(b.totalAmount) - Math.abs(a.totalAmount));
}

export function getDepartmentHeadcounts(db: DatabaseState): CategorySummary[] {
  const deptCounts: Record<string, number> = {};
  for (const emp of db.hr_roster) {
    const dept = emp.department || 'Other';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  }

  const palette = ['#0284c7', '#0d9488', '#d97706', '#7c3aed', '#db2777', '#475569'];

  const total = db.hr_roster.length;
  return Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([dept, count], idx) => ({
      category: dept,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: palette[idx % palette.length]
    }));
}

export function getInventoryNetChanges(db: DatabaseState): InventoryItemSummary[] {
  const items: Record<string, InventoryItemSummary> = {};

  for (const log of db.inventory_log) {
    const id = log.item_id || 'UNKNOWN';
    if (!items[id]) {
      items[id] = {
        itemId: id,
        itemName: log.item_name || id,
        materialType: log.material_type || 'General',
        netQuantityChange: 0,
        unit: log.unit || 'Units',
        warehouseBay: log.warehouse_bay || 'Main',
        transactionCount: 0
      };
    }

    items[id].netQuantityChange += log.quantity_change;
    items[id].transactionCount += 1;
  }

  return Object.values(items).sort((a, b) => b.netQuantityChange - a.netQuantityChange);
}

export function getOrderHistogramBuckets(orders: Order[]) {
  const buckets = [
    { label: '$0 - $20k', min: 0, max: 20000, count: 0, total: 0 },
    { label: '$20k - $40k', min: 20000, max: 40000, count: 0, total: 0 },
    { label: '$40k - $60k', min: 40000, max: 60000, count: 0, total: 0 },
    { label: '$60k - $80k', min: 60000, max: 80000, count: 0, total: 0 },
    { label: '$80k+', min: 80000, max: Infinity, count: 0, total: 0 }
  ];

  for (const o of orders) {
    const amt = o.total_amount || 0;
    const bucket = buckets.find(b => amt >= b.min && amt < b.max);
    if (bucket) {
      bucket.count += 1;
      bucket.total += amt;
    }
  }

  return buckets;
}
