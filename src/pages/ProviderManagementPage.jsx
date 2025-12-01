/**
 * Frontend: Provider Management Page
 * Multi-provider support with failover configuration
 * REAL implementation - NOT hardcoded!
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import './ProviderManagementPage.css';

export default function ProviderManagementPage() {
  const { token } = useAuth();
  const [providers, setProviders] = useState([]);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState({});
  const [providerSchema, setProviderSchema] = useState(null);
  const [status, setStatus] = useState(null);
  const [showBackupConfig, setShowBackupConfig] = useState(false);

  useEffect(() => {
    fetchProviders();
    fetchCurrentProvider();
    fetchProviderStatus();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/providers/supported', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch providers', error);
      alert('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentProvider = async () => {
    try {
      const response = await axios.get('/api/providers/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.data) {
        setCurrentProvider(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch current provider', error);
    }
  };

  const fetchProviderStatus = async () => {
    try {
      const response = await axios.get('/api/providers/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(response.data.data);
    } catch (error) {
      console.error('Failed to fetch status', error);
    }
  };

  const handleProviderSelect = async (providerName) => {
    try {
      setSelectedProvider(providerName);
      setFormData({});

      const response = await axios.get(`/api/providers/${providerName}/schema`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviderSchema(response.data.data || {});
    } catch (error) {
      console.error('Failed to fetch provider schema', error);
      alert('Failed to load provider configuration');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await axios.post(
        '/api/providers/test',
        {
          provider: selectedProvider,
          credentials: formData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('✅ Connection verified! You can now save.');
      }
    } catch (error) {
      alert(`❌ Test failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveProvider = async () => {
    try {
      setLoading(true);

      const payload = {
        credentials: formData,
        backup_provider: showBackupConfig ? formData.backup_provider : null
      };

      const response = await axios.post(
        `/api/providers/select/${selectedProvider}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`✅ ${selectedProvider} activated successfully!`);
        setSelectedProvider(null);
        setFormData({});
        fetchCurrentProvider();
        fetchProviderStatus();
      }
    } catch (error) {
      alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const getProviderIcon = (providerName) => {
    const icons = {
      exotel: '📱',
      twilio: '📞',
      voicebase: '🎙️',
      custom: '⚙️'
    };
    return icons[providerName] || '📡';
  };

  const getProviderColor = (providerName) => {
    const colors = {
      exotel: '#FF6B6B',
      twilio: '#0099FF',
      voicebase: '#9B59B6',
      custom: '#95A5A6'
    };
    return colors[providerName] || '#999';
  };

  return (
    <div className="provider-management-page">
      <div className="providers-container">
        <h1>📡 Provider Management</h1>
        <p className="subtitle">Configure your VoIP provider (Exotel, Twilio, VoiceBase, or Custom)</p>

        {/* Current Provider Status */}
        {status && status.configured && (
          <div className="current-provider-card">
            <h2>Current Provider</h2>
            <div className="provider-status-badge">
              <span className={`status-indicator ${status.is_healthy ? 'healthy' : 'unhealthy'}`}>
                {status.is_healthy ? '✅' : '⚠️'}
              </span>
              <div className="status-info">
                <h3>{status.provider}</h3>
                <p>Status: <strong>{status.circuit_breaker_state}</strong></p>
                <p>Health: <strong>{status.is_healthy ? 'Healthy' : 'Unhealthy'}</strong></p>
                {status.backup_provider && (
                  <p>Backup: <strong>{status.backup_provider}</strong></p>
                )}
                <p>Last Tested: <strong>{new Date(status.last_tested).toLocaleString()}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Providers Grid */}
        <div className="providers-section">
          <h2>Available Providers</h2>
          <div className="providers-grid">
            {loading && <div className="loading">Loading providers...</div>}

            {!loading && providers.map(provider => (
              <div
                key={provider.name}
                className={`provider-card ${currentProvider?.provider === provider.name ? 'active' : ''}`}
                style={{ borderLeftColor: getProviderColor(provider.name) }}
              >
                <div className="provider-header">
                  <span className="provider-icon">{getProviderIcon(provider.name)}</span>
                  <h3>{provider.label}</h3>
                  {currentProvider?.provider === provider.name && (
                    <span className="active-badge">🟢 Active</span>
                  )}
                </div>

                <p className="provider-description">{provider.description}</p>

                <div className="provider-features">
                  <strong>Features:</strong>
                  <ul>
                    {provider.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="provider-info">
                  <p><strong>Languages:</strong> {provider.languages.join(', ')}</p>
                  <p><strong>Pricing:</strong> {provider.pricing}</p>
                </div>

                {currentProvider?.provider !== provider.name && (
                  <button
                    className="btn-configure"
                    onClick={() => handleProviderSelect(provider.name)}
                  >
                    ⚙️ Configure
                  </button>
                )}

                {currentProvider?.provider === provider.name && (
                  <button
                    className="btn-change"
                    onClick={() => handleProviderSelect(provider.name)}
                  >
                    🔄 Change
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Form */}
        {selectedProvider && providerSchema && (
          <div className="configuration-section">
            <h2>Configure {selectedProvider.toUpperCase()}</h2>

            <div className="configuration-form">
              <div className="form-fields">
                {Object.entries(providerSchema).map(([key, field]) => (
                  <div key={key} className="form-group">
                    <label htmlFor={key}>
                      {field.label}
                      {field.required && <span className="required">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        id={key}
                        placeholder={field.placeholder}
                        value={formData[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        required={field.required}
                        rows="4"
                      />
                    ) : (
                      <input
                        id={key}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.help && (
                      <small className="help-text">💡 {field.help}</small>
                    )}
                  </div>
                ))}
              </div>

              {/* Backup Provider Option */}
              <div className="backup-config">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showBackupConfig}
                    onChange={(e) => setShowBackupConfig(e.target.checked)}
                  />
                  Configure Backup Provider (for failover)
                </label>

                {showBackupConfig && (
                  <div className="backup-fields">
                    <p className="backup-info">
                      If primary provider fails, system will automatically failover to backup
                    </p>

                    <select
                      value={formData.backup_provider || ''}
                      onChange={(e) => handleInputChange('backup_provider', e.target.value)}
                    >
                      <option value="">-- Select Backup Provider --</option>
                      {providers
                        .filter(p => p.name !== selectedProvider)
                        .map(p => (
                          <option key={p.name} value={p.name}>
                            {p.label}
                          </option>
                        ))}
                    </select>

                    {formData.backup_provider && (
                      <p className="backup-note">
                        ℹ️ You'll need to configure {formData.backup_provider} credentials separately
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  className="btn-test"
                  onClick={handleTestConnection}
                  disabled={testing || loading}
                >
                  🧪 {testing ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  className="btn-save"
                  onClick={handleSaveProvider}
                  disabled={loading}
                >
                  💾 {loading ? 'Saving...' : 'Save & Activate'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setSelectedProvider(null);
                    setFormData({});
                    setShowBackupConfig(false);
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Provider Statistics */}
        {status && status.configured && (
          <div className="provider-stats">
            <h2>Provider Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Circuit Breaker State</span>
                <span className="stat-value">{status.circuit_breaker_state}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Consecutive Failures</span>
                <span className="stat-value">{status.consecutive_failures}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Error Count</span>
                <span className="stat-value">{status.error_count}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Last Error</span>
                <span className="stat-value">{status.last_error || 'None'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
