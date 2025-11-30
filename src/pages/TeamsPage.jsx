import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import AgentAssignmentForm from '../components/AgentAssignmentForm';
import TeamPerformanceDashboard from '../components/TeamPerformanceDashboard';
import '../styles/TeamsPage.css';

/**
 * TeamsPage - Manage team members and their AI agent assignments
 * Shows list of human team members, their assigned agents, and performance metrics
 */
const TeamsPage = () => {
  const { user, token } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    role: 'agent'
  });

  // Fetch team members on mount
  useEffect(() => {
    fetchTeamMembers();
  }, [token]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err.response?.data?.error || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.title) {
      setError('Email and title are required');
      return;
    }

    try {
      const response = await axios.post('/api/teams/members', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers([...teamMembers, response.data.data]);
      setFormData({ email: '', title: '', role: 'agent' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add team member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      await axios.delete(`/api/teams/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      setSelectedMember(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete team member');
    }
  };

  const handleUpdateMember = async (memberId, updates) => {
    try {
      const response = await axios.put(`/api/teams/members/${memberId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers(
        teamMembers.map(m => m.id === memberId ? response.data.data : m)
      );

      if (selectedMember?.id === memberId) {
        setSelectedMember(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update team member');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="teams-page loading">
          <div className="spinner">Loading team members...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="teams-page">
          <div className="teams-header">
            <h1>Team Management</h1>
            <p className="subtitle">
              Manage team members and assign AI agents to handle customer support
            </p>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div className="teams-content">
            <div className="teams-sidebar">
              <div className="sidebar-header">
                <h2>Team Members ({teamMembers.length})</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setFormData({ email: '', title: '', role: 'agent' });
                  }}
                >
                  {showAddForm ? 'Cancel' : '+ Add Member'}
                </button>
              </div>

              {showAddForm && (
                <form className="add-member-form" onSubmit={handleAddMember}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="member@company.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Full Name / Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Priya Sharma"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="agent">Support Agent</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-success">
                    Create Member
                  </button>
                </form>
              )}

              <div className="members-list">
                {teamMembers.length === 0 ? (
                  <div className="empty-state">
                    <p>No team members yet</p>
                    <p className="text-muted">Create your first team member to get started</p>
                  </div>
                ) : (
                  teamMembers.map(member => (
                    <div
                      key={member.id}
                      className={`member-card ${selectedMember?.id === member.id ? 'active' : ''}`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="member-info">
                        <h3>{member.title}</h3>
                        <p className="email">{member.email}</p>
                        <div className="member-badge">
                          <span className="role">{member.role}</span>
                          <span className="score">Score: {member.performance_score?.toFixed(0) || 0}</span>
                        </div>
                      </div>

                      <div className="member-stats">
                        <div className="stat">
                          <div className="label">Calls This Week</div>
                          <div className="value">{member.calls_this_week || 0}</div>
                        </div>
                        <div className="stat">
                          <div className="label">Success Rate</div>
                          <div className="value">{(member.success_rate * 100 || 0).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="teams-main">
              {selectedMember ? (
                <>
                  <div className="member-details">
                    <div className="details-header">
                      <h2>{selectedMember.title}</h2>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteMember(selectedMember.id)}
                      >
                        Remove Member
                      </button>
                    </div>

                    <div className="details-content">
                      <div className="section">
                        <h3>Member Information</h3>
                        <div className="info-grid">
                          <div className="info-item">
                            <label>Email</label>
                            <p>{selectedMember.email}</p>
                          </div>
                          <div className="info-item">
                            <label>Role</label>
                            <p>{selectedMember.role}</p>
                          </div>
                          <div className="info-item">
                            <label>Joined</label>
                            <p>{new Date(selectedMember.joined_at).toLocaleDateString()}</p>
                          </div>
                          <div className="info-item">
                            <label>Status</label>
                            <p className={selectedMember.active ? 'status-active' : 'status-inactive'}>
                              {selectedMember.active ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <AgentAssignmentForm
                        memberId={selectedMember.id}
                        assignedAgents={selectedMember.assigned_agents || []}
                        onAssignmentsChange={fetchTeamMembers}
                      />

                      <TeamPerformanceDashboard
                        memberId={selectedMember.id}
                        memberName={selectedMember.title}
                        performance={selectedMember}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-selection">
                  <h2>Select a team member to view details</h2>
                  <p>Or create a new team member to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
};

export default TeamsPage;
