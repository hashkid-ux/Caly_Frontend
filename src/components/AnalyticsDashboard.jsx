import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, DollarSign, Zap, Clock, Users } from 'lucide-react';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Cost calculation helper
const calculateCostSavings = (callCount, automationRate) => {
  const costPerAICall = 0.15; // $0.15 per call (OpenAI + ASR + Exotel)
  const costPerHumanCall = 5.00; // $5 per call (human agent average)
  const automatedCalls = Math.round(callCount * (automationRate / 100));
  const humanCalls = callCount - automatedCalls;
  
  return {
    aiCost: (callCount * costPerAICall).toFixed(2),
    humanCost: (callCount * costPerHumanCall).toFixed(2),
    monthlySavings: (automatedCalls * (costPerHumanCall - costPerAICall)).toFixed(2),
    savingsPercent: ((1 - costPerAICall / costPerHumanCall) * 100).toFixed(0)
  };
};

// Analytics Page - Comprehensive KPI Dashboard
export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [analytics, setAnalytics] = useState({
    hourlyData: [],
    agentPerformance: [],
    intentBreakdown: [],
    kpis: {
      totalCalls: 0,
      resolvedCalls: 0,
      automationRate: 0,
      avgHandlingTime: 0,
      avgCustomerSatisfaction: 0,
      failureRate: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/analytics/comprehensive?range=${timeRange}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const costData = calculateCostSavings(analytics.kpis.totalCalls, analytics.kpis.automationRate);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard 
          icon={<Phone className="w-6 h-6" />}
          label="Total Calls" 
          value={analytics.kpis.totalCalls.toLocaleString()}
          change="+12%"
          trend="up"
        />
        <KPICard 
          icon={<CheckCircle className="w-6 h-6" />}
          label="Resolved (AI)" 
          value={`${analytics.kpis.automationRate}%`}
          subtitle={`${analytics.kpis.resolvedCalls.toLocaleString()} calls`}
          trend="up"
        />
        <KPICard 
          icon={<Clock className="w-6 h-6" />}
          label="Avg Handle Time" 
          value={`${analytics.kpis.avgHandlingTime}s`}
          subtitle="Per call"
          trend="down"
        />
        <KPICard 
          icon={<DollarSign className="w-6 h-6" />}
          label="Monthly Savings" 
          value={`$${costData.monthlySavings}`}
          subtitle={`${costData.savingsPercent}% vs human`}
          trend="up"
        />
      </div>

      {/* Cost Comparison */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-bold mb-4">💰 Cost Comparison</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">AI Cost (Current)</p>
            <p className="text-2xl font-bold text-blue-600">${costData.aiCost}</p>
            <p className="text-xs text-gray-500 mt-1">For {analytics.kpis.totalCalls} calls</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Human Cost (Equivalent)</p>
            <p className="text-2xl font-bold text-red-600">${costData.humanCost}</p>
            <p className="text-xs text-gray-500 mt-1">For {analytics.kpis.totalCalls} calls</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">💚 Monthly Savings</p>
            <p className="text-2xl font-bold text-green-600">${costData.monthlySavings}</p>
            <p className="text-xs text-gray-500 mt-1">{costData.savingsPercent}% reduction</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Call Volume */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Call Volume (Hourly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Total Calls" />
              <Bar dataKey="automated" fill="#10b981" name="AI Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Intent Breakdown */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Intent Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.intentBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                  '#ec4899', '#14b8a6', '#f97316'
                ].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-bold mb-4">🤖 Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-semibold">Agent</th>
                <th className="text-center p-3 font-semibold">Calls Handled</th>
                <th className="text-center p-3 font-semibold">Success Rate</th>
                <th className="text-center p-3 font-semibold">Avg Response</th>
              </tr>
            </thead>
            <tbody>
              {analytics.agentPerformance.map((agent, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{agent.name}</td>
                  <td className="text-center p-3">{agent.callsHandled}</td>
                  <td className="text-center p-3">
                    <span className={`px-2 py-1 rounded ${agent.successRate >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {agent.successRate}%
                    </span>
                  </td>
                  <td className="text-center p-3">{agent.avgResponseTime}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ icon, label, value, subtitle, change, trend }) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {icon}
      </div>
    </div>
    {change && (
      <div className={`text-xs mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </div>
    )}
  </div>
);

export default AnalyticsDashboard;
