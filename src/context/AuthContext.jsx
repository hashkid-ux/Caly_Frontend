// Frontend/src/context/AuthContext.jsx - Global authentication context with OAuth support
import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

// 🔒 SECURITY FIX 3: Logger that removes tokens from production logs
const logger = {
  debug: (msg, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(msg, data);
    }
    // Production: no logs to prevent token exposure
  },
  error: (msg, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(msg, data);
    }
  },
  warn: (msg, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(msg, data);
    }
  },
};

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * ✅ PHASE 3 FIX 3.2: Decode JWT token to check expiry
 * Simple JWT decoder without external dependencies
 */
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    logger.error('Failed to decode JWT:', err);
    return null;
  }
};

/**
 * ✅ PHASE 3 FIX 3.2: Check if token is expired
 * Returns true if token is expired or will expire within 5 minutes
 */
const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  // Add 5-minute buffer to proactively refresh before actual expiry
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  const now = Date.now();
  
  return now >= (expiryTime - bufferTime);
};

// Wrapper around fetch to add automatic token refresh on 401
const fetchWithTokenRefresh = async (url, options = {}, authContext = null) => {
  let response = await fetch(url, options);

  // If 401 and we have a refresh token, try to refresh
  if (response.status === 401 && authContext?.refreshToken) {
    logger.debug('🔄 [Auth] Token expired, attempting refresh...');
    const refreshResult = await authContext.refreshToken();
    
    if (refreshResult.success) {
      // Get new token and retry request
      const newToken = localStorage.getItem('accessToken');
      options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
      response = await fetch(url, options);
    }
  }

  return response;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Initialize from localStorage on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('user');
        
        if (accessToken) {
          // ✅ PHASE 3 FIX 3.2: Check if token is expired BEFORE using it
          if (isTokenExpired(accessToken)) {
            logger.debug('⏰ [Auth] Access token expired or expiring soon, attempting refresh...');
            
            if (refreshToken) {
              // Try to refresh the token
              try {
                const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refreshToken })
                });

                if (response.ok) {
                  const data = await response.json();
                  const newAccessToken = data.token || data.accessToken;
                  localStorage.setItem('accessToken', newAccessToken);
                  logger.debug('✅ [Auth] Token refreshed on app load');
                  
                  // Continue with fresh token
                  setToken(newAccessToken);
                  await fetchUserProfile(newAccessToken);
                } else {
                  throw new Error('Token refresh failed');
                }
              } catch (refreshErr) {
                logger.warn('⚠️  [Auth] Token refresh failed on app load:', refreshErr);
                // Clear auth and require re-login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setLoading(false);
              }
            } else {
              // No refresh token available, require re-login
              logger.debug('🔓 [Auth] No refresh token available, clearing session');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              setLoading(false);
            }
          } else {
            // Token is still valid
            setToken(accessToken);
            logger.debug('✅ [Auth] Valid token found in localStorage, fetching profile...');
            await fetchUserProfile(accessToken);
          }
        } else if (userData) {
          // Fallback: use cached user data if no token
          setUser(JSON.parse(userData));
          setLoading(false);
        } else {
          // No auth data found
          setLoading(false);
        }
      } catch (err) {
        logger.error('❌ [Auth] Initialization error:', err);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = useCallback(async (accessToken) => {
    try {
      logger.debug('🔗 [Auth] Fetching user profile...');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        logger.debug('✅ [Auth] Profile fetched successfully:', {
          userId: data.user.id,
          email: data.user.email,
          clientId: data.user.clientId,
        });
        setUser(data.user);
        // ✅ FIX: Also save clientId to localStorage for easy access
        localStorage.setItem('clientId', data.user.clientId);
        localStorage.setItem('user', JSON.stringify(data.user));
        setError(null);

        // ✅ NEW: Fetch onboarding status after profile is loaded
        try {
          const onboardingResponse = await fetch(`${API_BASE_URL}/api/onboarding/status`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          
          if (onboardingResponse.ok) {
            const onboardingData = await onboardingResponse.json();
            const completed = !!onboardingData.onboarding_completed_at;
            setOnboardingCompleted(completed);
            localStorage.setItem('onboardingCompleted', JSON.stringify(completed));
            logger.debug('✅ [Auth] Onboarding status:', { completed });
          }
        } catch (onboardingErr) {
          logger.warn('⚠️  [Auth] Failed to fetch onboarding status:', onboardingErr);
          setOnboardingCompleted(false);
        }
      } else if (response.status === 401) {
        // Token invalid or expired
        logger.warn('⚠️  [Auth] Token expired or invalid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenData');
        localStorage.removeItem('clientId');
        localStorage.removeItem('userId');
        localStorage.removeItem('onboardingCompleted');
        setToken(null);
        setUser(null);
        setOnboardingCompleted(false);
        setError('Session expired. Please login again.');
      } else {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
    } catch (err) {
      logger.error('❌ [Auth] Profile fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save tokens and user data
      const accessToken = data.token || data.accessToken;
      if (!accessToken) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('accessToken', accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      setToken(accessToken);
      logger.debug('✅ [Auth] Login successful');

      return { success: true, user: data.user };
    } catch (err) {
      logger.error('❌ [Auth] Login error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const verifyEmail = useCallback(async (email, otp) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const refreshToken = useCallback(async () => {
    // Prevent multiple concurrent refresh attempts
      if (isRefreshing) {
        logger.debug('⏳ [Auth] Refresh already in progress...');
        return { success: false, error: 'Refresh in progress' };
    }

    setIsRefreshing(true);
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      logger.debug('🔄 [Auth] Refreshing access token...');
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed');
      }

      const newAccessToken = data.token || data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      setToken(newAccessToken);
      
      logger.debug('✅ [Auth] Token refreshed successfully');
      return { success: true };
    } catch (err) {
      logger.error('❌ [Auth] Token refresh failed:', err);
      // Clear auth on refresh failure
      logout();
      return { success: false, error: err.message };
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const logout = useCallback(async () => {
    try {
      // ✅ PHASE 2 FIX 2.1: Blacklist refresh token on logout
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        }).catch(() => {
          // Ignore logout errors
        });
      }
    } catch (err) {
      logger.error('❌ [Auth] Logout error:', err);
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenData');
      localStorage.removeItem('clientId');
      localStorage.removeItem('userId');
      localStorage.removeItem('onboardingCompleted');
      setUser(null);
      setToken(null);
      setOnboardingCompleted(false);
      setError(null);
      logger.debug('✅ [Auth] Logged out');
    }
  }, []);

  // ✅ NEW: Set onboarding as completed
  const setOnboardingCompletedStatus = useCallback((completed) => {
    setOnboardingCompleted(completed);
    localStorage.setItem('onboardingCompleted', JSON.stringify(completed));
    if (completed) {
      localStorage.setItem('onboarding_completed_at', new Date().toISOString());
    }
  }, []);

  const getAuthHeader = () => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  };

  const verifyToken = useCallback(async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken })
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      return false;
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return !!token && !!user;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    token,
    isRefreshing,
    onboardingCompleted,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    getAuthHeader,
    verifyToken,
    fetchUserProfile,
    fetchWithTokenRefresh,
    setOnboardingCompletedStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

