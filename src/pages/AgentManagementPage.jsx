/**
 * Frontend: Agent Management Page
 * Enable/disable agents, configure agent settings
 * REAL implementation - NOT hardcoded!
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import './AgentManagementPage.css';

export default function AgentManagementPage() {
  const { token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('ecommerce');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [configForm, setConfigForm] = useState({});

  useEffect(() => {
    fetchSectors();
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedSector) {
      fetchAgentsBySector();
    }
  }, [selectedSector]);

  const fetchSectors = async () => {
    try {
      const response = await axios.get('/api/agents/sectors/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSectors(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sectors', error);
    }
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/agents/client/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch agents', error);
      alert('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentsBySector = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/agents/sector/${selectedSector}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sector agents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableAgent = async (agentId, agentName) => {
    try {
      setSaving(true);
      const response = await axios.post(
        `/api/agents/${agentId}/enable`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`✅ ${agentName} enabled successfully!`);
        fetchAgents();
      }
    } catch (error) {
      alert(`❌ Failed to enable agent: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDisableAgent = async (agentId, agentName) => {
    if (!window.confirm(`Disable ${agentName}? Active calls will still complete.`)) return;

    try {
      setSaving(true);
      const response = await axios.post(
        `/api/agents/${agentId}/disable`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`✅ ${agentName} disabled successfully!`);
        fetchAgents();
      }
    } catch (error) {
      alert(`❌ Failed to disable agent: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async (agentId, agentName) => {
    try {
      setSaving(true);
      const response = await axios.put(
        `/api/agents/${agentId}/config`,
        { config: configForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`✅ ${agentName} configuration saved!`);
        setSelectedAgent(null);
        setConfigForm({});
        fetchAgents();
      }
    } catch (error) {
      alert(`❌ Failed to save config: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const sectorColors = {
    ecommerce: '#667eea',
    healthcare: '#48bb78',
    realestate: '#ed8936',
    government: '#4299e1',
    fintech: '#9f7aea',
    logistics: '#38b2ac',
    education: '#f6ad55'
  };

  return (
    <div className="agent-management-page">
      <div className="agents-container">
        <h1>🤖 Agent Management</h1>
        <p className="subtitle">Enable/disable agents and configure their behavior</p>

        {/* Sector Filter */}
        <div className="sector-filter">
          <label>Filter by Sector:</label>
          <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
            <option value="">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Agents Grid */}
        <div className="agents-grid">
          {loading && <div className="loading">Loading agents...</div>}

          {!loading && agents.length === 0 && (
            <div className="empty-state">No agents available for this sector</div>
          )}

          {agents.map(agent => (
            <div key={agent.id} className={`agent-card ${agent.is_enabled_for_client ? 'enabled' : 'disabled'}`}>
              {/* Agent Header */}
              <div className="agent-header">
                <div className="agent-icon" style={{ backgroundColor: sectorColors[agent.sector] }}>
                  {agent.icon || '🤖'}
                </div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p className="agent-sector">{agent.sector}</p>
                  <p className="agent-description">{agent.description}</p>
                </div>
              </div>

              {/* Agent Stats */}
              <div className="agent-stats">
                {agent.success_rate !== null && (
                  <div className="stat">
                    <span className="stat-label">Success Rate:</span>
                    <span className="stat-value">{(agent.success_rate * 100).toFixed(1)}%</span>
                  </div>
                )}
                {agent.avg_handling_time && (
                  <div className="stat">
                    <span className="stat-label">Avg Handle Time:</span>
                    <span className="stat-value">{Math.round(agent.avg_handling_time)}s</span>
                  </div>
                )}
              </div>

              {/* Capabilities */}
              {agent.capabilities && agent.capabilities.length > 0 && (
                <div className="capabilities">
                  {agent.capabilities.map((cap, idx) => (
                    <span key={idx} className="capability-tag">{cap}</span>
                  ))}
                </div>
              )}

              {/* Language Support */}
              {agent.language_support && agent.language_support.length > 0 && (
                <div className="languages">
                  <strong>Languages:</strong> {agent.language_support.join(', ')}
                </div>
              )}

              {/* Agent Controls */}
              <div className="agent-controls">
                {!agent.is_enabled_for_client ? (
                  <button
                    className="btn-enable"
                    onClick={() => handleEnableAgent(agent.id, agent.name)}
                    disabled={saving}
                  >
                    ✅ Enable
                  </button>
                ) : (
                  <>
                    <button
                      className="btn-configure"
                      onClick={() => {
                        setSelectedAgent(agent.id);
                        setConfigForm(agent.client_config || {});
                      }}
                    >
                      ⚙️ Configure
                    </button>
                    <button
                      className="btn-disable"
                      onClick={() => handleDisableAgent(agent.id, agent.name)}
                      disabled={saving}
                    >
                      ❌ Disable
                    </button>
                  </>
                )}
              </div>

              {/* Configuration Form */}
              {selectedAgent === agent.id && (
                <div className="config-form-wrapper">
                  <div className="config-form">
                    <h4>Configure {agent.name}</h4>

                    <div className="form-group">
                      <label>Tone</label>
                      <select
                        value={configForm.tone || 'professional'}
                        onChange={(e) => setConfigForm({ ...configForm, tone: e.target.value })}
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="urgent">Urgent</option>
                        <option value="casual">Casual</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Language</label>
                      <select
                        value={configForm.language || 'en'}
                        onChange={(e) => setConfigForm({ ...configForm, language: e.target.value })}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="kn">Kannada</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={configForm.enable_transfer_to_human || false}
                          onChange={(e) => setConfigForm({ ...configForm, enable_transfer_to_human: e.target.checked })}
                        />
                        Enable Transfer to Human Agent
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Max Attempts for Resolution</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={configForm.max_attempts || 3}
                        onChange={(e) => setConfigForm({ ...configForm, max_attempts: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="config-actions">
                      <button
                        className="btn-save"
                        onClick={() => handleSaveConfig(agent.id, agent.name)}
                        disabled={saving}
                      >
                        💾 Save Configuration
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setSelectedAgent(null)}
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="summary">
          <p>Total Agents: <strong>{agents.length}</strong></p>
          <p>Enabled: <strong style={{ color: 'green' }}>{agents.filter(a => a.is_enabled_for_client).length}</strong></p>
          <p>Disabled: <strong style={{ color: 'red' }}>{agents.filter(a => !a.is_enabled_for_client).length}</strong></p>
        </div>
      </div>
    </div>
  );
}
