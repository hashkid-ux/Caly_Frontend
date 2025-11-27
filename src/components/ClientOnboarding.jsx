import React, { useState } from 'react';
import { Store, Key, Phone, Globe, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ClientOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    
    // Shopify Integration
    shopifyStore: '',
    shopifyApiKey: '',
    shopifyApiSecret: '',
    
    // Exotel Config
    exotelSid: '',
    exotelToken: '',
    exotelNumber: '',
    
    // Business Rules
    returnWindowDays: 14,
    refundAutoThreshold: 2000,
    cancelWindowHours: 24,
    
    // Additional Services
    enableWhatsApp: false,
    enableSMS: true,
    enableEmail: true
  });

  const [validationErrors, setValidationErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const errors = {};
    
    if (currentStep === 1) {
      if (!formData.companyName) errors.companyName = 'Company name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.phone) errors.phone = 'Phone is required';
    } else if (currentStep === 2) {
      if (!formData.shopifyStore) errors.shopifyStore = 'Shopify store URL is required';
      if (!formData.shopifyApiKey) errors.shopifyApiKey = 'API key is required';
    } else if (currentStep === 3) {
      if (!formData.exotelNumber) errors.exotelNumber = 'Exotel number is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      try {
        // API call to create client
        const response = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          setStep(5); // Success step
        } else {
          alert('Failed to create client. Please try again.');
        }
      } catch (error) {
        console.error('Error creating client:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const InputField = ({ label, field, type = 'text', placeholder, icon: Icon, required }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {validationErrors[field] && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validationErrors[field]}
        </p>
      )}
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
            i === step ? 'bg-blue-600 text-white' :
            i < step ? 'bg-green-500 text-white' :
            'bg-gray-200 text-gray-600'
          }`}>
            {i < step ? <CheckCircle className="w-6 h-6" /> : i}
          </div>
          {i < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              i < step ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Onboarding</h1>
            <p className="text-gray-500">Setup your Caly Voice AI in 4 simple steps</p>
          </div>

          {step < 5 && <StepIndicator />}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Store className="w-6 h-6 mr-2 text-blue-600" />
                Basic Information
              </h2>
              
              <InputField
                label="Company Name"
                field="companyName"
                placeholder="Your Company Pvt Ltd"
                icon={Store}
                required
              />
              
              <InputField
                label="Contact Person"
                field="contactPerson"
                placeholder="John Doe"
                required
              />
              
              <InputField
                label="Email"
                field="email"
                type="email"
                placeholder="contact@company.com"
                required
              />
              
              <InputField
                label="Phone"
                field="phone"
                type="tel"
                placeholder="+91 98765 43210"
                icon={Phone}
                required
              />
            </div>
          )}

          {/* Step 2: Shopify Integration */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-green-600" />
                Shopify Integration
              </h2>
              
              <InputField
                label="Shopify Store URL"
                field="shopifyStore"
                placeholder="your-store.myshopify.com"
                icon={Globe}
                required
              />
              
              <InputField
                label="Shopify API Key"
                field="shopifyApiKey"
                placeholder="shppa_xxxxxxxxxxxxxxxxxxxxx"
                icon={Key}
                required
              />
              
              <InputField
                label="Shopify API Secret"
                field="shopifyApiSecret"
                type="password"
                placeholder="shpss_xxxxxxxxxxxxxxxxxxxxx"
                icon={Key}
                required
              />
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>How to get API credentials:</strong><br />
                  1. Go to your Shopify Admin → Apps → Develop apps<br />
                  2. Create a new app and enable Admin API access<br />
                  3. Copy the API key and secret
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Exotel Configuration */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-purple-600" />
                Exotel Configuration
              </h2>
              
              <InputField
                label="Exotel Number"
                field="exotelNumber"
                placeholder="+91 80XXXXXXXX"
                icon={Phone}
                required
              />
              
              <InputField
                label="Exotel SID"
                field="exotelSid"
                placeholder="Your Exotel SID"
              />
              
              <InputField
                label="Exotel Token"
                field="exotelToken"
                type="password"
                placeholder="Your Exotel API Token"
              />
            </div>
          )}

          {/* Step 4: Business Rules */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-orange-600" />
                Business Rules & Preferences
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Window (Days)
                </label>
                <input
                  type="number"
                  value={formData.returnWindowDays}
                  onChange={(e) => updateField('returnWindowDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="mt-1 text-sm text-gray-500">Number of days customers can return products</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Refund Threshold (₹)
                </label>
                <input
                  type="number"
                  value={formData.refundAutoThreshold}
                  onChange={(e) => updateField('refundAutoThreshold', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="mt-1 text-sm text-gray-500">Orders below this amount are auto-refunded</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancel Window (Hours)
                </label>
                <input
                  type="number"
                  value={formData.cancelWindowHours}
                  onChange={(e) => updateField('cancelWindowHours', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="mt-1 text-sm text-gray-500">Hours within which orders can be cancelled</p>
              </div>

              <div className="space-y-3 mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.enableWhatsApp}
                    onChange={(e) => updateField('enableWhatsApp', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-700">Enable WhatsApp Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.enableSMS}
                    onChange={(e) => updateField('enableSMS', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-700">Enable SMS Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.enableEmail}
                    onChange={(e) => updateField('enableEmail', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-700">Enable Email Notifications</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Set!</h2>
              <p className="text-gray-600 mb-8">
                Your client account has been created successfully. You can now start receiving voice calls.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Previous
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Complete Setup
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;