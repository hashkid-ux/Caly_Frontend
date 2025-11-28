// Frontend/src/pages/SettingsPage.jsx - Company settings management
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Settings, Save, AlertCircle, CheckCircle, Loader,
  Globe, Phone, Users, Lock, Key, Bell
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('company');

  const [formData, setFormData] = useState({
    // Company Info
    timezone: 'Asia/Kolkata',
    language: 'hi',
    
    // Shopify
    shopifyStore: '',
    shopifyApiKey: '',
    shopifyApiSecret: '',
    
    // Exotel
    exotelNumber: '',
    exotelSid: '',
    exotelToken: '',
    
    // Business Rules
    returnWindowDays: 14,
    refundAutoThreshold: 2000,
    cancelWindowHours: 24,
    escalationThreshold: 60,
    
    // Channels
    enableWhatsApp: false,
    enableSMS: true,
    enableEmail: true
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');

      // ✅ FIX: Use clientId from user or fallback to localStorage
      const clientId = user?.clientId || localStorage.getItem('clientId');
      
      if (!clientId) {
        setError('No client information found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/clients/${clientId}`
      );

      if (response.data && response.data.settings) {
        const settings = response.data.settings;
        setFormData({
          timezone: settings.localization?.timezone || 'Asia/Kolkata',
          language: settings.localization?.language || 'hi',
          shopifyStore: settings.shopify?.store || '',
          shopifyApiKey: settings.shopify?.apiKey || '',
          shopifyApiSecret: settings.shopify?.apiSecret || '',
          exotelNumber: settings.exotel?.number || '',
          exotelSid: settings.exotel?.sid || '',
          exotelToken: settings.exotel?.token || '',
          returnWindowDays: settings.business?.returnWindowDays || 14,
          refundAutoThreshold: settings.business?.refundAutoThreshold || 2000,
          cancelWindowHours: settings.business?.cancelWindowHours || 24,
          escalationThreshold: settings.business?.escalationThreshold || 60,
          enableWhatsApp: settings.channels?.whatsApp || false,
          enableSMS: settings.channels?.sms !== false,
          enableEmail: settings.channels?.email !== false
        });
      }
    } catch (err) {
      console.error('Settings fetch error:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    setValidationErrors({});

    try {
      // ✅ FIX: Use clientId from user or fallback to localStorage
      const clientId = user?.clientId || localStorage.getItem('clientId');
      
      if (!clientId) {
        setError('No client information found. Please login again.');
        setSaving(false);
        return;
      }

      const response = await axiosInstance.put(
        `${API_BASE_URL}/api/clients/${clientId}`,
        formData
      );

      // ✅ Clear touched fields on successful save
      setTouchedFields({});
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Save error:', err);
      
      // ✅ Parse field-level validation errors from backend
      if (err.response?.data?.fields) {
        const fieldErrors = {};
        Object.entries(err.response.data.fields).forEach(([field, fieldData]) => {
          fieldErrors[field] = fieldData.message || 'Invalid value';
        });
        setValidationErrors(fieldErrors);
        setError('Please check the highlighted fields and try again');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save settings. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const Tab = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium ${
        activeTab === id
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const InputField = ({ label, field, type = 'text', placeholder, icon: Icon, helper, required = false }) => {
    const hasError = validationErrors[field] && touchedFields[field];
    const isFilled = formData[field] && String(formData[field]).length > 0;
    const isValid = isFilled && !validationErrors[field];

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          <span className={hasError ? 'text-red-700' : 'text-gray-700'}>
            {label}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            {required ? '(Required)' : '(Optional)'}
          </span>
        </label>
        <div className="relative">
          {Icon && (
            <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              hasError ? 'text-red-400' : isValid ? 'text-green-500' : 'text-gray-400'
            }`} />
          )}
          <input
            type={type}
            value={formData[field]}
            onChange={(e) => updateField(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            placeholder={placeholder}
            disabled={saving}
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-12 py-2 border-2 rounded-lg transition-colors ${
              hasError 
                ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                : isValid 
                ? 'border-green-500 bg-green-50 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 disabled:bg-gray-100`}
          />
          <CheckCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 transition-opacity ${isValid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
        </div>
        {hasError && (
          <p className="text-red-600 text-sm mt-2 flex items-start gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{validationErrors[field]}</span>
          </p>
        )}
        {helper && !hasError && <p className="text-gray-500 text-xs mt-1">{helper}</p>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your company configuration and integrations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 border-b">
          <div className="flex overflow-x-auto">
            <Tab id="company" label="Company Info" icon={Users} />
            <Tab id="integrations" label="Integrations" icon={Globe} />
            <Tab id="business" label="Business Rules" icon={Settings} />
            <Tab id="channels" label="Channels" icon={Bell} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={user?.companyName || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={saving}
                  >
                    <option>Asia/Kolkata</option>
                    <option>Asia/Bangkok</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => updateField('language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={saving}
                  >
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Integrations</h2>
              <p className="text-sm text-gray-600 mb-6">Set up integrations to connect your sales channels and communication tools (all optional)</p>

              {/* Shopify */}
              <div className="mb-8 pb-8 border-b bg-green-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Shopify Store
                </h3>
                <p className="text-xs text-gray-600 mb-4">Sell on your Shopify store directly through this platform (Optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Store URL"
                    field="shopifyStore"
                    placeholder="https://mystore.myshopify.com"
                    icon={Globe}
                    helper="Your complete Shopify store URL"
                  />
                  <InputField
                    label="API Key"
                    field="shopifyApiKey"
                    placeholder="shppa_1234567890abcdef..."
                    icon={Key}
                    helper="From Shopify Admin settings (32+ characters)"
                  />
                  <InputField
                    label="API Secret"
                    field="shopifyApiSecret"
                    type="password"
                    placeholder="shpss_1234567890abcdef..."
                    icon={Lock}
                    helper="Keep this secure (32+ characters)"
                  />
                </div>
              </div>

              {/* Exotel */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  Exotel Phone System
                </h3>
                <p className="text-xs text-gray-600 mb-4">Enable voice support and IVR for customer interactions (Optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Phone Number"
                    field="exotelNumber"
                    placeholder="+91 8000000000"
                    icon={Phone}
                    helper="E.164 format with country code"
                  />
                  <InputField
                    label="Exotel SID"
                    field="exotelSid"
                    placeholder="exotel_sid_value"
                    helper="Your Exotel Subscriber ID (5+ characters)"
                  />
                  <InputField
                    label="API Token"
                    field="exotelToken"
                    type="password"
                    placeholder="exotel_api_token_value"
                    icon={Lock}
                    helper="From Exotel dashboard (20+ characters)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Rules Tab */}
          {activeTab === 'business' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Business Rules</h2>
              <p className="text-sm text-gray-600 mb-6">Configure your business policies and automatic actions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Return Window (Days)"
                  field="returnWindowDays"
                  type="number"
                  helper="Days customers can return products"
                />

                <InputField
                  label="Auto-Refund Threshold (₹)"
                  field="refundAutoThreshold"
                  type="number"
                  helper="Orders below this auto-refund"
                />

                <InputField
                  label="Cancel Window (Hours)"
                  field="cancelWindowHours"
                  type="number"
                  helper="Hours to cancel order"
                />

                <InputField
                  label="Escalation Threshold (%)"
                  field="escalationThreshold"
                  type="number"
                  helper="Confidence below this escalates"
                />
              </div>
            </div>
          )}

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Communication Channels</h2>
              <p className="text-sm text-gray-600 mb-6">Enable or disable communication channels for customer notifications</p>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.enableWhatsApp}
                    onChange={(e) => updateField('enableWhatsApp', e.target.checked)}
                    disabled={saving}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">WhatsApp Support</p>
                    <p className="text-sm text-gray-600">Enable WhatsApp as a primary communication channel</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.enableSMS}
                    onChange={(e) => updateField('enableSMS', e.target.checked)}
                    disabled={saving}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Send SMS alerts and updates to customers (enabled by default)</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.enableEmail}
                    onChange={(e) => updateField('enableEmail', e.target.checked)}
                    disabled={saving}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send email updates to customers (enabled by default)</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {saving && <Loader className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
