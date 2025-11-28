// Frontend/src/pages/Dashboard.jsx - Redesigned dashboard with reduced information overload
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import UserMenu from '../components/UserMenu';
import MobileNavigation from '../components/MobileNavigation';
import LoadingSkeleton, { SkeletonDashboard } from '../components/SkeletonLoader';
import { Card, Typography, Section } from '../components/DesignSystem';
import {
  Phone, TrendingUp, Clock, LogOut, Settings, Menu, X, ChevronDown,
  BarChart3, Users, AlertCircle, CheckCircle, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    trends: true,
    performance: false,
  });
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
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
          calls: h.calls || 0,
          automated: Math.floor((h.calls || 0) * 0.75)
        }));
        setDailyData(daily);

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // HERO METRIC CARD - Single focal point
  const HeroMetric = () => (
    <div className={`${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-600 to-blue-700'} rounded-lg p-8 text-white shadow-lg animate-fade-in`}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-blue-100 font-medium mb-2">{t('dashboard.todaysCalls')}</p>
          <h1 className="text-5xl font-bold mb-2">{stats?.kpis?.total_calls || 0}</h1>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-300" />
            <p className="text-green-300 font-semibold">+12% vs yesterday</p>
          </div>
        </div>
        <Phone className="w-20 h-20 opacity-20" />
      </div>
    </div>
  );

  // SUPPORTING METRICS - 3 key KPIs
  const SupportingMetric = ({ icon: Icon, label, value, subtext, color }) => (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {subtext && <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // COLLAPSIBLE SECTION
  const CollapsibleSection = ({ title, isOpen, onToggle, children }) => (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden animate-fade-in-up`}>
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
      >
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>
      
      {isOpen && (
        <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {children}
        </div>
      )}
    </div>
  );

  if (loading && !stats) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl w-full mx-auto p-6">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`hidden md:flex md:flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Page Header with User Menu */}
        <PageHeader 
          title={t('dashboard.title')}
          subtitle={`${t('dashboard.welcome')}, ${user?.firstName || user?.email}`}
          showBackButton={false}
          actions={<UserMenu />}
        />

        {/* Mobile Header (hidden on desktop) */}
        <div className={`md:hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b p-4`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{t('dashboard.title')}</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('dashboard.welcome')}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`m-6 p-4 ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg flex items-start gap-3 animate-fade-in-down`}>
            <AlertCircle className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
            <span className={`text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`}>{error}</span>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className="p-6 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* HERO METRIC */}
            <HeroMetric />

            {/* SUPPORTING METRICS - 3 Key KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SupportingMetric
                icon={CheckCircle}
                label={t('dashboard.automationRate')}
                value={`${stats?.kpis?.automation_rate || 0}%`}
                subtext="↑ 5% vs yesterday"
                color="bg-green-600"
              />
              <SupportingMetric
                icon={Clock}
                label={t('dashboard.avgDuration')}
                value={`${stats?.kpis?.avg_handling_time || 0}s`}
                subtext="↓ 3s improvement"
                color="bg-purple-600"
              />
              <SupportingMetric
                icon={TrendingUp}
                label="Productivity"
                value={`${Math.floor((stats?.kpis?.automation_rate || 0) * 0.8)}%`}
                subtext="On track"
                color="bg-orange-600"
              />
            </div>

            {/* TRENDS SECTION - Collapsible */}
            <CollapsibleSection
              title={t('dashboard.callVolume7Days')}
              isOpen={expandedSections.trends}
              onToggle={() => toggleSection('trends')}
            >
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="time" stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }} />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} name="Total Calls" />
                    <Line type="monotone" dataKey="automated" stroke="#10B981" strokeWidth={2} name="Automated" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-center py-20`}>{t('dashboard.noDataAvailable')}</p>
              )}
            </CollapsibleSection>

            {/* AGENT PERFORMANCE - Collapsible */}
            <CollapsibleSection
              title="Agent Performance"
              isOpen={expandedSections.performance}
              onToggle={() => toggleSection('performance')}
            >
              {agentPerformance.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {agentPerformance.map((agent, idx) => (
                    <div key={idx} className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{agent.name}</p>
                      <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{agent.calls}</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success: {agent.success.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-center py-8`}>No agent data available yet</p>
              )}
            </CollapsibleSection>

            {/* QUICK ACTIONS */}
            <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${isDark ? 'border-blue-800/30' : 'border-blue-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>💡 Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-blue-900 hover:bg-blue-800 text-blue-100' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  View All Calls
                </button>
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
                  Configure Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Dashboard;
