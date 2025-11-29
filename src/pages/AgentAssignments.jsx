import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignAgentModal from '../components/AssignAgentModal';

/**
 * AgentAssignments - View and manage agent assignments for team members
 * Shows grid of members vs agents with assignment status
 */
export default function AgentAssignments({ teamId: propTeamId, onUpdate, token: propToken }) {
  const params = useParams();
  const { token: authToken } = useAuth();

  const teamId = propTeamId || params.id;
  const token = propToken || authToken;
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Common agent types
  const AGENT_TYPES = [
    'healthcare_support',
    'retail_support',
    'finance_advisor',
    'ecommerce_support',
    'telecom_support',
    'travel_advisor',
    'education_support',
    'hospitality_support',
    'automotive_support',
  ];

  // Fetch team members
  const { data: members = [], isLoading: membersLoading, refetch } = useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data || [];
    },
    enabled: !!token && !!teamId,
  });

  const handleAssignAgent = async (agentData) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/agents`,
        {
          team_member_id: selectedMember.id,
          ...agentData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAssignModal(false);
      setSelectedMember(null);
      refetch();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to assign agent:', err);
      throw err;
    }
  };

  const handleUnassignAgent = async (assignmentId) => {
    if (window.confirm('Unassign this agent?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/agents/${assignmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        refetch();
        onUpdate?.();
      } catch (err) {
        console.error('Failed to unassign agent:', err);
      }
    }
  };

  if (membersLoading) {
    return <LoadingSpinner message="Loading agent assignments..." />;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-slate-700">
        <svg
          className="w-12 h-12 text-slate-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-slate-400 mb-4">Add team members first to assign agents</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Agent Assignments</h2>
        <p className="text-slate-400">Assign agents to team members</p>
      </div>

      {/* Grid View */}
      <div className="space-y-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-slate-900/30 rounded-lg border border-slate-700 p-6"
          >
            {/* Member Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  User {member.user_id}
                </h3>
                <p className="text-slate-400 text-sm">
                  {member.title || 'No title'} • {member.role}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setShowAssignModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                + Assign Agent
              </button>
            </div>

            {/* Agent Assignments */}
            {member.agents && member.agents.length > 0 ? (
              <div className="space-y-2">
                {member.agents
                  .filter((a) => a.agent_type) // Filter out null agents
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="flex justify-between items-center bg-slate-800/50 p-4 rounded border border-slate-600"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{agent.agent_type}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>
                            Proficiency: {agent.proficiency_level || 80}%
                          </span>
                          <span>
                            Success Rate:{' '}
                            {((agent.success_rate || 0.8) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnassignAgent(agent.id)}
                        className="px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded transition-colors text-sm"
                      >
                        Unassign
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-800/20 rounded border border-dashed border-slate-600">
                <p className="text-slate-400">No agents assigned</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assign Agent Modal */}
      {showAssignModal && selectedMember && (
        <AssignAgentModal
          onClose={() => {
            setShowAssignModal(false);
            setSelectedMember(null);
          }}
          onSubmit={handleAssignAgent}
          agentTypes={AGENT_TYPES}
          memberName={selectedMember.title || `User ${selectedMember.user_id}`}
        />
      )}
    </div>
  );
}
