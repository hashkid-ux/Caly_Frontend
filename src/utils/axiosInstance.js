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
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // Handle 401 (token expired) - refresh token once
    if (error.response?.status === 401 && !originalRequest._tokenRefreshAttempted) {
      originalRequest._tokenRefreshAttempted = true;

      try {
        if (!refreshPromise) {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            // No refresh token, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login?reason=session_expired';
            return Promise.reject(error);
          }

          refreshPromise = axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
        }

        const response = await refreshPromise;
        refreshPromise = null;

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
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
