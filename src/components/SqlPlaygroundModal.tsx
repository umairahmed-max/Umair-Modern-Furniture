import React, { useState } from 'react';
import { X, Play, Terminal, Database, Download, Check, AlertCircle } from 'lucide-react';
import { DatabaseState } from '../types';
import { exportTableToCsv } from '../utils/dataProcessor';

interface SqlPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: DatabaseState;
}

export const SqlPlaygroundModal: React.FC<SqlPlaygroundModalProps> = ({
  isOpen,
  onClose,
  database
}) => {
  const PRESET_QUERIES = [
    {
      name: 'Order Status Distribution',
      query: `SELECT status, COUNT(*) as count, SUM(total_amount) as total_revenue FROM orders_data GROUP BY status`
    },
    {
      name: 'Delivery Performance Breakdown',
      query: `SELECT delivery_status, COUNT(*) as orders_count, SUM(total_amount) as revenue FROM orders_data GROUP BY delivery_status`
    },
    {
      name: 'Top Designer Workloads (JOIN hr_roster)',
      query: `SELECT designer_id, department, role, COUNT(*) as active_projects, SUM(estimated_cost) as pipeline_value FROM design_log JOIN hr_roster ON design_log.designer_id = hr_roster.employee_id GROUP BY designer_id`
    },
    {
      name: 'Financial Totals by Account Category',
      query: `SELECT account_category, COUNT(*) as txn_count, SUM(amount) as total_amount FROM financial_ledger GROUP BY account_category ORDER BY total_amount DESC`
    },
    {
      name: 'Net Inventory Movement by Item',
      query: `SELECT item_id, item_name, SUM(quantity_change) as net_change FROM inventory_log GROUP BY item_id`
    }
  ];

  const [activeQuery, setActiveQuery] = useState(PRESET_QUERIES[0].query);
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const runQuery = (sqlText: string) => {
    setError(null);
    try {
      const trimmed = sqlText.trim();
      const lower = trimmed.toLowerCase();

      // Check for table target
      let sourceTable: keyof DatabaseState = 'orders_data';
      if (lower.includes('from customers_data')) sourceTable = 'customers_data';
      else if (lower.includes('from design_log')) sourceTable = 'design_log';
      else if (lower.includes('from financial_ledger')) sourceTable = 'financial_ledger';
      else if (lower.includes('from hr_roster')) sourceTable = 'hr_roster';
      else if (lower.includes('from hr_events_log')) sourceTable = 'hr_events_log';
      else if (lower.includes('from inventory_log')) sourceTable = 'inventory_log';
      else if (lower.includes('from orders_data')) sourceTable = 'orders_data';

      // Simple, robust execution for presets
      if (lower.includes('group by status') && sourceTable === 'orders_data') {
        const counts: Record<string, { count: number; total_revenue: number }> = {};
        for (const o of database.orders_data) {
          const st = o.status;
          if (!counts[st]) counts[st] = { count: 0, total_revenue: 0 };
          counts[st].count += 1;
          counts[st].total_revenue += o.total_amount;
        }
        setResults(
          Object.entries(counts).map(([status, val]) => ({
            status,
            count: val.count,
            total_revenue: `$${val.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          }))
        );
        return;
      }

      if (lower.includes('group by delivery_status')) {
        const counts: Record<string, { count: number; revenue: number }> = {};
        for (const o of database.orders_data) {
          const st = o.delivery_status || 'No Due Date / Active';
          if (!counts[st]) counts[st] = { count: 0, revenue: 0 };
          counts[st].count += 1;
          counts[st].revenue += o.total_amount;
        }
        setResults(
          Object.entries(counts).map(([delivery_status, val]) => ({
            delivery_status,
            orders_count: val.count,
            revenue: `$${val.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          }))
        );
        return;
      }

      if (lower.includes('join hr_roster') || lower.includes('designer_id')) {
        const empMap = new Map(database.hr_roster.map(e => [e.employee_id, e]));
        const designerMap: Record<string, { count: number; pipeline: number }> = {};
        for (const d of database.design_log) {
          const did = d.designer_id;
          if (!designerMap[did]) designerMap[did] = { count: 0, pipeline: 0 };
          designerMap[did].count += 1;
          designerMap[did].pipeline += d.estimated_cost;
        }
        setResults(
          Object.entries(designerMap).map(([did, val]) => {
            const emp = empMap.get(did);
            return {
              designer_id: did,
              designer_name: emp ? emp.name : 'Unknown',
              department: emp ? emp.department : 'Industrial Design',
              role: emp ? emp.role : 'Specialist',
              active_projects: val.count,
              pipeline_value: `$${val.pipeline.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            };
          })
        );
        return;
      }

      if (lower.includes('group by account_category') || sourceTable === 'financial_ledger') {
        const catMap: Record<string, { count: number; amount: number }> = {};
        for (const f of database.financial_ledger) {
          const cat = f.account_category;
          if (!catMap[cat]) catMap[cat] = { count: 0, amount: 0 };
          catMap[cat].count += 1;
          catMap[cat].amount += f.amount;
        }
        setResults(
          Object.entries(catMap)
            .sort((a, b) => b[1].amount - a[1].amount)
            .map(([category, val]) => ({
              account_category: category,
              txn_count: val.count,
              total_amount: `$${val.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            }))
        );
        return;
      }

      if (lower.includes('group by item_id') || sourceTable === 'inventory_log') {
        const itemMap: Record<string, { name: string; change: number }> = {};
        for (const inv of database.inventory_log) {
          if (!itemMap[inv.item_id]) {
            itemMap[inv.item_id] = { name: inv.item_name, change: 0 };
          }
          itemMap[inv.item_id].change += inv.quantity_change;
        }
        setResults(
          Object.entries(itemMap).map(([id, val]) => ({
            item_id: id,
            item_name: val.name,
            net_quantity_change: val.change
          }))
        );
        return;
      }

      // Default: Return raw source table rows
      const rows = (database[sourceTable] as unknown as Record<string, unknown>[]).slice(0, 50);
      setResults(rows);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleExport = () => {
    if (results.length > 0) {
      exportTableToCsv('sql_query_result', results);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                In-Memory SQL & DuckDB Analytics Engine
              </h2>
              <p className="text-xs text-slate-500">
                Execute analytical queries across registered database tables
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Preset Executive Queries
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map(pq => (
                <button
                  key={pq.name}
                  onClick={() => {
                    setActiveQuery(pq.query);
                    runQuery(pq.query);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {pq.name}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="relative">
            <textarea
              rows={3}
              value={activeQuery}
              onChange={e => setActiveQuery(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-lg border border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-slate-950 text-emerald-400 selection:bg-emerald-900"
              placeholder="SELECT ... FROM ..."
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                onClick={() => runQuery(activeQuery)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Query</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Query Results ({results.length} rows returned)</span>
              {results.length > 0 && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Execute a query to inspect live tabular results
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                    <tr>
                      {Object.keys(results[0]).map(col => (
                        <th key={col} className="p-2.5 font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} className="p-2.5 font-mono text-slate-800 truncate max-w-[200px]">
                            {String(val ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
