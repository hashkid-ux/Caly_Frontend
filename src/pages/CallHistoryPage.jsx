import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Search, Filter, Clock, User, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * CallHistoryPage Component
 * 
 * Displays all customer calls with filtering and search capabilities
 * Features:
 * - Real-time call list
 * - Search by phone number
 * - Filter by status (all, active, resolved)
 * - Call details display
 * - Integration with call playback (future)
 */
const CallHistoryPage = () => {
  const { user, getAuthHeader } = useAuth();
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, resolved
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCalls();
    // Refresh every 10 seconds
    const interval = setInterval(fetchCalls, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter calls whenever search, status filter, or calls change
  useEffect(() => {
    let filtered = calls;

    // Apply status filter
    if (filterStatus !== 'all') {
      const isResolved = filterStatus === 'resolved';
      filtered = filtered.filter(call => (call.resolved || false) === isResolved);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(call =>
        (call.phone_from || '').includes(searchTerm) ||
        (call.phone_to || '').includes(searchTerm)
      );
    }

    setFilteredCalls(filtered);
  }, [calls, searchTerm, filterStatus]);

  const fetchCalls = async () => {
    try {
      setError('');
      const authHeaders = getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/calls?limit=100&offset=0`, {
        headers: authHeaders
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }

      const data = await response.json();
      setCalls(data.calls || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching calls:', err);
      setError('Failed to load calls. Please try again.');
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading calls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow sticky top-0 z-10">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
                <p className="text-gray-600 mt-1">View and manage all customer calls</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing <strong>{filteredCalls.length}</strong> of <strong>{calls.length}</strong> calls
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Calls List */}
        <div className="p-6 space-y-4">
          {filteredCalls.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No calls found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search term'
                  : 'No calls have been recorded yet'}
              </p>
            </div>
          ) : (
            filteredCalls.map(call => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{call.phone_from || 'Unknown'}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600">{call.phone_to || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500">Status</p>
                        <div className="flex items-center gap-1 mt-1">
                          {call.resolved ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-600">Resolved</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              <span className="font-medium text-yellow-600">Active</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {formatDuration(call.duration_seconds)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Intent</p>
                        <p className="font-medium text-gray-900 mt-1">{call.intent || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium text-gray-900 mt-1 text-xs">
                          {new Date(call.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Call Details Panel */}
      {selectedCall && (
        <div className="w-80 bg-white border-l border-gray-200 shadow-lg overflow-auto">
          <div className="p-6 sticky top-0 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Call Details</h2>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Phone From</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedCall.phone_from}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone To</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedCall.phone_to || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Duration</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {formatDuration(selectedCall.duration_seconds)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className={`font-semibold mt-1 ${selectedCall.resolved ? 'text-green-600' : 'text-yellow-600'}`}>
                  {selectedCall.resolved ? 'Resolved' : 'Active'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Intent</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedCall.intent || 'General'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Started</p>
                <p className="font-semibold text-gray-900 mt-1 text-xs">
                  {formatDate(selectedCall.created_at)}
                </p>
              </div>
              {selectedCall.transcript_summary && (
                <div>
                  <p className="text-gray-500 text-sm">Summary</p>
                  <p className="text-gray-700 mt-1 text-sm">{selectedCall.transcript_summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistoryPage;
