// Frontend/src/pages/OnboardingPage.jsx - Company setup wizard after login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building, Globe, Phone, Settings, CheckCircle, AlertCircle, Loader,
  ChevronRight, Key, DollarSign, Clock
} from 'lucide-react';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, getAuthHeader } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [testResults, setTestResults] = useState({
    shopifyTested: false,
    shopifyValid: false,
    exotelTested: false,
    exotelValid: false
  });

  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyLogo: null,
    timezone: 'Asia/Kolkata',
    language: 'hi',
    
    // Step 2: Shopify Integration
    shopifyStore: '',
    shopifyApiKey: '',
    shopifyApiSecret: '',
    
    // Step 3: Exotel Setup
    exotelNumber: '',
    exotelSid: '',
    exotelToken: '',
    
    // Step 4: Business Rules
    returnWindowDays: 14,
    refundAutoThreshold: 2000,
    cancelWindowHours: 24,
    escalationThreshold: 60,
    enableWhatsApp: false,
    enableSMS: true,
    enableEmail: true
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Reset test results when credentials change
    if (['shopifyApiKey', 'shopifyApiSecret', 'shopifyStore'].includes(field)) {
      setTestResults(prev => ({ ...prev, shopifyTested: false }));
    }
    if (['exotelSid', 'exotelToken'].includes(field)) {
      setTestResults(prev => ({ ...prev, exotelTested: false }));
    }
  };

  const validateStep = () => {
    const errors = {};
    
    switch (step) {
      case 2:
        if (!formData.shopifyStore) errors.shopifyStore = 'Shopify store URL required';
        if (!formData.shopifyApiKey) errors.shopifyApiKey = 'API key required';
        if (!formData.shopifyApiSecret) errors.shopifyApiSecret = 'API secret required';
        if (!testResults.shopifyValid) errors.shopifyTest = 'Please test and verify Shopify credentials';
        break;
      case 3:
        if (!formData.exotelNumber) errors.exotelNumber = 'Phone number required';
        if (!formData.exotelSid) errors.exotelSid = 'Exotel SID required';
        if (!formData.exotelToken) errors.exotelToken = 'API token required';
        if (!testResults.exotelValid) errors.exotelTest = 'Please test and verify Exotel credentials';
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const testShopifyConnection = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/onboarding/test-shopify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          shopifyStore: formData.shopifyStore,
          shopifyApiKey: formData.shopifyApiKey,
          shopifyApiSecret: formData.shopifyApiSecret
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Shopify connection failed');
        setTestResults(prev => ({ ...prev, shopifyTested: true, shopifyValid: false }));
        return;
      }

      setTestResults(prev => ({ ...prev, shopifyTested: true, shopifyValid: true }));
    } catch (err) {
      setError('Failed to test Shopify connection');
      setTestResults(prev => ({ ...prev, shopifyTested: true, shopifyValid: false }));
    } finally {
      setLoading(false);
    }
  };

  const testExotelConnection = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/onboarding/test-exotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          exotelSid: formData.exotelSid,
          exotelToken: formData.exotelToken
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Exotel connection failed');
        setTestResults(prev => ({ ...prev, exotelTested: true, exotelValid: false }));
        return;
      }

      setTestResults(prev => ({ ...prev, exotelTested: true, exotelValid: true }));
    } catch (err) {
      setError('Failed to test Exotel connection');
      setTestResults(prev => ({ ...prev, exotelTested: true, exotelValid: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Call real onboarding API endpoint
      const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          shopifyStore: formData.shopifyStore,
          shopifyApiKey: formData.shopifyApiKey,
          shopifyApiSecret: formData.shopifyApiSecret,
          exotelNumber: formData.exotelNumber,
          exotelSid: formData.exotelSid,
          exotelToken: formData.exotelToken,
          returnWindowDays: parseInt(formData.returnWindowDays),
          refundAutoThreshold: parseInt(formData.refundAutoThreshold),
          cancelWindowHours: parseInt(formData.cancelWindowHours),
          escalationThreshold: parseInt(formData.escalationThreshold),
          enableWhatsApp: formData.enableWhatsApp,
          enableSMS: formData.enableSMS,
          enableEmail: formData.enableEmail
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || data.errors?.shopifyApiKey || 'Setup failed');
        return;
      }

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex gap-2 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`flex-1 h-1 rounded ${
            i <= step ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        ></div>
      ))}
    </div>
  );

  const InputField = ({ label, field, type = 'text', placeholder, icon: Icon, required, helper }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            validationErrors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
      </div>
      {validationErrors[field] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validationErrors[field]}
        </p>
      )}
      {helper && <p className="text-gray-500 text-xs mt-1">{helper}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Setup Your Account</h1>
            <p className="text-gray-600 mt-2">Step {step} of 4 - {step === 1 ? 'Company Info' : step === 2 ? 'Shopify Integration' : step === 3 ? 'Exotel Setup' : 'Business Rules'}</p>
          </div>

          {/* Progress */}
          <StepIndicator />

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="w-6 h-6 mr-2 text-blue-600" />
                  Company Information
                </h2>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                  >
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Welcome!</strong> Let's get your Caly account set up. We'll configure your Shopify and Exotel integrations in the next steps.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Shopify Integration */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-green-600" />
                  Shopify Integration
                </h2>
              </div>

              <InputField
                label="Shopify Store URL"
                field="shopifyStore"
                placeholder="your-store.myshopify.com"
                icon={Globe}
                required
              />

              <InputField
                label="API Key"
                field="shopifyApiKey"
                placeholder="shppa_xxxx..."
                icon={Key}
                required
              />

              <InputField
                label="API Secret"
                field="shopifyApiSecret"
                type="password"
                placeholder="shpss_xxxx..."
                icon={Key}
                required
              />

              {/* Test Shopify Connection */}
              <div className="border-t pt-4">
                <button
                  onClick={testShopifyConnection}
                  disabled={!formData.shopifyStore || !formData.shopifyApiKey || !formData.shopifyApiSecret || loading}
                  className="w-full px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {loading && testResults.shopifyTested === false ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : testResults.shopifyValid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : null}
                  {testResults.shopifyTested ? (testResults.shopifyValid ? '✓ Shopify Connected' : '✗ Test Failed') : 'Test Shopify Connection'}
                </button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>How to get your API credentials:</strong>
                </p>
                <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1">
                  <li>Go to your Shopify Admin → Apps → Develop apps</li>
                  <li>Create a new app or select existing app</li>
                  <li>Go to Configuration tab</li>
                  <li>Under Admin API access scopes, enable required scopes</li>
                  <li>Click "Save" and then "Reveal" next to "Admin API access token"</li>
                  <li>Copy API Key and Secret from API credentials section</li>
                </ol>
              </div>
            </div>
          )}

          {/* Step 3: Exotel Setup */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-6 h-6 mr-2 text-purple-600" />
                  Exotel Configuration
                </h2>
              </div>

              <InputField
                label="Phone Number"
                field="exotelNumber"
                placeholder="+91 80XXXXXXXX"
                icon={Phone}
                required
                helper="Your Exotel phone number for receiving calls"
              />

              <InputField
                label="Exotel SID"
                field="exotelSid"
                placeholder="Your Exotel Account SID"
                required
              />

              <InputField
                label="API Token"
                field="exotelToken"
                type="password"
                placeholder="Your Exotel API Token"
                required
              />

              {/* Test Exotel Connection */}
              <div className="border-t pt-4">
                <button
                  onClick={testExotelConnection}
                  disabled={!formData.exotelSid || !formData.exotelToken || loading}
                  className="w-full px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {loading && testResults.exotelTested === false ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : testResults.exotelValid ? (
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  ) : null}
                  {testResults.exotelTested ? (testResults.exotelValid ? '✓ Exotel Connected' : '✗ Test Failed') : 'Test Exotel Connection'}
                </button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Webhook Configuration:</strong>
                </p>
                <p className="text-xs text-blue-800 mb-3">
                  After completing setup, add this webhook URL to your Exotel dashboard:
                </p>
                <code className="block bg-white p-2 rounded text-xs text-gray-800 border border-blue-200">
                  {API_BASE_URL}/webhooks/exotel/call-start
                </code>
              </div>
            </div>
          )}

          {/* Step 4: Business Rules */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-orange-600" />
                  Business Rules
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enableWhatsApp}
                      onChange={(e) => updateField('enableWhatsApp', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">Enable WhatsApp Support</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enableSMS}
                      onChange={(e) => updateField('enableSMS', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">Enable SMS Notifications</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enableEmail}
                      onChange={(e) => updateField('enableEmail', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">Enable Email Notifications</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">All Set!</p>
                  <p className="text-sm text-green-700 mt-1">Your Caly account is configured. Click "Complete Setup" to start receiving calls.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrev}
              disabled={step === 1 || loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
