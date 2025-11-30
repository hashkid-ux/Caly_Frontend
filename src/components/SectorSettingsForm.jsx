import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import sectorApiRequirements from '../config/sectorApiRequirements';
import '../styles/SectorSettingsForm.css';

/**
 * SectorSettingsForm - Dynamic form for sector-specific API configuration
 * Renders different fields based on selected sector (Shopify for e-commerce, EMR for healthcare, etc)
 */
const SectorSettingsForm = ({ sector, onSave, loading: parentLoading }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sectorConfig = sectorApiRequirements[sector];

  // Fetch existing config on mount
  useEffect(() => {
    if (sector) {
      fetchSectorConfig();
    }
  }, [sector, token]);

  const fetchSectorConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/sector-config/${sector}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.data && response.data.data.config) {
        setFormData(response.data.data.config);
      }
    } catch (err) {
      console.error('Error fetching sector config:', err);
      // Not an error - just means no config saved yet
      setFormData({});
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
      const missingRequired = Object.entries(sectorConfig.fields || {})
        .filter(([name, field]) => field.required && !formData[name])
        .map(([name]) => name);

      if (missingRequired.length > 0) {
        setError(`Missing required fields: ${missingRequired.join(', ')}`);
        return;
      }

      const response = await axios.post(
        `/api/sector-config`,
        {
          sector,
          config: formData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData(response.data.data.config);
      setSuccess('Configuration saved successfully!');

      if (onSave) {
        onSave(response.data.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save configuration');
      console.error('Error saving sector config:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!sectorConfig) {
    return (
      <div className="sector-settings-form">
        <p className="error-text">Sector configuration not found</p>
      </div>
    );
  }

  if (loading || parentLoading) {
    return <div className="sector-settings-form loading">Loading configuration...</div>;
  }

  const fields = sectorConfig.fields || {};

  return (
    <div className="sector-settings-form">
      <div className="form-header">
        <h3>{sectorConfig.name} Configuration</h3>
        <p className="description">{sectorConfig.description}</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="success-banner">
          {success}
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {sectorConfig.required_apis && sectorConfig.required_apis.length > 0 && (
        <div className="apis-info">
          <h4>Required Integrations</h4>
          <ul>
            {sectorConfig.required_apis.map(api => (
              <li key={api}>{api}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-fields">
        {Object.entries(fields).map(([fieldName, fieldConfig]) => (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName}>
              {fieldConfig.label}
              {fieldConfig.required && <span className="required">*</span>}
            </label>

            {fieldConfig.type === 'text' && (
              <input
                id={fieldName}
                type="text"
                value={formData[fieldName] || ''}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                placeholder={fieldConfig.placeholder}
                required={fieldConfig.required}
              />
            )}

            {fieldConfig.type === 'password' && (
              <input
                id={fieldName}
                type="password"
                value={formData[fieldName] || ''}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                placeholder={fieldConfig.placeholder}
                required={fieldConfig.required}
              />
            )}

            {fieldConfig.type === 'select' && (
              <select
                id={fieldName}
                value={formData[fieldName] || ''}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                required={fieldConfig.required}
              >
                <option value="">Select {fieldConfig.label}</option>
                {fieldConfig.options && fieldConfig.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {fieldConfig.type === 'checkbox' && (
              <div className="checkbox-wrapper">
                <input
                  id={fieldName}
                  type="checkbox"
                  checked={formData[fieldName] || false}
                  onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                />
                <label htmlFor={fieldName} className="checkbox-label">
                  {fieldConfig.label}
                </label>
              </div>
            )}

            {fieldConfig.help && (
              <p className="help-text">{fieldConfig.help}</p>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};

export default SectorSettingsForm;
