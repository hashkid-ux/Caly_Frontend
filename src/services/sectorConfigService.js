// Frontend/src/services/sectorConfigService.js
// ✅ PHASE 2: Service for managing sector-specific configurations

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class SectorConfigService {
  /**
   * Get configuration for a sector
   * @param {string} sector - Sector identifier (ecommerce, healthcare, etc.)
   * @param {string} accessToken - Auth token
   * @returns {Promise<object>} - Sector configuration
   */
  static async getSectorConfig(sector, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sector/config/${sector}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch sector config: ${response.status}`);
      }

      const data = await response.json();
      return data.config || {};
    } catch (error) {
      console.error('Error fetching sector config:', error);
      throw error;
    }
  }

  /**
   * Update configuration for a sector
   * @param {string} sector - Sector identifier
   * @param {object} config - Configuration object
   * @param {string} accessToken - Auth token
   * @returns {Promise<object>} - Updated configuration
   */
  static async updateSectorConfig(sector, config, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sector/config/${sector}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ config })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update sector config: ${response.status}`);
      }

      const data = await response.json();
      return data.config || {};
    } catch (error) {
      console.error('Error updating sector config:', error);
      throw error;
    }
  }

  /**
   * Get all available sectors
   * @returns {object[]} - List of available sectors
   */
  static getAvailableSectors() {
    return [
      {
        id: 'ecommerce',
        name: 'E-commerce & D2C',
        description: 'Online stores, marketplaces, D2C brands',
        icon: 'package'
      },
      {
        id: 'healthcare',
        name: 'Healthcare',
        description: 'Clinics, hospitals, pharmacies',
        icon: 'stethoscope'
      },
      {
        id: 'realestate',
        name: 'Real Estate',
        description: 'Property agents and brokers',
        icon: 'home'
      },
      {
        id: 'logistics',
        name: 'Logistics & Delivery',
        description: 'Courier and delivery services',
        icon: 'truck'
      },
      {
        id: 'fintech',
        name: 'Fintech & Banking',
        description: 'Banks and financial services',
        icon: 'dollar-sign'
      },
      {
        id: 'support',
        name: 'Customer Support',
        description: 'SaaS and software support',
        icon: 'headphones'
      },
      {
        id: 'telecom',
        name: 'Telecom & Utilities',
        description: 'Telecom providers and utilities',
        icon: 'zap'
      },
      {
        id: 'government',
        name: 'Government & Public',
        description: 'Government and public services',
        icon: 'shield'
      },
      {
        id: 'education',
        name: 'Education & EdTech',
        description: 'Schools and online learning',
        icon: 'graduation-cap'
      },
      {
        id: 'travel',
        name: 'Travel & Hospitality',
        description: 'Hotels, travel, and restaurants',
        icon: 'plane'
      },
      {
        id: 'saas',
        name: 'SaaS & Software',
        description: 'B2B software platforms',
        icon: 'users'
      }
    ];
  }

  /**
   * Get sector by ID
   * @param {string} sectorId - Sector identifier
   * @returns {object} - Sector object
   */
  static getSectorById(sectorId) {
    const sectors = this.getAvailableSectors();
    return sectors.find(s => s.id === sectorId);
  }

  /**
   * Get sector configuration schema (what fields are available)
   * @param {string} sector - Sector identifier
   * @returns {object[]} - Configuration field schema
   */
  static getConfigSchema(sector) {
    const schemas = {
      ecommerce: [
        { name: 'return_window_days', type: 'number', min: 1, max: 365 },
        { name: 'refund_auto_threshold', type: 'number', min: 0, max: 100000 },
        { name: 'cancel_window_hours', type: 'number', min: 1, max: 168 },
        { name: 'retention_days', type: 'number', min: 7, max: 365 }
      ],
      healthcare: [
        { name: 'appointment_buffer_mins', type: 'number', min: 0, max: 120 },
        { name: 'escalation_wait_time', type: 'number', min: 30, max: 1800 },
        { name: 'hipaa_enabled', type: 'checkbox' },
        { name: 'patient_privacy_level', type: 'select' }
      ],
      realestate: [
        { name: 'followup_window_hours', type: 'number', min: 1, max: 168 },
        { name: 'showing_duration_mins', type: 'number', min: 15, max: 120 },
        { name: 'offer_expiry_hours', type: 'number', min: 1, max: 240 }
      ],
      logistics: [
        { name: 'delivery_attempt_limit', type: 'number', min: 1, max: 10 },
        { name: 'address_clarification_threshold', type: 'number', min: 50, max: 100 },
        { name: 'sms_on_delivery', type: 'checkbox' }
      ],
      fintech: [
        { name: 'transaction_verification_timeout', type: 'number', min: 5, max: 120 },
        { name: 'fraud_alert_threshold', type: 'number', min: 0, max: 1000000 },
        { name: 'pci_compliance_enabled', type: 'checkbox' }
      ]
    };

    return schemas[sector] || schemas.ecommerce;
  }

  /**
   * Validate configuration against schema
   * @param {string} sector - Sector identifier
   * @param {object} config - Configuration to validate
   * @returns {object} - { valid: boolean, errors: string[] }
   */
  static validateConfig(sector, config) {
    const schema = this.getConfigSchema(sector);
    const errors = [];

    schema.forEach(field => {
      const value = config[field.name];

      if (field.type === 'number') {
        if (value !== undefined && (value < field.min || value > field.max)) {
          errors.push(`${field.name} must be between ${field.min} and ${field.max}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get default configuration for a sector
   * @param {string} sector - Sector identifier
   * @returns {object} - Default configuration
   */
  static getDefaultConfig(sector) {
    const defaults = {
      ecommerce: {
        return_window_days: 14,
        refund_auto_threshold: 2000,
        cancel_window_hours: 24,
        retention_days: 45
      },
      healthcare: {
        appointment_buffer_mins: 15,
        escalation_wait_time: 300,
        hipaa_enabled: true,
        patient_privacy_level: 'high'
      },
      realestate: {
        followup_window_hours: 24,
        showing_duration_mins: 30,
        offer_expiry_hours: 48
      },
      logistics: {
        delivery_attempt_limit: 3,
        address_clarification_threshold: 85,
        sms_on_delivery: true
      },
      fintech: {
        transaction_verification_timeout: 30,
        fraud_alert_threshold: 10000,
        pci_compliance_enabled: true
      }
    };

    return defaults[sector] || defaults.ecommerce;
  }

  /**
   * Get all sectors for the current client
   * @param {string} accessToken - Auth token
   * @returns {Promise<object[]>} - List of sectors with status
   */
  static async getAllSectors(accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sector`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch sectors: ${response.status}`);
      }

      const data = await response.json();
      return data.sectors || [];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  }

  /**
   * Get agents available for a sector
   * @param {string} sector - Sector identifier
   * @param {string} accessToken - Auth token
   * @returns {Promise<object[]>} - List of agents
   */
  static async getSectorAgents(sector, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sector/${sector}/agents`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }

      const data = await response.json();
      return data.agents || [];
    } catch (error) {
      console.error('Error fetching sector agents:', error);
      throw error;
    }
  }

  /**
   * Get entity types for a sector
   * @param {string} sector - Sector identifier
   * @param {string} accessToken - Auth token (optional - may be public)
   * @returns {Promise<object[]>} - List of entity types
   */
  static async getSectorEntities(sector, accessToken = null) {
    try {
      const headers = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/sector/${sector}/entities`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch entities: ${response.status}`);
      }

      const data = await response.json();
      return data.entities || [];
    } catch (error) {
      console.error('Error fetching sector entities:', error);
      throw error;
    }
  }

  /**
   * Get intent patterns for a sector
   * @param {string} sector - Sector identifier
   * @param {string} language - Language code (default: english)
   * @param {string} accessToken - Auth token (optional)
   * @returns {Promise<object[]>} - List of intent patterns
   */
  static async getSectorIntentPatterns(sector, language = 'english', accessToken = null) {
    try {
      const headers = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/sector/${sector}/intent-patterns?language=${language}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch intent patterns: ${response.status}`);
      }

      const data = await response.json();
      return data.patterns || [];
    } catch (error) {
      console.error('Error fetching intent patterns:', error);
      throw error;
    }
  }

  /**
   * Enable a sector for the current client
   * @param {string} sector - Sector identifier
   * @param {string} accessToken - Auth token
   * @returns {Promise<object>} - Sector status
   */
  static async enableSector(sector, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sector/${sector}/enable`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to enable sector: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error enabling sector:', error);
      throw error;
    }
  }

  /**
   * Disable a sector for the current client
   * @param {string} sector - Sector identifier
   * @param {string} accessToken - Auth token
   * @returns {Promise<object>} - Sector status
   */
  static async disableSector(sector, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sector/${sector}/disable`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to disable sector: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error disabling sector:', error);
      throw error;
    }
  }
}

export default SectorConfigService;
