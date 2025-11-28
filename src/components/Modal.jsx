import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  title = '', 
  children, 
  size = 'md',
  actions = null,
  closeOnBackdrop = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 transition-opacity"
        onClick={() => closeOnBackdrop && onClose()}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {actions && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              {Array.isArray(actions) ? (
                actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      action.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                        : action.variant === 'danger'
                        ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </button>
                ))
              ) : (
                <button
                  onClick={actions.onClick}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    actions.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {actions.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
