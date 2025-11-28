import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * OnboardingGuard Component
 * 
 * Enforces mandatory onboarding for authenticated users.
 * Redirects to /onboarding if:
 * - User is authenticated
 * - Onboarding is NOT completed
 * - Current route is NOT /onboarding (to prevent redirect loop)
 * 
 * Usage: Wrap protected routes with <OnboardingGuard>
 */
const OnboardingGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, onboardingCompleted, loading } = useAuth();

  React.useEffect(() => {
    // Don't check while loading auth state
    if (loading) return;

    // Only check for authenticated users
    if (isAuthenticated) {
      // If onboarding not completed and not already on /onboarding
      if (!onboardingCompleted && location.pathname !== '/onboarding') {
        // Allow /settings as a special case (top-level settings, not in onboarding flow)
        if (location.pathname !== '/settings') {
          navigate('/onboarding', { replace: true });
        }
      }
    }
  }, [isAuthenticated, onboardingCompleted, location.pathname, loading, navigate]);

  // Return children only if:
  // - Loading (show loading state from main component)
  // - Not authenticated (public routes handled elsewhere)
  // - Authenticated + onboarding completed (normal case)
  // - On /onboarding page (allow access even if not completed)
  // - On /settings page (allow as exception)
  if (
    !isAuthenticated ||
    onboardingCompleted ||
    location.pathname === '/onboarding' ||
    location.pathname === '/settings'
  ) {
    return children;
  }

  // Show nothing while redirecting
  return null;
};

export default OnboardingGuard;
