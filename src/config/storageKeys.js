/**
 * Centralized localStorage key management
 * Ensures consistent key names across entire frontend
 * Prevents typos and mismatches that cause session issues
 */

export const STORAGE_KEYS = {
  // Authentication tokens
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',

  // User/Tenant identity
  userId: 'userId',
  clientId: 'clientId',  // Use consistent camelCase naming

  // Token metadata
  tokenData: 'tokenData',

  // Onboarding status
  onboardingCompleted: 'onboardingCompleted',

  // User preferences
  rememberedEmail: 'rememberedEmail',
  user: 'user',

  // Session management
  lastLogin: 'lastLogin',
  sessionExpiry: 'sessionExpiry'
};

/**
 * Usage in components:
 * 
 * import { STORAGE_KEYS } from '../config/storageKeys';
 * 
 * // Set value
 * localStorage.setItem(STORAGE_KEYS.clientId, value);
 * 
 * // Get value
 * const clientId = localStorage.getItem(STORAGE_KEYS.clientId);
 * 
 * // Clear all auth tokens
 * localStorage.removeItem(STORAGE_KEYS.accessToken);
 * localStorage.removeItem(STORAGE_KEYS.refreshToken);
 */
