import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import CallReviewCard from '../components/CallReviewCard';
import QAMetricsPanel from '../components/QAMetricsPanel';
import CoachingPanel from '../components/CoachingPanel';
import { CheckCircle, AlertCircle, TrendingUp, Users, Award, Clock } from 'lucide-react';
import '../styles/QADashboard.css';

/**
 * QADashboard - Supervisor view for QA workflow
 * Shows calls pending review, team performance, coaching assignments
 */
const QADashboard = () => {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // pending, reviewed, team, coaching
  const [calls, setCalls] = useState([]);
  const [teamMetrics, setTeamMetrics] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const [reviewingCall, setReviewingCall] = useState(false);

  useEffect(() => {
    fetchQAData();
  }, [token, activeTab]);

  const fetchQAData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch calls based on active tab
      let status = activeTab === 'pending' ? 'pending' : 
                   activeTab === 'reviewed' ? 'reviewed' : null;

      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await axios.get(`/api/qa/calls-to-review?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCalls(response.data.data || []);
    } catch (err) {
      console.error('Error fetching QA data:', err);
      setError('Failed to load QA data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCall = async (call) => {
    try {
      const response = await axios.get(`/api/qa/calls/${call.id}/review`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedCall(response.data.data);
      setReviewingCall(true);
    } catch (err) {
      setError('Failed to load call details');
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axios.post(`/api/qa/calls/${selectedCall.call.id}/review`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviewingCall(false);
      setSelectedCall(null);
      await fetchQAData();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="qa-dashboard loading">
          <div className="spinner">Loading QA Dashboard...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="qa-dashboard">
          <div className="qa-header">
            <h1>QA Dashboard</h1>
            <p className="subtitle">Review calls, provide feedback, and track team performance</p>
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle className="icon" />
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Summary Cards */}
          <div className="summary-cards">
            <SummaryCard
              icon={Clock}
              label="Pending Reviews"
              value={calls.filter(c => c.reviews.length === 0).length}
              color="bg-blue-600"
            />
            <SummaryCard
              icon={CheckCircle}
              label="Completed Reviews"
              value={calls.filter(c => c.reviews.some(r => r.status === 'completed')).length}
              color="bg-green-600"
            />
            <SummaryCard
              icon={AlertCircle}
              label="Flagged Calls"
              value={calls.filter(c => c.reviews.some(r => r.status === 'flagged')).length}
              color="bg-red-600"
            />
            <SummaryCard
              icon={Users}
              label="Team Members"
              value={new Set(calls.map(c => c.team_member_id)).size}
              color="bg-purple-600"
            />
          </div>

          {/* Tabs */}
          <div className="qa-tabs">
            <button
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Review
            </button>
            <button
              className={`tab ${activeTab === 'reviewed' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviewed')}
            >
              Completed
            </button>
            <button
              className={`tab ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              Team Performance
            </button>
            <button
              className={`tab ${activeTab === 'coaching' ? 'active' : ''}`}
              onClick={() => setActiveTab('coaching')}
            >
              Coaching
            </button>
          </div>

          {/* Content Area */}
          <div className="qa-content">
            {reviewingCall && selectedCall ? (
              <CallReviewCard
                call={selectedCall}
                onSubmitReview={handleSubmitReview}
                onCancel={() => setReviewingCall(false)}
              />
            ) : activeTab === 'pending' || activeTab === 'reviewed' ? (
              <div className="calls-list">
                {calls.length === 0 ? (
                  <div className="empty-state">
                    <p>No calls to review</p>
                  </div>
                ) : (
                  calls.map(call => (
                    <div
                      key={call.id}
                      className={`call-item ${selectedCall?.call.id === call.id ? 'selected' : ''}`}
                      onClick={() => handleSelectCall(call)}
                    >
                      <div className="call-info">
                        <h4>{call.team_member_name || 'Unknown'}</h4>
                        <p className="phone">{call.phone_from}</p>
                        <p className="time">
                          {new Date(call.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="call-status">
                        {call.reviews.length > 0 ? (
                          <div className="reviewed-badge">
                            <CheckCircle className="icon" />
                            <span>Reviewed</span>
                            {call.reviews[0].status === 'flagged' && (
                              <span className="flagged">Flagged</span>
                            )}
                          </div>
                        ) : (
                          <div className="pending-badge">
                            <Clock className="icon" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'team' ? (
              <QAMetricsPanel token={token} />
            ) : activeTab === 'coaching' ? (
              <CoachingPanel token={token} />
            ) : null}
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
};

const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <div className="summary-card">
    <div className={`icon-box ${color}`}>
      <Icon className="icon" />
    </div>
    <div className="card-content">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  </div>
);

export default QADashboard;
