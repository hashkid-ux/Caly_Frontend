import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const TextInput = ({
  label = '',
  placeholder = '',
  type = 'text',
  value = '',
  onChange = () => {},
  error = '',
  success = false,
  helpText = '',
  required = false,
  disabled = false,
  icon: Icon = null,
  fullWidth = true
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 dark:bg-red-900/20 dark:text-gray-100'
              : success
              ? 'border-green-300 dark:border-green-700 focus:ring-green-500 dark:bg-green-900/20 dark:text-gray-100'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100'
          } ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
        />
        {error && <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600 dark:text-red-400" />}
        {!error && success && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />}
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
      {helpText && !error && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{helpText}</p>}
    </div>
  );
};

const PasswordInput = ({
  label = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  error = '',
  required = false,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 dark:bg-red-900/20 dark:text-gray-100'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100'
          } ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

const Textarea = ({
  label = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  rows = 4
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-none ${
          error
            ? 'border-red-300 dark:border-red-700 focus:ring-red-500 dark:bg-red-900/20 dark:text-gray-100'
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
      />
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
      {helpText && !error && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{helpText}</p>}
    </div>
  );
};

const Select = ({
  label = '',
  placeholder = 'Select an option',
  value = '',
  onChange = () => {},
  options = [],
  error = '',
  required = false,
  disabled = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
          error
            ? 'border-red-300 dark:border-red-700 focus:ring-red-500 dark:bg-red-900/20 dark:text-gray-100'
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

const Checkbox = ({
  label = '',
  checked = false,
  onChange = () => {},
  error = '',
  disabled = false,
  description = ''
}) => {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`mt-1 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:accent-blue-500 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      />
      <div>
        <label className={`text-sm font-medium ${disabled ? 'text-gray-500 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </label>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

const RadioGroup = ({
  label = '',
  value = '',
  onChange = () => {},
  options = [],
  error = '',
  disabled = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export { TextInput, PasswordInput, Textarea, Select, Checkbox, RadioGroup };
