import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Breadcrumb from '../components/Breadcrumb';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Phone, Clock, AlertCircle, Loader } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * AnalyticsPage Component
 * 
 * Comprehensive analytics dashboard showing:
 * - Key performance indicators (KPIs)
 * - Call volume trends (hourly/daily)
 * - Revenue breakdown
 * - Customer sentiment analysis
 * - Agent performance metrics
 */
const AnalyticsPage = () => {
  const { getAuthHeader } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const authHeaders = getAuthHeader();
      
      const response = await fetch(`${API_BASE_URL}/api/analytics/comprehensive?range=${timeRange}`, {
        headers: authHeaders
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Please try again.');
      setLoading(false);
    }
  };

  const calculateCostSavings = () => {
    if (!analytics?.kpis) return { aiCost: 0, humanCost: 0, savings: 0 };
    
    const costPerAICall = 0.15; // $0.15 per AI call
    const costPerHumanCall = 5.00; // $5.00 per human call
    const totalCalls = analytics.kpis.total_calls || 0;
    const automationRate = analytics.kpis.automation_rate || 0;
    
    const automatedCalls = Math.round(totalCalls * (automationRate / 100));
    const humanCalls = totalCalls - automatedCalls;
    
    return {
      aiCost: (automatedCalls * costPerAICall).toFixed(2),
      humanCost: (totalCalls * costPerHumanCall).toFixed(2),
      savings: (automatedCalls * (costPerHumanCall - costPerAICall)).toFixed(2)
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const costData = calculateCostSavings();
  const sentimentData = analytics?.sentimentBreakdown || [];
  const chartData = analytics?.hourlyData || [];

  return (
    <>
      <Breadcrumb />
      <PageHeader 
        title="Analytics & Insights" 
        subtitle="Comprehensive performance metrics and KPIs"
        showBackButton={false}
        actions={
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        }
      />
      <div className="bg-gray-50">

      {/* Error Alert */}
      {error && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            icon={Phone}
            label="Total Calls"
            value={analytics?.kpis?.total_calls || 0}
            unit=""
            color="blue"
          />
          <KPICard
            icon={TrendingUp}
            label="Automation Rate"
            value={`${analytics?.kpis?.automation_rate || 0}%`}
            unit=""
            color="green"
          />
          <KPICard
            icon={Clock}
            label="Avg Duration"
            value={analytics?.kpis?.avg_handling_time_seconds || 0}
            unit="s"
            color="purple"
          />
          <KPICard
            icon={DollarSign}
            label="Cost Savings"
            value={`$${costData.savings}`}
            unit=""
            color="orange"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Volume */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Call Volume Trend</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#3B82F6"
                    dot={{ fill: '#3B82F6' }}
                    name="Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No data available</p>
            )}
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Sentiment</h2>
            {sentimentData.length > 0 ? (
              <div className="space-y-4">
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
                <div className="space-y-2 text-sm">
                  {sentimentData.map(item => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <strong className="text-gray-900">{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No sentiment data available</p>
            )}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">AI Call Cost</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">${costData.aiCost}</p>
            <p className="text-xs text-gray-500 mt-2">For {analytics?.kpis?.total_calls || 0} calls</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Human Call Cost</p>
            <p className="text-3xl font-bold text-red-600 mt-2">${costData.humanCost}</p>
            <p className="text-xs text-gray-500 mt-2">If all calls were manual</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Monthly Savings</p>
            <p className="text-3xl font-bold text-green-600 mt-2">${costData.savings}</p>
            <p className="text-xs text-gray-500 mt-2">With current automation</p>
          </div>
        </div>

        {/* Agent Performance */}
        {analytics?.agentPerformance && analytics.agentPerformance.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Agent Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Agent</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Calls Handled</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Success Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.agentPerformance.map((agent, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{agent.name}</td>
                      <td className="py-3 px-4 text-gray-600">{agent.calls_handled || 0}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {agent.success_rate || 0}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{agent.avg_handling_time || 0}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * KPI Card Component
 */
const KPICard = ({ icon: Icon, label, value, unit, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg shadow p-6 border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">
            {value}{unit}
          </p>
        </div>
        <Icon className="w-8 h-8 opacity-60" />
      </div>
    </div>
  );
};

export default AnalyticsPage;
