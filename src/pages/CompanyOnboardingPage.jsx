/**
 * ✅ PHASE 3 FIX 3.1: Company Onboarding Page
 * 
 * Purpose:
 * - Allow users (especially OAuth users) to customize their company name after registration
 * - Display auto-generated company name and allow editing
 * - Shows company creation status and onboarding progress
 * 
 * Flow:
 * 1. User logs in via OAuth (company auto-created with name like "John's Company")
 * 2. Redirect to /onboarding
 * 3. Show current company name (auto-generated)
 * 4. Allow user to customize: company name, website, phone
 * 5. Save changes to backend
 * 6. Redirect to /dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Globe, Phone, ArrowRight, Loader } from 'lucide-react';
import logger from '../utils/logger'; // ✅ PHASE 2 FIX 5: Environment-aware logging

const CompanyOnboardingPage = () => {
  const navigate = useNavigate();
  const { user, getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
    throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
  }

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Form state
  const [company, setCompany] = useState({
    name: '',
    website: '',
    phone: '',
  });

  // Load current company details
  useEffect(() => {
    const loadCompanyDetails = async () => {
      try {
        const authHeaders = getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/api/auth/company`, {
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error('Failed to load company details');
        }

        const data = await response.json();
        setCompany({
          name: data.company.name || '',
          website: data.company.website || '',
          phone: data.company.phone || '',
        });
      } catch (err) {
        // ✅ PHASE 2 FIX 5: Use environment-aware logger
        logger.error('Error loading company:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadCompanyDetails();
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, navigate, getAuthHeader, API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate company name
      if (!company.name.trim()) {
        throw new Error('Company name is required');
      }

      if (company.name.trim().length < 2) {
        throw new Error('Company name must be at least 2 characters');
      }

      const authHeaders = getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/auth/company`, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: company.name.trim(),
          companyWebsite: company.website.trim() || undefined,
          companyPhone: company.phone.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update company');
      }

      setSuccess(true);
      // ✅ PHASE 2 FIX 5: Use environment-aware logger
      logger.debug('✅ Company onboarding completed:', data.company);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600 mb-4">
            Your company profile has been set up successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Let's set up your company information. You can change these details anytime.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Company Name *
                </div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is currently set to: {company.name || 'No name set'}
              </p>
            </div>

            {/* Website (Optional) */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Website (Optional)
                </div>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={company.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  Phone (Optional)
                </div>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={company.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Skip Button */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={submitting}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              Skip for now
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Your company profile helps us personalize your experience. You can update these details anytime from your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOnboardingPage;
