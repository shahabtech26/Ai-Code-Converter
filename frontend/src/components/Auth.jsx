import React, { useState } from 'react';
import { Code2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock database of registered users
  const registeredUsers = [
    { email: 'demo@codealchemy.com', password: 'demo123', name: 'Demo User' },
    { email: 'user@example.com', password: 'password123', name: 'John Developer' },
    { email: 'test@test.com', password: 'test123456', name: 'Test Account' }
  ];

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!signInData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signInData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!signInData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(signInData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sign in with proper authentication
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user exists in mock database
    const user = registeredUsers.find(
      u => u.email.toLowerCase() === signInData.email.toLowerCase() && u.password === signInData.password
    );

    if (user) {
      setSuccessMessage(`✓ Signed in successfully as ${user.name}`);
      setTimeout(() => {
        onAuthSuccess(user.name);
        setSignInData({ email: '', password: '' });
        setSuccessMessage('');
      }, 1000);
    } else {
      // Check if email exists
      const emailExists = registeredUsers.some(u => u.email.toLowerCase() === signInData.email.toLowerCase());
      
      if (emailExists) {
        setErrors({ password: 'Incorrect password. Please try again.' });
      } else {
        setErrors({ email: 'No account found with this email address' });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">CodeAlchemy</h1>
        </div>
        <p className="text-slate-400 text-lg">AI Code Converter</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>

          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-300 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                value={signInData.email}
                onChange={(e) => {
                  setSignInData({...signInData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/30' 
                    : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-slate-300 font-medium mb-2">Password</label>
              <input 
                type="password" 
                value={signInData.password}
                onChange={(e) => {
                  setSignInData({...signInData, password: e.target.value});
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500/30' 
                    : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
            
            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold rounded-lg transition uppercase tracking-wide mb-3 ${
                isLoading 
                  ? 'bg-slate-600 opacity-60 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Try Demo Button */}
            <button 
              type="button"
              onClick={() => {
                setSignInData({ email: 'demo@codealchemy.com', password: 'demo123' });
                setErrors({});
                setSuccessMessage('');
              }}
              disabled={isLoading}
              className={`w-full py-3 text-slate-300 font-bold rounded-lg border border-slate-600 transition uppercase tracking-wide ${
                isLoading 
                  ? 'bg-slate-700 opacity-60 cursor-not-allowed' 
                  : 'bg-slate-700 hover:bg-slate-600 hover:text-white'
              }`}
            >
              Try Demo Account
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400 mb-2 font-semibold">Demo Credentials:</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>Email: <span className="text-slate-300">demo@codealchemy.com</span></li>
              <li>Password: <span className="text-slate-300">demo123</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
