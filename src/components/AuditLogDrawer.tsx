import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
  onClearLogs: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AuditLogItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-600 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Governance & Ingestion Audit Log
              </h3>
              <p className="text-[11px] text-slate-500">
                Data pipeline transformations & de-duplications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No audit logs recorded
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-semibold text-slate-700">{log.tableName}</span>
                  <span className="text-slate-400">{log.timestamp}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  {getIcon(log.type)}
                  <p className="leading-snug">{log.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClearLogs}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Clear log history
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
