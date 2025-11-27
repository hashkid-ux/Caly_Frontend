// Frontend/src/pages/RegisterPage.jsx - Company registration page with OAuth
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building, AlertCircle, CheckCircle, Loader, Eye, EyeOff, Chrome } from 'lucide-react';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1); // 1: signup info, 2: email verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check for OAuth token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');

    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/dashboard');
    }

    if (oauthError) {
      setError(`OAuth Error: ${oauthError}`);
    }
  }, [searchParams, navigate]);

  // Step 1: Registration Info
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Step 2: Email Verification
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Password strength validator
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[!@#$%^&*]/.test(pwd)) strength = 100;
    setPasswordStrength(strength);
  };

  const handleGoogleSignup = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password || !formData.companyName) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (passwordStrength < 75) {
        setError('Password is too weak. Please use uppercase, lowercase, numbers, and special characters.');
        return;
      }

      // Register
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Move to step 2: Email verification
      setStep(2);
      setOtpSent(true);

    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: otp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      // Redirect to login
      navigate('/login', { 
        state: { message: 'Email verified! Please log in with your credentials.' }
      });

    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Verify error:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestNewOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (response.ok) {
        setError('');
        alert('New OTP sent to your email');
      } else {
        setError('Failed to request OTP');
      }
    } catch (error) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Caly</h1>
          <p className="text-gray-600 mt-2">
            {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
          </p>
        </div>

        {/* Google OAuth Button - Only on Step 1 */}
        {step === 1 && (
          <>
            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full mb-4 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              <Chrome className="w-5 h-5" />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or register with email</span>
              </div>
            </div>
          </>
        )}

        {/* Step Indicator */}
        <div className="flex gap-4 mb-8">
          <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Step 1: Registration */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company Ltd"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 25, 50, 75, 100].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-1 rounded ${
                          passwordStrength >= level ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Fair' : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-600">
              By registering, you agree to our Terms of Service and Privacy Policy
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Email Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-2 text-center text-2xl letter-spacing-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                required
                disabled={loading}
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={requestNewOtp}
                  disabled={loading}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
