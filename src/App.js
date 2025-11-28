import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingGuard from './components/OnboardingGuard';
import ErrorBoundary from './components/ErrorBoundary';

// Loading Fallback Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Auth Pages - Lazy Loaded
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));

// Protected Pages - Lazy Loaded
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CallHistoryPage = lazy(() => import('./pages/CallHistoryPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider initialLanguage="en">
          <Router>
            <AuthProvider>
              <Suspense fallback={<LoadingSpinner />}>
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

              {/* Landing Page - Public homepage */}
              <Route path="/" element={<LandingPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
              </Suspense>
            </AuthProvider>
          </Router>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;