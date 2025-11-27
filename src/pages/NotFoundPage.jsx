import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

/**
 * 404 Not Found Page
 * Displayed when user navigates to non-existent route
 * @component
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrapper">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">404</div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-message">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="not-found-actions">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-primary"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-secondary"
            >
              Go Back
            </button>
          </div>

          <div className="not-found-links">
            <p>Quick navigation:</p>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/onboarding">Onboarding</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
