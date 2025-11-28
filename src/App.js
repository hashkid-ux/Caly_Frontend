import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingGuard from './components/OnboardingGuard';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

// Protected Pages
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import CallHistoryPage from './pages/CallHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes - No Auth Required */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/callback" element={<OAuthCallbackPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Onboarding Route - No guard so users can always access/edit */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Main Dashboard Routes - Guarded by OnboardingGuard for mandatory onboarding */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <Dashboard />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/call-history"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <CallHistoryPage />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <AnalyticsPage />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <TeamPage />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* Settings Route - Special exception in OnboardingGuard */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;