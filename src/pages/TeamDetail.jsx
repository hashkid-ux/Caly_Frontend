import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import TeamMembers from '../components/TeamMembers';
import AgentAssignments from '../components/AgentAssignments';
import PerformanceChart from '../components/PerformanceChart';
import TeamSettings from '../components/TeamSettings';

/**
 * TeamDetail - View team details with tabs for members, agents, performance, settings
 * Route: /dashboard/teams/:id
 */
export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('members');

  // Fetch team details
  const { data: team, isLoading, error, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/teams/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    },
    enabled: !!token && !!id,
  });

  const TABS = [
    { id: 'members', label: '👥 Members', icon: 'users' },
    { id: 'agents', label: '🤖 Agent Assignments', icon: 'robot' },
    { id: 'performance', label: '📊 Performance', icon: 'chart' },
    { id: 'settings', label: '⚙️ Settings', icon: 'settings' },
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading team details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-red-200">
            <p className="font-semibold mb-2">Failed to load team</p>
            <p className="text-sm mb-4">{error.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/dashboard/teams')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Back to Teams
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-slate-400">Team not found</p>
          <button
            onClick={() => navigate('/dashboard/teams')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard/teams')}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Teams
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{team.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-medium">
                    {team.sector}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      team.status === 'active'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-gray-900 text-gray-200'
                    }`}
                  >
                    {team.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
                  </span>
                  <span className="text-slate-400">
                    {team.member_count || 0} members
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-slate-400 text-sm">Team Lead</p>
                  <p className="text-xl font-semibold text-white">
                    {team.lead_id ? 'Assigned' : 'Unassigned'}
                  </p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-slate-400 text-sm">Created</p>
                  <p className="text-xl font-semibold text-white">
                    {new Date(team.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          {team.performance && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Calls Today</p>
                <p className="text-2xl font-bold text-white">
                  {team.performance.calls_handled || 0}
                </p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {team.performance.resolution_rate
                    ? (team.performance.resolution_rate * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Avg Satisfaction</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {team.performance.avg_satisfaction_score
                    ? team.performance.avg_satisfaction_score.toFixed(1)
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Escalations</p>
                <p className="text-2xl font-bold text-orange-400">
                  {team.performance.calls_escalated || 0}
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            {/* Tab Navigation */}
            <div className="flex gap-0 border-b border-slate-700">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'members' && (
                <TeamMembers
                  teamId={id}
                  onUpdate={() => refetch()}
                  token={token}
                />
              )}
              {activeTab === 'agents' && (
                <AgentAssignments
                  teamId={id}
                  onUpdate={() => refetch()}
                  token={token}
                />
              )}
              {activeTab === 'performance' && (
                <PerformanceChart
                  teamId={id}
                  token={token}
                />
              )}
              {activeTab === 'settings' && (
                <TeamSettings
                  team={team}
                  onUpdate={() => refetch()}
                  token={token}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
