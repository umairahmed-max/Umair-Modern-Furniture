import React, { useState } from 'react';

export interface BarItem {
  label: string;
  value: number;
  sublabel?: string;
  color?: string;
  formattedValue?: string;
}

interface BarChartProps {
  data: BarItem[];
  title?: string;
  subtitle?: string;
  layout?: 'horizontal' | 'vertical';
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  emptyMessage?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  layout = 'horizontal',
  height = 240,
  valuePrefix = '',
  valueSuffix = '',
  emptyMessage = 'No data available'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(d => Math.abs(d.value)), 1);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-sm font-semibold text-slate-900">{title}</h4>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400">
          {emptyMessage}
        </div>
      ) : layout === 'horizontal' ? (
        <div className="flex flex-col gap-3 my-auto">
          {data.map((item, idx) => {
            const pct = Math.min(100, Math.round((Math.abs(item.value) / maxValue) * 100));
            const isHovered = hoveredIdx === idx;
            const barColor = item.color || '#3b82f6';

            return (
              <div
                key={item.label + idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-50' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700 truncate max-w-[200px]">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-900 font-semibold">
                    <span>
                      {item.formattedValue ??
                        `${valuePrefix}${item.value.toLocaleString()}${valueSuffix}`}
                    </span>
                    {item.sublabel && (
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({item.sublabel})
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vertical Bars */
        <div
          className="flex items-end justify-between gap-3 pt-6 pb-2 px-2 my-auto"
          style={{ height }}
        >
          {data.map((item, idx) => {
            const pct = Math.min(100, Math.max(8, Math.round((Math.abs(item.value) / maxValue) * 100)));
            const isHovered = hoveredIdx === idx;
            const barColor = item.color || '#3b82f6';

            return (
              <div
                key={item.label + idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Floating tooltip/value */}
                <span
                  className={`text-[11px] font-mono font-semibold mb-1.5 transition-all text-slate-700 ${
                    isHovered ? 'scale-110 text-slate-900' : 'opacity-80'
                  }`}
                >
                  {item.formattedValue ?? `${valuePrefix}${item.value}${valueSuffix}`}
                </span>

                {/* Vertical Bar */}
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-md flex items-end h-[160px]">
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: barColor,
                      opacity: isHovered ? 1 : 0.88
                    }}
                  />
                </div>

                {/* X-axis label */}
                <span className="text-[11px] text-slate-500 mt-2 font-medium truncate max-w-[70px] text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
