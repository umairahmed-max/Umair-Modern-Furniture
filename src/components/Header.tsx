import React from 'react';
import {
  Upload,
  Database,
  FileSpreadsheet,
  RotateCcw,
  Terminal,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface HeaderProps {
  loadedTablesCount: number;
  totalTablesCount: number;
  onOpenUpload: () => void;
  onOpenAudit: () => void;
  onOpenSql: () => void;
  onResetSampleData: () => void;
  onExportAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  loadedTablesCount,
  totalTablesCount,
  onOpenUpload,
  onOpenAudit,
  onOpenSql,
  onResetSampleData,
  onExportAll
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-100 flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  Modern Furniture Co.
                </h1>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  BI Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                Executive Analytics & Operational Performance Engine
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Table Health Badge */}
            <button
              onClick={onOpenAudit}
              title="Click to view data governance audit log"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>DuckDB Tables:</span>
              <span className="font-mono font-bold text-emerald-600">
                {loadedTablesCount}/{totalTablesCount}
              </span>
            </button>

            {/* SQL Explorer */}
            <button
              onClick={onOpenSql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">SQL Query</span>
            </button>

            {/* Ingest CSV Files */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ingest CSVs</span>
            </button>

            {/* Export CSVs */}
            <button
              onClick={onExportAll}
              title="Export complete active database tables"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            {/* Reset to sample data */}
            <button
              onClick={onResetSampleData}
              title="Reset in-memory data to default high-fidelity sample"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
