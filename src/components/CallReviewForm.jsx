import React, { useState, useMemo } from 'react';
import { Star, AlertCircle, CheckCircle, X } from 'lucide-react';
import '../styles/CallReviewForm.css';

/**
 * CallReviewForm - Form for supervisors to review QA calls
 * Captures score (0-100), feedback by category, and coaching recommendations
 */
const CallReviewForm = ({ call, onSubmit, onCancel, isSubmitting = false }) => {
  const [qaScore, setQaScore] = useState(75);
  const [reviewStatus, setReviewStatus] = useState('completed');
  const [feedbackItems, setFeedbackItems] = useState([
    { category: 'communication', score: 75, notes: '' },
    { category: 'problem_solving', score: 75, notes: '' },
    { category: 'product_knowledge', score: 75, notes: '' },
    { category: 'empathy', score: 75, notes: '' },
    { category: 'resolution', score: 75, notes: '' },
    { category: 'efficiency', score: 75, notes: '' },
    { category: 'compliance', score: 75, notes: '' }
  ]);
  const [coachingNeeded, setCoachingNeeded] = useState(false);
  const [coachingTopic, setCoachingTopic] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');

  const categoryLabels = {
    communication: 'Communication Skills',
    problem_solving: 'Problem Solving',
    product_knowledge: 'Product Knowledge',
    empathy: 'Empathy & Customer Understanding',
    resolution: 'Resolution Quality',
    efficiency: 'Call Efficiency',
    compliance: 'Compliance & Policies'
  };

  const coachingTopics = [
    'Communication Enhancement',
    'Problem Solving Techniques',
    'Product Knowledge Training',
    'Customer Empathy Development',
    'Efficiency Improvement',
    'Compliance Training',
    'Conflict Resolution',
    'Upselling Techniques',
    'Other'
  ];

  const avgScore = useMemo(() => {
    const sum = feedbackItems.reduce((acc, item) => acc + item.score, 0);
    return Math.round(sum / feedbackItems.length);
  }, [feedbackItems]);

  const handleFeedbackChange = (index, field, value) => {
    const updated = [...feedbackItems];
    updated[index] = { ...updated[index], [field]: value };
    setFeedbackItems(updated);

    // Auto-calculate overall score as average
    const newAvg = Math.round(
      updated.reduce((sum, item) => sum + item.score, 0) / updated.length
    );
    setQaScore(newAvg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      qa_score: qaScore,
      status: reviewStatus,
      feedback_text: generalFeedback,
      feedback_items: feedbackItems,
      coaching_needed: coachingNeeded,
      coaching_topic: coachingNeeded ? coachingTopic : null
    };

    onSubmit(reviewData);
  };

  const scoreColor = (score) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-fair';
    if (score >= 60) return 'score-poor';
    return 'score-failing';
  };

  const scoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Failing';
  };

  return (
    <div className="call-review-form-container">
      <div className="form-header">
        <h3>QA Review Form</h3>
        <button className="close-btn" onClick={onCancel} disabled={isSubmitting}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="call-review-form">
        {/* Call Context */}
        <section className="form-section">
          <h4>Call Information</h4>
          <div className="call-context">
            <div className="context-item">
              <label>Team Member</label>
              <p>{call.team_member?.name || 'Unknown'}</p>
            </div>
            <div className="context-item">
              <label>Caller</label>
              <p>{call.phone_from}</p>
            </div>
            <div className="context-item">
              <label>Duration</label>
              <p>{call.duration || 'N/A'} seconds</p>
            </div>
            <div className="context-item">
              <label>Call Date</label>
              <p>{new Date(call.created_at).toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Overall Score */}
        <section className="form-section">
          <div className="section-header">
            <h4>Overall QA Score</h4>
            <div className={`overall-score ${scoreColor(qaScore)}`}>
              <span className="score-number">{qaScore}</span>
              <span className="score-label">{scoreLabel(qaScore)}</span>
            </div>
          </div>

          <div className="score-slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={qaScore}
              onChange={(e) => setQaScore(parseInt(e.target.value))}
              className="score-slider"
            />
            <div className="slider-labels">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </section>

        {/* Category Feedback */}
        <section className="form-section">
          <h4>Category Feedback</h4>
          <div className="feedback-categories">
            {feedbackItems.map((item, index) => (
              <div key={item.category} className="feedback-item">
                <div className="feedback-header">
                  <label>{categoryLabels[item.category]}</label>
                  <div className={`category-score ${scoreColor(item.score)}`}>
                    {item.score}
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.score}
                  onChange={(e) =>
                    handleFeedbackChange(index, 'score', parseInt(e.target.value))
                  }
                  className="category-slider"
                />

                <textarea
                  placeholder={`Notes about ${categoryLabels[item.category].toLowerCase()}...`}
                  value={item.notes}
                  onChange={(e) =>
                    handleFeedbackChange(index, 'notes', e.target.value)
                  }
                  className="feedback-notes"
                  rows="2"
                />
              </div>
            ))}
          </div>
        </section>

        {/* General Feedback */}
        <section className="form-section">
          <h4>General Feedback</h4>
          <textarea
            placeholder="Enter any additional feedback, observations, or recommendations..."
            value={generalFeedback}
            onChange={(e) => setGeneralFeedback(e.target.value)}
            className="general-feedback"
            rows="4"
          />
        </section>

        {/* Review Status */}
        <section className="form-section">
          <h4>Review Status</h4>
          <div className="status-options">
            <label className="status-option">
              <input
                type="radio"
                value="completed"
                checked={reviewStatus === 'completed'}
                onChange={(e) => setReviewStatus(e.target.value)}
              />
              <span>
                <CheckCircle size={18} />
                Completed - Meeting standards
              </span>
            </label>
            <label className="status-option">
              <input
                type="radio"
                value="flagged"
                checked={reviewStatus === 'flagged'}
                onChange={(e) => setReviewStatus(e.target.value)}
              />
              <span>
                <AlertCircle size={18} />
                Flagged - Needs improvement
              </span>
            </label>
          </div>
        </section>

        {/* Coaching Assignment */}
        <section className="form-section">
          <h4>Coaching Assignment</h4>
          <label className="coaching-checkbox">
            <input
              type="checkbox"
              checked={coachingNeeded}
              onChange={(e) => setCoachingNeeded(e.target.checked)}
            />
            <span>Assign coaching for improvement</span>
          </label>

          {coachingNeeded && (
            <div className="coaching-options">
              <select
                value={coachingTopic}
                onChange={(e) => setCoachingTopic(e.target.value)}
                className="coaching-select"
                required
              >
                <option value="">Select coaching topic...</option>
                {coachingTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* Form Actions */}
        <section className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </section>
      </form>
    </div>
  );
};

export default CallReviewForm;
