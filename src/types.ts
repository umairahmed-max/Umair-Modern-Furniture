export interface Customer {
  customer_id: string;
  customer_name: string;
  email: string;
  segment: 'Commercial Architecture' | 'Luxury Hospitality' | 'Residential Bespoke' | 'Retail Direct';
  signup_date: string;
  lifetime_value: number;
  location: string;
  total_orders: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  fulfillment_date: string | null;
  due_date: string | null;
  total_amount: number;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Pending' | 'Cancelled';
  delivery_status?: 'On-Time' | 'Delayed' | 'No Due Date / Active';
  items_count?: number;
  product_category?: string;
  shipping_region?: string;
}

export interface DesignProject {
  design_id: string;
  design_name: string;
  designer_id: string;
  client_name: string;
  category: 'Living' | 'Dining' | 'Workplace' | 'Bedroom' | 'Architectural';
  created_date: string;
  completion_date: string | null;
  status: 'In Review' | 'In Production' | 'Drafting' | 'Approved' | 'Concept';
  estimated_cost: number;
  wood_material: string;
  revision_count: number;
}

export interface FinancialTransaction {
  transaction_id: string;
  transaction_date: string;
  account_category: string;
  amount: number;
  type: 'Revenue' | 'Expense';
  description: string;
  invoice_ref?: string;
}

export interface Employee {
  employee_id: string;
  name: string;
  department: 'Master Woodcraft' | 'Industrial Design' | 'Operations & Logistics' | 'Finance & Procurement' | 'Client Relations';
  role: string;
  hire_date: string;
  status: 'Active' | 'On Leave';
  salary?: number;
  studio_location?: string;
}

export interface HrEvent {
  event_id: string;
  employee_id: string;
  event_date: string;
  event_type: 'Promotion' | 'Certification' | 'Performance Review' | 'Safety Milestone' | 'Shift Adjustment';
  notes: string;
}

export interface InventoryLogEntry {
  log_id?: string;
  item_id: string;
  item_name: string;
  material_type: string;
  timestamp: string;
  quantity_change: number;
  unit: string;
  warehouse_bay: string;
  reason: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  tableName: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  rowCount?: number;
  dedupCount?: number;
}

export interface DatabaseState {
  customers_data: Customer[];
  orders_data: Order[];
  design_log: DesignProject[];
  financial_ledger: FinancialTransaction[];
  hr_roster: Employee[];
  hr_events_log: HrEvent[];
  inventory_log: InventoryLogEntry[];
}
