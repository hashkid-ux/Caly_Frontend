/**
 * Frontend Environment Validator
 * Validates required env vars are available at startup
 * Prevents app from crashing due to missing configuration
 */

export const validateFrontendEnv = () => {
  const requiredVars = {
    // API Configuration - CRITICAL
    'REACT_APP_API_URL': {
      required: true,
      message: 'API endpoint is not configured. Set REACT_APP_API_URL in .env',
    },
    // Optional but recommended
    'REACT_APP_ENV': {
      required: false,
      default: 'production',
    },
    'REACT_APP_DEBUG': {
      required: false,
      default: 'false',
    },
  };

  const errors = [];
  const warnings = [];

  Object.entries(requiredVars).forEach(([key, config]) => {
    const value = process.env[key];

    if (config.required && !value) {
      errors.push(config.message || `Missing required env var: ${key}`);
    } else if (!value && config.default) {
      process.env[key] = config.default;
      warnings.push(`${key} not set, using default: ${config.default}`);
    }
  });

  if (errors.length > 0) {
    const errorMessage = [
      '\n❌ Frontend Environment Validation Failed\n',
      ...errors.map(e => `  ✗ ${e}`),
      '\nCreate .env file in Frontend directory with required variables.',
      'Example:',
      '  REACT_APP_API_URL=http://localhost:8080',
      '  REACT_APP_ENV=development',
      '',
    ].join('\n');
    
    console.error(errorMessage);
    throw new Error('Frontend environment validation failed');
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Validation Warnings\n');
    warnings.forEach(w => console.warn(`  ⚠ ${w}`));
  }

  console.log('✓ Frontend environment validation passed\n');
};

/**
 * Get API URL from environment or fallback to current origin
 * @returns {string} API base URL
 */
export const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || window.location.origin;
};

/**
 * Get debug flag from environment
 * @returns {boolean} Whether debug mode is enabled
 */
export const isDebugMode = () => {
  return process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV === 'development';
};

/**
 * Get current environment
 * @returns {string} Environment name
 */
export const getEnvironment = () => {
  return process.env.REACT_APP_ENV || process.env.NODE_ENV || 'production';
};
