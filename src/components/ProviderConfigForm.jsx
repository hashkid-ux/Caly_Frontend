/**
 * Provider Configuration Form Component
 * Reusable form for configuring any provider type
 */

import React from 'react';
import './ProviderConfigForm.css';

export default function ProviderConfigForm({
  provider,
  schema,
  formData,
  onInputChange,
  onTest,
  onSave,
  onCancel,
  loading,
  testing
}) {
  if (!schema || Object.keys(schema).length === 0) {
    return null;
  }

  return (
    <div className="provider-config-form">
      <div className="form-wrapper">
        <div className="form-fields">
          {Object.entries(schema).map(([key, field]) => (
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
                  onChange={(e) => onInputChange(key, e.target.value)}
                  required={field.required}
                  rows={field.rows || 4}
                  className="form-textarea"
                />
              ) : field.type === 'select' ? (
                <select
                  id={key}
                  value={formData[key] || ''}
                  onChange={(e) => onInputChange(key, e.target.value)}
                  required={field.required}
                  className="form-select"
                >
                  <option value="">-- Select {field.label} --</option>
                  {field.options && field.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'number' ? (
                <input
                  id={key}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                  value={formData[key] || ''}
                  onChange={(e) => onInputChange(key, e.target.value)}
                  required={field.required}
                  className="form-input"
                />
              ) : (
                <input
                  id={key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[key] || ''}
                  onChange={(e) => onInputChange(key, e.target.value)}
                  required={field.required}
                  className="form-input"
                  autoComplete={field.type === 'password' ? 'off' : 'on'}
                />
              )}

              {field.help && (
                <small className="help-text">💡 {field.help}</small>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            className="btn btn-test"
            onClick={onTest}
            disabled={testing || loading}
          >
            {testing ? (
              <>
                <span className="spinner"></span>
                Testing...
              </>
            ) : (
              <>🧪 Test Connection</>
            )}
          </button>
          <button
            className="btn btn-save"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              <>💾 Save & Activate</>
            )}
          </button>
          <button
            className="btn btn-cancel"
            onClick={onCancel}
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}
