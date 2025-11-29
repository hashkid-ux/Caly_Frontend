import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * TeamCard - Reusable team card component for dashboard
 */
export default function TeamCard({ team, onViewDetails }) {
  return (
    <div
      onClick={onViewDetails}
      className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
            {team.name}
          </h3>
          <p className="text-sm text-slate-400">{team.sector}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              team.status === 'active'
                ? 'bg-green-900 text-green-300'
                : 'bg-gray-900 text-gray-300'
            }`}
          >
            {team.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700">
        <div>
          <p className="text-slate-400 text-xs mb-1">Team Members</p>
          <p className="text-2xl font-bold text-white">{team.member_count || 0}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Created</p>
          <p className="text-sm font-medium text-white">
            {new Date(team.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Performance */}
      {team.performance && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-slate-400 text-xs mb-1">Today's Calls</p>
            <p className="text-lg font-bold text-blue-400">
              {team.performance.calls_handled || 0}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Satisfaction</p>
            <p className="text-lg font-bold text-yellow-400">
              {team.performance.avg_satisfaction_score
                ? team.performance.avg_satisfaction_score.toFixed(1)
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <button className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors text-sm font-medium border border-blue-600/30">
        View Details →
      </button>
    </div>
  );
}
