import React, { useState, useEffect } from 'react';
import { 
  Phone, Users, TrendingUp, Activity, Settings, FileText, 
  Clock, BarChart3, AlertCircle, CheckCircle, Store, Key,
  Globe, DollarSign, Plus, Filter, Download, Search,
  PlayCircle, PauseCircle, RefreshCw, X, Edit, Trash2,
  Home, PhoneCall, Database, Zap, ChevronRight, Menu
} from 'lucide-react';

// API Configuration
if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Main App Component with Router
const CalyApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pages = {
    dashboard: <Dashboard setPage={setCurrentPage} />,
    calls: <CallsPage />,
    clients: <ClientsPage setPage={setCurrentPage} />,
    analytics: <AnalyticsPage />,
    agents: <AgentsPage />,
    settings: <SettingsPage />,
    onboarding: <ClientOnboarding setPage={setCurrentPage} />
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300`}>
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-blue-600">Caly AI</h1>
              <p className="text-xs text-gray-500">Voice Agent Platform</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'calls', icon: PhoneCall, label: 'Calls' },
            { id: 'clients', icon: Users, label: 'Clients' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'agents', icon: Zap, label: 'Agents' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'px-2 justify-center'} py-3 rounded-lg transition-colors ${
                currentPage === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {pages[currentPage]}
      </div>
    </div>
  );
};

// Dashboard Page
const Dashboard = ({ setPage }) => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    automationRate: 0,
    avgHandlingTime: 0,
    callsToday: 0,
    resolvedToday: 0,
    totalClients: 0
  });
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const kpisRes = await fetch(`${API_BASE_URL}/api/analytics/kpis`);
      const kpisData = await kpisRes.json();
      
      const callsRes = await fetch(`${API_BASE_URL}/api/calls?limit=10`);
      const callsData = await callsRes.json();
      
      const clientsRes = await fetch(`${API_BASE_URL}/api/clients`);
      const clientsData = await clientsRes.json();

      setStats({
        totalCalls: kpisData.total_calls || 0,
        activeCalls: 0,
        automationRate: parseFloat(kpisData.automation_rate) || 0,
        avgHandlingTime: kpisData.avg_handling_time_seconds || 0,
        callsToday: kpisData.total_calls || 0,
        resolvedToday: kpisData.resolved_calls || 0,
        totalClients: clientsData.clients?.length || 0
      });

      setRecentCalls(callsData.calls || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {subtext && <p className="text-gray-400 text-xs mt-2">{subtext}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of your voice AI operations</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <button 
          onClick={() => setPage('onboarding')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Phone}
          label="Total Calls"
          value={stats.totalCalls.toLocaleString()}
          subtext={`${stats.callsToday} today`}
          color="text-blue-600"
          trend={12}
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
          value={`${stats.automationRate.toFixed(1)}%`}
          subtext={`${stats.resolvedToday}/${stats.callsToday} resolved`}
          color="text-purple-600"
          trend={5}
        />
        <StatCard
          icon={Clock}
          label="Avg Handling Time"
          value={`${stats.avgHandlingTime}s`}
          subtext="Last 24 hours"
          color="text-orange-600"
          trend={-3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-blue-600" />
              Recent Calls
            </h2>
            <button 
              onClick={() => setPage('calls')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="divide-y">
            {recentCalls.slice(0, 5).map(call => (
              <div key={call.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.phone_from}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(call.start_ts).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      call.resolved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {call.resolved ? 'Resolved' : 'Pending'}
                    </span>
                    {call.end_ts && (
                      <span className="text-sm text-gray-500">
                        {Math.round((new Date(call.end_ts) - new Date(call.start_ts)) / 1000)}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Active Clients
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Clients</span>
                <span className="font-bold text-2xl text-gray-900">{stats.totalClients}</span>
              </div>
              <button 
                onClick={() => setPage('clients')}
                className="w-full mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium"
              >
                Manage Clients
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Voice Engine</span>
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Agents</span>
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> 14 Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calls Page
const CallsPage = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ resolved: '', search: '' });

  useEffect(() => {
    fetchCalls();
  }, [filters]);

  const fetchCalls = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.resolved) params.append('resolved', filters.resolved);
      if (filters.search) params.append('phone_from', filters.search);
      
      const res = await fetch(`${API_BASE_URL}/api/calls?${params}`);
      const data = await res.json();
      setCalls(data.calls || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
        <p className="text-gray-500 mt-1">View and manage all customer calls</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by phone number..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <select
          value={filters.resolved}
          onChange={(e) => setFilters({...filters, resolved: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Statuses</option>
          <option value="true">Resolved</option>
          <option value="false">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {calls.map(call => (
              <tr key={call.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{call.phone_from}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(call.start_ts).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {call.end_ts 
                    ? `${Math.round((new Date(call.end_ts) - new Date(call.start_ts)) / 1000)}s`
                    : 'In progress'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    call.resolved 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {call.resolved ? 'Resolved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Clients Page
const ClientsPage = ({ setPage }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/clients`)
      .then(res => res.json())
      .then(data => setClients(data.clients || []))
      .catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your B2B clients</p>
        </div>
        <button 
          onClick={() => setPage('onboarding')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                client.active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {client.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{client.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{client.email}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Store</span>
                <span className="font-medium text-gray-900 truncate ml-2">{client.shopify_store_url}</span>
              </div>
            </div>

            <button className="w-full mt-4 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm">
              View Stats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics, Agents, Settings Pages
const AnalyticsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Reports</h1>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics Coming Soon</h2>
      <p className="text-gray-500">Detailed charts and insights will be available here</p>
    </div>
  </div>
);

const AgentsPage = () => {
  const agents = [
    { name: 'OrderLookupAgent', calls: 145, successRate: 92 },
    { name: 'ReturnAgent', calls: 89, successRate: 87 },
    { name: 'RefundAgent', calls: 67, successRate: 95 },
    { name: 'TrackingAgent', calls: 123, successRate: 91 }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
            <Zap className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="font-bold text-gray-900 mb-4">{agent.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Calls</span>
                <span className="font-bold">{agent.calls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success</span>
                <span className="font-bold text-green-600">{agent.successRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
      <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Settings Coming Soon</h2>
    </div>
  </div>
);

// Client Onboarding
const ClientOnboarding = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    shopifyStore: '', shopifyApiKey: '', shopifyApiSecret: '',
    exotelNumber: ''
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.name,
          email: formData.email,
          phone: formData.phone,
          shopifyStore: formData.shopifyStore,
          shopifyApiKey: formData.shopifyApiKey,
          shopifyApiSecret: formData.shopifyApiSecret,
          exotelNumber: formData.exotelNumber
        })
      });

      if (res.ok) {
        setStep(3);
        setTimeout(() => setPage('clients'), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Client</h1>

          {step === 1 && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={() => setStep(2)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Shopify Store URL"
                value={formData.shopifyStore}
                onChange={(e) => setFormData({...formData, shopifyStore: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Shopify API Key"
                value={formData.shopifyApiKey}
                onChange={(e) => setFormData({...formData, shopifyApiKey: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Shopify API Secret"
                value={formData.shopifyApiSecret}
                onChange={(e) => setFormData({...formData, shopifyApiSecret: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Exotel Number"
                value={formData.exotelNumber}
                onChange={(e) => setFormData({...formData, exotelNumber: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Client
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-500">Client created successfully</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalyApp;