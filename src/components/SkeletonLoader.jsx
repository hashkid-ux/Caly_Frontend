// Frontend/src/components/SkeletonLoader.jsx - Loading skeleton placeholders
import React from 'react';

/**
 * SkeletonLoader - Animated placeholder while data loads
 * Improves perceived performance and UX with contextual loading states
 */
export const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
);

export const SkeletonCard = ({ count = 3 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-100 dark:border-gray-700">
    <SkeletonLine width="w-1/3" height="h-5" className="mb-3" />
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} height="h-4" className={i !== count - 1 ? 'mb-2' : ''} />
      ))}
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
    {/* Header */}
    <div className="grid gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonLine key={`header-${i}`} height="h-4" width="w-4/5" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div
        key={`row-${rowIdx}`}
        className="grid gap-4 p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, colIdx) => (
          <SkeletonLine key={`cell-${rowIdx}-${colIdx}`} height="h-4" width={colIdx === 0 ? 'w-3/4' : 'w-full'} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
    <SkeletonLine width="w-1/4" height="h-5" className="mb-4" />
    <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

export const SkeletonCard3Col = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
        <SkeletonLine height="h-4" width="w-2/3" className="mb-3" />
        <SkeletonLine height="h-8" width="w-1/2" />
      </div>
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-4">
    {/* KPI Cards */}
    <SkeletonCard3Col />
    
    {/* Chart */}
    <SkeletonChart />
    
    {/* Table */}
    <SkeletonTable rows={3} cols={4} />
  </div>
);

/**
 * LoadingSkeleton - Main component for showing skeleton during data load
 */
const LoadingSkeleton = ({ type = 'table', rows = 5, cols = 5 }) => {
  const variants = {
    table: <SkeletonTable rows={rows} cols={cols} />,
    card: <SkeletonCard count={3} />,
    chart: <SkeletonChart />,
    cards3col: <SkeletonCard3Col />,
    dashboard: <SkeletonDashboard />,
  };

  return variants[type] || variants.table;
};

export default LoadingSkeleton;
