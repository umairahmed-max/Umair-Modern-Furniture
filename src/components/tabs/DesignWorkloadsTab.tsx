import React, { useState, useMemo } from 'react';
import {
  Palette,
  Search,
  Filter,
  Download,
  FolderOpen,
  User,
  Layers,
  Sparkles,
  TreePine
} from 'lucide-react';
import { DatabaseState, DesignProject } from '../../types';
import { getDesignerWorkloads } from '../../utils/analytics';
import { BarChart } from '../charts/BarChart';
import { exportTableToCsv } from '../../utils/dataProcessor';

interface DesignWorkloadsTabProps {
  database: DatabaseState;
}

export const DesignWorkloadsTab: React.FC<DesignWorkloadsTabProps> = ({ database }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>('All');

  const designerWorkloads = useMemo(() => {
    return getDesignerWorkloads(database);
  }, [database]);

  const filteredDesigns = useMemo(() => {
    return database.design_log.filter(item => {
      const matchesSearch =
        item.design_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.wood_material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.design_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesDesigner =
        selectedDesignerId === 'All' || item.designer_id === selectedDesignerId;

      return matchesSearch && matchesStatus && matchesDesigner;
    });
  }, [database.design_log, searchTerm, statusFilter, selectedDesignerId]);

  const getStatusBadge = (status: DesignProject['status']) => {
    switch (status) {
      case 'Approved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'In Production':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'In Review':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Drafting':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Concept':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Designer Workloads & Custom Bespoke Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Relational cross-table analytics between design logs and master craftsman HR personnel
          </p>
        </div>
        <button
          onClick={() => exportTableToCsv('design_pipeline_report', database.design_log)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Pipeline CSV</span>
        </button>
      </div>

      {/* Visual Workloads Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChart
            title="Top Designer Workloads (Active Projects)"
            subtitle="Project volume and pipeline value per principal furniture architect"
            data={designerWorkloads.map(w => ({
              label: w.designerName.split(' ')[0],
              value: w.activeProjects,
              sublabel: `$${w.totalPipelineValue.toLocaleString()}`,
              color: '#b45309',
              formattedValue: `${w.activeProjects} active ($${w.totalPipelineValue.toLocaleString()})`
            }))}
            layout="horizontal"
          />
        </div>

        {/* Designer Capacity Breakdown Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Staff Capacity Roster
          </h4>
          <div className="space-y-2.5">
            {designerWorkloads.map(designer => {
              const isSelected = selectedDesignerId === designer.designerId;
              return (
                <div
                  key={designer.designerId}
                  onClick={() =>
                    setSelectedDesignerId(isSelected ? 'All' : designer.designerId)
                  }
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{designer.designerName}</p>
                      <p className="text-[11px] text-slate-500">{designer.role}</p>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {designer.designerId}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Active: <strong className="text-slate-800">{designer.activeProjects}</strong>
                    </span>
                    <span className="font-mono font-semibold text-amber-900">
                      ${designer.totalPipelineValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search piece name, client, timber material..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="In Production">In Production</option>
              <option value="In Review">In Review</option>
              <option value="Drafting">Drafting</option>
              <option value="Concept">Concept</option>
            </select>
          </div>

          {selectedDesignerId !== 'All' && (
            <button
              onClick={() => setSelectedDesignerId('All')}
              className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-900 font-medium"
            >
              Clear Designer Filter
            </button>
          )}
        </div>
      </div>

      {/* Design Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Design ID</th>
                <th className="p-3">Piece Name</th>
                <th className="p-3">Client</th>
                <th className="p-3">Category</th>
                <th className="p-3">Wood & Materials</th>
                <th className="p-3">Designer</th>
                <th className="p-3 text-right">Est. Cost</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Revisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDesigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-slate-400 font-sans">
                    No custom design projects found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDesigns.map(design => (
                  <tr key={design.design_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{design.design_id}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{design.design_name}</p>
                      <p className="text-[11px] text-slate-400">Created: {design.created_date}</p>
                    </td>
                    <td className="p-3 text-slate-700">{design.client_name}</td>
                    <td className="p-3 text-slate-600">{design.category}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                        <TreePine className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{design.wood_material}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-700">{design.designer_id}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ${design.estimated_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                          design.status
                        )}`}
                      >
                        {design.status}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600">
                      {design.revision_count}
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
