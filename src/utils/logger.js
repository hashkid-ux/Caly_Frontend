// Frontend/src/utils/logger.js - Environment-aware logger for production safety
/**
 * Frontend Logger
 * 
 * Purpose: Log debugging info only in development mode
 * Production: All logs are suppressed to prevent exposing sensitive data
 * 
 * Usage:
 *   import { logger } from './utils/logger';
 *   logger.debug('User info', { userId, email });  // Only in dev
 *   logger.error('Error occurred', { error });      // Only in dev
 *   logger.warn('Warning message', data);           // Only in dev
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log debug information (dev only)
   */
  debug: (message, data = null) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },

  /**
   * Log error information (dev only)
   */
  error: (message, data = null) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, data || '');
    }
  },

  /**
   * Log warning information (dev only)
   */
  warn: (message, data = null) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },

  /**
   * Log info message (dev only)
   */
  info: (message, data = null) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }
};

export default logger;
