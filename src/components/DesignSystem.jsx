// Frontend/src/components/DesignSystem.jsx - Design System Components & Utilities
import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * TYPOGRAPHY SYSTEM
 */
export const Typography = {
  H1: ({ children, className = '' }) => (
    <h1 className={`text-4xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h1>
  ),
  H2: ({ children, className = '' }) => (
    <h2 className={`text-3xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>
  ),
  H3: ({ children, className = '' }) => (
    <h3 className={`text-2xl font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h3>
  ),
  H4: ({ children, className = '' }) => (
    <h4 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h4>
  ),
  H5: ({ children, className = '' }) => (
    <h5 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h5>
  ),
  Body: ({ children, className = '' }) => (
    <p className={`text-base text-gray-700 dark:text-gray-300 ${className}`}>{children}</p>
  ),
  BodySmall: ({ children, className = '' }) => (
    <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
  ),
  Label: ({ children, className = '' }) => (
    <label className={`text-sm font-medium text-gray-900 dark:text-white ${className}`}>{children}</label>
  ),
  Caption: ({ children, className = '' }) => (
    <p className={`text-xs text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
  ),
};

/**
 * SPACING CONSTANTS
 */
export const Spacing = {
  XS: 'gap-1', // 4px
  SM: 'gap-2', // 8px
  MD: 'gap-3', // 12px
  LG: 'gap-4', // 16px
  XL: 'gap-6', // 24px
  XXL: 'gap-8', // 32px
};

/**
 * ALERT/STATUS COMPONENTS
 */
export const Alert = ({ type = 'info', title, message, icon: Icon = null }) => {
  const typeConfig = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      icon: Info,
      textColor: 'text-blue-800 dark:text-blue-300',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      icon: CheckCircle,
      textColor: 'text-green-800 dark:text-green-300',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      icon: AlertTriangle,
      textColor: 'text-yellow-800 dark:text-yellow-300',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      icon: AlertCircle,
      textColor: 'text-red-800 dark:text-red-300',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  const config = typeConfig[type];
  const IconComponent = Icon || config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex gap-3`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconColor} mt-0.5`} />
      <div>
        {title && <h4 className={`font-semibold ${config.textColor}`}>{title}</h4>}
        {message && <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>{message}</p>}
      </div>
    </div>
  );
};

/**
 * BADGE COMPONENT
 */
export const Badge = ({ 
  label, 
  variant = 'default',
  size = 'md',
  icon: Icon = null,
  removable = false,
  onRemove = () => {}
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full inline-flex items-center gap-1.5 font-medium`}>
      {Icon && <Icon className="w-3 h-3" />}
      <span>{label}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
};

/**
 * DIVIDER COMPONENT
 */
export const Divider = ({ horizontal = true, className = '' }) => 
  horizontal ? (
    <div className={`h-px bg-gray-200 dark:bg-gray-700 ${className}`}></div>
  ) : (
    <div className={`w-px bg-gray-200 dark:bg-gray-700 ${className}`}></div>
  );

/**
 * GRID LAYOUTS
 */
export const GridLayouts = {
  Grid2: ({ children, gap = 'gap-4' }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gap}`}>{children}</div>
  ),
  Grid3: ({ children, gap = 'gap-4' }) => (
    <div className={`grid grid-cols-1 md:grid-cols-3 ${gap}`}>{children}</div>
  ),
  Grid4: ({ children, gap = 'gap-4' }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${gap}`}>{children}</div>
  ),
  AutoGrid: ({ children, gap = 'gap-4', minWidth = '300px' }) => (
    <div className={`grid ${gap}`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))` }}>
      {children}
    </div>
  ),
};

/**
 * CONTAINER LAYOUTS
 */
export const Containers = {
  PageContainer: ({ children }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  ),
  FormContainer: ({ children }) => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">{children}</div>
  ),
  WideContainer: ({ children }) => (
    <div className="max-w-full px-4 sm:px-6 lg:px-8">{children}</div>
  ),
};

/**
 * CARD LAYOUTS
 */
export const Card = ({ 
  children, 
  header = null,
  footer = null,
  padding = 'p-6',
  className = ''
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
    {header && <div className={`${padding} border-b border-gray-200 dark:border-gray-700`}>{header}</div>}
    <div className={padding}>{children}</div>
    {footer && <div className={`${padding} border-t border-gray-200 dark:border-gray-700`}>{footer}</div>}
  </div>
);

/**
 * SECTION COMPONENT
 */
export const Section = ({ 
  title = null,
  subtitle = null,
  children,
  actions = null,
  className = ''
}) => (
  <div className={`py-6 ${className}`}>
    {(title || subtitle || actions) && (
      <div className="flex justify-between items-start mb-6">
        <div>
          {title && <Typography.H3>{title}</Typography.H3>}
          {subtitle && <Typography.BodySmall className="mt-1 text-gray-600">{subtitle}</Typography.BodySmall>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

export default {
  Typography,
  Spacing,
  Alert,
  Badge,
  Divider,
  GridLayouts,
  Containers,
  Card,
  Section,
};
