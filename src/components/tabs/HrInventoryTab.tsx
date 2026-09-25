import React, { useState, useMemo } from 'react';
import {
  Users,
  Package,
  Award,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Download,
  Building,
  Calendar,
  Box
} from 'lucide-react';
import { DatabaseState, Employee, InventoryLogEntry } from '../../types';
import { getDepartmentHeadcounts, getInventoryNetChanges } from '../../utils/analytics';
import { DonutChart } from '../charts/DonutChart';
import { BarChart } from '../charts/BarChart';
import { exportTableToCsv } from '../../utils/dataProcessor';

interface HrInventoryTabProps {
  database: DatabaseState;
}

export const HrInventoryTab: React.FC<HrInventoryTabProps> = ({ database }) => {
  const [subView, setSubView] = useState<'all' | 'hr' | 'inventory'>('all');

  const deptHeadcounts = useMemo(() => {
    return getDepartmentHeadcounts(database);
  }, [database]);

  const inventoryNetChanges = useMemo(() => {
    return getInventoryNetChanges(database);
  }, [database]);

  // HR events map by employee
  const eventsByEmployee = useMemo(() => {
    const map = new Map<string, typeof database.hr_events_log>();
    for (const evt of database.hr_events_log) {
      const arr = map.get(evt.employee_id) || [];
      arr.push(evt);
      map.set(evt.employee_id, arr);
    }
    return map;
  }, [database.hr_events_log]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Human Resources & Inventory Audits
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Artisan craft headcount distribution, certifications, and hardwood inventory stock balances
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTableToCsv('hr_roster_report', database.hr_roster)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HR CSV</span>
          </button>
          <button
            onClick={() => exportTableToCsv('inventory_ledger_report', database.inventory_log)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inventory CSV</span>
          </button>
        </div>
      </div>

      {/* Top 2 Visual Charts from Streamlit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HR Roster by Department */}
        <DonutChart
          title="Department Headcount Distribution"
          subtitle="Staff allocation across master woodcraft, industrial design, and operations"
          data={deptHeadcounts.map(d => ({
            label: d.category,
            value: d.count,
            color: d.color || '#3b82f6'
          }))}
          centerLabel="Personnel"
          centerValue={database.hr_roster.length.toString()}
        />

        {/* Inventory Log Summary: Net Quantity Change by Item */}
        <BarChart
          title="Net Quantity Change by Item"
          subtitle="Aggregate mill inbound stock vs shop floor assembly consumption"
          data={inventoryNetChanges.slice(0, 8).map(item => ({
            label: item.itemName.split(' ')[0] + ' ' + (item.itemName.split(' ')[1] || ''),
            value: Math.abs(item.netQuantityChange),
            sublabel: `${item.netQuantityChange >= 0 ? '+' : ''}${item.netQuantityChange} ${item.unit}`,
            color: item.netQuantityChange >= 0 ? '#10b981' : '#f59e0b',
            formattedValue: `${item.netQuantityChange >= 0 ? '+' : ''}${item.netQuantityChange}`
          }))}
          layout="vertical"
          height={200}
        />
      </div>

      {/* Detailed Tables Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HR Roster Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                HR Personnel Directory ({database.hr_roster.length})
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="p-2.5">ID / Name</th>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {database.hr_roster.map(emp => {
                  const events = eventsByEmployee.get(emp.employee_id);
                  return (
                    <tr key={emp.employee_id} className="hover:bg-slate-50/60">
                      <td className="p-2.5">
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <span className="font-mono text-[10px] text-slate-400">
                          {emp.employee_id} · {emp.studio_location}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700">{emp.department}</td>
                      <td className="p-2.5 text-slate-600 truncate max-w-[140px]">{emp.role}</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Log Movements Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Raw Timber & Fittings Ledger ({database.inventory_log.length})
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 max-h-[420px]">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] sticky top-0">
                <tr>
                  <th className="p-2.5">Item Stock</th>
                  <th className="p-2.5">Warehouse Bay</th>
                  <th className="p-2.5">Movement Reason</th>
                  <th className="p-2.5 text-right">Qty Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {database.inventory_log.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 font-sans">
                    <td className="p-2.5">
                      <p className="font-semibold text-slate-900 truncate max-w-[150px]">
                        {log.item_name}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400">{log.item_id}</span>
                    </td>
                    <td className="p-2.5 font-mono text-slate-600">{log.warehouse_bay}</td>
                    <td className="p-2.5 text-slate-600 truncate max-w-[130px]">{log.reason}</td>
                    <td
                      className={`p-2.5 text-right font-mono font-bold ${
                        log.quantity_change > 0 ? 'text-emerald-600' : 'text-amber-800'
                      }`}
                    >
                      {log.quantity_change > 0 ? `+${log.quantity_change}` : log.quantity_change}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">{log.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HR Events & Certifications Milestone Feed */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-800" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Craftsmanship Milestones & Safety Certifications
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {database.hr_events_log.map(evt => (
            <div
              key={evt.event_id}
              className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-amber-900">{evt.event_type}</span>
                <span className="text-slate-400">{evt.event_date}</span>
              </div>
              <p className="text-slate-700 leading-snug">{evt.notes}</p>
              <p className="text-[10px] font-mono text-slate-400">Employee ID: {evt.employee_id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
