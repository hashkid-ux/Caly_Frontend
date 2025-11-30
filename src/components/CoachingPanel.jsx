import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import '../styles/CoachingPanel.css';

/**
 * CoachingPanel - Manage coaching assignments and track progress
 */
const CoachingPanel = ({ token }) => {
  const [coachingData, setCoachingData] = useState({
    assignments: [],
    progress: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    team_member_id: '',
    topic: '',
    description: '',
    target_date: '',
    priority: 'medium'
  });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchCoachingData();
    fetchTeamMembers();
  }, [token]);

  const fetchCoachingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demonstration
      const mockData = {
        assignments: [
          {
            id: 1,
            team_member_id: 1,
            team_member_name: 'John Doe',
            supervisor_id: 2,
            topic: 'Communication Enhancement',
            description: 'Improve call opening and customer greeting techniques',
            target_date: '2025-12-15',
            priority: 'high',
            status: 'active',
            created_at: '2025-11-20'
          },
          {
            id: 2,
            team_member_id: 3,
            team_member_name: 'Jane Smith',
            supervisor_id: 2,
            topic: 'Product Knowledge Training',
            description: 'Review latest product features and specifications',
            target_date: '2025-12-20',
            priority: 'medium',
            status: 'active',
            created_at: '2025-11-22'
          }
        ],
        progress: [
          {
            id: 1,
            assignment_id: 1,
            session_date: '2025-11-25',
            topic_covered: 'Call Opening Techniques',
            progress_score: 7,
            notes: 'Good improvement in greeting, needs work on tone'
          },
          {
            id: 2,
            assignment_id: 1,
            session_date: '2025-11-28',
            topic_covered: 'Handling Customer Objections',
            progress_score: 8,
            notes: 'Significant improvement, becoming more confident'
          }
        ]
      };

      setCoachingData(mockData);
    } catch (err) {
      console.error('Error fetching coaching data:', err);
      setError('Failed to load coaching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('/api/teams/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/qa/team-member/coaching', newAssignment, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowNewAssignment(false);
      setNewAssignment({
        team_member_id: '',
        topic: '',
        description: '',
        target_date: '',
        priority: 'medium'
      });
      await fetchCoachingData();
    } catch (err) {
      setError('Failed to create coaching assignment');
    }
  };

  const handleAddProgress = async (assignmentId) => {
    try {
      const progressData = {
        session_date: new Date().toISOString().split('T')[0],
        topic_covered: 'Coaching Session',
        progress_score: 7,
        notes: 'Session conducted'
      };

      await axios.post(`/api/qa/coaching/${assignmentId}/progress`, progressData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCoachingData();
    } catch (err) {
      setError('Failed to add progress');
    }
  };

  if (loading) {
    return <div className="loading">Loading coaching data...</div>;
  }

  const getStatusColor = (status) => {
    if (status === 'active') return 'status-active';
    if (status === 'completed') return 'status-completed';
    return 'status-on-hold';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'priority-high';
    if (priority === 'medium') return 'priority-medium';
    return 'priority-low';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressAverage = (assignmentId) => {
    const progressItems = coachingData.progress.filter(
      p => p.assignment_id === assignmentId
    );
    if (progressItems.length === 0) return 0;
    const avg = progressItems.reduce((sum, p) => sum + p.progress_score, 0) / progressItems.length;
    return Math.round(avg * 10) / 10;
  };

  return (
    <div className="coaching-panel">
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="coaching-header">
        <h3>Coaching Management</h3>
        <button
          className="btn-new-assignment"
          onClick={() => setShowNewAssignment(!showNewAssignment)}
        >
          <Plus size={18} />
          New Assignment
        </button>
      </div>

      {/* New Assignment Form */}
      {showNewAssignment && (
        <form className="new-assignment-form" onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label>Team Member</label>
            <select
              value={newAssignment.team_member_id}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, team_member_id: e.target.value })
              }
              required
            >
              <option value="">Select team member...</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Topic</label>
              <input
                type="text"
                value={newAssignment.topic}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, topic: e.target.value })
                }
                placeholder="e.g., Communication Enhancement"
                required
              />
            </div>

            <div className="form-group">
              <label>Target Date</label>
              <input
                type="date"
                value={newAssignment.target_date}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, target_date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={newAssignment.priority}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, description: e.target.value })
              }
              placeholder="Describe the coaching focus..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowNewAssignment(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Assignment
            </button>
          </div>
        </form>
      )}

      {/* Coaching Assignments */}
      <div className="assignments-section">
        <h4>Active Assignments</h4>

        {coachingData.assignments.length === 0 ? (
          <div className="empty-state">
            <p>No active coaching assignments</p>
          </div>
        ) : (
          <div className="assignments-list">
            {coachingData.assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <div
                  className="assignment-header"
                  onClick={() =>
                    setExpandedId(expandedId === assignment.id ? null : assignment.id)
                  }
                >
                  <div className="assignment-title">
                    <h5>{assignment.topic}</h5>
                    <p className="member-name">{assignment.team_member_name}</p>
                  </div>

                  <div className="assignment-meta">
                    <span className={`status-badge ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    <span className={`priority-badge ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority}
                    </span>
                    <span className="target-date">
                      Target: {formatDate(assignment.target_date)}
                    </span>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`chevron ${expandedId === assignment.id ? 'expanded' : ''}`}
                  />
                </div>

                {expandedId === assignment.id && (
                  <div className="assignment-details">
                    <p className="description">{assignment.description}</p>

                    {/* Progress History */}
                    <div className="progress-history">
                      <h6>Progress Sessions</h6>
                      {coachingData.progress
                        .filter(p => p.assignment_id === assignment.id)
                        .map(progress => (
                          <div key={progress.id} className="progress-item">
                            <div className="progress-date">
                              {formatDate(progress.session_date)}
                            </div>
                            <div className="progress-content">
                              <p className="progress-topic">
                                <strong>{progress.topic_covered}</strong>
                              </p>
                              <p className="progress-score">
                                Score: <span className="score">{progress.progress_score}/10</span>
                              </p>
                              <p className="progress-notes">{progress.notes}</p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Average Progress */}
                    <div className="progress-avg">
                      <span>Average Progress Score:</span>
                      <span className="avg-score">
                        {getProgressAverage(assignment.id)}/10
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="assignment-actions">
                      <button
                        className="btn-add-session"
                        onClick={() => handleAddProgress(assignment.id)}
                      >
                        <Plus size={16} />
                        Log Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion Statistics */}
      <div className="completion-stats">
        <h4>Coaching Statistics</h4>
        <div className="stats-grid">
          <div className="stat-box">
            <Clock className="icon" />
            <div>
              <p className="stat-label">Active Assignments</p>
              <p className="stat-value">
                {coachingData.assignments.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>

          <div className="stat-box">
            <CheckCircle className="icon" />
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">
                {coachingData.assignments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="stat-box">
            <AlertCircle className="icon" />
            <div>
              <p className="stat-label">Total Sessions Logged</p>
              <p className="stat-value">{coachingData.progress.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingPanel;
