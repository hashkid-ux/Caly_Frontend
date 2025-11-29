import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, Download, Play, FileText, ChevronRight, Phone, Clock, Zap, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../PageHeader';
import { useCalls } from '../../hooks/useRealData';

/**
 * Call History Page - REAL DATA FROM BACKEND
 * - Fetches calls from /api/calls endpoint
 * - Real search and filtering with API parameters
 * - Real call metadata from database
 * - Real pagination
 * - Real export to CSV
 */
const CallHistoryPageNew = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'week'
  });
  const [selectedCalls, setSelectedCalls] = useState(new Set());

  // Calculate date range for API query
  const getDaysFromDateRange = (range) => {
    const ranges = { week: 7, month: 30, all: 90 };
    return ranges[range] || 7;
  };

  // Fetch real calls from backend
  const { 
    data: callsResponse, 
    isLoading, 
    error 
  } = useCalls(user?.client_id, {
    page,
    limit: pageSize,
    status: filters.status === 'all' ? null : filters.status,
    days: getDaysFromDateRange(filters.dateRange),
    search: searchQuery || null
  });

  const calls = callsResponse?.data || [];
  const totalCalls = callsResponse?.total || 0;
  const totalPages = Math.ceil(totalCalls / pageSize);

  // Handle call selection for bulk operations
  const toggleCallSelection = (callId) => {
    const newSelected = new Set(selectedCalls);
    if (newSelected.has(callId)) {
      newSelected.delete(callId);
    } else {
      newSelected.add(callId);
    }
    setSelectedCalls(newSelected);
  };

  const selectAllCalls = () => {
    if (selectedCalls.size === calls.length) {
      setSelectedCalls(new Set());
    } else {
      setSelectedCalls(new Set(calls.map(c => c.id)));
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Call ID', 'Date', 'Duration (sec)', 'From', 'To', 'Status', 'Satisfaction'];
    const rows = calls.map(call => [
      call.id,
      new Date(call.start_ts).toLocaleString(),
      Math.round(call.duration_seconds || 0),
      call.phone_from || 'N/A',
      call.phone_to || 'N/A',
      call.resolved ? 'Completed' : 'Pending',
      call.customer_satisfaction || 'N/A'
    ]);

    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calls-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // Status badge color
  const getStatusColor = (call) => {
    return call.resolved ? 'green' : 'gray';
  };

  const getStatusText = (call) => {
    return call.resolved ? 'Completed' : 'Pending';
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <PageHeader title="📞 Call History" description="View and manage all calls" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error loading calls: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <PageHeader title="📞 Call History" description="View and analyze all calls" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by phone number or transcript..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="unresolved">Unresolved</option>
            </select>

            {/* Date Range */}
            <select
              value={filters.dateRange}
              onChange={(e) => {
                setFilters({ ...filters, dateRange: e.target.value });
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={selectAllCalls}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {selectedCalls.size === calls.length && calls.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            {selectedCalls.size > 0 && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
                {selectedCalls.size} Selected
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {calls.length} calls
          {searchQuery && ` matching "${searchQuery}"`}
          ({totalCalls} total)
        </div>

        {/* Calls List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading calls...</span>
          </div>
        ) : calls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <Phone size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No calls found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-3">
            {calls.map((call) => (
              <div
                key={call.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  setSelectedCall(call);
                  setShowDetailModal(true);
                }}
              >
                <div className="flex items-center p-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedCalls.has(call.id)}
                    onChange={() => toggleCallSelection(call.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />

                  {/* Call Info */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {call.phone_from || 'Unknown'} → {call.phone_to || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(call.start_ts).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Duration */}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock size={16} />
                          <span className="text-sm">{formatDuration(call.duration_seconds)}</span>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`
                            px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              getStatusColor(call) === 'green'
                                ? 'bg-green-100 text-green-800'
                                : getStatusColor(call) === 'red'
                                ? 'bg-red-100 text-red-800'
                                : getStatusColor(call) === 'orange'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          `}
                        >
                          {getStatusText(call)}
                        </div>

                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex items-center gap-6 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">From:</span> {call.phone_from || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">To:</span> {call.phone_to || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Satisfaction:</span> {call.customer_satisfaction || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Call Detail Modal */}
      {showDetailModal && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Call Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Call Header */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 font-medium">From</p>
                  <p className="text-lg font-semibold">{selectedCall.phone_from || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">To</p>
                  <p className="text-lg font-semibold">{selectedCall.phone_to || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date & Time</p>
                  <p className="text-lg font-semibold">{new Date(selectedCall.start_ts).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Duration</p>
                  <p className="text-lg font-semibold">{formatDuration(selectedCall.duration_seconds)}</p>
                </div>
              </div>

              {/* Call Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <p className="text-base">{getStatusText(selectedCall)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Satisfaction</p>
                  <p className="text-base">{selectedCall.customer_satisfaction || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Call ID</p>
                  <p className="text-base font-mono text-xs">{selectedCall.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Recording URL</p>
                  <p className="text-base">{selectedCall.recording_url ? '✓ Available' : 'N/A'}</p>
                </div>
              </div>

              {/* Transcript */}
              {selectedCall.transcript_full && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Transcript</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded text-sm">{selectedCall.transcript_full}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex gap-2">
                {selectedCall.recording_url && (
                  <button onClick={() => window.open(selectedCall.recording_url, '_blank')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
                    <Play size={16} className="inline mr-2" />
                    Play Recording
                  </button>
                )}
                {selectedCall.transcript_full && (
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition">
                    <FileText size={16} className="inline mr-2" />
                    View Transcript
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistoryPageNew;
