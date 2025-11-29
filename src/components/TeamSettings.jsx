import React from 'react';
import TeamMembers from './TeamMembers';

/**
 * TeamSettings - Team settings tab component
 */
export default function TeamSettings({ team, onUpdate, token }) {
  const handleUpdateTeam = async (updates) => {
    try {
      // API call would go here
      await fetch(`${process.env.REACT_APP_API_URL}/api/teams/${team.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      onUpdate?.();
    } catch (err) {
      console.error('Failed to update team:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Team Information</h3>
        <div className="bg-slate-900/30 rounded-lg border border-slate-700 p-6 space-y-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Team Name</p>
            <p className="text-white font-medium">{team.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Sector</p>
            <p className="text-white font-medium">{team.sector}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Status</p>
            <p className="text-white font-medium">
              {team.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Created</p>
            <p className="text-white font-medium">
              {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
