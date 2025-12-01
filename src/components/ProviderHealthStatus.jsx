/**
 * Provider Health Status Component
 * Displays provider health status with circuit breaker state
 */

import React, { useEffect, useState } from 'react';
import './ProviderHealthStatus.css';

export default function ProviderHealthStatus({ status, onRefresh }) {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    setLastRefresh(new Date());
  }, [status]);

  if (!status) {
    return (
      <div className="provider-health-status placeholder">
        <p>No provider configured</p>
      </div>
    );
  }

  const getHealthColor = (isHealthy) => {
    return isHealthy ? '#2ecc71' : '#e74c3c';
  };

  const getCircuitBreakerIcon = (state) => {
    switch (state) {
      case 'CLOSED':
        return '🟢';
      case 'OPEN':
        return '🔴';
      case 'HALF_OPEN':
        return '🟡';
      default:
        return '⚫';
    }
  };

  const getCircuitBreakerColor = (state) => {
    switch (state) {
      case 'CLOSED':
        return '#2ecc71';
      case 'OPEN':
        return '#e74c3c';
      case 'HALF_OPEN':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const getCircuitBreakerDescription = (state) => {
    switch (state) {
      case 'CLOSED':
        return 'Provider is healthy and accepting requests';
      case 'OPEN':
        return 'Provider is failing - requests blocked. Will retry after cooldown.';
      case 'HALF_OPEN':
        return 'Provider is recovering - testing connection';
      default:
        return 'Unknown state';
    }
  };

  return (
    <div className="provider-health-status">
      <div className="status-header">
        <h3>Provider Health</h3>
        <button
          className="refresh-btn"
          onClick={onRefresh}
          title="Refresh status"
        >
          🔄
        </button>
      </div>

      <div className="status-grid">
        {/* Overall Health */}
        <div className="status-item">
          <div
            className="status-badge"
            style={{ borderLeftColor: getHealthColor(status.is_healthy) }}
          >
            <span className="badge-icon">
              {status.is_healthy ? '✅' : '⚠️'}
            </span>
            <div className="badge-content">
              <span className="badge-label">Overall Health</span>
              <span className="badge-value">
                {status.is_healthy ? 'Healthy' : 'Unhealthy'}
              </span>
            </div>
          </div>
        </div>

        {/* Circuit Breaker State */}
        <div className="status-item">
          <div
            className="status-badge"
            style={{ borderLeftColor: getCircuitBreakerColor(status.circuit_breaker_state) }}
          >
            <span className="badge-icon">
              {getCircuitBreakerIcon(status.circuit_breaker_state)}
            </span>
            <div className="badge-content">
              <span className="badge-label">Circuit Breaker</span>
              <span className="badge-value">
                {status.circuit_breaker_state}
              </span>
            </div>
          </div>
          <p className="badge-description">
            {getCircuitBreakerDescription(status.circuit_breaker_state)}
          </p>
        </div>

        {/* Failure Metrics */}
        <div className="status-item">
          <div className="status-badge metric-badge">
            <span className="badge-icon">📊</span>
            <div className="badge-content">
              <span className="badge-label">Consecutive Failures</span>
              <span className="badge-value">{status.consecutive_failures}</span>
            </div>
          </div>
        </div>

        {/* Error Count */}
        <div className="status-item">
          <div className="status-badge metric-badge">
            <span className="badge-icon">🔴</span>
            <div className="badge-content">
              <span className="badge-label">Total Errors</span>
              <span className="badge-value">{status.error_count}</span>
            </div>
          </div>
        </div>

        {/* Last Error */}
        {status.last_error && (
          <div className="status-item full-width">
            <div className="error-display">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <strong>Last Error</strong>
                <p>{status.last_error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Backup Provider */}
        {status.backup_provider && (
          <div className="status-item full-width">
            <div className="backup-display">
              <span className="backup-icon">🔄</span>
              <div className="backup-content">
                <strong>Backup Provider</strong>
                <p>{status.backup_provider}</p>
                <p className="backup-info">
                  If primary provider fails, system will automatically failover
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Last Tested */}
        <div className="status-item full-width">
          <div className="timestamp-display">
            <span>Last Tested: {new Date(status.last_tested).toLocaleString()}</span>
            <span className="timestamp-relative">
              {getTimeAgo(new Date(status.last_tested))}
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicator Bar */}
      <div className="status-bar">
        <div
          className="status-bar-fill"
          style={{
            width: status.is_healthy ? '100%' : '25%',
            backgroundColor: getHealthColor(status.is_healthy)
          }}
        ></div>
      </div>
    </div>
  );
}

/**
 * Helper: Get human-readable time ago
 */
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
