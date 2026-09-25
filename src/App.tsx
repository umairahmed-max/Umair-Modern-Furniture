import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Palette,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_SAMPLE_DATA } from './data/sampleData';
import { AuditLogItem, DatabaseState } from './types';
import { processUploadedCsvFiles, exportTableToCsv } from './utils/dataProcessor';
import { Header } from './components/Header';
import { ExecutiveSummaryTab } from './components/tabs/ExecutiveSummaryTab';
import { OrdersFulfillmentTab } from './components/tabs/OrdersFulfillmentTab';
import { DesignWorkloadsTab } from './components/tabs/DesignWorkloadsTab';
import { FinancialLedgerTab } from './components/tabs/FinancialLedgerTab';
import { HrInventoryTab } from './components/tabs/HrInventoryTab';
import { DataIngestionModal } from './components/DataIngestionModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { SqlPlaygroundModal } from './components/SqlPlaygroundModal';

export default function App() {
  const [database, setDatabase] = useState<DatabaseState>(INITIAL_SAMPLE_DATA);
  const [activeTab, setActiveTab] = useState<'summary' | 'orders' | 'designs' | 'financial' | 'hr_inventory'>('summary');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isSqlOpen, setIsSqlOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial audit log
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      tableName: 'System Initialization',
      message: 'DuckDB memory store initialized with Modern Furniture Co. benchmark operational datasets.',
      type: 'success'
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      tableName: 'orders_data',
      message: 'Loaded 16 verified orders with automated delivery status classification.',
      type: 'info',
      rowCount: 16
    },
    {
      id: 'init-3',
      timestamp: new Date().toLocaleTimeString(),
      tableName: 'design_log',
      message: 'Loaded 9 custom bespoke furniture engineering records.',
      type: 'info',
      rowCount: 9
    },
    {
      id: 'init-4',
      timestamp: new Date().toLocaleTimeString(),
      tableName: 'financial_ledger',
      message: 'Loaded 15 verified cashflow and accounting ledger transactions.',
      type: 'info',
      rowCount: 15
    },
    {
      id: 'init-5',
      timestamp: new Date().toLocaleTimeString(),
      tableName: 'hr_roster',
      message: 'Loaded 10 active master craftsmen and furniture architects.',
      type: 'info',
      rowCount: 10
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleUploadFiles = async (files: File[]) => {
    const result = await processUploadedCsvFiles(files, database);
    setDatabase(result.updatedDatabase);
    setAuditLogs(prev => [...result.auditLogs, ...prev]);

    if (result.tablesUpdated.length > 0) {
      showToast(`Successfully ingested and standardized ${result.tablesUpdated.length} dataset(s)!`);
    } else {
      showToast('Completed file analysis. Check audit log for details.');
    }
  };

  const handleResetSampleData = () => {
    setDatabase(INITIAL_SAMPLE_DATA);
    setAuditLogs(prev => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        tableName: 'System Reset',
        message: 'Re-loaded default Modern Furniture Co. benchmark sample datasets.',
        type: 'info'
      },
      ...prev
    ]);
    showToast('Reset in-memory data to default benchmark datasets.');
  };

  const handleExportAll = () => {
    exportTableToCsv('modern_furniture_orders', database.orders_data);
    exportTableToCsv('modern_furniture_designs', database.design_log);
    exportTableToCsv('modern_furniture_ledger', database.financial_ledger);
    exportTableToCsv('modern_furniture_roster', database.hr_roster);
    exportTableToCsv('modern_furniture_inventory', database.inventory_log);
    showToast('Exported operational CSV files.');
  };

  interface TabItem {
    id: 'summary' | 'orders' | 'designs' | 'financial' | 'hr_inventory';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'summary', label: 'Executive Summary', icon: TrendingUp },
    { id: 'orders', label: 'Orders & Fulfillment', icon: Package, badge: database.orders_data.length },
    { id: 'designs', label: 'Design Workloads', icon: Palette, badge: database.design_log.length },
    { id: 'financial', label: 'Financial Ledger', icon: DollarSign, badge: database.financial_ledger.length },
    { id: 'hr_inventory', label: 'HR & Inventory', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        loadedTablesCount={7}
        totalTablesCount={7}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenSql={() => setIsSqlOpen(true)}
        onResetSampleData={handleResetSampleData}
        onExportAll={handleExportAll}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl max-w-full overflow-x-auto scrollbar-none shadow-2xs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-300/60 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Views */}
        <div className="transition-opacity duration-200">
          {activeTab === 'summary' && (
            <ExecutiveSummaryTab
              database={database}
              onNavigateToTab={(tabId) => setActiveTab(tabId as typeof activeTab)}
            />
          )}

          {activeTab === 'orders' && <OrdersFulfillmentTab database={database} />}

          {activeTab === 'designs' && <DesignWorkloadsTab database={database} />}

          {activeTab === 'financial' && <FinancialLedgerTab database={database} />}

          {activeTab === 'hr_inventory' && <HrInventoryTab database={database} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Modern Furniture Co. — Internal Business Intelligence Engine</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Portland Master Mill</span>
            <span>·</span>
            <span>San Francisco Design Lab</span>
            <span>·</span>
            <span>DuckDB In-Memory Architecture</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DataIngestionModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        database={database}
        onUploadFiles={handleUploadFiles}
        onResetSampleData={handleResetSampleData}
      />

      <AuditLogDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        logs={auditLogs}
        onClearLogs={() => setAuditLogs([])}
      />

      <SqlPlaygroundModal
        isOpen={isSqlOpen}
        onClose={() => setIsSqlOpen(false)}
        database={database}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
