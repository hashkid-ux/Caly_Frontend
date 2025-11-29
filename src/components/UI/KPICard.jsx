import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * KPI Card Component
 * Displays key performance indicator with metric, trend, and sparkline
 */
const KPICard = ({
  title,
  value,
  unit = '',
  trend = 0,
  trendLabel = '',
  icon: Icon = null,
  status = 'neutral', // 'success', 'warning', 'danger', 'neutral'
  color = 'blue', // 'blue', 'green', 'red', 'orange', 'purple'
  miniChart = null,
  onClick = null,
  loading = false
}) => {
  const statusColors = {
    success: 'text-green-600 bg-green-50',
    warning: 'text-orange-600 bg-orange-50',
    danger: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  const borderColors = {
    blue: 'border-blue-200 hover:border-blue-400',
    green: 'border-green-200 hover:border-green-400',
    red: 'border-red-200 hover:border-red-400',
    orange: 'border-orange-200 hover:border-orange-400',
    purple: 'border-purple-200 hover:border-purple-400'
  };

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  };

  const isTrendPositive = trend > 0;
  const trendColor = isTrendPositive ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isTrendPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={`
        border rounded-lg p-6 bg-white transition-all duration-200
        ${borderColors[color]}
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        shadow-sm
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${statusColors[status]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
      ) : (
        <>
          {/* Value */}
          <div className="mb-2">
            <div className={`text-3xl font-bold ${textColors[color]}`}>
              {value}
              {unit && <span className="text-sm ml-1 text-gray-500">{unit}</span>}
            </div>
          </div>

          {/* Trend */}
          {trend !== 0 && (
            <div className={`flex items-center text-sm ${trendColor}`}>
              <TrendIcon size={14} className="mr-1" />
              <span>
                {Math.abs(trend)}% {trendLabel}
              </span>
            </div>
          )}
        </>
      )}

      {/* Mini Chart */}
      {miniChart && (
        <div className="mt-4 h-12 opacity-75">
          {miniChart}
        </div>
      )}
    </div>
  );
};

export default KPICard;
