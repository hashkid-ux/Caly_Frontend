import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Star, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../PageHeader';

/**
 * Redesigned Teams Page - Sector-Based Team Organization
 * - Organize teams by sector
 * - Assign agents to team members
 * - View team performance & workload
 * - Training recommendations
 */
const TeamsPageNew = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [viewMode, setViewMode] = useState('sector'); // 'sector', 'agent', 'performance'

  // Mock team data organized by sector
  const mockTeams = [
    {
      id: 'team-healthcare',
      sector: 'healthcare',
      name: 'Healthcare Team',
      lead: { id: 'user-1', name: 'Dr. Sarah Kumar', title: 'Lead Healthcare Agent' },
      members: [
        {
          id: 'member-1',
          name: 'Dr. Sarah Kumar',
          title: 'Lead Healthcare Agent',
          performance: 98,
          rating: 4.8,
          callsThisWeek: 143,
          trend: 12,
          assignedAgents: [
            { id: 'agent-1', name: 'AppointmentBookingAgent', proficiency: 100, calls: 87, successRate: 99.4 },
            { id: 'agent-2', name: 'PrescriptionRefillAgent', proficiency: 95, calls: 34, successRate: 97.1 },
            { id: 'agent-3', name: 'TriageAgent', proficiency: 92, calls: 18, successRate: 94.4 },
            { id: 'agent-4', name: 'FollowUpAgent', proficiency: 88, calls: 4, successRate: 100 }
          ]
        },
        {
          id: 'member-2',
          name: 'Nurse Lisa Patel',
          title: 'Senior Healthcare Agent',
          performance: 94,
          rating: 4.7,
          callsThisWeek: 127,
          trend: 8,
          assignedAgents: [
            { id: 'agent-1', name: 'AppointmentBookingAgent', proficiency: 88, calls: 56, successRate: 98.2 },
            { id: 'agent-5', name: 'PatientInfoAgent', proficiency: 96, calls: 71, successRate: 99.1 }
          ]
        }
      ],
      performance: { avgRating: 4.75, successRate: 98.1, utilization: 87 }
    },
    {
      id: 'team-ecommerce',
      sector: 'ecommerce',
      name: 'E-Commerce Team',
      lead: { id: 'user-2', name: 'Rajesh Sharma', title: 'Lead E-Commerce Agent' },
      members: [
        {
          id: 'member-3',
          name: 'Rajesh Sharma',
          title: 'Lead E-Commerce Agent',
          performance: 97,
          rating: 4.8,
          callsThisWeek: 187,
          trend: 15,
          assignedAgents: [
            { id: 'agent-6', name: 'OrderStatusAgent', proficiency: 100, calls: 95, successRate: 99.5 },
            { id: 'agent-7', name: 'RefundAgent', proficiency: 96, calls: 52, successRate: 98.1 },
            { id: 'agent-8', name: 'TrackingAgent', proficiency: 94, calls: 40, successRate: 97.5 }
          ]
        },
        {
          id: 'member-4',
          name: 'Priya Verma',
          title: 'Senior E-Commerce Agent',
          performance: 93,
          rating: 4.6,
          callsThisWeek: 156,
          trend: 10,
          assignedAgents: [
            { id: 'agent-6', name: 'OrderStatusAgent', proficiency: 85, calls: 72, successRate: 97.2 },
            { id: 'agent-9', name: 'ComplaintAgent', proficiency: 91, calls: 84, successRate: 96.4 }
          ]
        }
      ],
      performance: { avgRating: 4.7, successRate: 97.8, utilization: 92 }
    },
    {
      id: 'team-support',
      sector: 'support',
      name: 'Support Team',
      lead: { id: 'user-3', name: 'James Wilson', title: 'Support Team Lead' },
      members: [
        {
          id: 'member-5',
          name: 'James Wilson',
          title: 'Support Team Lead',
          performance: 92,
          rating: 4.5,
          callsThisWeek: 98,
          trend: 5,
          assignedAgents: [
            { id: 'agent-10', name: 'L1SupportAgent', proficiency: 95, calls: 58, successRate: 96.6 },
            { id: 'agent-11', name: 'FAQLookupAgent', proficiency: 92, calls: 40, successRate: 95.0 }
          ]
        }
      ],
      performance: { avgRating: 4.5, successRate: 96.0, utilization: 78 }
    }
  ];

  // Get sector info
  const getSectorInfo = (sector) => {
    const info = {
      healthcare: { emoji: '🏥', color: 'bg-red-50', border: 'border-red-200', text: 'text-red-900' },
      ecommerce: { emoji: '🛒', color: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
      logistics: { emoji: '🚚', color: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-900' },
      fintech: { emoji: '💰', color: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900' },
      support: { emoji: '📞', color: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
      telecom: { emoji: '📱', color: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
      realestate: { emoji: '🏠', color: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
      government: { emoji: '🏛️', color: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900' },
      education: { emoji: '🎓', color: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900' },
      travel: { emoji: '✈️', color: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900' },
      saas: { emoji: '💻', color: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900' }
    };
    return info[sector] || info.support;
  };

  // Toggle team expansion
  const toggleTeamExpansion = (teamId) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  // Get proficiency color
  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 95) return 'text-green-600';
    if (proficiency >= 85) return 'text-blue-600';
    if (proficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) return <div className="p-8 text-center">Please log in to view teams</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="👥 Teams & Agents" description="Manage your teams and agent assignments" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('sector')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'sector'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              📊 By Sector
            </button>
            <button
              onClick={() => setViewMode('agent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'agent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🤖 By Agent
            </button>
            <button
              onClick={() => setViewMode('performance')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'performance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              📈 Performance
            </button>
          </div>

          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus size={20} /> Create Team
          </button>
        </div>

        {/* Teams List (By Sector View) */}
        {viewMode === 'sector' && (
          <div className="space-y-6">
            {mockTeams.map(team => {
              const sectorInfo = getSectorInfo(team.sector);
              const isExpanded = expandedTeams.has(team.id);

              return (
                <div key={team.id} className={`${sectorInfo.color} border-2 ${sectorInfo.border} rounded-lg overflow-hidden`}>
                  {/* Team Header */}
                  <div
                    className="p-6 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => toggleTeamExpansion(team.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{sectorInfo.emoji}</span>
                        <div>
                          <h3 className={`text-xl font-bold ${sectorInfo.text}`}>{team.name}</h3>
                          <p className="text-sm text-gray-600">Lead: {team.lead.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{team.members.length}</p>
                          <p className="text-xs text-gray-600">Members</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{team.members.reduce((sum, m) => sum + m.assignedAgents.length, 0)}</p>
                          <p className="text-xs text-gray-600">Agents</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{team.performance.utilization}%</p>
                          <p className="text-xs text-gray-600">Util.</p>
                        </div>

                        {isExpanded ? (
                          <ChevronUp size={24} className="text-gray-700" />
                        ) : (
                          <ChevronDown size={24} className="text-gray-700" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Team Details (Expanded) */}
                  {isExpanded && (
                    <div className="border-t-2 border-current border-opacity-20 p-6 space-y-6">
                      {team.members.map(member => (
                        <div key={member.id} className="bg-white rounded-lg p-6 border border-gray-200">
                          {/* Member Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.title}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-gray-900">{member.performance}%</p>
                              <p className="text-xs text-gray-600">Performance</p>
                            </div>
                          </div>

                          {/* Member Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{member.rating}★</p>
                              <p className="text-xs text-gray-600">Satisfaction</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{member.callsThisWeek}</p>
                              <p className="text-xs text-gray-600">Calls/Week</p>
                            </div>
                            <div className={`text-center ${member.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <p className="text-2xl font-bold">↑ {member.trend}%</p>
                              <p className="text-xs text-gray-600">vs last week</p>
                            </div>
                          </div>

                          {/* Assigned Agents */}
                          <h5 className="font-semibold text-gray-900 mb-3">Assigned Agents ({member.assignedAgents.length})</h5>
                          <div className="space-y-2">
                            {member.assignedAgents.map(agent => (
                              <div key={agent.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                                  <p className="text-xs text-gray-600">{agent.calls} calls | {agent.successRate}% success</p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-bold ${getProficiencyColor(agent.proficiency)}`}>
                                    {agent.proficiency}%
                                  </p>
                                  <p className="text-xs text-gray-600">Proficiency</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                              ✏️ Edit
                            </button>
                            <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                              🤖 Manage Agents
                            </button>
                            <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
                              📊 Performance
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Performance View */}
        {viewMode === 'performance' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Team Performance Comparison</h3>
            <div className="space-y-4">
              {mockTeams.map(team => (
                <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getSectorInfo(team.sector).emoji}</span>
                      <h4 className="font-semibold text-gray-900">{team.name}</h4>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{team.performance.avgRating}★</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${team.performance.successRate}%` }}
                        ></div>
                      </div>
                      <p className="text-sm font-medium mt-1">{team.performance.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Utilization</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${team.performance.utilization}%` }}
                        ></div>
                      </div>
                      <p className="text-sm font-medium mt-1">{team.performance.utilization}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Members</p>
                      <p className="text-sm font-medium mt-3">{team.members.length} active</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Team</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                <input
                  type="text"
                  placeholder="e.g., Healthcare Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a sector</option>
                  <option>🏥 Healthcare</option>
                  <option>🛒 E-Commerce</option>
                  <option>🚚 Logistics</option>
                  <option>💰 Fintech</option>
                  <option>📞 Support</option>
                  <option>📱 Telecom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Lead</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select team lead</option>
                  <option>Dr. Sarah Kumar</option>
                  <option>Rajesh Sharma</option>
                  <option>James Wilson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Team description..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateTeamModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPageNew;
