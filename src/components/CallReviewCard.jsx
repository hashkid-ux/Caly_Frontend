import React, { useState } from 'react';
import CallReviewForm from './CallReviewForm';
import { ChevronUp, ChevronDown } from 'lucide-react';
import '../styles/CallReviewCard.css';

/**
 * CallReviewCard - Display call details with review form
 * Shows transcript context, metrics, and review submission
 */
const CallReviewCard = ({ call, onSubmitReview, onCancel }) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (reviewData) => {
    try {
      setIsSubmitting(true);
      await onSubmitReview(reviewData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!call) {
    return (
      <div className="call-review-card">
        <p>No call data available</p>
      </div>
    );
  }

  return (
    <div className="call-review-card-container">
      <div className="card-header">
        <h3>Review Call</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <div className="card-content">
        {/* Call Context Summary */}
        <div className="call-context-section">
          <div className="context-summary">
            <div className="summary-item">
              <span className="label">Agent:</span>
              <span className="value">{call.team_member?.name || 'Unknown'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Caller:</span>
              <span className="value">{call.phone_from}</span>
            </div>
            <div className="summary-item">
              <span className="label">Duration:</span>
              <span className="value">{call.duration || 'N/A'}s</span>
            </div>
            <div className="summary-item">
              <span className="label">Date:</span>
              <span className="value">
                {new Date(call.created_at).toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Status:</span>
              <span className={`status-badge ${call.status}`}>
                {call.status || 'Completed'}
              </span>
            </div>
          </div>
        </div>

        {/* Previous Reviews */}
        {call.reviews && call.reviews.length > 0 && (
          <div className="previous-reviews-section">
            <h4>Previous Reviews</h4>
            {call.reviews.map((review, idx) => (
              <div key={idx} className="review-item">
                <div className="review-header">
                  <span className="score-badge">{review.qa_score}</span>
                  <span className="status-badge">{review.status}</span>
                  <span className="date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="feedback-text">{review.feedback}</p>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible Transcript */}
        <div className="transcript-section">
          <button
            className="section-toggle"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            <span>Call Transcript</span>
            {showTranscript ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showTranscript && (
            <div className="transcript-content">
              {call.transcript ? (
                <div className="transcript-text">
                  {call.transcript}
                </div>
              ) : (
                <p className="no-transcript">No transcript available</p>
              )}
            </div>
          )}
        </div>

        {/* Collapsible Metrics */}
        <div className="metrics-section">
          <button
            className="section-toggle"
            onClick={() => setShowMetrics(!showMetrics)}
          >
            <span>Call Metrics</span>
            {showMetrics ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showMetrics && (
            <div className="metrics-content">
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Duration</span>
                  <span className="metric-value">{call.duration || 'N/A'}s</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Wait Time</span>
                  <span className="metric-value">{call.wait_time || 'N/A'}s</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">After-Call Work</span>
                  <span className="metric-value">{call.acw_time || 'N/A'}s</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Resolution Status</span>
                  <span className="metric-value">
                    {call.resolved ? 'Resolved' : 'Unresolved'}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Sector</span>
                  <span className="metric-value">{call.sector || 'N/A'}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Call Type</span>
                  <span className="metric-value">{call.call_type || 'Inbound'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QA Review Form */}
        <div className="review-form-section">
          <CallReviewForm
            call={call}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CallReviewCard;
