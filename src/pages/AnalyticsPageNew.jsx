import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import KPICard from '../UI/KPICard';
import FilterBar from '../UI/FilterBar';
import PageHeader from '../PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../hooks/useRealData';

/**
 * Analytics Dashboard - REAL DATA FROM BACKEND
 * - Fetches KPIs from /api/analytics/kpis endpoint
 * - All data comes from database (calls, agents, teams tables)
 * - NO mock data used anywhere
 * - Real metrics: calls today, duration, completion rate, error rate
 * - Real charts: volume trend, agent performance, sector breakdown, outcomes
 */
const AnalyticsPageNew = () => {
  const { user } = useAuth();
  const [sector, setSector] = useState('all');
  const [days, setDays] = useState(7);

  // Fetch real analytics data from backend
  const { data: analyticsResponse, isLoading, error } = useAnalytics(
    user?.client_id,
    { sector: sector === 'all' ? null : sector, days: parseInt(days) }
  );

  const analyticsData = analyticsResponse?.data;

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <PageHeader title="📊 Analytics Dashboard" description="Real-time performance metrics" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error loading analytics: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    // Export analytics to CSV
    const headers = ['Metric', 'Value', 'Trend'];
    const rows = [
      ['Calls Today', analyticsData?.callsToday || 0, 'N/A'],
      ['Avg Duration (min)', analyticsData?.avgDuration || 0, 'N/A'],
      ['Completion Rate (%)', analyticsData?.completionRate || 0, 'N/A'],
      ['Error Rate (%)', analyticsData?.errorRate || 0, 'N/A']
    ];

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <PageHeader 
        title="📊 Analytics Dashboard" 
        description="Real-time performance metrics from backend" 
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sectors</option>
                <option value="healthcare">Healthcare</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="logistics">Logistics</option>
                <option value="fintech">Fintech</option>
                <option value="realestate">Real Estate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Calls Today"
            value={analyticsData?.callsToday || 0}
            trend={analyticsData?.callsTrendPercent || 0}
            trendLabel="increase"
            status={analyticsData?.callsToday > 200 ? 'success' : 'warning'}
            color="blue"
            loading={isLoading}
          />
          <KPICard
            title="Avg Duration"
            value={analyticsData?.avgDuration ? `${Math.round(analyticsData.avgDuration)}m` : '0m'}
            trend={analyticsData?.durationTrendPercent || 0}
            trendLabel="decrease"
            status="info"
            color="purple"
            loading={isLoading}
          />
          <KPICard
            title="Completion Rate"
            value={analyticsData?.completionRate ? `${analyticsData.completionRate.toFixed(1)}%` : '0%'}
            trend={analyticsData?.completionTrendPercent || 0}
            trendLabel="increase"
            status={analyticsData?.completionRate > 95 ? 'success' : 'warning'}
            color="green"
            loading={isLoading}
          />
          <KPICard
            title="Error Rate"
            value={analyticsData?.errorRate ? `${analyticsData.errorRate.toFixed(1)}%` : '0%'}
            trend={analyticsData?.errorTrendPercent || 0}
            trendLabel="decrease"
            status={analyticsData?.errorRate > 5 ? 'danger' : 'success'}
            color="red"
            loading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Call Volume Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📈 Call Volume Trend</h3>
            {analyticsData?.dailyTrend && analyticsData.dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    name="Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>

          {/* Top Agent Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">👥 Top Agent Performance</h3>
            {analyticsData?.topAgents && analyticsData.topAgents.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.topAgents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis width={100} dataKey="agent_type" type="category" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="success_rate" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No agent data available
              </div>
            )}
          </div>

          {/* Sector Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🏢 Calls by Sector</h3>
            {analyticsData?.sectorBreakdown && analyticsData.sectorBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.sectorBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ sector, percentage }) => `${sector}: ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.sectorBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#FFA500', '#EF4444', '#1E40AF', '#4B5563', '#8B4513', '#6B7280'][index % 6]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No sector data available
              </div>
            )}
          </div>

          {/* Call Outcomes */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Call Outcomes</h3>
            {analyticsData?.outcomes && analyticsData.outcomes.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.outcomes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analyticsData.outcomes.map((entry, index) => {
                      const colors = ['#10B981', '#F59E0B', '#EF4444'];
                      return <Cell key={`cell-${index}`} fill={colors[index % 3]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} calls`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No outcome data available
              </div>
            )}
          </div>
        </div>

        {/* Hourly Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">⏰ Hourly Call Volume (Last 24h)</h3>
          {analyticsData?.hourlyTrend && analyticsData.hourlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.hourlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No hourly data available
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">📋 Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm font-medium">Total Calls</p>
              <p className="text-3xl font-bold text-gray-800">{analyticsData?.totalCalls || 0}</p>
              <p className="text-gray-500 text-xs mt-1">All calls in period</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-600 text-sm font-medium">Successful Calls</p>
              <p className="text-3xl font-bold text-gray-800">{analyticsData?.successfulCalls || 0}</p>
              <p className="text-gray-500 text-xs mt-1">Resolved successfully</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-gray-600 text-sm font-medium">Failed Calls</p>
              <p className="text-3xl font-bold text-gray-800">{analyticsData?.failedCalls || 0}</p>
              <p className="text-gray-500 text-xs mt-1">Escalated or failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageNew;
