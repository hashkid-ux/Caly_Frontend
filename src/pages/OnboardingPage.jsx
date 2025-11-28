// Frontend/src/pages/OnboardingPage.jsx - Fast-track 2-step onboarding redesign
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building, Phone, CheckCircle, AlertCircle, Loader, Zap, ArrowRight, Settings
} from 'lucide-react';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, setOnboardingCompletedStatus } = useAuth();
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Simplified to essentials only
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    phoneNumber: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.companyName || formData.companyName.trim() === '') {
      errors.companyName = 'Company name required';
    }
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      errors.phoneNumber = 'Phone number required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      // Call minimal onboarding API endpoint (fast-track)
      const payload = {
        companyName: formData.companyName,
        phoneNumber: formData.phoneNumber,
        // Minimal required fields - rest done via Settings later
        skipShopify: true,
        skipExotel: true,
        returnWindowDays: 14,
        refundAutoThreshold: 2000,
        cancelWindowHours: 24,
        escalationThreshold: 60,
        enableWhatsApp: false,
        enableSMS: true,
        enableEmail: true
      };

      const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Setup failed');
        return;
      }

      // Show success screen
      setStep(2);
      
      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        setOnboardingCompletedStatus(true);
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Quick Setup Form
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Let's Get Started</h1>
            <p className="text-gray-600 dark:text-gray-400">Set up your Caly account in just 60 seconds</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-800 dark:text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Company Name */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="Your Business Name"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors dark:bg-gray-700 dark:text-white ${
                    validationErrors.companyName 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
              </div>
              {validationErrors.companyName && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.companyName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  placeholder="+91 80XXXXXXXX"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors dark:bg-gray-700 dark:text-white ${
                    validationErrors.phoneNumber 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
              </div>
              {validationErrors.phoneNumber && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.phoneNumber}
                </p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">For receiving calls & SMS updates</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Quick Setup</p>
                <p className="text-xs text-blue-800 dark:text-blue-400 mt-0.5">Just 2 fields to get going</p>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-4 flex gap-3">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Configure Later</p>
                <p className="text-xs text-purple-800 dark:text-purple-400 mt-0.5">Add integrations anytime in Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Success Screen
  if (step === 2) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        {/* Success Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Welcome to Caly!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your account is ready. Let's go to your dashboard and start managing customer interactions.
        </p>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 text-left space-y-3 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What's Next?</h3>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Explore Your Dashboard</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">View calls, messages, and performance metrics</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Add Integrations (Optional)</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Connect Shopify, Exotel, and other services in Settings</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Start Receiving Calls</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Configure agents and webhook rules to get going</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            setOnboardingCompletedStatus(true);
            navigate('/dashboard');
          }}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>

        {/* Auto-redirect message */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
          Redirecting automatically in a moment...
        </p>
      </div>
    </div>
    );
  }

  // Should never reach here
  return null;
};

export default OnboardingPage;
