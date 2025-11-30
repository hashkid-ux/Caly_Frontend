/**
 * Frontend sector API requirements configuration
 * Maps sector to field definitions for dynamic form rendering
 * Should match Backend/config/sectorApiRequirements.js structure
 */

const sectorApiRequirements = {
  ecommerce: {
    name: 'E-Commerce',
    description: 'Online retail and marketplace businesses',
    required_apis: ['Shopify API', 'Exotel Telephony'],
    optional_apis: ['Payment Gateway', 'Inventory Management'],
    fields: {
      shopify_store_url: {
        type: 'text',
        label: 'Shopify Store URL',
        placeholder: 'https://your-store.myshopify.com',
        required: true,
        help: 'Your Shopify store domain'
      },
      shopify_api_key: {
        type: 'text',
        label: 'Shopify API Key',
        placeholder: 'Enter your API key',
        required: true
      },
      shopify_access_token: {
        type: 'password',
        label: 'Shopify Access Token',
        placeholder: 'Enter your access token',
        required: true,
        help: 'Generate from Shopify App settings'
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        placeholder: 'Your Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        placeholder: 'Your Exotel token',
        required: true
      }
    }
  },

  healthcare: {
    name: 'Healthcare',
    description: 'Hospitals, clinics, and medical practitioners',
    required_apis: ['EMR System', 'Exotel Telephony', 'HIPAA Compliance'],
    optional_apis: ['Telemedicine', 'Appointment Booking'],
    fields: {
      emr_provider: {
        type: 'select',
        label: 'EMR System',
        required: true,
        options: ['epic', 'cerner', 'meditech', 'nextgen', 'athenahealth'],
        help: 'Electronic Medical Records provider'
      },
      emr_api_url: {
        type: 'text',
        label: 'EMR API URL',
        placeholder: 'https://emr-api.example.com',
        required: true
      },
      emr_username: {
        type: 'text',
        label: 'EMR Username',
        placeholder: 'API user',
        required: true
      },
      emr_password: {
        type: 'password',
        label: 'EMR Password',
        required: true
      },
      practice_id: {
        type: 'text',
        label: 'Practice ID',
        placeholder: 'Your practice ID',
        required: true
      },
      hipaa_enabled: {
        type: 'checkbox',
        label: 'Enable HIPAA Compliance Mode',
        required: false,
        help: 'Enables encryption and audit logging for HIPAA compliance'
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  realestate: {
    name: 'Real Estate',
    description: 'Property management and real estate agencies',
    required_apis: ['MLS API', 'Exotel Telephony'],
    optional_apis: ['Property Management System', 'CRM'],
    fields: {
      mls_api_key: {
        type: 'text',
        label: 'MLS API Key',
        placeholder: 'Your MLS API key',
        required: true,
        help: 'Multiple Listing Service API credentials'
      },
      mls_username: {
        type: 'text',
        label: 'MLS Username',
        placeholder: 'MLS username',
        required: true
      },
      mls_password: {
        type: 'password',
        label: 'MLS Password',
        required: true
      },
      mls_board_id: {
        type: 'text',
        label: 'MLS Board ID',
        placeholder: 'Your board ID',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  fintech: {
    name: 'Financial Services',
    description: 'Banks, fintech, and financial institutions',
    required_apis: ['Payment Gateway', 'Banking API', 'Exotel Telephony'],
    optional_apis: ['Compliance Engine', 'KYC Provider'],
    fields: {
      stripe_api_key: {
        type: 'text',
        label: 'Stripe API Key',
        placeholder: 'pk_live_...',
        required: true
      },
      stripe_secret_key: {
        type: 'password',
        label: 'Stripe Secret Key',
        placeholder: 'sk_live_...',
        required: true
      },
      bank_api_token: {
        type: 'password',
        label: 'Bank API Token',
        required: true,
        help: 'Your bank integration token'
      },
      kyc_provider: {
        type: 'select',
        label: 'KYC Provider',
        required: false,
        options: ['aadhaar', 'pan', 'gstin', 'other'],
        help: 'Know Your Customer provider'
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  hospitality: {
    name: 'Hospitality',
    description: 'Hotels, restaurants, and hospitality businesses',
    required_apis: ['Booking System API', 'Exotel Telephony'],
    optional_apis: ['PMS (Property Management)', 'Review Management'],
    fields: {
      booking_system: {
        type: 'select',
        label: 'Booking System',
        required: true,
        options: ['booking.com', 'airbnb', 'custom_pms', 'oracle_pms'],
        help: 'Your property booking system'
      },
      booking_api_key: {
        type: 'text',
        label: 'Booking API Key',
        required: true
      },
      booking_secret: {
        type: 'password',
        label: 'Booking Secret',
        required: true
      },
      property_id: {
        type: 'text',
        label: 'Property ID',
        placeholder: 'Your property ID',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  logistics: {
    name: 'Logistics & Delivery',
    description: 'Courier, delivery, and logistics companies',
    required_apis: ['Tracking API', 'Exotel Telephony'],
    optional_apis: ['Fleet Management', 'Route Optimization'],
    fields: {
      tracking_api_url: {
        type: 'text',
        label: 'Tracking API URL',
        placeholder: 'https://api.logistics.com',
        required: true
      },
      tracking_api_key: {
        type: 'text',
        label: 'Tracking API Key',
        required: true
      },
      tracking_secret: {
        type: 'password',
        label: 'Tracking Secret',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  education: {
    name: 'Education',
    description: 'Schools, colleges, and educational institutions',
    required_apis: ['Learning Management System', 'Exotel Telephony'],
    optional_apis: ['Student Information System', 'Assessment Platform'],
    fields: {
      lms_provider: {
        type: 'select',
        label: 'LMS Provider',
        required: true,
        options: ['moodle', 'canvas', 'blackboard', 'schoology', 'custom'],
        help: 'Learning Management System'
      },
      lms_api_url: {
        type: 'text',
        label: 'LMS API URL',
        required: true
      },
      lms_api_key: {
        type: 'text',
        label: 'LMS API Key',
        required: true
      },
      institution_id: {
        type: 'text',
        label: 'Institution ID',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  government: {
    name: 'Government',
    description: 'Government agencies and public services',
    required_apis: ['Citizen Portal API', 'Exotel Telephony'],
    optional_apis: ['Records Management', 'Compliance Engine'],
    fields: {
      portal_api_url: {
        type: 'text',
        label: 'Portal API URL',
        required: true
      },
      portal_api_key: {
        type: 'text',
        label: 'Portal API Key',
        required: true
      },
      department_id: {
        type: 'text',
        label: 'Department ID',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  telecom: {
    name: 'Telecommunications',
    description: 'Telecom operators and communication service providers',
    required_apis: ['Billing API', 'Network API', 'Exotel Telephony'],
    optional_apis: ['Usage Analytics', 'Network Monitoring'],
    fields: {
      billing_api_url: {
        type: 'text',
        label: 'Billing API URL',
        required: true
      },
      billing_api_key: {
        type: 'text',
        label: 'Billing API Key',
        required: true
      },
      operator_id: {
        type: 'text',
        label: 'Operator ID',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  },

  saas: {
    name: 'SaaS',
    description: 'Software-as-a-Service and cloud applications',
    required_apis: ['SaaS API', 'Exotel Telephony'],
    optional_apis: ['Analytics API', 'Webhook Management'],
    fields: {
      saas_api_url: {
        type: 'text',
        label: 'SaaS API URL',
        placeholder: 'https://api.saas-app.com',
        required: true
      },
      saas_api_key: {
        type: 'text',
        label: 'SaaS API Key',
        required: true
      },
      saas_secret: {
        type: 'password',
        label: 'SaaS Secret',
        required: true
      },
      exotel_number: {
        type: 'text',
        label: 'Exotel Phone Number',
        placeholder: '+91XXXXXXXXXX',
        required: true
      },
      exotel_sid: {
        type: 'text',
        label: 'Exotel SID',
        required: true
      },
      exotel_token: {
        type: 'password',
        label: 'Exotel API Token',
        required: true
      }
    }
  }
};

export default sectorApiRequirements;
