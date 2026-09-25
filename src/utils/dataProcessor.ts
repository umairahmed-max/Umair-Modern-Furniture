import Papa from 'papaparse';
import {
  AuditLogItem,
  Customer,
  DatabaseState,
  DesignProject,
  Employee,
  FinancialTransaction,
  HrEvent,
  InventoryLogEntry,
  Order
} from '../types';

export function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[\s\-]+/g, '_');
}

export function cleanString(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

export function cleanNumber(val: unknown, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(String(val).replace(/[^0-9.-]+/g, ''));
  return isNaN(num) ? fallback : num;
}

export function titleCase(val: unknown): string {
  const str = cleanString(val);
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function computeDeliveryStatus(
  dueDate: string | null | undefined,
  fulfillmentDate: string | null | undefined,
  currentStatus: string
): 'On-Time' | 'Delayed' | 'No Due Date / Active' {
  if (currentStatus === 'Cancelled') return 'No Due Date / Active';
  if (!dueDate) return 'No Due Date / Active';
  if (fulfillmentDate) {
    return fulfillmentDate <= dueDate ? 'On-Time' : 'Delayed';
  }
  // If not fulfilled yet, check if past due date
  const today = new Date().toISOString().split('T')[0];
  if (today > dueDate) {
    return 'Delayed';
  }
  return 'No Due Date / Active';
}

export interface IngestionResult {
  updatedDatabase: DatabaseState;
  auditLogs: AuditLogItem[];
  tablesUpdated: string[];
}

export async function processUploadedCsvFiles(
  files: File[],
  currentDatabase: DatabaseState
): Promise<IngestionResult> {
  const auditLogs: AuditLogItem[] = [];
  const tablesUpdated: string[] = [];
  const newDb: DatabaseState = {
    customers_data: [...currentDatabase.customers_data],
    orders_data: [...currentDatabase.orders_data],
    design_log: [...currentDatabase.design_log],
    financial_ledger: [...currentDatabase.financial_ledger],
    hr_roster: [...currentDatabase.hr_roster],
    hr_events_log: [...currentDatabase.hr_events_log],
    inventory_log: [...currentDatabase.inventory_log]
  };

  const fileMappings: Record<string, keyof DatabaseState> = {
    customers_data: 'customers_data',
    customers: 'customers_data',
    orders_data: 'orders_data',
    orders: 'orders_data',
    design_log: 'design_log',
    designs: 'design_log',
    design: 'design_log',
    financial_ledger: 'financial_ledger',
    finance: 'financial_ledger',
    ledger: 'financial_ledger',
    hr_roster: 'hr_roster',
    roster: 'hr_roster',
    employees: 'hr_roster',
    hr_events_log: 'hr_events_log',
    hr_events: 'hr_events_log',
    inventory_log: 'inventory_log',
    inventory: 'inventory_log'
  };

  for (const file of files) {
    const rawName = file.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    let matchedTable: keyof DatabaseState | null = null;

    for (const [key, targetTable] of Object.entries(fileMappings)) {
      if (rawName.includes(key)) {
        matchedTable = targetTable;
        break;
      }
    }

    if (!matchedTable) {
      auditLogs.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        tableName: file.name,
        message: `Could not auto-map file "${file.name}" to a recognized table. Please name it e.g. orders_data.csv`,
        type: 'warning'
      });
      continue;
    }

    try {
      const text = await file.text();
      const parsed = Papa.parse<Record<string, unknown>>(text, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: normalizeHeader
      });

      const rawRows = parsed.data;
      const initialCount = rawRows.length;

      if (matchedTable === 'customers_data') {
        const seen = new Set<string>();
        const cleaned: Customer[] = [];
        for (const row of rawRows) {
          const id = cleanString(row.customer_id || row.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);

          cleaned.push({
            customer_id: id,
            customer_name: cleanString(row.customer_name || row.name || 'Anonymous'),
            email: cleanString(row.email),
            segment: (titleCase(row.segment) as Customer['segment']) || 'Retail Direct',
            signup_date: cleanString(row.signup_date || row.date),
            lifetime_value: cleanNumber(row.lifetime_value || row.ltv),
            location: cleanString(row.location || 'Unknown'),
            total_orders: cleanNumber(row.total_orders, 0)
          });
        }
        newDb.customers_data = cleaned;
        tablesUpdated.push('customers_data');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'customers_data',
          message: `Ingested ${cleaned.length} customers (removed ${initialCount - cleaned.length} duplicates/blanks).`,
          type: 'success',
          rowCount: cleaned.length,
          dedupCount: initialCount - cleaned.length
        });
      } else if (matchedTable === 'orders_data') {
        const seen = new Set<string>();
        const cleaned: Order[] = [];
        for (const row of rawRows) {
          const id = cleanString(row.order_id || row.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);

          const status = (titleCase(row.status) as Order['status']) || 'Processing';
          const dueDate = cleanString(row.due_date);
          const fulfillmentDate = cleanString(row.fulfillment_date) || null;

          cleaned.push({
            order_id: id,
            customer_id: cleanString(row.customer_id),
            order_date: cleanString(row.order_date || row.date),
            fulfillment_date: fulfillmentDate,
            due_date: dueDate || null,
            total_amount: cleanNumber(row.total_amount || row.amount),
            status,
            delivery_status: computeDeliveryStatus(dueDate, fulfillmentDate, status),
            items_count: cleanNumber(row.items_count, 1),
            product_category: cleanString(row.product_category || 'Handcrafted Furniture'),
            shipping_region: cleanString(row.shipping_region || 'Domestic')
          });
        }
        newDb.orders_data = cleaned;
        tablesUpdated.push('orders_data');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'orders_data',
          message: `Ingested ${cleaned.length} orders (calculated delivery statuses, removed ${initialCount - cleaned.length} duplicates).`,
          type: 'success',
          rowCount: cleaned.length,
          dedupCount: initialCount - cleaned.length
        });
      } else if (matchedTable === 'design_log') {
        const seen = new Set<string>();
        const cleaned: DesignProject[] = [];
        for (const row of rawRows) {
          const id = cleanString(row.design_id || row.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);

          cleaned.push({
            design_id: id,
            design_name: cleanString(row.design_name || row.name || 'Custom Piece'),
            designer_id: cleanString(row.designer_id || row.employee_id),
            client_name: cleanString(row.client_name || row.client),
            category: (titleCase(row.category) as DesignProject['category']) || 'Living',
            created_date: cleanString(row.created_date || row.date),
            completion_date: cleanString(row.completion_date) || null,
            status: (titleCase(row.status) as DesignProject['status']) || 'Drafting',
            estimated_cost: cleanNumber(row.estimated_cost || row.cost),
            wood_material: cleanString(row.wood_material || 'American Hardwood'),
            revision_count: cleanNumber(row.revision_count, 0)
          });
        }
        newDb.design_log = cleaned;
        tablesUpdated.push('design_log');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'design_log',
          message: `Ingested ${cleaned.length} custom design projects.`,
          type: 'success',
          rowCount: cleaned.length
        });
      } else if (matchedTable === 'financial_ledger') {
        const seen = new Set<string>();
        const cleaned: FinancialTransaction[] = [];
        for (const row of rawRows) {
          const id = cleanString(row.transaction_id || row.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);

          const amt = cleanNumber(row.amount);
          const type = amt >= 0 ? 'Revenue' : 'Expense';

          cleaned.push({
            transaction_id: id,
            transaction_date: cleanString(row.transaction_date || row.date),
            account_category: titleCase(row.account_category || 'General Operations'),
            amount: amt,
            type,
            description: cleanString(row.description),
            invoice_ref: cleanString(row.invoice_ref)
          });
        }
        newDb.financial_ledger = cleaned;
        tablesUpdated.push('financial_ledger');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'financial_ledger',
          message: `Ingested ${cleaned.length} financial transactions with category classification.`,
          type: 'success',
          rowCount: cleaned.length
        });
      } else if (matchedTable === 'hr_roster') {
        const seen = new Set<string>();
        const cleaned: Employee[] = [];
        for (const row of rawRows) {
          const id = cleanString(row.employee_id || row.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);

          cleaned.push({
            employee_id: id,
            name: cleanString(row.name || row.employee_name),
            department: (titleCase(row.department) as Employee['department']) || 'Master Woodcraft',
            role: cleanString(row.role || 'Specialist'),
            hire_date: cleanString(row.hire_date || row.date),
            status: (titleCase(row.status) as Employee['status']) || 'Active',
            salary: cleanNumber(row.salary, 85000),
            studio_location: cleanString(row.studio_location || 'Portland Master Mill')
          });
        }
        newDb.hr_roster = cleaned;
        tablesUpdated.push('hr_roster');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'hr_roster',
          message: `Ingested ${cleaned.length} team members into HR roster.`,
          type: 'success',
          rowCount: cleaned.length
        });
      } else if (matchedTable === 'hr_events_log') {
        const seen = new Set<string>();
        const cleaned: HrEvent[] = [];
        for (const row of rawRows) {
          const id = cleanString(row.event_id || row.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);

          cleaned.push({
            event_id: id,
            employee_id: cleanString(row.employee_id),
            event_date: cleanString(row.event_date || row.date),
            event_type: (titleCase(row.event_type) as HrEvent['event_type']) || 'Certification',
            notes: cleanString(row.notes || row.description)
          });
        }
        newDb.hr_events_log = cleaned;
        tablesUpdated.push('hr_events_log');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'hr_events_log',
          message: `Ingested ${cleaned.length} HR milestone events.`,
          type: 'success',
          rowCount: cleaned.length
        });
      } else if (matchedTable === 'inventory_log') {
        const cleaned: InventoryLogEntry[] = [];
        for (const row of rawRows) {
          cleaned.push({
            log_id: cleanString(row.log_id || crypto.randomUUID().slice(0, 8)),
            item_id: cleanString(row.item_id),
            item_name: cleanString(row.item_name || 'Timber Stock'),
            material_type: cleanString(row.material_type || 'Raw Material'),
            timestamp: cleanString(row.timestamp || row.date),
            quantity_change: cleanNumber(row.quantity_change || row.qty),
            unit: cleanString(row.unit || 'Units'),
            warehouse_bay: cleanString(row.warehouse_bay || 'Main Bay'),
            reason: cleanString(row.reason || 'Inventory Transaction')
          });
        }
        newDb.inventory_log = cleaned;
        tablesUpdated.push('inventory_log');
        auditLogs.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          tableName: 'inventory_log',
          message: `Ingested ${cleaned.length} inventory ledger events.`,
          type: 'success',
          rowCount: cleaned.length
        });
      }
    } catch (err) {
      auditLogs.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        tableName: file.name,
        message: `Error processing file: ${(err as Error).message}`,
        type: 'error'
      });
    }
  }

  return {
    updatedDatabase: newDb,
    auditLogs,
    tablesUpdated
  };
}

export function exportTableToCsv(
  filename: string,
  rows: unknown[]
): void {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
