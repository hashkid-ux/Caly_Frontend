// Frontend/src/pages/LoginPage.jsx - Company login page with OAuth
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader, Chrome } from 'lucide-react';
import logger from '../utils/logger'; // ✅ PHASE 2 FIX 5: Environment-aware logging

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for OAuth token in URL (from callback)
  useEffect(() => {
    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');

    if (token) {
      // Save token and redirect
      localStorage.setItem('accessToken', token);
      navigate('/dashboard');
    }

    if (oauthError) {
      setError(`OAuth Error: ${oauthError}`);
    }
  }, [searchParams, navigate]);

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 🔒 TIMEOUT PROTECTION: 10-second fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal // Add abort signal for timeout
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // ✅ USER-FRIENDLY ERROR MESSAGES
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (response.status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else if (response.status === 503) {
          setError('Server is temporarily unavailable. Please try again.');
        } else {
          setError(data.error || 'Login failed. Please try again.');
        }
        return;
      }

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }

      // Store user info
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ NEW: Check onboarding status before redirecting
      try {
        const onboardingResponse = await fetch(`${API_BASE_URL}/api/onboarding/status`, {
          headers: { 'Authorization': `Bearer ${data.accessToken}` }
        });

        if (onboardingResponse.ok) {
          const onboardingData = await onboardingResponse.json();
          const completed = !!onboardingData.onboarding_completed_at;
          
          if (completed) {
            // Onboarding done, go to dashboard
            localStorage.setItem('onboardingCompleted', 'true');
            navigate('/dashboard');
          } else {
            // Onboarding not done, go to onboarding
            localStorage.setItem('onboardingCompleted', 'false');
            navigate('/onboarding');
          }
        } else {
          // If onboarding check fails, default to onboarding
          navigate('/onboarding');
        }
      } catch (err) {
        // If onboarding check fails, default to onboarding as safe fallback
        logger.warn('Failed to check onboarding status:', err);
        navigate('/onboarding');
      }

    } catch (error) {
      clearTimeout(timeoutId);
      
      // ✅ NETWORK ERROR HANDLING
      if (error.name === 'AbortError') {
        setError('Login took too long. Please check your internet connection and try again.');
      } else if (error instanceof TypeError) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Connection error. Please try again.');
      }
      // ✅ PHASE 2 FIX 5: Use environment-aware logger
      logger.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Caly</h1>
          <p className="text-gray-600 mt-2">AI-Powered Customer Support</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full mb-6 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          disabled={loading}
        >
          <Chrome className="w-5 h-5" />
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
              disabled={loading}
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline font-medium"
            >
              Register now
            </button>
          </p>
        </div>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
