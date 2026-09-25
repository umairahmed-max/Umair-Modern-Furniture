import React, { useState } from 'react';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  thickness?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  centerLabel,
  centerValue,
  size = 220,
  thickness = 28
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const normalizedRadius = radius - thickness / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-sm font-semibold text-slate-900">{title}</h4>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {total === 0 ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          No records to display
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
          {/* SVG Donut */}
          <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
              {data.map((slice, index) => {
                const percent = total > 0 ? slice.value / total : 0;
                const strokeDashoffset = circumference * (1 - percent);
                const rotation = accumulatedPercent * 360;
                accumulatedPercent += percent;

                const isHovered = hoveredIndex === index;

                return (
                  <circle
                    key={slice.label}
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? thickness + 4 : thickness}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${rotation} ${radius} ${radius})`}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {hoveredIndex !== null ? (
                <>
                  <span className="text-xs text-slate-500 font-medium truncate max-w-[120px]">
                    {data[hoveredIndex].label}
                  </span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                    {data[hoveredIndex].value}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {Math.round((data[hoveredIndex].value / total) * 100)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    {centerLabel || 'Total'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
                    {centerValue || total}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Clean Legend */}
          <div className="flex flex-col gap-2.5 min-w-[160px]">
            {data.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between gap-3 text-xs p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isHovered ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span className="text-slate-900 font-semibold">{item.value}</span>
                    <span className="text-slate-400 text-[11px] w-8 text-right">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
