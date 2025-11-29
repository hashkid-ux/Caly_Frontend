// Frontend/src/pages/SectorConfigurationPage.jsx
// ✅ PHASE 2: Sector configuration page for business rules

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Card from '../components/Card';
import Button from '../components/Button';
import Section from '../components/Section';
import { Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const SECTOR_CONFIGS = {
  ecommerce: {
    title: 'E-commerce Configuration',
    fields: [
      {
        name: 'return_window_days',
        label: 'Return Window (Days)',
        type: 'number',
        description: 'Number of days customers can return items',
        defaultValue: 14,
        min: 1,
        max: 365
      },
      {
        name: 'refund_auto_threshold',
        label: 'Auto Refund Threshold (₹)',
        type: 'number',
        description: 'Orders below this amount auto-refund without approval',
        defaultValue: 2000,
        min: 0,
        max: 100000
      },
      {
        name: 'cancel_window_hours',
        label: 'Cancellation Window (Hours)',
        type: 'number',
        description: 'Hours after order before cancellation is not allowed',
        defaultValue: 24,
        min: 1,
        max: 168
      },
      {
        name: 'retention_days',
        label: 'Data Retention (Days)',
        type: 'number',
        description: 'How long to keep call and order records',
        defaultValue: 45,
        min: 7,
        max: 365
      }
    ]
  },
  healthcare: {
    title: 'Healthcare Configuration',
    fields: [
      {
        name: 'appointment_buffer_mins',
        label: 'Appointment Buffer (Minutes)',
        type: 'number',
        description: 'Minutes to keep between appointments for prep',
        defaultValue: 15,
        min: 0,
        max: 120
      },
      {
        name: 'escalation_wait_time',
        label: 'Escalation Wait Time (Seconds)',
        type: 'number',
        description: 'Seconds to wait before escalating to clinician',
        defaultValue: 300,
        min: 30,
        max: 1800
      },
      {
        name: 'hipaa_enabled',
        label: 'HIPAA Compliance',
        type: 'checkbox',
        description: 'Enable HIPAA-compliant data handling and encryption',
        defaultValue: true
      },
      {
        name: 'patient_privacy_level',
        label: 'Patient Privacy Level',
        type: 'select',
        options: [
          { value: 'high', label: 'High - Encrypt all PII' },
          { value: 'medium', label: 'Medium - Encrypt sensitive fields' },
          { value: 'standard', label: 'Standard - Standard encryption' }
        ],
        description: 'How strictly to handle patient data',
        defaultValue: 'high'
      }
    ]
  },
  realestate: {
    title: 'Real Estate Configuration',
    fields: [
      {
        name: 'followup_window_hours',
        label: 'Follow-up Window (Hours)',
        type: 'number',
        description: 'Hours to follow up after showing scheduled',
        defaultValue: 24,
        min: 1,
        max: 168
      },
      {
        name: 'showing_duration_mins',
        label: 'Default Showing Duration (Minutes)',
        type: 'number',
        description: 'Standard time for property viewings',
        defaultValue: 30,
        min: 15,
        max: 120
      },
      {
        name: 'offer_expiry_hours',
        label: 'Offer Expiry (Hours)',
        type: 'number',
        description: 'How long offers remain valid',
        defaultValue: 48,
        min: 1,
        max: 240
      }
    ]
  },
  logistics: {
    title: 'Logistics Configuration',
    fields: [
      {
        name: 'delivery_attempt_limit',
        label: 'Max Delivery Attempts',
        type: 'number',
        description: 'Maximum delivery attempts before marking failed',
        defaultValue: 3,
        min: 1,
        max: 10
      },
      {
        name: 'address_clarification_threshold',
        label: 'Address Clarification Threshold (%)',
        type: 'number',
        description: 'Confidence threshold for address verification',
        defaultValue: 85,
        min: 50,
        max: 100
      },
      {
        name: 'sms_on_delivery',
        label: 'SMS on Delivery',
        type: 'checkbox',
        description: 'Send SMS notification when package is delivered',
        defaultValue: true
      }
    ]
  },
  fintech: {
    title: 'Fintech Configuration',
    fields: [
      {
        name: 'transaction_verification_timeout',
        label: 'Transaction Verification Timeout (Seconds)',
        type: 'number',
        description: 'Maximum time to wait for transaction verification',
        defaultValue: 30,
        min: 5,
        max: 120
      },
      {
        name: 'fraud_alert_threshold',
        label: 'Fraud Alert Threshold (₹)',
        type: 'number',
        description: 'Alert for transactions above this amount',
        defaultValue: 10000,
        min: 0,
        max: 1000000
      },
      {
        name: 'pci_compliance_enabled',
        label: 'PCI-DSS Compliance',
        type: 'checkbox',
        description: 'Enable PCI-compliant payment data handling',
        defaultValue: true
      }
    ]
  },
  support: {
    title: 'Customer Support Configuration',
    fields: [
      {
        name: 'l1_resolution_target_mins',
        label: 'L1 Resolution Target (Minutes)',
        type: 'number',
        description: 'Target time for L1 support to resolve issues',
        defaultValue: 15,
        min: 5,
        max: 120
      },
      {
        name: 'escalation_threshold_rating',
        label: 'Escalation Threshold (Rating)',
        type: 'number',
        description: 'Escalate if customer satisfaction below this rating (1-5)',
        defaultValue: 2.5,
        min: 1,
        max: 5,
        step: 0.5
      },
      {
        name: 'ticket_priority_auto_assign',
        label: 'Auto-assign Based on Priority',
        type: 'checkbox',
        description: 'Automatically assign tickets based on priority level',
        defaultValue: true
      }
    ]
  },
  telecom: {
    title: 'Telecom & Utilities Configuration',
    fields: [
      {
        name: 'outage_alert_threshold_mins',
        label: 'Outage Alert Threshold (Minutes)',
        type: 'number',
        description: 'Alert customers after service down for X minutes',
        defaultValue: 30,
        min: 5,
        max: 240
      },
      {
        name: 'billing_cycle_day',
        label: 'Billing Cycle Day (of month)',
        type: 'number',
        description: 'Day of month when billing cycle starts',
        defaultValue: 1,
        min: 1,
        max: 28
      },
      {
        name: 'service_activation_timeout_hours',
        label: 'Service Activation Timeout (Hours)',
        type: 'number',
        description: 'Maximum time to activate new service',
        defaultValue: 24,
        min: 1,
        max: 72
      }
    ]
  },
  government: {
    title: 'Government & Public Services Configuration',
    fields: [
      {
        name: 'complaint_resolution_sla_days',
        label: 'Complaint Resolution SLA (Days)',
        type: 'number',
        description: 'Target days to resolve public complaints',
        defaultValue: 7,
        min: 1,
        max: 60
      },
      {
        name: 'permit_processing_days',
        label: 'Permit Processing Time (Days)',
        type: 'number',
        description: 'Standard processing time for permits',
        defaultValue: 14,
        min: 1,
        max: 60
      },
      {
        name: 'transparency_logging_enabled',
        label: 'Transparency Logging',
        type: 'checkbox',
        description: 'Log all interactions for transparency and audit',
        defaultValue: true
      }
    ]
  },
  education: {
    title: 'Education & EdTech Configuration',
    fields: [
      {
        name: 'admission_application_deadline_days',
        label: 'Admission Deadline (Days from now)',
        type: 'number',
        description: 'Days until application deadline',
        defaultValue: 60,
        min: 1,
        max: 365
      },
      {
        name: 'batch_capacity_per_class',
        label: 'Batch Capacity (Students)',
        type: 'number',
        description: 'Maximum students per batch/class',
        defaultValue: 40,
        min: 10,
        max: 500
      },
      {
        name: 'enrollment_confirmation_required',
        label: 'Enrollment Confirmation Required',
        type: 'checkbox',
        description: 'Require confirmation before finalizing enrollment',
        defaultValue: true
      }
    ]
  },
  travel: {
    title: 'Travel & Hospitality Configuration',
    fields: [
      {
        name: 'booking_confirmation_timeout_mins',
        label: 'Booking Confirmation Timeout (Minutes)',
        type: 'number',
        description: 'Time to confirm booking before cancellation',
        defaultValue: 10,
        min: 5,
        max: 60
      },
      {
        name: 'checkin_window_hours_before',
        label: 'Check-in Window (Hours before)',
        type: 'number',
        description: 'Hours before arrival when check-in is allowed',
        defaultValue: 24,
        min: 1,
        max: 168
      },
      {
        name: 'disruption_alert_enabled',
        label: 'Disruption Alerts',
        type: 'checkbox',
        description: 'Send alerts for flight delays, weather, etc.',
        defaultValue: true
      }
    ]
  },
  saas: {
    title: 'SaaS & Software Configuration',
    fields: [
      {
        name: 'onboarding_completion_target_days',
        label: 'Onboarding Completion Target (Days)',
        type: 'number',
        description: 'Target days for full onboarding completion',
        defaultValue: 7,
        min: 1,
        max: 30
      },
      {
        name: 'demo_session_duration_mins',
        label: 'Demo Session Duration (Minutes)',
        type: 'number',
        description: 'Standard duration for product demo sessions',
        defaultValue: 30,
        min: 15,
        max: 120
      },
      {
        name: 'feature_faq_auto_suggest',
        label: 'Auto-suggest Feature FAQs',
        type: 'checkbox',
        description: 'Automatically suggest relevant feature FAQs',
        defaultValue: true
      }
    ]
  }
};

/**
 * Sector Configuration Page
 * Allows clients to customize business rules for their sector
 */
const SectorConfigurationPage = () => {
  const { user, sector } = useAuth();
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Load current configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/sector/config/${sector || 'ecommerce'}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setConfig(data.config || {});
        } else {
          throw new Error('Failed to load configuration');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sector) {
      loadConfig();
    }
  }, [sector, API_BASE_URL]);

  // Handle field changes
  const handleFieldChange = useCallback((fieldName, value) => {
    setConfig(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setIsDirty(true);
    setSuccess(false);
  }, []);

  // Save configuration
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/sector/config/${sector || 'ecommerce'}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ config })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setIsDirty(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Please log in to configure your sector</div>;
  }

  const sectorConfig = SECTOR_CONFIGS[sector] || SECTOR_CONFIGS.ecommerce;
  const fields = sectorConfig.fields || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={sectorConfig.title}
        description="Customize business rules and settings for your operations"
      />

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          icon={AlertCircle}
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          type="success"
          icon={CheckCircle}
          title="Saved"
          message="Configuration has been updated successfully"
          onClose={() => setSuccess(false)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-500" size={32} />
          <p className="text-gray-600 dark:text-gray-400">Loading configuration...</p>
        </Card>
      )}

      {/* Configuration Form */}
      {!loading && (
        <>
          {/* Main Configuration */}
          <Section title="Settings" description="Adjust these based on your business needs">
            <div className="space-y-6">
              {fields.map((field) => (
                <div key={field.name} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                  {/* Label & Description */}
                  <label className="block mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {field.label}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {field.description}
                    </span>
                  </label>

                  {/* Input Fields */}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={config[field.name] ?? field.defaultValue}
                      onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value))}
                      min={field.min}
                      max={field.max}
                      className="
                        w-full md:w-64 px-4 py-2 rounded-lg border
                        border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      "
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config[field.name] ?? field.defaultValue}
                        onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                        Enabled
                      </span>
                    </label>
                  )}

                  {field.type === 'select' && (
                    <select
                      value={config[field.name] ?? field.defaultValue}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="
                        w-full md:w-64 px-4 py-2 rounded-lg border
                        border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      "
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSave}
              disabled={!isDirty || saving}
              loading={saving}
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SectorConfigurationPage;
