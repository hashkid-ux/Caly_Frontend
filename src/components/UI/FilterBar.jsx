import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Filter Bar Component
 * Provides sector, date range, and other filtering options
 */
const FilterBar = ({
  sectors = [],
  onSectorChange = () => {},
  dateRange = { start: '', end: '' },
  onDateRangeChange = () => {},
  onExport = () => {},
  showDatePicker = true,
  showSectorFilter = true,
  showExportButton = true,
  customFilters = [],
  onRefresh = () => {}
}) => {
  const [activeFilters, setActiveFilters] = useState({});

  const handleSectorChange = (sector) => {
    setActiveFilters({ ...activeFilters, sector });
    onSectorChange(sector);
  };

  const sectorOptions = [
    { value: 'all', label: '📊 All Sectors' },
    { value: 'ecommerce', label: '🛒 E-Commerce' },
    { value: 'healthcare', label: '🏥 Healthcare' },
    { value: 'realestate', label: '🏠 Real Estate' },
    { value: 'logistics', label: '🚚 Logistics' },
    { value: 'fintech', label: '💰 Fintech' },
    { value: 'support', label: '📞 Support' },
    { value: 'telecom', label: '📱 Telecom' },
    { value: 'government', label: '🏛️ Government' },
    { value: 'education', label: '🎓 Education' },
    { value: 'travel', label: '✈️ Travel' },
    { value: 'saas', label: '💻 SaaS' }
  ];

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sector Filter */}
        {showSectorFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Sector
            </label>
            <select
              value={activeFilters.sector || 'all'}
              onChange={(e) => handleSectorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              {sectorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range Filter */}
        {showDatePicker && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Date Range
            </label>
            <select
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom Filters */}
        {customFilters.map((filter, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
            </label>
            {filter.type === 'select' ? (
              <select
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={filter.placeholder}
              />
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          {showExportButton && (
            <button
              onClick={onExport}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              📥 Export
            </button>
          )}
          <button
            onClick={onRefresh}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
