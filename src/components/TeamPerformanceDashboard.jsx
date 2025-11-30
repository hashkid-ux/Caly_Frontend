import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/TeamPerformanceDashboard.css';

/**
 * TeamPerformanceDashboard - Display real-time performance metrics for team members
 * Shows: success rate, avg rating, calls handled, performance trend
 */
const TeamPerformanceDashboard = ({ memberId, memberName, performance }) => {
  const { token } = useAuth();
  const [performanceData, setPerformanceData] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, [memberId, token]);

  const fetchPerformanceData = async () => {
    try {
      setError(null);

      // Get current performance
      const perfResponse = await axios.get(
        `/api/teams/members/${memberId}/performance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPerformanceData(perfResponse.data.data);

      // Extract trend data if available
      if (perfResponse.data.data?.trend) {
        setTrend(perfResponse.data.data.trend);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', class: 'excellent' };
    if (score >= 60) return { level: 'Good', class: 'good' };
    if (score >= 40) return { level: 'Fair', class: 'fair' };
    return { level: 'Needs Improvement', class: 'poor' };
  };

  const data = performanceData || performance || {};
  const performanceScore = data.performance_score || 0;
  const perfLevel = getPerformanceLevel(performanceScore);

  if (loading && !data) {
    return <div className="performance-dashboard loading">Loading performance data...</div>;
  }

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h3>Performance Metrics</h3>
        <button
          className="btn btn-small btn-secondary"
          onClick={fetchPerformanceData}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="metrics-grid">
        {/* Overall Performance Score */}
        <div className="metric-card score">
          <div className="metric-content">
            <h4>Overall Performance</h4>
            <div className="score-display">
              <div className={`score-circle ${perfLevel.class}`}>
                <div className="score-value">{performanceScore.toFixed(0)}</div>
              </div>
              <div className="score-info">
                <p className="score-level">{perfLevel.level}</p>
                <p className="score-hint">Based on success rate, satisfaction, and speed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="metric-card">
          <h4>Success Rate</h4>
          <div className="metric-value">
            {((data.success_rate || 0) * 100).toFixed(0)}%
          </div>
          <div className="metric-bar">
            <div
              className="bar-fill"
              style={{ width: `${(data.success_rate || 0) * 100}%` }}
            />
          </div>
          <p className="metric-label">Calls resolved successfully</p>
        </div>

        {/* Average Rating */}
        <div className="metric-card">
          <h4>Avg Rating</h4>
          <div className="metric-value">
            {(data.avg_rating || 0).toFixed(1)} / 5
          </div>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`star ${star <= (data.avg_rating || 0) ? 'filled' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="metric-label">Customer satisfaction rating</p>
        </div>

        {/* Calls Total */}
        <div className="metric-card">
          <h4>Total Calls</h4>
          <div className="metric-value">{data.calls_total || 0}</div>
          <p className="metric-label">Total calls handled</p>
        </div>

        {/* Calls This Week */}
        <div className="metric-card">
          <h4>This Week</h4>
          <div className="metric-value">{data.calls_this_week || 0}</div>
          <p className="metric-label">Calls handled this week</p>
        </div>

        {/* Avg Handling Time */}
        <div className="metric-card">
          <h4>Avg Time</h4>
          <div className="metric-value">
            {data.avg_handling_time ? `${Math.round(data.avg_handling_time / 60)}m` : '—'}
          </div>
          <p className="metric-label">Average call duration</p>
        </div>
      </div>

      {/* Agent Breakdown */}
      {data.assigned_agents && data.assigned_agents.length > 0 && (
        <div className="agents-breakdown">
          <h4>Performance by Agent</h4>
          <div className="agents-list">
            {data.assigned_agents.map(agent => (
              <div key={agent.agent_id} className="agent-performance">
                <div className="agent-header">
                  <h5>{agent.agent_type}</h5>
                  <span className="proficiency">
                    Proficiency: {agent.proficiency_level || 50}%
                  </span>
                </div>

                <div className="agent-stats">
                  <div className="stat">
                    <label>Calls Handled</label>
                    <value>{agent.calls_handled || 0}</value>
                  </div>

                  <div className="stat">
                    <label>Success Rate</label>
                    <value>
                      {((agent.success_rate || 0) * 100).toFixed(0)}%
                    </value>
                  </div>

                  <div className="stat">
                    <label>Avg Time</label>
                    <value>
                      {agent.avg_handling_time ? `${Math.round(agent.avg_handling_time / 60)}m` : '—'}
                    </value>
                  </div>
                </div>

                <div className="agent-bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${(agent.success_rate || 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Trend */}
      {trend && trend.length > 0 && (
        <div className="performance-trend">
          <h4>7-Day Trend</h4>
          <div className="trend-chart">
            <div className="trend-bars">
              {trend.map((day, idx) => (
                <div key={idx} className="trend-bar-group">
                  <div className="trend-bar-item">
                    <div
                      className="bar"
                      style={{ height: `${(day.success_rate || 0) * 100}%` }}
                      title={`${day.date}: ${(day.success_rate * 100).toFixed(0)}%`}
                    />
                    <span className="date">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="chart-label">Success rate over the last 7 days</p>
          </div>
        </div>
      )}

      <div className="dashboard-footer">
        <p className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default TeamPerformanceDashboard;
