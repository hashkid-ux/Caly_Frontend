import React, { useState, useEffect } from 'react';
import { BarChart3, Phone, Users, TrendingUp, Activity, Settings, FileText, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    automationRate: 0,
    avgHandlingTime: 0,
    callsToday: 0,
    resolvedToday: 0
  });

  const [recentCalls, setRecentCalls] = useState([]);
  const [activeAgents, setActiveAgents] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
    
    // Poll for real-time updates every 5 seconds
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with API calls
      setStats({
        totalCalls: 1247,
        activeCalls: 3,
        automationRate: 87.5,
        avgHandlingTime: 145,
        callsToday: 89,
        resolvedToday: 78
      });

      setRecentCalls([
        { id: 1, phone: '+91 98765 43210', status: 'active', intent: 'Order Lookup', duration: '2:34', agent: 'OrderLookupAgent' },
        { id: 2, phone: '+91 98765 43211', status: 'completed', intent: 'Return Request', duration: '4:12', agent: 'ReturnAgent' },
        { id: 3, phone: '+91 98765 43212', status: 'active', intent: 'Refund', duration: '1:05', agent: 'RefundAgent' }
      ]);

      setActiveAgents([
        { type: 'OrderLookupAgent', count: 2, avgDuration: 180 },
        { type: 'RefundAgent', count: 1, avgDuration: 95 }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtext && <p className="text-gray-400 text-xs mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const CallRow = ({ call }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">{call.phone}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          call.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {call.status}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">{call.intent}</td>
      <td className="py-3 px-4 text-gray-500">{call.agent}</td>
      <td className="py-3 px-4">
        <div className="flex items-center text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {call.duration}
        </div>
      </td>
      <td className="py-3 px-4">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View Details
        </button>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Caly Voice AI Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time call monitoring & analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                + Add Client
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Phone}
            label="Total Calls"
            value={stats.totalCalls.toLocaleString()}
            subtext={`${stats.callsToday} today`}
            color="text-blue-600"
          />
          <StatCard
            icon={Activity}
            label="Active Calls"
            value={stats.activeCalls}
            subtext="Live now"
            color="text-green-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Automation Rate"
            value={`${stats.automationRate}%`}
            subtext={`${stats.resolvedToday}/${stats.callsToday} resolved`}
            color="text-purple-600"
          />
          <StatCard
            icon={Clock}
            label="Avg Handling Time"
            value={`${stats.avgHandlingTime}s`}
            subtext="Last 24 hours"
            color="text-orange-600"
          />
        </div>

        {/* Active Agents */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Active Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAgents.map((agent, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{agent.type}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {agent.count} active
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Avg: {agent.avgDuration}s
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Recent Calls
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Phone Number</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Intent</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Agent</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Duration</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map(call => (
                  <CallRow key={call.id} call={call} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Client Management</h3>
            <p className="text-sm text-gray-500">Manage clients, API keys, and configurations</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
            <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Analytics & Reports</h3>
            <p className="text-sm text-gray-500">View detailed analytics and export reports</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
            <Settings className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Agent Configuration</h3>
            <p className="text-sm text-gray-500">Customize agent behavior and responses</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;