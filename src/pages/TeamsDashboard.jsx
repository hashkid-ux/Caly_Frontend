import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TeamCard from '../components/TeamCard';
import CreateTeamModal from '../components/CreateTeamModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * TeamsDashboard - List all teams with filtering and search
 * Route: /dashboard/teams
 */
export default function TeamsDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sectors for filtering
  const SECTORS = [
    { value: 'all', label: 'All Sectors' },
    { value: 'healthcare', label: '🏥 Healthcare' },
    { value: 'retail', label: '🛍️ Retail' },
    { value: 'finance', label: '💰 Finance' },
    { value: 'ecommerce', label: '📦 E-Commerce' },
    { value: 'telecom', label: '📱 Telecom' },
    { value: 'travel', label: '✈️ Travel' },
    { value: 'education', label: '🎓 Education' },
    { value: 'hospitality', label: '🏨 Hospitality' },
    { value: 'automotive', label: '🚗 Automotive' },
    { value: 'other', label: '📋 Other' },
  ];

  const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: '✅ Active' },
    { value: 'inactive', label: '⏸️ Inactive' },
  ];

  // Fetch teams
  const { data: teamsData, isLoading, error, refetch } = useQuery({
    queryKey: ['teams', selectedSector, selectedStatus, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSector !== 'all') params.append('sector', selectedSector);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/teams?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data || [];
    },
    enabled: !!token,
  });

  // Filter by search term (client-side for instant feedback)
  const filteredTeams = (teamsData || []).filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = async (teamData) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/teams`,
        teamData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create team:', err);
      throw err;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Teams</h1>
              <p className="text-slate-400">
                Manage your teams and assign agents across sectors
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              + Create Team
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800 p-6 rounded-lg border border-slate-700">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Sector Filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              {SECTORS.map((sector) => (
                <option key={sector.value} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <LoadingSpinner message="Loading teams..." />
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-red-200">
              <p className="font-semibold mb-2">Failed to load teams</p>
              <p className="text-sm mb-4">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-slate-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || selectedSector !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first team to get started'}
              </p>
              {searchTerm === '' &&
                selectedSector === 'all' &&
                selectedStatus === 'all' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Create First Team
                  </button>
                )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onViewDetails={() => navigate(`/dashboard/teams/${team.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <CreateTeamModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTeam}
            sectors={SECTORS.filter((s) => s.value !== 'all')}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
