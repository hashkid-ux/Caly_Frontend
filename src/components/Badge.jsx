import React from 'react';

const Badge = ({ 
  label, 
  variant = 'default',
  size = 'md',
  icon: Icon = null,
  dismissible = false,
  onDismiss = () => {}
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {Icon && <Icon className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
      {label}
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
};

const BadgeGroup = ({ badges = [], maxDisplay = 3 }) => {
  const displayed = badges.slice(0, maxDisplay);
  const hidden = badges.length - maxDisplay;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayed.map((badge, idx) => (
        <Badge key={idx} {...badge} />
      ))}
      {hidden > 0 && (
        <Badge label={`+${hidden} more`} variant="default" />
      )}
    </div>
  );
};

export { Badge, BadgeGroup };
