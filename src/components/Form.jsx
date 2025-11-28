import React, { useState } from 'react';

const Form = ({ 
  onSubmit = () => {},
  children,
  layout = 'vertical',
  gap = 'gap-6'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const layoutClasses = {
    vertical: 'flex flex-col',
    horizontal: 'grid grid-cols-2 gap-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
  };

  return (
    <form onSubmit={handleSubmit} className={`${layoutClasses[layout]} ${gap}`}>
      {children}
    </form>
  );
};

const FormGroup = ({ children, columns = 1, className = '' }) => {
  const colClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3'
  };

  return (
    <div className={`${colClasses[columns]} ${className}`}>
      {children}
    </div>
  );
};

const FormSection = ({ title, description, children }) => {
  return (
    <div className="space-y-4">
      <div>
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const FormActions = ({ onSubmit = () => {}, onCancel = () => {}, submitLabel = 'Save', cancelLabel = 'Cancel', loading = false }) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
};

export { Form, FormGroup, FormSection, FormActions };
