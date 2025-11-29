import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * TeamAnalytics - Performance analytics with charts and trends
 * Shows 30-day performance metrics and team comparison
 */
export default function TeamAnalytics({ teamId: propTeamId, token: propToken }) {
  const params = useParams();
  const { token: authToken } = useAuth();

  const teamId = propTeamId || params.id;
  const token = propToken || authToken;
  const [days, setDays] = useState(30);

  // Fetch performance data
  const { data: performanceData = [], isLoading: perfLoading } = useQuery({
    queryKey: ['teamPerformance', teamId, days],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/performance?days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return (response.data.data || []).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      );
    },
    enabled: !!token && !!teamId,
  });

  // Process chart data
  const chartData = performanceData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    calls: item.calls_handled || 0,
    completed: item.calls_completed || 0,
    escalated: item.calls_escalated || 0,
    satisfaction: item.avg_satisfaction_score || 0,
    resolution: (item.resolution_rate * 100).toFixed(1) || 0,
  }));

  // Calculate summary stats
  const summary = {
    totalCalls: performanceData.reduce((sum, item) => sum + (item.calls_handled || 0), 0),
    totalCompleted: performanceData.reduce(
      (sum, item) => sum + (item.calls_completed || 0),
      0
    ),
    totalEscalated: performanceData.reduce(
      (sum, item) => sum + (item.calls_escalated || 0),
      0
    ),
    avgSatisfaction:
      performanceData.length > 0
        ? (
            performanceData.reduce(
              (sum, item) => sum + (item.avg_satisfaction_score || 0),
              0
            ) / performanceData.length
          ).toFixed(1)
        : 0,
    avgResolution:
      performanceData.length > 0
        ? (
            (performanceData.reduce((sum, item) => sum + (item.resolution_rate || 0), 0) /
              performanceData.length) *
            100
          ).toFixed(1)
        : 0,
  };

  if (perfLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Calls</p>
          <p className="text-3xl font-bold text-white">{summary.totalCalls}</p>
          <p className="text-xs text-slate-500 mt-1">
            {days} day period
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-400">{summary.totalCompleted}</p>
          <p className="text-xs text-slate-500 mt-1">
            {summary.totalCalls > 0
              ? ((summary.totalCompleted / summary.totalCalls) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Escalations</p>
          <p className="text-3xl font-bold text-orange-400">{summary.totalEscalated}</p>
          <p className="text-xs text-slate-500 mt-1">
            {summary.totalCalls > 0
              ? ((summary.totalEscalated / summary.totalCalls) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Avg Satisfaction</p>
          <p className="text-3xl font-bold text-yellow-400">
            {summary.avgSatisfaction}
          </p>
          <p className="text-xs text-slate-500 mt-1">out of 5</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Resolution Rate</p>
          <p className="text-3xl font-bold text-blue-400">{summary.avgResolution}%</p>
          <p className="text-xs text-slate-500 mt-1">average</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-slate-700">
          <p className="text-slate-400">No performance data available</p>
        </div>
      ) : (
        <>
          {/* Calls Trend */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Calls Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Calls"
                  dot={{ fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Completed"
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Satisfaction & Resolution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Satisfaction Score
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '0.5rem',
                      color: '#f1f5f9',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={{ fill: '#fbbf24' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resolution Rate</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '0.5rem',
                      color: '#f1f5f9',
                    }}
                  />
                  <Bar dataKey="resolution" fill="#3b82f6" name="Resolution %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                const csv = [
                  ['Date', 'Calls', 'Completed', 'Escalated', 'Satisfaction', 'Resolution %'],
                  ...chartData.map((row) => [
                    row.date,
                    row.calls,
                    row.completed,
                    row.escalated,
                    row.satisfaction,
                    row.resolution,
                  ]),
                ]
                  .map((row) => row.join(','))
                  .join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `team-analytics-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              📥 Export CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}
