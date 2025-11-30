import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, AlertCircle, Award, Users } from 'lucide-react';
import '../styles/QAMetricsPanel.css';

/**
 * QAMetricsPanel - Display team QA metrics and performance breakdown
 */
const QAMetricsPanel = ({ token }) => {
  const [teamMetrics, setTeamMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('qa_score'); // qa_score, reviews_completed, flagged_count

  useEffect(() => {
    fetchTeamMetrics();
  }, [token]);

  const fetchTeamMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you'd fetch from /api/qa/team-member/:memberId/qa-metrics
      // For now, simulating with data structure
      const response = await axios.get('/api/teams/members', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Enhanced with mock QA metrics for demonstration
      const metricsData = response.data.data.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        qa_score: Math.floor(Math.random() * 40) + 60, // 60-100
        reviews_completed: Math.floor(Math.random() * 50) + 5,
        flagged_count: Math.floor(Math.random() * 10),
        coaching_needed_count: Math.floor(Math.random() * 5),
        last_review: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        avg_call_duration: Math.floor(Math.random() * 300) + 120
      }));

      // Sort by selected metric
      const sorted = metricsData.sort((a, b) => {
        if (sortBy === 'qa_score') return b.qa_score - a.qa_score;
        if (sortBy === 'reviews_completed') return b.reviews_completed - a.reviews_completed;
        if (sortBy === 'flagged_count') return b.flagged_count - a.flagged_count;
        return 0;
      });

      setTeamMetrics(sorted);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load team metrics');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 60) return 'poor';
    return 'failing';
  };

  if (loading) {
    return <div className="loading">Loading team metrics...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  const totalTeamScore = Math.round(
    teamMetrics.reduce((sum, m) => sum + m.qa_score, 0) / teamMetrics.length
  );
  const totalReviewsCompleted = teamMetrics.reduce((sum, m) => sum + m.reviews_completed, 0);
  const totalFlagged = teamMetrics.reduce((sum, m) => sum + m.flagged_count, 0);

  return (
    <div className="qa-metrics-panel">
      {/* Summary Stats */}
      <div className="metrics-summary">
        <div className="summary-stat">
          <div className="stat-icon excellent">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Team Average QA Score</p>
            <p className={`stat-value score-${getScoreColor(totalTeamScore)}`}>
              {totalTeamScore}
            </p>
          </div>
        </div>

        <div className="summary-stat">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Reviews Completed</p>
            <p className="stat-value">{totalReviewsCompleted}</p>
          </div>
        </div>

        <div className="summary-stat">
          <div className="stat-icon warning">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Flagged Calls</p>
            <p className="stat-value">{totalFlagged}</p>
          </div>
        </div>

        <div className="summary-stat">
          <div className="stat-icon info">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Team Members</p>
            <p className="stat-value">{teamMetrics.length}</p>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="metrics-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="qa_score">QA Score (Highest)</option>
            <option value="reviews_completed">Reviews Completed</option>
            <option value="flagged_count">Flagged Calls</option>
          </select>
        </div>
      </div>

      {/* Team Member Metrics Table */}
      <div className="metrics-table-container">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Team Member</th>
              <th className="score-col">QA Score</th>
              <th>Reviews</th>
              <th>Flagged</th>
              <th>Coaching Needed</th>
              <th>Last Review</th>
              <th>Avg Duration</th>
            </tr>
          </thead>
          <tbody>
            {teamMetrics.map(member => (
              <tr key={member.id} className="metric-row">
                <td className="member-info">
                  <div>
                    <p className="member-name">{member.name}</p>
                    <p className="member-email">{member.email}</p>
                  </div>
                </td>
                <td className="score-col">
                  <div className={`score-badge score-${getScoreColor(member.qa_score)}`}>
                    {member.qa_score}
                  </div>
                </td>
                <td className="centered">{member.reviews_completed}</td>
                <td className="centered">
                  {member.flagged_count > 0 && (
                    <span className="flagged-badge">{member.flagged_count}</span>
                  )}
                  {member.flagged_count === 0 && <span className="text-muted">—</span>}
                </td>
                <td className="centered">
                  {member.coaching_needed_count > 0 ? (
                    <span className="coaching-badge">{member.coaching_needed_count}</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="text-muted">{member.last_review}</td>
                <td className="centered">{member.avg_call_duration}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Categories */}
      <div className="performance-breakdown">
        <h4>Performance Category Breakdown</h4>
        <div className="category-stats">
          {[
            { name: 'Communication', avg: 78 },
            { name: 'Problem Solving', avg: 82 },
            { name: 'Product Knowledge', avg: 76 },
            { name: 'Empathy', avg: 85 },
            { name: 'Resolution', avg: 79 },
            { name: 'Efficiency', avg: 81 },
            { name: 'Compliance', avg: 88 }
          ].map(cat => (
            <div key={cat.name} className="category-stat">
              <label>{cat.name}</label>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${cat.avg}%` }}></div>
              </div>
              <span className="progress-value">{cat.avg}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QAMetricsPanel;
