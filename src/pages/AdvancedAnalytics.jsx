import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Download, Filter, Calendar,
  Phone, CheckCircle, Users, Award
} from 'lucide-react';
import '../styles/AdvancedAnalytics.css';

/**
 * Advanced Analytics Dashboard - Phase 10
 * Comprehensive business intelligence and performance metrics
 */
const AdvancedAnalytics = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, trends, team, calls, reports
  const [days, setDays] = useState(30);
  const [dashboardData, setDashboardData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [callAnalytics, setCallAnalytics] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [token, days, activeTab]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'dashboard') {
        const res = await axios.get(`/api/analytics/dashboard?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data.data);
      } else if (activeTab === 'trends') {
        const res = await axios.get(`/api/analytics/trends?days=${days}&metric=calls&period=daily`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrendsData(res.data.data.trends);
      } else if (activeTab === 'team') {
        const res = await axios.get(`/api/analytics/team-performance?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeamPerformance(res.data.data.team_performance);
      } else if (activeTab === 'calls') {
        const res = await axios.get(`/api/analytics/call-analytics?days=${days}&groupBy=sector`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCallAnalytics(res.data.data.analytics);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await axios.get(`/api/analytics/export/${format}?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: format === 'csv' ? 'blob' : 'json'
      });

      if (format === 'csv') {
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
      } else {
        const dataStr = JSON.stringify(res.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics-${Date.now()}.json`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      setError('Failed to export analytics');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="analytics-page loading">
          <div className="spinner">Loading analytics...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="analytics-page">
          <div className="analytics-header">
            <h1>Advanced Analytics</h1>
            <p className="subtitle">Business Intelligence & Performance Metrics</p>
          </div>

          {/* Controls */}
          <div className="analytics-controls">
            <div className="filter-group">
              <Calendar size={18} />
              <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>

            <div className="export-group">
              <button onClick={() => handleExport('csv')} className="btn-export csv">
                <Download size={16} />
                Export CSV
              </button>
              <button onClick={() => handleExport('json')} className="btn-export json">
                <Download size={16} />
                Export JSON
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Tabs */}
          <div className="analytics-tabs">
            <button
              className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              Trends
            </button>
            <button
              className={`tab ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              Team Performance
            </button>
            <button
              className={`tab ${activeTab === 'calls' ? 'active' : ''}`}
              onClick={() => setActiveTab('calls')}
            >
              Call Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="analytics-content">
            {activeTab === 'dashboard' && dashboardData && (
              <DashboardView data={dashboardData} />
            )}
            {activeTab === 'trends' && trendsData && (
              <TrendsView data={trendsData} />
            )}
            {activeTab === 'team' && teamPerformance && (
              <TeamPerformanceView data={teamPerformance} />
            )}
            {activeTab === 'calls' && callAnalytics && (
              <CallAnalyticsView data={callAnalytics} />
            )}
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
};

// Dashboard View Component
const DashboardView = ({ data }) => {
  return (
    <div className="dashboard-view">
      <div className="kpi-cards">
        <KPICard
          icon={Phone}
          label="Total Calls"
          value={data.calls?.total_calls || 0}
          subtext={`${data.calls?.resolved_calls || 0} resolved`}
        />
        <KPICard
          icon={CheckCircle}
          label="Resolution Rate"
          value={`${Math.round((data.calls?.resolved_calls / data.calls?.total_calls) * 100)}%`}
          subtext="of calls resolved"
        />
        <KPICard
          icon={Award}
          label="Avg QA Score"
          value={Math.round(data.team?.avg_qa_score || 0)}
          subtext="team average"
        />
        <KPICard
          icon={Users}
          label="Team Size"
          value={data.team?.team_size || 0}
          subtext="active members"
        />
      </div>

      {/* Top Agents */}
      <div className="chart-section">
        <h3>Top Performing Agents</h3>
        <div className="agents-table">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Calls Handled</th>
                <th>Avg Duration (min)</th>
                <th>QA Score</th>
              </tr>
            </thead>
            <tbody>
              {data.top_agents?.map((agent, idx) => (
                <tr key={idx}>
                  <td>{agent.name}</td>
                  <td>{agent.calls_handled}</td>
                  <td>{Math.round((agent.avg_call_duration || 0) / 60)}</td>
                  <td>
                    <span className={`score-badge score-${agent.qa_score >= 80 ? 'high' : 'low'}`}>
                      {agent.qa_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Trends View Component
const TrendsView = ({ data }) => {
  return (
    <div className="trends-view">
      <div className="chart-section">
        <h3>Calls Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Calls" />
            <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Average Call Duration</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => Math.round(value / 60) + ' min'} />
            <Bar dataKey="avg_duration" fill="#8b5cf6" name="Duration (seconds)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Team Performance View Component
const TeamPerformanceView = ({ data }) => {
  return (
    <div className="team-performance-view">
      <div className="performance-table">
        <table>
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Calls Handled</th>
              <th>Resolution Rate</th>
              <th>Avg Duration</th>
              <th>QA Score</th>
              <th>Escalated</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((agent, idx) => (
              <tr key={idx}>
                <td className="agent-name">{agent.name}</td>
                <td>{agent.calls_handled || 0}</td>
                <td>
                  <span className={`rate-badge ${(agent.resolution_rate || 0) >= 80 ? 'high' : 'low'}`}>
                    {agent.resolution_rate || 0}%
                  </span>
                </td>
                <td>{Math.round((agent.avg_duration_seconds || 0) / 60)} min</td>
                <td>
                  <span className={`score-badge score-${(agent.qa_score || 0) >= 80 ? 'high' : 'low'}`}>
                    {agent.qa_score || 'N/A'}
                  </span>
                </td>
                <td>{agent.escalated_count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Call Analytics View Component
const CallAnalyticsView = ({ data }) => {
  return (
    <div className="call-analytics-view">
      <div className="chart-section">
        <h3>Calls by Category</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total_calls"
              nameKey="sector"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Resolution Rate by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sector" />
            <YAxis />
            <Tooltip formatter={(value) => value + '%'} />
            <Bar dataKey="resolution_rate" fill="#10b981" name="Resolution Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ icon: Icon, label, value, subtext }) => (
  <div className="kpi-card">
    <div className="kpi-icon">
      <Icon size={24} />
    </div>
    <div className="kpi-content">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-subtext">{subtext}</p>
    </div>
  </div>
);

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default AdvancedAnalytics;
