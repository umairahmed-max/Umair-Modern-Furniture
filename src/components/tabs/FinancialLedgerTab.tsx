import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { DatabaseState, FinancialTransaction } from '../../types';
import { getFinancialCategoryTotals } from '../../utils/analytics';
import { BarChart } from '../charts/BarChart';
import { exportTableToCsv } from '../../utils/dataProcessor';

interface FinancialLedgerTabProps {
  database: DatabaseState;
}

export const FinancialLedgerTab: React.FC<FinancialLedgerTabProps> = ({ database }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Revenue' | 'Expense'>('All');

  const categoryTotals = useMemo(() => {
    return getFinancialCategoryTotals(database);
  }, [database]);

  // Aggregate totals
  const totalRevenue = useMemo(() => {
    return database.financial_ledger
      .filter(t => t.type === 'Revenue' || t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [database.financial_ledger]);

  const totalExpense = useMemo(() => {
    return database.financial_ledger
      .filter(t => t.type === 'Expense' || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [database.financial_ledger]);

  const netBalance = totalRevenue - totalExpense;
  const marginPct = totalRevenue > 0 ? Math.round((netBalance / totalRevenue) * 100) : 0;

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return database.financial_ledger.filter(txn => {
      const matchesSearch =
        txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (txn.invoice_ref && txn.invoice_ref.toLowerCase().includes(searchTerm.toLowerCase())) ||
        txn.account_category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || txn.account_category === categoryFilter;

      const matchesType =
        typeFilter === 'All' ||
        (typeFilter === 'Revenue' && txn.amount >= 0) ||
        (typeFilter === 'Expense' && txn.amount < 0);

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [database.financial_ledger, searchTerm, categoryFilter, typeFilter]);

  const distinctCategories = useMemo(() => {
    return Array.from(new Set(database.financial_ledger.map(t => t.account_category)));
  }, [database.financial_ledger]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Ledger & Account Category Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational cashflow, raw hardwood timber procurement, fabrication expenses, and client revenues
          </p>
        </div>
        <button
          onClick={() => exportTableToCsv('financial_ledger_report', database.financial_ledger)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Financial Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gross Inflow
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-emerald-600">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Wholesale & bespoke deposits</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Operating Outflow
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-rose-600">
            ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Materials, CNC tooling, payroll</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Operating Balance
            </span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`mt-2 text-2xl font-bold font-mono ${
              netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Available operational liquidity</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Operating Margin
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-amber-900">{marginPct}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Efficiency before tax & depreciation</p>
        </div>
      </div>

      {/* Financial Totals by Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChart
            title="Financial Totals by Account Category"
            subtitle="Categorical breakdown of business cash inflows and expense obligations"
            data={categoryTotals.map(cat => ({
              label: cat.category,
              value: Math.abs(cat.totalAmount),
              sublabel: `${cat.count} txns`,
              color: cat.totalAmount >= 0 ? '#10b981' : '#f43f5e',
              formattedValue: `${cat.totalAmount >= 0 ? '+' : '-'}$${Math.abs(
                cat.totalAmount
              ).toLocaleString()}`
            }))}
            layout="horizontal"
          />
        </div>

        {/* Category Breakdown Table Summary */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Account Category Totals
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {categoryTotals.map(item => (
                <div key={item.category} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.category}</p>
                    <p className="text-[11px] text-slate-400">{item.count} ledger records</p>
                  </div>
                  <span
                    className={`font-mono font-bold shrink-0 ${
                      item.totalAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.totalAmount >= 0 ? '+' : ''}$
                    {item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description, invoice ref, category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white"
            >
              <option value="All">All Categories</option>
              {distinctCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as 'All' | 'Revenue' | 'Expense')}
              className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white"
            >
              <option value="All">All Types</option>
              <option value="Revenue">Inflows (Revenue)</option>
              <option value="Expense">Outflows (Expense)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Txn ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Account Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Invoice Ref</th>
                <th className="p-3 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-400 font-sans">
                    No transactions match criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(txn => (
                  <tr key={txn.transaction_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{txn.transaction_id}</td>
                    <td className="p-3 font-mono text-slate-600">{txn.transaction_date}</td>
                    <td className="p-3">
                      <span className="font-medium text-slate-800">{txn.account_category}</span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-sm truncate">{txn.description}</td>
                    <td className="p-3 font-mono text-slate-500">
                      {txn.invoice_ref ? (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                          {txn.invoice_ref}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-bold ${
                        txn.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {txn.amount >= 0 ? '+' : ''}$
                      {txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
