import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  Palette,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { DatabaseState } from '../../types';
import {
  calculateExecutiveKPIs,
  getOrderStatusBreakdown,
  getDesignStatusBreakdown
} from '../../utils/analytics';
import { MetricCard } from '../charts/MetricCard';
import { DonutChart } from '../charts/DonutChart';
import { BarChart } from '../charts/BarChart';

interface ExecutiveSummaryTabProps {
  database: DatabaseState;
  onNavigateToTab: (tabId: string) => void;
}

export const ExecutiveSummaryTab: React.FC<ExecutiveSummaryTabProps> = ({
  database,
  onNavigateToTab
}) => {
  const kpis = calculateExecutiveKPIs(database);
  const orderBreakdown = getOrderStatusBreakdown(database.orders_data);
  const designBreakdown = getDesignStatusBreakdown(database.design_log);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Furniture Co. Performance Scorecard</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Artisanal Craftsmanship, Scaled Operations
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            Real-time synchronization across bespoke custom designs, order fulfillment pipeline, master timber inventories, and financial ledger.
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={kpis.totalOrders.toLocaleString()}
          subtitle="Across commercial & residential accounts"
          icon={ShoppingBag}
          trend={{ value: '14.2% vs prev quarter', isPositive: true }}
          highlightColor="blue"
        />

        <MetricCard
          title="Total Order Revenue"
          value={`$${kpis.totalRevenue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}`}
          subtitle={`Avg Order Value: $${kpis.avgOrderValue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: '8.6% growth', isPositive: true }}
          highlightColor="emerald"
        />

        <MetricCard
          title="Custom Design Pipeline"
          value={kpis.customProjectsCount.toString()}
          subtitle={`$${kpis.customPipelineValue.toLocaleString()} in active design`}
          icon={Palette}
          trend={{ value: '3 new approvals', isPositive: true }}
          highlightColor="amber"
        />

        <MetricCard
          title="Active Personnel"
          value={kpis.totalEmployees.toString()}
          subtitle="Master woodcraft & design team"
          icon={Users}
          highlightColor="purple"
        />
      </div>

      {/* Secondary Operational Health Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">On-Time Fulfillment Rate</p>
              <p className="text-lg font-bold font-mono text-slate-900">{kpis.onTimeRate}%</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Ledger Net Cash Flow</p>
              <p className={`text-lg font-bold font-mono ${kpis.netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${kpis.netIncome.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('financial')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Custom Pipeline Value</p>
              <p className="text-lg font-bold font-mono text-slate-900">
                ${kpis.customPipelineValue.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('designs')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Designs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Distribution Donut Chart */}
        <DonutChart
          title="Order Distribution by Status"
          subtitle="Proportion of orders currently in each fulfillment stage"
          data={orderBreakdown.map(b => ({
            label: b.category,
            value: b.count,
            color: b.color || '#0284c7'
          }))}
          centerLabel="Total Orders"
          centerValue={kpis.totalOrders.toString()}
        />

        {/* Custom Design Projects Bar Chart */}
        <BarChart
          title="Design Projects by Status"
          subtitle="Pipeline stages from early concept drafting to shop-floor production"
          data={designBreakdown.map(d => ({
            label: d.category,
            value: d.count,
            sublabel: `$${(d.totalAmount || 0).toLocaleString()}`,
            color: d.color,
            formattedValue: `${d.count} projects`
          }))}
          layout="vertical"
          height={200}
        />
      </div>

      {/* Quick Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent High-Priority Orders */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">High-Value Active Orders</h4>
              <p className="text-xs text-slate-500">Commercial & luxury hospitality commissions</p>
            </div>
            <button
              onClick={() => onNavigateToTab('orders')}
              className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All ({database.orders_data.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {database.orders_data
              .slice()
              .sort((a, b) => b.total_amount - a.total_amount)
              .slice(0, 4)
              .map(order => (
                <div key={order.order_id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{order.order_id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-700 font-medium truncate max-w-[180px]">
                        {order.product_category || order.customer_id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ordered {order.order_date} · Due {order.due_date || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-slate-900">
                      ${order.total_amount.toLocaleString()}
                    </p>
                    <span className="text-[11px] font-medium text-slate-600">{order.status}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Featured Custom Bespoke Commissions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Active Custom Commissions</h4>
              <p className="text-xs text-slate-500">Bespoke studio projects and materials</p>
            </div>
            <button
              onClick={() => onNavigateToTab('designs')}
              className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All ({database.design_log.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {database.design_log.slice(0, 4).map(design => (
              <div key={design.design_id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-900 truncate max-w-[220px]">
                    {design.design_name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {design.wood_material} · {design.client_name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-slate-900">
                    ${design.estimated_cost.toLocaleString()}
                  </p>
                  <span className="text-[11px] font-medium text-amber-800">{design.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
