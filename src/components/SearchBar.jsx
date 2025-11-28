import React, { useState, useCallback } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch = () => {},
  onClear = () => {},
  value = '',
  showFilter = false,
  filters = null
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Button and Dropdown */}
      {showFilter && filters && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full md:w-auto flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full mt-2 right-0 md:right-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10 min-w-max">
              {filters.map((filter) => (
                <div key={filter.key} className="mb-4 last:mb-0">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    {filter.label}
                  </label>
                  {filter.type === 'select' && (
                    <select
                      value={filter.value || ''}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">{filter.placeholder || 'All'}</option>
                      {filter.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'checkbox' && (
                    <div className="space-y-2">
                      {filter.options?.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filter.value?.includes(opt.value) || false}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(filter.value || []), opt.value]
                                : (filter.value || []).filter((v) => v !== opt.value);
                              filter.onChange(newValue);
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {filter.type === 'date-range' && (
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={filter.value?.start || ''}
                        onChange={(e) =>
                          filter.onChange({
                            ...filter.value,
                            start: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="date"
                        value={filter.value?.end || ''}
                        onChange={(e) =>
                          filter.onChange({
                            ...filter.value,
                            end: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
