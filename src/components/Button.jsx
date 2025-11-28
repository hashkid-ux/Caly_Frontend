import React, { memo, useState } from 'react';
import { Loader, Check } from 'lucide-react';

const Button = memo(({ 
  label, 
  onClick = () => {},
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon = null,
  fullWidth = false,
  type = 'button',
  className = '',
  showSuccessState = false,
  successLabel = 'Done!'
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async (e) => {
    onClick(e);
    
    // Show success state if enabled
    if (showSuccessState) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md active:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-800',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600',
    ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:active:bg-blue-900/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClass = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed btn-interactive';
  
  // Success state styling
  if (showSuccess) {
    return (
      <button
        type={type}
        disabled={true}
        className={`${baseClass} ${sizes[size]} ${fullWidth ? 'w-full' : ''} bg-green-600 text-white dark:bg-green-700 animate-success-circle ${className}`}
      >
        <Check className="w-4 h-4" />
        <span>{successLabel}</span>
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4 animate-spin-slow" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;