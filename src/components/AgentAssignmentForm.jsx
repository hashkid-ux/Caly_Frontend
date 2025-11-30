import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AgentAssignmentForm.css';

/**
 * AgentAssignmentForm - Assign AI agents to team members with proficiency levels
 * Shows available agents per sector, allows setting proficiency (0-100)
 */
const AgentAssignmentForm = ({ memberId, assignedAgents, onAssignmentsChange }) => {
  const { user, token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch available agents on mount
  useEffect(() => {
    fetchAgents();
  }, [token]);

  // Initialize assignments from props
  useEffect(() => {
    const assignmentMap = {};
    if (assignedAgents && Array.isArray(assignedAgents)) {
      assignedAgents.forEach(assignment => {
        assignmentMap[assignment.agent_id] = assignment.proficiency_level || 50;
      });
    }
    setAssignments(assignmentMap);
  }, [assignedAgents]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get agents from sector config
      const response = await axios.get('/api/sector-config', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Extract all unique agents from sectors
      const agentMap = new Map();
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data.forEach(sector => {
          if (sector.agents && Array.isArray(sector.agents)) {
            sector.agents.forEach(agent => {
              if (!agentMap.has(agent.id)) {
                agentMap.set(agent.id, {
                  id: agent.id,
                  type: agent.agent_type,
                  sector: sector.sector || sector.name,
                  description: agent.description || `${agent.agent_type} Agent`,
                  success_rate: agent.success_rate || 0.8
                });
              }
            });
          }
        });
      }

      setAgents(Array.from(agentMap.values()));
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load available agents');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (agentId, proficiency) => {
    setAssignments({
      ...assignments,
      [agentId]: proficiency
    });
  };

  const handleRemoveAssignment = (agentId) => {
    const newAssignments = { ...assignments };
    delete newAssignments[agentId];
    setAssignments(newAssignments);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Convert assignments to array format
      const assignmentArray = Object.entries(assignments).map(([agentId, proficiency]) => ({
        agent_id: agentId,
        proficiency_level: parseInt(proficiency)
      }));

      await axios.put(`/api/teams/members/${memberId}/agents`, {
        assignments: assignmentArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Call parent callback to refresh data
      if (onAssignmentsChange) {
        onAssignmentsChange();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save assignments');
      console.error('Error saving assignments:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="agent-assignment loading">Loading agents...</div>;
  }

  const assignedCount = Object.keys(assignments).length;
  const unassignedAgents = agents.filter(a => !assignments[a.id]);
  const assignedAgentsList = agents.filter(a => assignments[a.id]);

  return (
    <div className="agent-assignment-form">
      <div className="form-header">
        <h3>AI Agent Assignments</h3>
        <span className="badge">{assignedCount} assigned</span>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="assignments-section">
        {assignedAgentsList.length > 0 && (
          <div className="assigned-agents">
            <h4>Currently Assigned ({assignedAgentsList.length})</h4>
            <div className="agents-list">
              {assignedAgentsList.map(agent => (
                <div key={agent.id} className="agent-item assigned">
                  <div className="agent-info">
                    <h5>{agent.type}</h5>
                    <p className="sector">{agent.sector}</p>
                  </div>

                  <div className="proficiency-control">
                    <label>Proficiency Level</label>
                    <div className="proficiency-input">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={assignments[agent.id] || 50}
                        onChange={(e) => handleAssignmentChange(agent.id, e.target.value)}
                        className="slider"
                      />
                      <span className="value">{assignments[agent.id] || 50}%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => handleRemoveAssignment(agent.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {unassignedAgents.length > 0 && (
          <div className="available-agents">
            <h4>Available Agents</h4>
            <div className="agents-list">
              {unassignedAgents.map(agent => (
                <div key={agent.id} className="agent-item available">
                  <div className="agent-info">
                    <h5>{agent.type}</h5>
                    <p className="sector">{agent.sector}</p>
                    <p className="description">{agent.description}</p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-small btn-primary"
                    onClick={() => handleAssignmentChange(agent.id, 50)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {agents.length === 0 && (
          <div className="empty-state">
            <p>No agents available</p>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Assignments'}
        </button>
      </div>
    </div>
  );
};

export default AgentAssignmentForm;
