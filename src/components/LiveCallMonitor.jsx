import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Pause, Play, X, Copy, CheckCircle, AlertCircle } from 'lucide-react';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Live Call Monitor - Real-time call monitoring
export const LiveCallMonitor = () => {
  const [activeCalls, setActiveCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchActiveCalls();
    
    // Poll for active calls every 2 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchActiveCalls, 2000);
    }
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchActiveCalls = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/calls/active`);
      const data = await res.json();
      setActiveCalls(data.calls || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active calls:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📞 Live Calls</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {autoRefresh ? '🔴 Live' : '⚫ Paused'}
          </button>
          <button
            onClick={fetchActiveCalls}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {activeCalls.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No active calls at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Incoming calls will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Calls List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activeCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCall?.id === call.id
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{call.phone_from}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {call.client_name || 'Unknown Client'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {call.current_intent && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {call.current_intent}
                        </span>
                      )}
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {Math.floor((Date.now() - new Date(call.start_ts).getTime()) / 1000)}s
                      </span>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Call Details */}
          {selectedCall && (
            <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Call Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{selectedCall.phone_from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-semibold">{selectedCall.client_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">
                      {Math.floor((Date.now() - new Date(selectedCall.start_ts).getTime()) / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Intent:</span>
                    <span className="font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {selectedCall.current_intent || 'Detecting...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Transcript */}
              <div>
                <h3 className="font-bold mb-3">💬 Live Transcript</h3>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto space-y-3 text-sm">
                  {selectedCall.transcript_partial ? (
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">CUSTOMER</p>
                          <p className="text-gray-800">{selectedCall.transcript_partial}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">AI AGENT</p>
                          <p className="text-gray-800 italic">Processing response...</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Waiting for input...</p>
                  )}
                </div>
              </div>

              {/* Agent Status */}
              {selectedCall.agent_type && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold mb-2">🤖 Agent Status</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-600">Type:</span> <span className="font-semibold">{selectedCall.agent_type}</span></p>
                    <p><span className="text-gray-600">State:</span> <span className="font-semibold text-green-600">{selectedCall.agent_state}</span></p>
                    {selectedCall.agent_progress && (
                      <p><span className="text-gray-600">Progress:</span> <span className="font-semibold">{selectedCall.agent_progress}</span></p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2">
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveCallMonitor;
