import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: 'amber' | 'emerald' | 'blue' | 'purple' | 'slate';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlightColor = 'amber'
}) => {
  const colorStyles = {
    amber: 'text-amber-700 bg-amber-50 border-amber-200/60',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
    blue: 'text-sky-700 bg-sky-50 border-sky-200/60',
    purple: 'text-purple-700 bg-purple-50 border-purple-200/60',
    slate: 'text-slate-700 bg-slate-100 border-slate-200'
  };

  const iconBgStyles = {
    amber: 'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    blue: 'bg-sky-100 text-sky-800',
    purple: 'bg-purple-100 text-purple-800',
    slate: 'bg-slate-200 text-slate-800'
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgStyles[highlightColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
