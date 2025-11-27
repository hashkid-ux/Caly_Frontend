import React from 'react';
import './ErrorBoundary.css';

/**
 * Error Boundary Component - Catches React component errors
 * Prevents entire app crash when child component fails
 * Logs errors to backend for monitoring
 * @component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  /**
   * Update state when error is caught
   * @static
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Log error to backend and update state
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Info about component stack
   */
  componentDidCatch(error, errorInfo) {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Log to backend
    this.logErrorToBackend(error, errorInfo, errorId);

    this.setState({
      error,
      errorInfo,
      errorId,
    });
  }

  /**
   * Send error details to backend logging endpoint
   * @private
   */
  logErrorToBackend = async (error, errorInfo, errorId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
      
      await fetch(`${apiUrl}/api/logs/client-error`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify({
          errorId,
          message: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          environment: process.env.NODE_ENV,
        }),
      });
    } catch (logError) {
      console.error('Failed to log error to backend:', logError);
    }
  };

  /**
   * Reset error state and try rendering again
   * @private
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry for the inconvenience. An unexpected error occurred while processing your request.
            </p>
            
            <div className="error-id">
              <strong>Error ID:</strong> <code>{this.state.errorId}</code>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  <strong>Component Stack:</strong>
                  {'\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReset} className="btn btn-primary">
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="btn btn-secondary"
              >
                Go to Dashboard
              </button>
            </div>

            <p className="error-support">
              If the problem persists, please contact support with error ID: <strong>{this.state.errorId}</strong>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
