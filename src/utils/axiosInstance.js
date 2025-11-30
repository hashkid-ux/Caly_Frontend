// Frontend/src/utils/axiosInstance.js - Configured axios with auth headers & retry logic
import axios from 'axios';
import logger from './logger'; // ✅ PHASE 2 FIX 5: Environment-aware logging

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
let refreshPromise = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds (increased from 10s for better retry window)
  withCredentials: true,  // ✅ SECURITY FIX: Send httpOnly cookies with all requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests (kept for backward compatibility)
// ✅ SECURITY: Tokens are now in httpOnly cookies, no need to manually set Authorization header
// Cookies are automatically sent by browser when credentials: 'include' is set
axiosInstance.interceptors.request.use(
  config => {
    // httpOnly cookies are automatically sent by the browser
    // No need to manually set Authorization header
    logger.debug('[AXIOS] Request to ' + config.url);
    return config;
  },
  error => Promise.reject(error)
);

// Handle retries, token refresh, and errors
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const retryCount = originalRequest._retryCount || 0;

    // Determine if we should retry this request
    const shouldRetry = 
      !originalRequest._retry &&
      retryCount < MAX_RETRIES &&
      (
        (error.response?.status >= 500) || // Server errors
        error.response?.status === 429 || // Rate limit
        error.response?.status === 408 || // Request timeout
        error.code === 'ECONNABORTED' || // Timeout
        error.code === 'ENOTFOUND' || // DNS failure
        error.code === 'ECONNREFUSED' // Connection refused
      );

    if (shouldRetry) {
      originalRequest._retryCount = retryCount + 1;
      originalRequest._retry = true;

      // Exponential backoff: 1s, 2s, 4s + random jitter
      const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      const jitterMs = Math.random() * 1000;
      const totalDelay = delayMs + jitterMs;

      // ✅ PHASE 2 FIX 5: Use environment-aware logger instead of console
      logger.debug(`[AXIOS RETRY] Attempt ${originalRequest._retryCount}/${MAX_RETRIES} after ${Math.round(totalDelay)}ms for ${originalRequest.url}`);

      await new Promise(resolve => setTimeout(resolve, totalDelay));

      return axiosInstance(originalRequest);
    }

    // Handle 401 (token expired) - refresh token once with proper locking
    if (error.response?.status === 401 && !originalRequest._tokenRefreshAttempted) {
      originalRequest._tokenRefreshAttempted = true;

      try {
        // ✅ SECURITY FIX: Proper locking mechanism to prevent race condition
        // All concurrent requests wait for the SAME refresh promise
        if (!refreshPromise) {
          logger.debug('[AXIOS] Starting token refresh...');
          // ✅ SECURITY FIX: Refresh endpoint now uses httpOnly cookies
          // No need to send refreshToken in body - it's in the httpOnly cookie
          refreshPromise = axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},  // Empty body
            { withCredentials: true }  // ✅ Send/receive httpOnly cookies
          )
            .then(response => {
              logger.debug('[AXIOS] Token refresh successful');
              return response;
            })
            .catch(err => {
              logger.error('[AXIOS] Token refresh failed:', err.message);
              throw err;
            })
            .finally(() => {
              // Clear the refresh promise AFTER all concurrent requests have awaited it
              refreshPromise = null;
            });
        }

        // ✅ SECURITY: Wait for refresh to complete (same promise for all concurrent requests)
        await refreshPromise;

        // ✅ SECURITY: Tokens are now in httpOnly cookies (not in response)
        // Browser automatically handles cookie storage and sending
        
        // Retry original request with refreshed token (in httpOnly cookie)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        logger.error('[AXIOS] Authentication failed - redirecting to login');
        // Clear all auth data from localStorage and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login?reason=session_expired';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
