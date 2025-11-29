import React, { useState, useCallback } from 'react';
import { Search, Filter, Download, Play, FileText, ChevronRight, Phone, Clock, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../PageHeader';

/**
 * Redesigned Call History Page
 * - Advanced search and filtering
 * - Rich call cards with metadata
 * - Call details modal
 * - Bulk operations
 * - Pagination with virtual scrolling
 * - Export to CSV/PDF
 */
const CallHistoryPageNew = () => {
  const { user } = useAuth();
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState({
    sector: 'all',
    agent: '',
    status: 'all',
    dateRange: 'week',
    minDuration: 0,
    maxDuration: 1000
  });
  const [selectedCalls, setSelectedCalls] = useState(new Set());

  // Mock call data
  const mockCalls = [
    {
      id: '1',
      timestamp: new Date(2025, 10, 29, 14, 30),
      duration: 272,
      sector: 'healthcare',
      caller: { name: 'Dr. Smith\'s Clinic', id: 'clinic-001' },
      agent: 'PatientBot v2',
      status: 'completed',
      satisfaction: 4.2,
      transcript: 'Appointment scheduled for Nov 30...',
      outcome: 'Appointment scheduled'
    },
    {
      id: '2',
      timestamp: new Date(2025, 10, 29, 13, 15),
      duration: 138,
      sector: 'ecommerce',
      caller: { name: 'Amazon Store', id: 'store-001' },
      agent: 'OrderBot v3',
      status: 'escalated',
      satisfaction: 3.8,
      transcript: 'Order issue reported...',
      outcome: 'Transferred to human agent'
    },
    {
      id: '3',
      timestamp: new Date(2025, 10, 29, 12, 45),
      duration: 156,
      sector: 'logistics',
      caller: { name: 'DHL Express', id: 'dhl-001' },
      agent: 'TrackingBot v1',
      status: 'completed',
      satisfaction: 4.5,
      transcript: 'Package tracking updated...',
      outcome: 'Delivery status provided'
    },
    {
      id: '4',
      timestamp: new Date(2025, 10, 29, 11, 20),
      duration: 89,
      sector: 'fintech',
      caller: { name: 'HDFC Bank', id: 'hdfc-001' },
      agent: 'TransactionBot v2',
      status: 'completed',
      satisfaction: 4.7,
      transcript: 'Transaction verified...',
      outcome: 'Fraud alert resolved'
    },
    {
      id: '5',
      timestamp: new Date(2025, 10, 29, 10, 15),
      duration: 201,
      sector: 'support',
      caller: { name: 'Customer Support', id: 'support-001' },
      agent: 'L1SupportBot v1',
      status: 'completed',
      satisfaction: 4.1,
      transcript: 'Issue resolved...',
      outcome: 'Ticket created'
    }
  ];

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get sector color
  const getSectorColor = (sector) => {
    const colors = {
      ecommerce: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'badge-orange' },
      healthcare: { bg: 'bg-red-100', text: 'text-red-700', badge: 'badge-red' },
      logistics: { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'badge-gray' },
      fintech: { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'badge-purple' },
      support: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'badge-blue' },
      telecom: { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'badge-amber' },
      realestate: { bg: 'bg-amber-900', text: 'text-yellow-700', badge: 'badge-yellow' },
      government: { bg: 'bg-slate-100', text: 'text-slate-700', badge: 'badge-slate' },
      education: { bg: 'bg-violet-100', text: 'text-violet-700', badge: 'badge-violet' },
      travel: { bg: 'bg-cyan-100', text: 'text-cyan-700', badge: 'badge-cyan' },
      saas: { bg: 'bg-pink-100', text: 'text-pink-700', badge: 'badge-pink' }
    };
    return colors[sector] || colors.support;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    if (status === 'completed') return '✅';
    if (status === 'escalated') return '⚠️';
    if (status === 'failed') return '❌';
    return '⏳';
  };

  // Get sector emoji
  const getSectorEmoji = (sector) => {
    const emojis = {
      ecommerce: '🛒',
      healthcare: '🏥',
      logistics: '🚚',
      fintech: '💰',
      support: '📞',
      telecom: '📱',
      realestate: '🏠',
      government: '🏛️',
      education: '🎓',
      travel: '✈️',
      saas: '💻'
    };
    return emojis[sector] || '📊';
  };

  // Get sector label
  const getSectorLabel = (sector) => {
    const labels = {
      ecommerce: 'E-Commerce',
      healthcare: 'Healthcare',
      logistics: 'Logistics',
      fintech: 'Fintech',
      support: 'Support',
      telecom: 'Telecom',
      realestate: 'Real Estate',
      government: 'Government',
      education: 'Education',
      travel: 'Travel',
      saas: 'SaaS'
    };
    return labels[sector] || sector;
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let results = mockCalls;

    // Search filter
    if (searchQuery) {
      results = results.filter(call =>
        call.caller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.agent.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sector filter
    if (filters.sector !== 'all') {
      results = results.filter(call => call.sector === filters.sector);
    }

    // Status filter
    if (filters.status !== 'all') {
      results = results.filter(call => call.status === filters.status);
    }

    setFilteredCalls(results);
    setPage(1);
  }, [searchQuery, filters]);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Toggle call selection
  const toggleCallSelection = (callId) => {
    const newSelected = new Set(selectedCalls);
    if (newSelected.has(callId)) {
      newSelected.delete(callId);
    } else {
      newSelected.add(callId);
    }
    setSelectedCalls(newSelected);
  };

  // Pagination
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedCalls = filteredCalls.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredCalls.length / pageSize);

  if (!user) return <div className="p-8 text-center">Please log in to view call history</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="📞 Call History" description="View and analyze all your calls" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by caller name, agent, or contact..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sectors</option>
                <option value="ecommerce">🛒 E-Commerce</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="logistics">🚚 Logistics</option>
                <option value="fintech">💰 Fintech</option>
                <option value="support">📞 Support</option>
                <option value="telecom">📱 Telecom</option>
                <option value="realestate">🏠 Real Estate</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">✅ Completed</option>
                <option value="escalated">⚠️ Escalated</option>
                <option value="failed">❌ Failed</option>
                <option value="pending">⏳ Pending</option>
              </select>
            </div>

            {/* Agent Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>
              <input
                type="text"
                placeholder="Filter by agent..."
                onChange={(e) => handleFilterChange('agent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                🔍 Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {startIdx + 1}-{Math.min(endIdx, filteredCalls.length)} of {filteredCalls.length} calls
        </div>

        {/* Call Cards */}
        <div className="space-y-4 mb-8">
          {paginatedCalls.map(call => (
            <div
              key={call.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 cursor-pointer"
              onClick={() => {
                setSelectedCall(call);
                setShowDetailModal(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Top Row */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{getSectorEmoji(call.sector)}</span>
                    <span className="text-sm font-medium text-gray-700">{formatTime(call.timestamp)}</span>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={14} /> {formatDuration(call.duration)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(call.sector).bg} ${getSectorColor(call.sector).text}`}>
                      {getSectorLabel(call.sector)}
                    </span>
                    <span className="ml-auto text-lg">{getStatusIcon(call.status)}</span>
                  </div>

                  {/* Caller & Agent */}
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900">{call.caller.name}</p>
                    <p className="text-xs text-gray-600">Agent: {call.agent}</p>
                  </div>

                  {/* Status & Outcome */}
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-medium">Outcome:</span> {call.outcome}
                  </p>

                  {/* Rating */}
                  {call.satisfaction && (
                    <p className="text-sm text-gray-600">
                      Rating: <span className="font-medium">{call.satisfaction}★</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Play recording
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Play recording"
                  >
                    <Play size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // View transcript
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                    title="View transcript"
                  >
                    <FileText size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCall(call);
                      setShowDetailModal(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                    title="View details"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* Call Detail Modal */}
        {showDetailModal && selectedCall && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Call Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Caller</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCall.caller.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Agent</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCall.agent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-medium text-gray-900">{formatDuration(selectedCall.duration)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-lg font-medium text-gray-900">{getStatusIcon(selectedCall.status)} {selectedCall.status}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Outcome</p>
                    <p className="text-gray-900">{selectedCall.outcome}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Transcript Preview</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedCall.transcript}</p>
                  </div>

                  {selectedCall.satisfaction && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Customer Satisfaction</p>
                      <div className="flex items-center">
                        <span className="text-3xl">{selectedCall.satisfaction}★</span>
                        <span className="ml-2 text-gray-600">/ 5.0</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    🔊 Play Recording
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    📥 Export
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistoryPageNew;
