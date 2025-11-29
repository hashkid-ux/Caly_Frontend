import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AddMemberModal from '../components/AddMemberModal';

/**
 * TeamMembers - Team member management with add/edit/remove
 * Used as standalone page and as component in TeamDetail
 */
export default function TeamMembers({ teamId: propTeamId, onUpdate, token: propToken }) {
  const params = useParams();
  const { token: authToken } = useAuth();

  const teamId = propTeamId || params.id;
  const token = propToken || authToken;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Fetch team members
  const { data: members = [], isLoading, error, refetch } = useQuery({
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

  const handleAddMember = async (memberData) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/members`,
        memberData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAddModal(false);
      refetch();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to add member:', err);
      throw err;
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/members/${memberId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        refetch();
        onUpdate?.();
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };

  const handleUpdateMember = async (memberId, updates) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/teams/${teamId}/members/${memberId}`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingMember(null);
      refetch();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to update member:', err);
      throw err;
    }
  };

  const ROLE_OPTIONS = [
    { value: 'member', label: 'Team Member' },
    { value: 'lead', label: 'Team Lead' },
    { value: 'manager', label: 'Manager' },
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading team members..." />;
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-red-200">
        <p className="font-semibold mb-2">Failed to load members</p>
        <p className="text-sm mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Team Members</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          + Add Member
        </button>
      </div>

      {/* Members Table */}
      {members.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v-2a9 9 0 00-18 0v2z"
            />
          </svg>
          <p className="text-slate-400 mb-4">No team members yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900/30 rounded-lg border border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Agents
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">User {member.user_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-400">{member.title || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateMember(member.id, { role: e.target.value })
                      }
                      className="px-3 py-1 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(member.performance_score || 0) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-slate-400">
                        {((member.performance_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                      {member.agent_count || 0} agents
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMember}
        />
      )}
    </div>
  );
}
