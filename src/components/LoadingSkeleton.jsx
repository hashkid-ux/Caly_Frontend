import React from 'react';

const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
);

const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="hidden md:block">
      {/* Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex gap-6">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="flex-1" height="h-4" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="px-6 py-4 border-b border-gray-200 flex gap-6"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} width="flex-1" height="h-4" />
          ))}
        </div>
      ))}
    </div>

    {/* Mobile */}
    <div className="md:hidden space-y-4 p-4">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="space-y-2 p-3 border rounded-lg">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="flex justify-between">
              <Skeleton width="w-24" height="h-3" />
              <Skeleton width="w-32" height="h-3" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <Skeleton width="w-24" height="h-3" />
            <Skeleton width="w-16" height="h-6" />
          </div>
          <Skeleton width="w-12" height="h-12" className="rounded-lg" />
        </div>
        <Skeleton width="w-20" height="h-3" />
      </div>
    ))}
  </div>
);

const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, idx) => (
      <Skeleton
        key={idx}
        width={idx === lines - 1 ? 'w-3/4' : 'w-full'}
        height="h-4"
      />
    ))}
  </div>
);

export { Skeleton, TableSkeleton, CardSkeleton, TextSkeleton };
