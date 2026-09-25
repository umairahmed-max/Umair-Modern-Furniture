import { DatabaseState } from '../types';

export const INITIAL_SAMPLE_DATA: DatabaseState = {
  customers_data: [
    {
      customer_id: 'CUST-001',
      customer_name: 'Studio Kanso Architects',
      email: 'projects@kansoarchitects.com',
      segment: 'Commercial Architecture',
      signup_date: '2023-02-14',
      lifetime_value: 142500,
      location: 'San Francisco, CA',
      total_orders: 14
    },
    {
      customer_id: 'CUST-002',
      customer_name: 'Amanpuri Retreat & Spa',
      email: 'procurement@amanpuri.design',
      segment: 'Luxury Hospitality',
      signup_date: '2023-05-19',
      lifetime_value: 284000,
      location: 'Sedona, AZ',
      total_orders: 8
    },
    {
      customer_id: 'CUST-003',
      customer_name: 'Helena Vance Private Estate',
      email: 'hvance@vanceholdings.org',
      segment: 'Residential Bespoke',
      signup_date: '2023-09-02',
      lifetime_value: 68400,
      location: 'Aspen, CO',
      total_orders: 5
    },
    {
      customer_id: 'CUST-004',
      customer_name: 'Nordic Light Design Group',
      email: 'sourcing@nordiclight.se',
      segment: 'Retail Direct',
      signup_date: '2023-11-10',
      lifetime_value: 95200,
      location: 'New York, NY',
      total_orders: 12
    },
    {
      customer_id: 'CUST-005',
      customer_name: 'Equinox Capital HQ',
      email: 'facilities@equinoxcap.com',
      segment: 'Commercial Architecture',
      signup_date: '2024-01-15',
      lifetime_value: 198000,
      location: 'Chicago, IL',
      total_orders: 9
    },
    {
      customer_id: 'CUST-006',
      customer_name: 'Maison Miro Interior Studio',
      email: 'contact@maisonmiro.com',
      segment: 'Residential Bespoke',
      signup_date: '2024-03-22',
      lifetime_value: 54100,
      location: 'Seattle, WA',
      total_orders: 6
    },
    {
      customer_id: 'CUST-007',
      customer_name: 'Lumiere Boutique Hotels',
      email: 'development@lumierehotels.com',
      segment: 'Luxury Hospitality',
      signup_date: '2024-04-05',
      lifetime_value: 312000,
      location: 'Miami, FL',
      total_orders: 11
    },
    {
      customer_id: 'CUST-008',
      customer_name: 'The Modernist Gallery & Shop',
      email: 'orders@modernistcuration.com',
      segment: 'Retail Direct',
      signup_date: '2024-06-18',
      lifetime_value: 82400,
      location: 'Austin, TX',
      total_orders: 7
    }
  ],

  orders_data: [
    {
      order_id: 'ORD-9021',
      customer_id: 'CUST-001',
      order_date: '2024-05-12',
      fulfillment_date: '2024-06-08',
      due_date: '2024-06-10',
      total_amount: 32400.0,
      status: 'Delivered',
      items_count: 8,
      product_category: 'Workplace Desks & Credenzas',
      shipping_region: 'West Coast'
    },
    {
      order_id: 'ORD-9022',
      customer_id: 'CUST-002',
      order_date: '2024-05-18',
      fulfillment_date: '2024-06-25',
      due_date: '2024-06-20',
      total_amount: 58200.0,
      status: 'Delivered',
      items_count: 14,
      product_category: 'Lounge & Daybeds',
      shipping_region: 'Southwest'
    },
    {
      order_id: 'ORD-9023',
      customer_id: 'CUST-003',
      order_date: '2024-05-24',
      fulfillment_date: '2024-06-14',
      due_date: '2024-06-15',
      total_amount: 18900.0,
      status: 'Delivered',
      items_count: 4,
      product_category: 'Dining Tables & Chairs',
      shipping_region: 'Mountain'
    },
    {
      order_id: 'ORD-9024',
      customer_id: 'CUST-005',
      order_date: '2024-06-01',
      fulfillment_date: '2024-07-04',
      due_date: '2024-07-01',
      total_amount: 47500.0,
      status: 'Delivered',
      items_count: 12,
      product_category: 'Executive Boardroom Tables',
      shipping_region: 'Midwest'
    },
    {
      order_id: 'ORD-9025',
      customer_id: 'CUST-007',
      order_date: '2024-06-10',
      fulfillment_date: '2024-07-15',
      due_date: '2024-07-15',
      total_amount: 72000.0,
      status: 'Delivered',
      items_count: 22,
      product_category: 'Guest Suite Bedframes & Nightstands',
      shipping_region: 'Southeast'
    },
    {
      order_id: 'ORD-9026',
      customer_id: 'CUST-004',
      order_date: '2024-06-15',
      fulfillment_date: '2024-07-02',
      due_date: '2024-07-05',
      total_amount: 24300.0,
      status: 'Delivered',
      items_count: 10,
      product_category: 'Shelving & Bookcases',
      shipping_region: 'Northeast'
    },
    {
      order_id: 'ORD-9027',
      customer_id: 'CUST-006',
      order_date: '2024-06-20',
      fulfillment_date: null,
      due_date: '2024-07-28',
      total_amount: 16800.0,
      status: 'Processing',
      items_count: 3,
      product_category: 'Custom Sideboards',
      shipping_region: 'Pacific Northwest'
    },
    {
      order_id: 'ORD-9028',
      customer_id: 'CUST-008',
      order_date: '2024-06-25',
      fulfillment_date: null,
      due_date: '2024-08-05',
      total_amount: 29400.0,
      status: 'Processing',
      items_count: 9,
      product_category: 'Accent Chairs & Ottomans',
      shipping_region: 'South'
    },
    {
      order_id: 'ORD-9029',
      customer_id: 'CUST-001',
      order_date: '2024-07-02',
      fulfillment_date: null,
      due_date: '2024-08-12',
      total_amount: 38900.0,
      status: 'Shipped',
      items_count: 7,
      product_category: 'Conference Credenzas',
      shipping_region: 'West Coast'
    },
    {
      order_id: 'ORD-9030',
      customer_id: 'CUST-002',
      order_date: '2024-07-05',
      fulfillment_date: null,
      due_date: '2024-08-20',
      total_amount: 64100.0,
      status: 'Processing',
      items_count: 18,
      product_category: 'Outdoor Teak Loungers',
      shipping_region: 'Southwest'
    },
    {
      order_id: 'ORD-9031',
      customer_id: 'CUST-003',
      order_date: '2024-07-08',
      fulfillment_date: null,
      due_date: '2024-08-15',
      total_amount: 14500.0,
      status: 'Pending',
      items_count: 2,
      product_category: 'Solid Walnut Coffee Tables',
      shipping_region: 'Mountain'
    },
    {
      order_id: 'ORD-9032',
      customer_id: 'CUST-005',
      order_date: '2024-07-12',
      fulfillment_date: null,
      due_date: '2024-08-25',
      total_amount: 51200.0,
      status: 'Processing',
      items_count: 15,
      product_category: 'Acoustic Slat Storage Walls',
      shipping_region: 'Midwest'
    },
    {
      order_id: 'ORD-9033',
      customer_id: 'CUST-007',
      order_date: '2024-07-15',
      fulfillment_date: null,
      due_date: '2024-09-01',
      total_amount: 86000.0,
      status: 'Shipped',
      items_count: 25,
      product_category: 'Lobby Lounge Systems',
      shipping_region: 'Southeast'
    },
    {
      order_id: 'ORD-9034',
      customer_id: 'CUST-004',
      order_date: '2024-07-18',
      fulfillment_date: null,
      due_date: '2024-08-10',
      total_amount: 19800.0,
      status: 'Pending',
      items_count: 5,
      product_category: 'Sculptural Bookshelves',
      shipping_region: 'Northeast'
    },
    {
      order_id: 'ORD-9035',
      customer_id: 'CUST-006',
      order_date: '2024-07-20',
      fulfillment_date: null,
      due_date: '2024-08-30',
      total_amount: 22600.0,
      status: 'Processing',
      items_count: 4,
      product_category: 'Low-Profile Platform Beds',
      shipping_region: 'Pacific Northwest'
    },
    {
      order_id: 'ORD-9036',
      customer_id: 'CUST-008',
      order_date: '2024-06-05',
      fulfillment_date: null,
      due_date: '2024-06-28',
      total_amount: 12400.0,
      status: 'Cancelled',
      items_count: 2,
      product_category: 'End Tables',
      shipping_region: 'South'
    }
  ],

  design_log: [
    {
      design_id: 'DSG-401',
      design_name: 'Koto Fluted Credenza in Smoked Oak',
      designer_id: 'EMP-102',
      client_name: 'Studio Kanso Architects',
      category: 'Living',
      created_date: '2024-04-10',
      completion_date: '2024-05-15',
      status: 'Approved',
      estimated_cost: 8400.0,
      wood_material: 'Smoked White Oak',
      revision_count: 2
    },
    {
      design_id: 'DSG-402',
      design_name: 'Svea Cantilever Dining Table (12-Seater)',
      designer_id: 'EMP-102',
      client_name: 'Helena Vance Private Estate',
      category: 'Dining',
      created_date: '2024-04-18',
      completion_date: '2024-05-22',
      status: 'In Production',
      estimated_cost: 14200.0,
      wood_material: 'American Black Walnut',
      revision_count: 3
    },
    {
      design_id: 'DSG-403',
      design_name: 'Njord Modular Bouclé Sectional Frame',
      designer_id: 'EMP-103',
      client_name: 'Lumiere Boutique Hotels',
      category: 'Living',
      created_date: '2024-05-02',
      completion_date: '2024-06-12',
      status: 'In Production',
      estimated_cost: 21500.0,
      wood_material: 'Kiln-Dried Ash & Brass',
      revision_count: 1
    },
    {
      design_id: 'DSG-404',
      design_name: 'Aalto Executive Desk with Leather Inset',
      designer_id: 'EMP-104',
      client_name: 'Equinox Capital HQ',
      category: 'Workplace',
      created_date: '2024-05-11',
      completion_date: null,
      status: 'Drafting',
      estimated_cost: 11800.0,
      wood_material: 'European Walnut',
      revision_count: 4
    },
    {
      design_id: 'DSG-405',
      design_name: 'Kyoto Low-Profile Platform Bedframe',
      designer_id: 'EMP-102',
      client_name: 'Maison Miro Interior Studio',
      category: 'Bedroom',
      created_date: '2024-05-28',
      completion_date: '2024-06-30',
      status: 'Approved',
      estimated_cost: 9600.0,
      wood_material: 'White Hinoki & Oak',
      revision_count: 2
    },
    {
      design_id: 'DSG-406',
      design_name: 'Solstice Curved Reception Banquette',
      designer_id: 'EMP-103',
      client_name: 'Amanpuri Retreat & Spa',
      category: 'Architectural',
      created_date: '2024-06-03',
      completion_date: null,
      status: 'In Review',
      estimated_cost: 26800.0,
      wood_material: 'Burmese Teak',
      revision_count: 3
    },
    {
      design_id: 'DSG-407',
      design_name: 'Oskar Slat-Back Counter Stool Series',
      designer_id: 'EMP-104',
      client_name: 'The Modernist Gallery & Shop',
      category: 'Dining',
      created_date: '2024-06-15',
      completion_date: null,
      status: 'Concept',
      estimated_cost: 6500.0,
      wood_material: 'Torrefied Maple',
      revision_count: 1
    },
    {
      design_id: 'DSG-408',
      design_name: 'Vessel Monolithic Marble & Ash Console',
      designer_id: 'EMP-103',
      client_name: 'Helena Vance Private Estate',
      category: 'Living',
      created_date: '2024-06-22',
      completion_date: null,
      status: 'Drafting',
      estimated_cost: 13400.0,
      wood_material: 'Calacatta & Black Ash',
      revision_count: 2
    },
    {
      design_id: 'DSG-409',
      design_name: 'Nordic Grid Acoustic Partition Screen',
      designer_id: 'EMP-104',
      client_name: 'Nordic Light Design Group',
      category: 'Workplace',
      created_date: '2024-07-01',
      completion_date: null,
      status: 'In Review',
      estimated_cost: 8900.0,
      wood_material: 'White Oak & Wool Felt',
      revision_count: 1
    }
  ],

  financial_ledger: [
    {
      transaction_id: 'TXN-8801',
      transaction_date: '2024-05-12',
      account_category: 'Wholesale Revenue',
      amount: 32400.0,
      type: 'Revenue',
      description: 'Order ORD-9021 Studio Kanso Fulfillment Payment',
      invoice_ref: 'INV-2024-051'
    },
    {
      transaction_id: 'TXN-8802',
      transaction_date: '2024-05-15',
      account_category: 'Raw Materials - Hardwood',
      amount: -18500.0,
      type: 'Expense',
      description: 'Quarterly Kiln-Dried Walnut & White Oak Slabs (Allegheny Lumber)',
      invoice_ref: 'PO-LUMB-441'
    },
    {
      transaction_id: 'TXN-8803',
      transaction_date: '2024-05-18',
      account_category: 'Bespoke Custom Revenue',
      amount: 58200.0,
      type: 'Revenue',
      description: 'Order ORD-9022 Amanpuri Daybed Suite Deposit',
      invoice_ref: 'INV-2024-058'
    },
    {
      transaction_id: 'TXN-8804',
      transaction_date: '2024-05-22',
      account_category: 'Fabrication & CNC Tooling',
      amount: -6400.0,
      type: 'Expense',
      description: '5-Axis CNC Precision Spindle Service & Diamond Router Bits',
      invoice_ref: 'SVC-CNC-992'
    },
    {
      transaction_id: 'TXN-8805',
      transaction_date: '2024-05-24',
      account_category: 'Bespoke Custom Revenue',
      amount: 18900.0,
      type: 'Revenue',
      description: 'Order ORD-9023 Vance Dining Suite Balance',
      invoice_ref: 'INV-2024-062'
    },
    {
      transaction_id: 'TXN-8806',
      transaction_date: '2024-05-31',
      account_category: 'Salaries & Payroll',
      amount: -38200.0,
      type: 'Expense',
      description: 'Craftsmen & Engineering Bi-Weekly Payroll Allocation',
      invoice_ref: 'PAY-2024-05B'
    },
    {
      transaction_id: 'TXN-8807',
      transaction_date: '2024-06-01',
      account_category: 'Wholesale Revenue',
      amount: 47500.0,
      type: 'Revenue',
      description: 'Order ORD-9024 Equinox Capital Conference Installation',
      invoice_ref: 'INV-2024-071'
    },
    {
      transaction_id: 'TXN-8808',
      transaction_date: '2024-06-06',
      account_category: 'Hardware & Fittings',
      amount: -4800.0,
      type: 'Expense',
      description: 'Solid Brass Blum Concealed Hinges & Custom Pulls',
      invoice_ref: 'PO-HRD-1029'
    },
    {
      transaction_id: 'TXN-8809',
      transaction_date: '2024-06-10',
      account_category: 'Bespoke Custom Revenue',
      amount: 72000.0,
      type: 'Revenue',
      description: 'Order ORD-9025 Lumiere Hotel Phase 1 Delivery',
      invoice_ref: 'INV-2024-078'
    },
    {
      transaction_id: 'TXN-8810',
      transaction_date: '2024-06-15',
      account_category: 'Wholesale Revenue',
      amount: 24300.0,
      type: 'Revenue',
      description: 'Order ORD-9026 Nordic Light Shelving Contract',
      invoice_ref: 'INV-2024-082'
    },
    {
      transaction_id: 'TXN-8811',
      transaction_date: '2024-06-18',
      account_category: 'Logistics & White-Glove Freight',
      amount: -8900.0,
      type: 'Expense',
      description: 'Cross-Country Dedicated Climate-Controlled Crating & Transit',
      invoice_ref: 'FRT-CRATE-301'
    },
    {
      transaction_id: 'TXN-8812',
      transaction_date: '2024-06-30',
      account_category: 'Salaries & Payroll',
      amount: -38200.0,
      type: 'Expense',
      description: 'Artisans & Operations Monthly Payroll Allocation',
      invoice_ref: 'PAY-2024-06B'
    },
    {
      transaction_id: 'TXN-8813',
      transaction_date: '2024-07-02',
      account_category: 'Wholesale Revenue',
      amount: 38900.0,
      type: 'Revenue',
      description: 'Order ORD-9029 Kanso Conference Credenzas Deposit',
      invoice_ref: 'INV-2024-093'
    },
    {
      transaction_id: 'TXN-8814',
      transaction_date: '2024-07-06',
      account_category: 'Studio Overhead & Utilities',
      amount: -5100.0,
      type: 'Expense',
      description: 'Portland Kiln Facility 3-Phase Power & Dust Extraction',
      invoice_ref: 'UTL-PGE-704'
    },
    {
      transaction_id: 'TXN-8815',
      transaction_date: '2024-07-15',
      account_category: 'Bespoke Custom Revenue',
      amount: 86000.0,
      type: 'Revenue',
      description: 'Order ORD-9033 Lumiere Lounge Milestone Tranche',
      invoice_ref: 'INV-2024-102'
    }
  ],

  hr_roster: [
    {
      employee_id: 'EMP-101',
      name: 'Matthias Vance',
      department: 'Master Woodcraft',
      role: 'Head Cabinetmaker & Joinery Director',
      hire_date: '2021-03-01',
      status: 'Active',
      salary: 115000,
      studio_location: 'Portland Master Mill'
    },
    {
      employee_id: 'EMP-102',
      name: 'Astrid Lindholm',
      department: 'Industrial Design',
      role: 'Principal Furniture Architect',
      hire_date: '2021-08-15',
      status: 'Active',
      salary: 122000,
      studio_location: 'San Francisco Design Lab'
    },
    {
      employee_id: 'EMP-103',
      name: 'Julian Chen',
      department: 'Industrial Design',
      role: 'Senior Bespoke Product Designer',
      hire_date: '2022-02-10',
      status: 'Active',
      salary: 104000,
      studio_location: 'San Francisco Design Lab'
    },
    {
      employee_id: 'EMP-104',
      name: 'Elena Rostova',
      department: 'Industrial Design',
      role: 'Computational CAD & Prototyper',
      hire_date: '2022-09-01',
      status: 'Active',
      salary: 94000,
      studio_location: 'Portland Master Mill'
    },
    {
      employee_id: 'EMP-105',
      name: 'Marcus Brody',
      department: 'Master Woodcraft',
      role: 'Senior CNC Fabricator & Turner',
      hire_date: '2021-11-20',
      status: 'Active',
      salary: 88000,
      studio_location: 'Portland Master Mill'
    },
    {
      employee_id: 'EMP-106',
      name: 'Claire Beauchamp',
      department: 'Master Woodcraft',
      role: 'Hand Finisher & French Polisher',
      hire_date: '2023-01-14',
      status: 'Active',
      salary: 76000,
      studio_location: 'Portland Master Mill'
    },
    {
      employee_id: 'EMP-107',
      name: 'Devon Sterling',
      department: 'Operations & Logistics',
      role: 'Director of Supply Chain & Fulfillment',
      hire_date: '2022-05-04',
      status: 'Active',
      salary: 108000,
      studio_location: 'Portland Distribution Hub'
    },
    {
      employee_id: 'EMP-108',
      name: 'Samantha O\'Connor',
      department: 'Finance & Procurement',
      role: 'Senior Comptroller & Hardwood Buyer',
      hire_date: '2022-06-20',
      status: 'Active',
      salary: 102000,
      studio_location: 'Portland HQ'
    },
    {
      employee_id: 'EMP-109',
      name: 'Kofi Mensah',
      department: 'Client Relations',
      role: 'Architectural Accounts Director',
      hire_date: '2023-04-11',
      status: 'Active',
      salary: 98000,
      studio_location: 'San Francisco Design Lab'
    },
    {
      employee_id: 'EMP-110',
      name: 'Isabella Rossi',
      department: 'Operations & Logistics',
      role: 'QA Inspector & White-Glove Lead',
      hire_date: '2023-08-01',
      status: 'Active',
      salary: 72000,
      studio_location: 'Portland Distribution Hub'
    }
  ],

  hr_events_log: [
    {
      event_id: 'EVT-701',
      employee_id: 'EMP-102',
      event_date: '2024-03-15',
      event_type: 'Promotion',
      notes: 'Promoted to Principal Furniture Architect following Milan Triennale showcase'
    },
    {
      event_id: 'EVT-702',
      employee_id: 'EMP-105',
      event_date: '2024-04-20',
      event_type: 'Certification',
      notes: 'Mastered 5-Axis Homag CNC Automation Safety & Calibration'
    },
    {
      event_id: 'EVT-703',
      employee_id: 'EMP-101',
      event_date: '2024-05-10',
      event_type: 'Safety Milestone',
      notes: 'Recognized for 750 Consecutive Days Zero Incident Shop Floor Record'
    },
    {
      event_id: 'EVT-704',
      employee_id: 'EMP-103',
      event_date: '2024-06-01',
      event_type: 'Performance Review',
      notes: 'Exceeded custom bespoke delivery targets by 18%; awarded quarterly design merit'
    },
    {
      event_id: 'EVT-705',
      employee_id: 'EMP-109',
      event_date: '2024-06-25',
      event_type: 'Shift Adjustment',
      notes: 'Expanded client relations jurisdiction to East Coast Hospitality territory'
    }
  ],

  inventory_log: [
    {
      log_id: 'INV-LOG-01',
      item_id: 'LUMB-WALNUT-84',
      item_name: 'American Walnut 8/4 FAS Kiln-Dried Slabs',
      material_type: 'Hardwood Timber',
      timestamp: '2024-05-15 08:30:00',
      quantity_change: 120,
      unit: 'Board Feet (BF)',
      warehouse_bay: 'Bay A-12',
      reason: 'Mill Shipment Received'
    },
    {
      log_id: 'INV-LOG-02',
      item_id: 'LUMB-WALNUT-84',
      item_name: 'American Walnut 8/4 FAS Kiln-Dried Slabs',
      material_type: 'Hardwood Timber',
      timestamp: '2024-05-20 14:15:00',
      quantity_change: -45,
      unit: 'Board Feet (BF)',
      warehouse_bay: 'Bay A-12',
      reason: 'Bespoke Order ORD-9023 Milling Cut'
    },
    {
      log_id: 'INV-LOG-03',
      item_id: 'LUMB-OAK-WHITE-44',
      item_name: 'European White Oak 4/4 Rift-Sawn',
      material_type: 'Hardwood Timber',
      timestamp: '2024-05-18 09:00:00',
      quantity_change: 250,
      unit: 'Board Feet (BF)',
      warehouse_bay: 'Bay B-04',
      reason: 'Direct Mill Ingestion'
    },
    {
      log_id: 'INV-LOG-04',
      item_id: 'LUMB-OAK-WHITE-44',
      item_name: 'European White Oak 4/4 Rift-Sawn',
      material_type: 'Hardwood Timber',
      timestamp: '2024-06-02 11:30:00',
      quantity_change: -80,
      unit: 'Board Feet (BF)',
      warehouse_bay: 'Bay B-04',
      reason: 'CNC Credenza Assembly Allocation'
    },
    {
      log_id: 'INV-LOG-05',
      item_id: 'HRD-BLUM-SOFT',
      item_name: 'Blum Tip-On Concealed Soft Hinges (Pair)',
      material_type: 'Precision Hardware',
      timestamp: '2024-06-05 10:45:00',
      quantity_change: 150,
      unit: 'Sets',
      warehouse_bay: 'Bay C-01',
      reason: 'Hardware Restock Inbound'
    },
    {
      log_id: 'INV-LOG-06',
      item_id: 'HRD-BLUM-SOFT',
      item_name: 'Blum Tip-On Concealed Soft Hinges (Pair)',
      material_type: 'Precision Hardware',
      timestamp: '2024-06-12 16:00:00',
      quantity_change: -32,
      unit: 'Sets',
      warehouse_bay: 'Bay C-01',
      reason: 'Credenza Fitting Allocation'
    },
    {
      log_id: 'INV-LOG-07',
      item_id: 'FAB-BOUCLE-CREAM',
      item_name: 'Heavy Textured Belgian Bouclé Fabric',
      material_type: 'Textile',
      timestamp: '2024-06-10 13:00:00',
      quantity_change: 85,
      unit: 'Linear Yards',
      warehouse_bay: 'Bay D-03',
      reason: 'Textile Mill Shipment'
    },
    {
      log_id: 'INV-LOG-08',
      item_id: 'FAB-BOUCLE-CREAM',
      item_name: 'Heavy Textured Belgian Bouclé Fabric',
      material_type: 'Textile',
      timestamp: '2024-06-25 15:20:00',
      quantity_change: -28,
      unit: 'Linear Yards',
      warehouse_bay: 'Bay D-03',
      reason: 'Lounge Sectional Upholstery Allocation'
    },
    {
      log_id: 'INV-LOG-09',
      item_id: 'LUMB-TEAK-BURMA',
      item_name: 'Sustainably Sourced Burmese Teak Decking 6/4',
      material_type: 'Hardwood Timber',
      timestamp: '2024-06-28 09:15:00',
      quantity_change: 180,
      unit: 'Board Feet (BF)',
      warehouse_bay: 'Bay A-08',
      reason: 'Amanpuri Resort Project Timber Ingestion'
    },
    {
      log_id: 'INV-LOG-10',
      item_id: 'LUMB-TEAK-BURMA',
      item_name: 'Sustainably Sourced Burmese Teak Decking 6/4',
      material_type: 'Hardwood Timber',
      timestamp: '2024-07-08 14:00:00',
      quantity_change: -60,
      unit: 'Board Feet (BF)',
      warehouse_bay: 'Bay A-08',
      reason: 'Outdoor Lounge Louver Cutting'
    }
  ]
};
