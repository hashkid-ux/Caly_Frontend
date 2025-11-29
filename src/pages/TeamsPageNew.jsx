import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, TrendingUp, Activity, Search, Loader, AlertCircle } from 'lucide-react';
import PageHeader from '../PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useTeams, useCreateTeam } from '../../hooks/useRealData';

/**
 * Teams Management Page - REAL DATA FROM BACKEND
 * - Fetches teams from /api/teams endpoint
 * - Fetches team details from /api/teams/{teamId} endpoint
 * - Real team members from database
 * - Real performance metrics from team_performance table
 * - Real agent assignments
 */
const TeamsPageNew = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSector, setNewTeamSector] = useState('healthcare');

  // Fetch real teams from backend
  const { 
    data: teamsResponse, 
    isLoading, 
    error 
  } = useTeams(user?.client_id, {
    search: searchQuery || null
  });

  const teams = teamsResponse?.data || [];
  const createTeamMutation = useCreateTeam(user?.client_id);

  // Filter teams by search
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.sector?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    try {
      await createTeamMutation.mutateAsync({
        name: newTeamName,
        sector: newTeamSector,
        description: ''
      });
      setNewTeamName('');
      setShowCreateModal(false);
    } catch (err) {
      alert('Error creating team: ' + err.message);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      // TODO: Implement delete mutation
      console.log('Delete team:', teamId);
    }
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <PageHeader title="👥 Teams Management" description="Manage your support teams" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error loading teams: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <PageHeader title="👥 Teams Management" description="Manage and monitor your support teams" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Teams</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Create Team
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams by name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading teams...</span>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No teams found</p>
            <p className="text-gray-500 text-sm mb-6">Create your first team to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Create Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden"
              >
                {/* Team Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold">{team.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingTeam(team.id)}
                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100">{team.sector || 'General'}</p>
                </div>

                {/* Team Content */}
                <div className="p-4 space-y-4">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium mb-1">Members</p>
                      <p className="text-2xl font-bold text-gray-900">{team.members_count || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {team.success_rate ? `${team.success_rate.toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Activity size={16} />
                        Calls Handled
                      </div>
                      <span className="font-semibold text-gray-900">{team.calls_handled || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <TrendingUp size={16} />
                        Avg Duration
                      </div>
                      <span className="font-semibold text-gray-900">
                        {team.avg_duration ? `${Math.round(team.avg_duration)}m` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        Sector
                      </div>
                      <span className="font-semibold text-gray-900">{team.sector || 'General'}</span>
                    </div>
                  </div>

                  {/* Team Members Preview */}
                  {team.members && team.members.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">Team Members</p>
                      <div className="space-y-1">
                        {team.members.slice(0, 3).map((member, idx) => (
                          <p key={idx} className="text-xs text-gray-700">
                            • {member.agent_type || member.name || 'Agent'}
                          </p>
                        ))}
                        {team.members.length > 3 && (
                          <p className="text-xs text-blue-600 font-medium">
                            +{team.members.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-gray-200 flex gap-2">
                    <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition text-sm">
                      View Details
                    </button>
                    <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 rounded-lg transition text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Team</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Team Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  placeholder="e.g., Healthcare Support Team"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sector Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <select
                  value={newTeamSector}
                  onChange={(e) => setNewTeamSector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="healthcare">Healthcare</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="logistics">Logistics</option>
                  <option value="fintech">Fintech</option>
                  <option value="realestate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Error Message */}
              {createTeamMutation.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{createTeamMutation.error.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={createTeamMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {createTeamMutation.isPending ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Team
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPageNew;
