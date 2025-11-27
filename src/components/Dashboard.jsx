// Frontend/src/components/Dashboard.jsx - Main admin dashboard with company metrics
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Phone, Users, TrendingUp, AlertCircle, Settings, LogOut,
  Calendar, Clock, DollarSign, Zap, MessageSquare
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [callsData, setCallsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      const [statsRes, callsRes] = await Promise.all([
        axiosInstance.get('/api/analytics/dashboard'),
        axiosInstance.get('/api/calls?limit=30&offset=0')
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }

      if (callsRes.data && callsRes.data.calls) {
        // Transform calls for chart
        const callsByDay = {};
        const revenueByDay = {};
        const sentiments = { positive: 0, neutral: 0, negative: 0 };

        callsRes.data.calls.forEach(call => {
          const date = new Date(call.created_at).toLocaleDateString();
          callsByDay[date] = (callsByDay[date] || 0) + 1;
          revenueByDay[date] = (revenueByDay[date] || 0) + (call.call_cost || 0);
          
          if (call.sentiment) {
            sentiments[call.sentiment.toLowerCase()] = (sentiments[call.sentiment.toLowerCase()] || 0) + 1;
          }
        });

        setCallsData(Object.entries(callsByDay).map(([date, count]) => ({
          date,
          calls: count
        })));

        setRevenueData(Object.entries(revenueByDay).map(([date, revenue]) => ({
          date,
          revenue: parseFloat(revenue.toFixed(2))
        })));

        setSentimentData([
          { name: 'Positive', value: sentiments.positive, fill: '#10b981' },
          { name: 'Neutral', value: sentiments.neutral, fill: '#f59e0b' },
          { name: 'Negative', value: sentiments.negative, fill: '#ef4444' }
        ]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, unit = '' }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}{unit}
          </p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from yesterday
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-blue-600 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.firstName}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Phone}
            label="Today's Calls"
            value={stats?.todaysCalls || 0}
            change={stats?.callsChange || 0}
          />
          <StatCard
            icon={Clock}
            label="Avg Duration"
            value={stats?.avgDuration || 0}
            unit=" min"
            change={stats?.durationChange || 0}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`₹${(stats?.todaysRevenue || 0).toFixed(2)}`}
            change={stats?.revenueChange || 0}
          />
          <StatCard
            icon={TrendingUp}
            label="Satisfaction"
            value={`${stats?.satisfactionRate || 0}%`}
            change={stats?.satisfactionChange || 0}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Calls Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Call Volume (7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calls" stroke="#2563eb" dot={{ fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue (7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment & Recent Calls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment Pie */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Sentiment</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {sentimentData.map(item => (
                <div key={item.name} className="flex justify-between">
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Calls */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Calls</h2>
            <div className="space-y-3">
              {callsData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No calls yet</p>
              ) : (
                callsData.slice(0, 5).map((call, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Call {idx + 1}</p>
                        <p className="text-xs text-gray-600">{call.date}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{call.calls} calls</span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate('/calls')}
              className="w-full mt-4 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded"
            >
              View All Calls →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
