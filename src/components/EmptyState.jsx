// Frontend/src/components/EmptyState.jsx - Beautiful empty state UI for no data/search results
import React from 'react';
import { InboxIcon, AlertTriangle, Search, Plus } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = InboxIcon, 
  title = 'No data found',
  description = 'There is no data to display',
  action = null,
  actionLabel = 'Create',
  onAction = null,
  variant = 'default',
  size = 'medium'
}) => {
  const variants = {
    default: {
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      iconColor: 'text-gray-400 dark:text-gray-600',
      titleColor: 'text-gray-900 dark:text-gray-100',
      descColor: 'text-gray-600 dark:text-gray-400',
      buttonBg: 'bg-gray-600 hover:bg-gray-700',
    },
    empty: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-400 dark:text-blue-500',
      titleColor: 'text-blue-900 dark:text-blue-200',
      descColor: 'text-blue-700 dark:text-blue-300',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-400 dark:text-red-500',
      titleColor: 'text-red-900 dark:text-red-200',
      descColor: 'text-red-700 dark:text-red-300',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    },
    search: {
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-400 dark:text-purple-500',
      titleColor: 'text-purple-900 dark:text-purple-200',
      descColor: 'text-purple-700 dark:text-purple-300',
      buttonBg: 'bg-purple-600 hover:bg-purple-700',
    },
  };

  const sizeClasses = {
    small: { icon: 'w-8 h-8', title: 'text-sm', desc: 'text-xs', padding: 'p-4' },
    medium: { icon: 'w-12 h-12', title: 'text-lg', desc: 'text-sm', padding: 'p-8' },
    large: { icon: 'w-16 h-16', title: 'text-2xl', desc: 'text-base', padding: 'p-12' },
  };

  const config = variants[variant] || variants.default;
  const sizeConfig = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`${config.bgColor} rounded-lg ${sizeConfig.padding} text-center border border-gray-200 dark:border-gray-700`}>
      <Icon className={`${sizeConfig.icon} ${config.iconColor} mx-auto mb-3`} />
      <h3 className={`${sizeConfig.title} font-semibold ${config.titleColor} mb-2`}>
        {title}
      </h3>
      <p className={`${sizeConfig.desc} ${config.descColor} mb-4 max-w-sm mx-auto`}>
        {description}
      </p>
      {(action || onAction) && (
        <div className="flex justify-center gap-3">
          {Array.isArray(action) ? (
            action.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  btn.variant === 'primary' ? `${config.buttonBg} text-white` : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {btn.label}
              </button>
            ))
          ) : onAction ? (
            <button
              onClick={onAction}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${config.buttonBg} text-white inline-flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

// Specialized variants
export const NoSearchResults = ({ query = '', onClear = () => {} }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={`No results for "${query}". Try searching with different keywords.`}
    actionLabel="Clear Search"
    onAction={onClear}
    variant="search"
    size="medium"
  />
);

export const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry = () => {}
}) => (
  <EmptyState
    icon={AlertTriangle}
    title={message}
    description="Please try again or contact support if the problem persists"
    actionLabel="Try Again"
    onAction={onRetry}
    variant="error"
    size="medium"
  />
);
