import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { DatabaseState, Order } from '../../types';
import {
  getDeliveryPerformanceBreakdown,
  getOrderHistogramBuckets
} from '../../utils/analytics';
import { BarChart } from '../charts/BarChart';
import { exportTableToCsv } from '../../utils/dataProcessor';

interface OrdersFulfillmentTabProps {
  database: DatabaseState;
}

export const OrdersFulfillmentTab: React.FC<OrdersFulfillmentTabProps> = ({ database }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Order>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Quick lookup customer map
  const customerMap = useMemo(() => {
    return new Map(database.customers_data.map(c => [c.customer_id, c]));
  }, [database.customers_data]);

  const deliveryBreakdown = useMemo(() => {
    return getDeliveryPerformanceBreakdown(database.orders_data);
  }, [database.orders_data]);

  const histogramBuckets = useMemo(() => {
    return getOrderHistogramBuckets(database.orders_data);
  }, [database.orders_data]);

  // Filter & Sort
  const filteredOrders = useMemo(() => {
    return database.orders_data
      .filter(order => {
        const matchesSearch =
          order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.product_category &&
            order.product_category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customerMap.get(order.customer_id)?.customer_name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        const matchesDelivery =
          deliveryFilter === 'All' || order.delivery_status === deliveryFilter;

        return matchesSearch && matchesStatus && matchesDelivery;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [
    database.orders_data,
    searchTerm,
    statusFilter,
    deliveryFilter,
    sortField,
    sortDirection,
    customerMap
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Shipped':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'Processing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Pending':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Cancelled':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getDeliveryBadge = (deliveryStatus?: Order['delivery_status']) => {
    switch (deliveryStatus) {
      case 'On-Time':
        return {
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
          label: 'On-Time',
          style: 'text-emerald-700'
        };
      case 'Delayed':
        return {
          icon: <AlertCircle className="w-3 h-3 text-rose-600" />,
          label: 'Delayed',
          style: 'text-rose-700 font-semibold'
        };
      default:
        return {
          icon: <Clock className="w-3 h-3 text-sky-600" />,
          label: 'Active / Due Pending',
          style: 'text-slate-600'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Order Fulfillment & Delivery Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor client order cycles, contractual due dates, and shipment milestone integrity
          </p>
        </div>
        <button
          onClick={() => exportTableToCsv('orders_fulfillment_report', database.orders_data)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Visual Analytics Grid (from Streamlit) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance Breakdown */}
        <BarChart
          title="Delivery Performance Breakdown"
          subtitle="Contractual on-time delivery vs delayed fulfillment status"
          data={deliveryBreakdown.map(d => ({
            label: d.category,
            value: d.count,
            color: d.color,
            formattedValue: `${d.count} orders (${d.percentage}%)`
          }))}
          layout="horizontal"
        />

        {/* Distribution of Order Amounts */}
        <BarChart
          title="Distribution of Order Amounts"
          subtitle="Frequency breakdown by transaction contract size"
          data={histogramBuckets.map(b => ({
            label: b.label,
            value: b.count,
            color: '#d97706',
            formattedValue: `${b.count} orders`
          }))}
          layout="vertical"
          height={200}
        />
      </div>

      {/* Interactive Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, category..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-slate-50/50"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Delivery:</span>
              <select
                value={deliveryFilter}
                onChange={e => {
                  setDeliveryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              >
                <option value="All">All Deliveries</option>
                <option value="On-Time">On-Time</option>
                <option value="Delayed">Delayed</option>
                <option value="No Due Date / Active">No Due Date / Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
          <span>
            Showing {filteredOrders.length} of {database.orders_data.length} total orders
          </span>
          {(searchTerm || statusFilter !== 'All' || deliveryFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setDeliveryFilter('All');
                setCurrentPage(1);
              }}
              className="text-amber-800 hover:text-amber-900 font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => toggleSort('order_id')}
                  className="p-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">Client / Project</th>
                <th
                  onClick={() => toggleSort('order_date')}
                  className="p-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Order Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('due_date')}
                  className="p-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">Fulfillment</th>
                <th
                  onClick={() => toggleSort('total_amount')}
                  className="p-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">Status</th>
                <th className="p-3">Delivery Perf</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-slate-400 font-sans">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const client = customerMap.get(order.customer_id);
                  const delivery = getDeliveryBadge(order.delivery_status);

                  return (
                    <tr
                      key={order.order_id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-3 font-bold text-slate-900">{order.order_id}</td>
                      <td className="p-3 font-sans">
                        <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {client?.customer_name || order.customer_id}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {order.product_category}
                        </p>
                      </td>
                      <td className="p-3 text-slate-600">{order.order_date}</td>
                      <td className="p-3 text-slate-600">{order.due_date || '—'}</td>
                      <td className="p-3 text-slate-600">{order.fulfillment_date || 'In Progress'}</td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        ${order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 font-sans">
                        <div className={`flex items-center gap-1.5 text-xs ${delivery.style}`}>
                          {delivery.icon}
                          <span>{delivery.label}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-sans">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-bold text-slate-900">
                  Order Details: {selectedOrder.order_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-medium block">Client Name</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {customerMap.get(selectedOrder.customer_id)?.customer_name || selectedOrder.customer_id}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Total Value</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    ${selectedOrder.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Contract Order Date</span>
                  <span className="font-mono text-slate-700">{selectedOrder.order_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Contractual Due Date</span>
                  <span className="font-mono text-slate-700">{selectedOrder.due_date || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Fulfillment Date</span>
                  <span className="font-mono text-slate-700">{selectedOrder.fulfillment_date || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Delivery SLA Status</span>
                  <span className="font-semibold text-slate-900">{selectedOrder.delivery_status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Product Category</span>
                  <span className="text-slate-700">{selectedOrder.product_category}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Shipping Destination</span>
                  <span className="text-slate-700">{selectedOrder.shipping_region || 'Domestic'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
