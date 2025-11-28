import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Zap, AlertCircle, Loader, CheckCircle, TrendingUp } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * TeamPage Component
 * 
 * Displays all AI agents and their performance metrics
 * Features:
 * - Agent status and statistics
 * - Calls handled and success rates
 * - Real-time performance tracking
 */
const TeamPage = () => {
  const { getAuthHeader } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgents();
    // Refresh every 15 seconds
    const interval = setInterval(fetchAgents, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      setError('');
      const authHeaders = getAuthHeader();
      
      // Try to fetch from /api/agents endpoint
      // If not available, fall back to agents from analytics
      const response = await fetch(`${API_BASE_URL}/api/analytics/comprehensive?range=7d`, {
        headers: authHeaders
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }

      const data = await response.json();
      
      // Extract agents from analytics data
      const agentsData = data.agentPerformance || [];
      
      // Format agents data
      const formattedAgents = agentsData.map(agent => ({
        id: agent.name,
        name: agent.name,
        callsHandled: agent.calls_handled || 0,
        successRate: agent.success_rate || 0,
        avgHandlingTime: agent.avg_handling_time || 0,
        active: true
      }));

      setAgents(formattedAgents.length > 0 ? formattedAgents : getDefaultAgents());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching team data:', err);
      // Use mock data on error
      setAgents(getDefaultAgents());
      setLoading(false);
    }
  };

  const getDefaultAgents = () => {
    return [
      {
        id: 'order-lookup',
        name: 'OrderLookupAgent',
        callsHandled: 0,
        successRate: 0,
        avgHandlingTime: 0,
        active: true
      },
      {
        id: 'return-agent',
        name: 'ReturnAgent',
        callsHandled: 0,
        successRate: 0,
        avgHandlingTime: 0,
        active: true
      },
      {
        id: 'refund-agent',
        name: 'RefundAgent',
        callsHandled: 0,
        successRate: 0,
        avgHandlingTime: 0,
        active: true
      },
      {
        id: 'tracking-agent',
        name: 'TrackingAgent',
        callsHandled: 0,
        successRate: 0,
        avgHandlingTime: 0,
        active: true
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  const activeAgents = agents.filter(a => a.active).length;
  const totalCalls = agents.reduce((sum, a) => sum + (a.callsHandled || 0), 0);
  const avgSuccessRate =
    agents.length > 0
      ? Math.round(agents.reduce((sum, a) => sum + (a.successRate || 0), 0) / agents.length)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
              <p className="text-gray-600 mt-1">Manage and monitor your AI agent team</p>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatBox label="Total Agents" value={agents.length} icon={Users} />
            <StatBox label="Active Agents" value={activeAgents} icon={CheckCircle} />
            <StatBox label="Total Calls" value={totalCalls.toLocaleString()} icon={TrendingUp} />
            <StatBox label="Avg Success Rate" value={`${avgSuccessRate}%`} icon={Zap} />
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

      {/* Agents Grid */}
      <div className="p-6">
        {agents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Configure your AI agents in settings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}

        {/* Detailed Table View */}
        {agents.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Performance Details</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Agent Name</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-900">Calls Handled</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-900">Success Rate</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-900">Avg Duration</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent, idx) => (
                    <tr key={agent.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6 text-gray-900 font-medium">{agent.name}</td>
                      <td className="py-4 px-6 text-right text-gray-600">
                        {(agent.callsHandled || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            (agent.successRate || 0) >= 85
                              ? 'bg-green-100 text-green-800'
                              : (agent.successRate || 0) >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {agent.successRate || 0}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">
                        {agent.avgHandlingTime || 0}s
                      </td>
                      <td className="py-4 px-6 text-center">
                        {agent.active ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                            <span className="w-2 h-2 bg-gray-400 rounded-full" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Agent Card Component
 */
const AgentCard = ({ agent }) => {
  const getSuccessRateColor = (rate) => {
    if (rate >= 85) return 'from-green-50 to-green-100 border-green-200';
    if (rate >= 70) return 'from-yellow-50 to-yellow-100 border-yellow-200';
    return 'from-red-50 to-red-100 border-red-200';
  };

  const getStatusColor = (rate) => {
    if (rate >= 85) return 'text-green-600 bg-green-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`bg-gradient-to-br ${getSuccessRateColor(agent.successRate)} rounded-lg shadow-md p-6 border-2 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{agent.name}</h3>
            {agent.active && (
              <span className="text-xs text-green-600 font-semibold">● Active</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 font-medium">Calls Handled</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {(agent.callsHandled || 0).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600 font-medium mb-2">Success Rate</p>
          <div className="flex items-center justify-between">
            <div className="flex-1 bg-gray-300 rounded-full h-2 mr-2">
              <div
                className={`h-full rounded-full ${
                  (agent.successRate || 0) >= 85
                    ? 'bg-green-600'
                    : (agent.successRate || 0) >= 70
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(agent.successRate || 0, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-bold px-2 py-1 rounded ${getStatusColor(agent.successRate)}`}>
              {agent.successRate || 0}%
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 font-medium">Avg Duration</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {agent.avgHandlingTime || 0}s
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Stat Box Component
 */
const StatBox = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default TeamPage;
