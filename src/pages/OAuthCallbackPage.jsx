/**
 * OAuth Callback Handler Page
 * Handles Google OAuth redirect: /callback?accessToken=JWT&refreshToken=JWT
 * 
 * Flow:
 * 1. Extract accessToken and refreshToken from URL query parameters
 * 2. Save both tokens to localStorage
 * 3. Redirect to /dashboard
 * 4. AuthContext will verify tokens and fetch user profile
 * 
 * This prevents the redirect loop where ProtectedRoute checks auth
 * before the tokens are saved to localStorage
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, AlertCircle } from 'lucide-react';
import logger from '../utils/logger'; // ✅ PHASE 2 FIX 5: Environment-aware logging

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract both tokens from URL: /callback?accessToken=JWT&refreshToken=JWT
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const errorParam = searchParams.get('error');

        // Check for backend error
        if (errorParam) {
          throw new Error(`Authentication failed: ${errorParam}`);
        }

        if (!accessToken) {
          throw new Error('No access token received from authentication provider. Please try logging in again.');
        }

        if (!refreshToken) {
          throw new Error('No refresh token received from authentication provider. Please try logging in again.');
        }

        // ✅ PHASE 2 FIX 5: Use environment-aware logger
        logger.debug('✅ [OAuth] Both tokens received from backend');

        // Validate token format (JWT has 3 parts separated by dots)
        const accessParts = accessToken.split('.');
        const refreshParts = refreshToken.split('.');
        
        if (accessParts.length !== 3) {
          throw new Error('Invalid access token format received from backend');
        }

        if (refreshParts.length !== 3) {
          throw new Error('Invalid refresh token format received from backend');
        }

        // Step 1: Save tokens to localStorage immediately
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // ✅ PHASE 2 FIX 5: Use environment-aware logger
        logger.debug('✅ [OAuth] Both tokens saved to localStorage');

        // Step 2: Decode and save access token data for quick access (without verification)
        // This is safe since the backend already verified it
        try {
          const decoded = JSON.parse(atob(accessParts[1]));
          // ✅ PHASE 2 FIX 5: Use environment-aware logger
          logger.debug('✅ [OAuth] Access token decoded:', {
            userId: decoded.userId,
            email: decoded.email,
            clientId: decoded.clientId,
            expiresIn: decoded.exp - Math.floor(Date.now() / 1000) + 's',
          });

          // ✅ FIX: Save clientId separately so it can be accessed by name
          localStorage.setItem('userId', decoded.userId);
          localStorage.setItem('clientId', decoded.clientId);  // ✅ CRITICAL: Save as separate key
          
          localStorage.setItem('tokenData', JSON.stringify({
            userId: decoded.userId,
            email: decoded.email,
            clientId: decoded.clientId,
            expiresAt: decoded.exp * 1000, // Convert to milliseconds
          }));
        } catch (decodeError) {
          // ✅ PHASE 2 FIX 5: Use environment-aware logger
          logger.warn('⚠️  Could not decode token payload, will fetch from server', decodeError);
          // Continue anyway, AuthContext will fetch full profile
        }

        // Step 3: Wait a moment to ensure localStorage is synced
        await new Promise(resolve => setTimeout(resolve, 100));

        // Step 4: Redirect to dashboard
        // AuthContext useEffect will now find the tokens in localStorage
        // and fetch the full user profile
        // ✅ PHASE 2 FIX 5: Use environment-aware logger
        logger.debug('✅ [OAuth] Redirecting to dashboard');
        navigate('/dashboard', { replace: true });

      } catch (err) {
        // ✅ PHASE 2 FIX 5: Use environment-aware logger
        logger.error('❌ [OAuth] Callback error:', err);
        setError(err.message || 'An unexpected error occurred during authentication');
        setIsProcessing(false);

        // Auto-redirect to login after 3 seconds
        const redirectTimer = setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);

        return () => clearTimeout(redirectTimer);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 text-center text-sm mb-6">
            {error}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700 text-center">
            Redirecting to login in 3 seconds...
          </div>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Processing state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Completing Authentication
        </h2>
        <p className="text-gray-600 text-center text-sm mb-4">
          Please wait while we verify your credentials...
        </p>
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span>Token received</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            <span>Saving credentials...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
