// Frontend/src/pages/Dashboard.jsx - Main admin dashboard
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import PageHeader from '../components/PageHeader';
import UserMenu from '../components/UserMenu';
import {
  Phone, TrendingUp, DollarSign, Clock, LogOut, Settings, Menu, X,
  BarChart3, Users, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [agentPerformance, setAgentPerformance] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes] = await Promise.all([
        axiosInstance.get('/api/analytics/comprehensive?range=today'),
        axiosInstance.get('/api/analytics/comprehensive?range=7d')
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }

      if (analyticsRes.data) {
        // Transform hourly data for chart
        const daily = (analyticsRes.data.hourlyData || []).map(h => ({
          time: h.hour || '00:00',
          calls: h.calls || 0
        }));
        setDailyData(daily);

        // Revenue data
        const revenue = (analyticsRes.data.hourlyData || []).map(h => ({
          time: h.hour || '00:00',
          revenue: (h.calls || 0) * 0.15 // Rough estimate
        }));
        setRevenueData(revenue);

        // Agent performance
        const agents = (analyticsRes.data.agentPerformance || []).map(a => ({
          name: a.name || 'Unknown',
          calls: a.calls_handled || 0,
          success: a.success_rate || 0
        }));
        setAgentPerformance(agents);
      }

      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ icon: Icon, label, value, change, bgColor }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: bgColor }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs yesterday
            </p>
          )}
        </div>
        <div style={{ backgroundColor: bgColor + '20' }} className="p-3 rounded-lg">
          <Icon className="w-6 h-6" style={{ color: bgColor }} />
        </div>
      </div>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`hidden md:flex md:flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Page Header with User Menu */}
        <PageHeader 
          title="Dashboard"
          subtitle={`Welcome back, ${user?.firstName || user?.email}`}
          showBackButton={false}
          actions={<UserMenu />}
        />

        {/* Mobile Header (hidden on desktop) */}
        <div className="md:hidden bg-white border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 text-sm">Welcome back</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Phone}
            label="Today's Calls"
            value={stats?.kpis?.total_calls || 0}
            change={12}
            bgColor="#3B82F6"
          />
          <StatCard
            icon={CheckCircle}
            label="Automation Rate"
            value={`${stats?.kpis?.automation_rate || 0}%`}
            change={5}
            bgColor="#10B981"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue (Est.)"
            value={`₹${((stats?.kpis?.total_calls || 0) * 30).toLocaleString()}`}
            change={8}
            bgColor="#F59E0B"
          />
          <StatCard
            icon={Clock}
            label="Avg Duration"
            value={`${stats?.kpis?.avg_handling_time || 0}s`}
            change={-3}
            bgColor="#8B5CF6"
          />
        </div>

        {/* Charts */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Volume Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Volume (7 Days)</h3>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-20">No data available</p>
            )}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue (7 Days)</h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-20">No data available</p>
            )}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agentPerformance.length > 0 ? (
                agentPerformance.map((agent, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                    <p className="font-medium text-gray-900 text-sm">{agent.name}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{agent.calls}</p>
                    <p className="text-xs text-gray-600 mt-1">Success: {agent.success.toFixed(1)}%</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-8">No agent data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
