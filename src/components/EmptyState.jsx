import React from 'react';
import { InboxIcon, AlertTriangle, Search } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = InboxIcon, 
  title = 'No data found',
  description = 'There is no data to display',
  action = null,
  variant = 'default'
}) => {
  const variants = {
    default: {
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-600',
    },
    empty: {
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-700',
    },
    error: {
      bgColor: 'bg-red-50',
      iconColor: 'text-red-400',
      titleColor: 'text-red-900',
      descColor: 'text-red-700',
    },
  };

  const config = variants[variant] || variants.default;

  return (
    <div className={`${config.bgColor} rounded-lg p-12 text-center`}>
      <Icon className={`w-12 h-12 ${config.iconColor} mx-auto mb-4`} />
      <h3 className={`text-lg font-semibold ${config.titleColor} mb-2`}>
        {title}
      </h3>
      <p className={`${config.descColor} mb-6 max-w-sm mx-auto`}>
        {description}
      </p>
      {action && (
        <div className="flex justify-center gap-3">
          {Array.isArray(action) ? (
            action.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  btn.variant === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {btn.label}
              </button>
            ))
          ) : (
            <button
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                action.variant === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
