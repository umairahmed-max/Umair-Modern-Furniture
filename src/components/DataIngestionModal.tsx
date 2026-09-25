import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { DatabaseState } from '../types';
import { exportTableToCsv } from '../utils/dataProcessor';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: DatabaseState;
  onUploadFiles: (files: File[]) => Promise<void>;
  onResetSampleData: () => void;
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  database,
  onUploadFiles,
  onResetSampleData
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const tableSummaries = [
    {
      key: 'orders_data',
      label: 'Orders Data (orders_data.csv)',
      count: database.orders_data.length,
      desc: 'Order IDs, customer IDs, delivery dates, amounts, fulfillment statuses.'
    },
    {
      key: 'design_log',
      label: 'Design Log (design_log.csv)',
      count: database.design_log.length,
      desc: 'Bespoke custom furniture projects, designer assignment, costs, status.'
    },
    {
      key: 'financial_ledger',
      label: 'Financial Ledger (financial_ledger.csv)',
      count: database.financial_ledger.length,
      desc: 'Revenue, raw timber costs, CNC machining, hardware, salaries.'
    },
    {
      key: 'hr_roster',
      label: 'HR Roster (hr_roster.csv)',
      count: database.hr_roster.length,
      desc: 'Master woodcrafters, furniture designers, roles, departments, salaries.'
    },
    {
      key: 'hr_events_log',
      label: 'HR Events Log (hr_events_log.csv)',
      count: database.hr_events_log.length,
      desc: 'Promotions, safety records, and certifications.'
    },
    {
      key: 'inventory_log',
      label: 'Inventory Log (inventory_log.csv)',
      count: database.inventory_log.length,
      desc: 'Hardwood lumber, brass hardware, bouclé fabrics, inbound/outbound movements.'
    },
    {
      key: 'customers_data',
      label: 'Customers Data (customers_data.csv)',
      count: database.customers_data.length,
      desc: 'Architecture studios, luxury hotels, residential clients, and LTV.'
    }
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      await onUploadFiles(Array.from(files));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const downloadSampleTemplate = (tableKey: keyof DatabaseState) => {
    const data = database[tableKey];
    if (data && data.length > 0) {
      exportTableToCsv(`${tableKey}_template`, data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-900">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Operational Data Ingestion & Governance
              </h2>
              <p className="text-xs text-slate-500">
                Ingest CSVs into in-memory tables with automated schema standardisation
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-600 bg-amber-50/60'
                : 'border-slate-300 hover:border-amber-600 hover:bg-slate-50/80 bg-slate-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".csv"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {isProcessing ? 'Processing & Standardizing...' : 'Drop CSV files here, or click to browse'}
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                Matches filenames e.g. <span className="font-mono text-slate-700">orders_data.csv</span>, <span className="font-mono text-slate-700">design_log.csv</span>, <span className="font-mono text-slate-700">financial_ledger.csv</span>, <span className="font-mono text-slate-700">hr_roster.csv</span>, etc.
              </p>
            </div>
          </div>

          {/* Quick Action: Re-load Sample Data */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Want to test with Modern Furniture Co.&apos;s comprehensive benchmark datasets?
              </span>
            </div>
            <button
              onClick={() => {
                onResetSampleData();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-900 text-white font-semibold hover:bg-amber-800 shrink-0 transition-colors"
            >
              Load Benchmark Data
            </button>
          </div>

          {/* Registered Tables Status */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Table Status & Template Downloader
            </h3>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {tableSummaries.map(t => (
                <div
                  key={t.key}
                  className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{t.label}</p>
                      <p className="text-[11px] text-slate-500 truncate">{t.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {t.count} records
                    </span>
                    <button
                      onClick={() => downloadSampleTemplate(t.key as keyof DatabaseState)}
                      title={`Download template / export ${t.key}.csv`}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
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
