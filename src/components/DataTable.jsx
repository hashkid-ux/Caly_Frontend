import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

const DataTable = ({ 
  columns = [], 
  data = [], 
  onSort = () => {},
  onRowClick = () => {},
  loading = false,
  emptyMessage = 'No data available'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (columnKey) => {
    let newDirection = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      newDirection = 'desc';
    }

    setSortConfig({ key: columnKey, direction: newDirection });
    onSort(columnKey, newDirection);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onClick={() => onRowClick(row)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer space-y-2"
            >
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    {column.label}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-300 text-right">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
