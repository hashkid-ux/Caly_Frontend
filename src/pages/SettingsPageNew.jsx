/**
 * Frontend: Dynamic Settings Page
 * Shows sector-specific APIs and allows credential configuration
 * REAL implementation - NOT hardcoded!
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import './SettingsPage.css';

export default function SettingsPage() {
  const { token } = useAuth();
  const [sector, setSector] = useState('ecommerce');
  const [requiredApis, setRequiredApis] = useState([]);
  const [savedCredentials, setSavedCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});

  const sectors = [
    { value: 'ecommerce', label: '🛒 E-Commerce' },
    { value: 'healthcare', label: '🏥 Healthcare' },
    { value: 'realestate', label: '🏠 Real Estate' },
    { value: 'government', label: '🏛️ Government' },
    { value: 'fintech', label: '💳 FinTech' },
    { value: 'logistics', label: '📦 Logistics' },
    { value: 'education', label: '📚 Education' }
  ];

  useEffect(() => {
    fetchApisForSector();
    fetchSavedCredentials();
  }, [sector]);

  const fetchApisForSector = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/settings/sector/${sector}/apis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequiredApis(response.data.apis || []);
    } catch (error) {
      console.error('Failed to fetch APIs', error);
      alert('Failed to load API requirements');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCredentials = async () => {
    try {
      const response = await axios.get(`/api/settings/credentials/${sector}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedCredentials(response.data.credentials || []);
    } catch (error) {
      console.error('Failed to fetch saved credentials', error);
    }
  };

  const handleTestCredential = async (apiType, formFields) => {
    setTesting(true);
    try {
      // Build credentials object from form fields
      const credentials = {};
      formFields.forEach(field => {
        credentials[field.name] = document.getElementById(`${apiType}_${field.name}`)?.value || '';
      });

      const response = await axios.post(
        `/api/settings/credentials/${sector}/${apiType}/test`,
        { credentials },
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

  const handleSaveCredential = async (apiType, formFields, providerName) => {
    setLoading(true);
    try {
      // Build credentials object
      const credentials = {};
      formFields.forEach(field => {
        credentials[field.name] = document.getElementById(`${apiType}_${field.name}`)?.value || '';
      });

      const response = await axios.post(
        `/api/settings/credentials/${sector}/${apiType}/save`,
        { credentials, provider_name: providerName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('✅ Credential saved successfully!');
        setActiveForm(null);
        fetchSavedCredentials();
      }
    } catch (error) {
      alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (credentialId) => {
    if (!window.confirm('Delete this credential? This cannot be undone.')) return;

    try {
      await axios.delete(
        `/api/settings/credentials/${credentialId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Credential deleted');
      fetchSavedCredentials();
    } catch (error) {
      alert('❌ Failed to delete credential');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>⚙️ Settings & Integration Configuration</h1>

        {/* Sector Selector */}
        <div className="sector-selector-section">
          <h2>Select Your Sector</h2>
          <div className="sector-buttons">
            {sectors.map(s => (
              <button
                key={s.value}
                className={`sector-btn ${sector === s.value ? 'active' : ''}`}
                onClick={() => setSector(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Required APIs for Sector */}
        <div className="apis-section">
          <h2>Required Integrations for {sectors.find(s => s.value === sector)?.label}</h2>

          {loading && <div className="loading">Loading APIs...</div>}

          {!loading && requiredApis.length === 0 && (
            <div className="empty-state">No APIs configured for this sector yet</div>
          )}

          {requiredApis.map(api => {
            const isSaved = savedCredentials.some(c => c.api_type === api.type);

            return (
              <div key={api.type} className="api-card">
                <div className="api-header">
                  <div className="api-info">
                    <h3>{api.name}</h3>
                    {api.help && <p className="help-text">💡 {api.help}</p>}
                  </div>
                  <div className="api-status">
                    {isSaved ? (
                      <span className="status-badge verified">✅ Configured</span>
                    ) : (
                      <span className="status-badge pending">⏳ Pending</span>
                    )}
                    {api.required && <span className="required-badge">Required</span>}
                  </div>
                </div>

                {/* Display saved credential */}
                {isSaved && (
                  <div className="saved-credential">
                    <p>📌 Configured Provider: <strong>{savedCredentials.find(c => c.api_type === api.type)?.provider_name}</strong></p>
                    <button
                      className="btn-reconfigure"
                      onClick={() => setActiveForm(activeForm === api.type ? null : api.type)}
                    >
                      🔧 Reconfigure
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCredential(savedCredentials.find(c => c.api_type === api.type).id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {/* Credential Form */}
                {!isSaved && (
                  <div className="credential-form-wrapper">
                    <button
                      className="btn-configure"
                      onClick={() => setActiveForm(activeForm === api.type ? null : api.type)}
                    >
                      {activeForm === api.type ? '❌ Close' : '⚙️ Configure'}
                    </button>

                    {activeForm === api.type && (
                      <form className="credential-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveCredential(api.type, api.fields, `${sector}-${api.type}`);
                      }}>
                        <div className="form-fields">
                          {api.fields.map(field => (
                            <div key={field.name} className="form-group">
                              <label htmlFor={`${api.type}_${field.name}`}>
                                {field.label}
                                {field.required && <span className="required-indicator">*</span>}
                              </label>

                              {field.type === 'select' ? (
                                <select
                                  id={`${api.type}_${field.name}`}
                                  required={field.required}
                                  defaultValue=""
                                >
                                  <option value="">-- Select {field.label} --</option>
                                  {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : field.type === 'checkbox' ? (
                                <input
                                  type="checkbox"
                                  id={`${api.type}_${field.name}`}
                                  required={field.required}
                                />
                              ) : (
                                <input
                                  type={field.type}
                                  id={`${api.type}_${field.name}`}
                                  placeholder={field.placeholder}
                                  required={field.required}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="form-actions">
                          <button
                            type="button"
                            className="btn-test"
                            onClick={() => handleTestCredential(api.type, api.fields)}
                            disabled={testing || loading}
                          >
                            🧪 {testing ? 'Testing...' : 'Test Connection'}
                          </button>
                          <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                          >
                            💾 {loading ? 'Saving...' : 'Save & Verify'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
