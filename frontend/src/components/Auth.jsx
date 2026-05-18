import React, { useState } from 'react';
import { Code2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { authAPI, saveToken } from '../utils/api';

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('signin');
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // ─── Validation helpers ────────────────────────────────────────────────────

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateSignIn = () => {
    const e = {};
    if (!signInData.email.trim()) e.email = 'Email is required.';
    else if (!validateEmail(signInData.email)) e.email = 'Enter a valid email address.';
    if (!signInData.password) e.password = 'Password is required.';
    else if (signInData.password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignUp = () => {
    const e = {};
    if (!signUpData.name.trim()) e.name = 'Name is required.';
    if (!signUpData.email.trim()) e.email = 'Email is required.';
    else if (!validateEmail(signUpData.email)) e.email = 'Enter a valid email address.';
    if (!signUpData.password) e.password = 'Password is required.';
    else if (signUpData.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (signUpData.password !== signUpData.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Sign In ───────────────────────────────────────────────────────────────

  const handleSignIn = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    if (!validateSignIn()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.login(signInData.email, signInData.password);
      const { token, user } = response.data;
      setSuccessMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => onAuthSuccess({ token, user }), 600);
    } catch (err) {
      const msg = err.response?.data?.error || 'Sign in failed. Please try again.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Sign Up ───────────────────────────────────────────────────────────────

  const handleSignUp = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    if (!validateSignUp()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.register(signUpData.name, signUpData.email, signUpData.password);
      const { token, user } = response.data;
      setSuccessMessage(`Account created! Welcome, ${user.name}!`);
      setTimeout(() => onAuthSuccess({ token, user }), 600);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
    setSuccessMessage('');
  };

  const fillDemo = () => {
    setSignInData({ email: 'demo@codealchemy.com', password: 'demo123' });
    setErrors({});
    setServerError('');
  };

  // ─── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CodeAlchemy</h1>
          <p className="text-slate-400 mt-1">AI-powered code converter & bug detector</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex mb-6 rounded-xl bg-slate-700/50 p-1">
            {['signin', 'signup'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchMode(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === tab
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Server-level feedback */}
          {serverError && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm" role="alert">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm" role="status">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ── Sign In Form ── */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} noValidate>
              <Field
                label="Email Address"
                type="email"
                value={signInData.email}
                onChange={(v) => { setSignInData({ ...signInData, email: v }); if (errors.email) setErrors({ ...errors, email: '' }); }}
                placeholder="your@email.com"
                error={errors.email}
                disabled={isLoading}
              />
              <Field
                label="Password"
                type="password"
                value={signInData.password}
                onChange={(v) => { setSignInData({ ...signInData, password: v }); if (errors.password) setErrors({ ...errors, password: '' }); }}
                placeholder="••••••••"
                error={errors.password}
                disabled={isLoading}
              />

              <SubmitButton loading={isLoading} label="Sign In" />

              <button
                type="button"
                onClick={fillDemo}
                disabled={isLoading}
                className="mt-2 w-full py-2.5 text-slate-300 text-sm font-semibold rounded-lg border border-slate-600 bg-slate-700 hover:bg-slate-600 hover:text-white transition disabled:opacity-50"
              >
                Try Demo Account
              </button>
            </form>
          )}

          {/* ── Sign Up Form ── */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} noValidate>
              <Field
                label="Full Name"
                type="text"
                value={signUpData.name}
                onChange={(v) => { setSignUpData({ ...signUpData, name: v }); if (errors.name) setErrors({ ...errors, name: '' }); }}
                placeholder="John Developer"
                error={errors.name}
                disabled={isLoading}
              />
              <Field
                label="Email Address"
                type="email"
                value={signUpData.email}
                onChange={(v) => { setSignUpData({ ...signUpData, email: v }); if (errors.email) setErrors({ ...errors, email: '' }); }}
                placeholder="your@email.com"
                error={errors.email}
                disabled={isLoading}
              />
              <Field
                label="Password"
                type="password"
                value={signUpData.password}
                onChange={(v) => { setSignUpData({ ...signUpData, password: v }); if (errors.password) setErrors({ ...errors, password: '' }); }}
                placeholder="••••••••"
                error={errors.password}
                disabled={isLoading}
                hint="Minimum 6 characters"
              />
              <Field
                label="Confirm Password"
                type="password"
                value={signUpData.confirmPassword}
                onChange={(v) => { setSignUpData({ ...signUpData, confirmPassword: v }); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }}
                placeholder="••••••••"
                error={errors.confirmPassword}
                disabled={isLoading}
              />
              <SubmitButton loading={isLoading} label="Create Account" />
            </form>
          )}

          {/* Demo credentials hint */}
          {mode === 'signin' && (
            <div className="mt-5 p-3 rounded-lg bg-slate-700/40 border border-slate-600/50">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Demo credentials</p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-300">demo@codealchemy.com</span> / <span className="text-slate-300">demo123</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Or create your own account in Sign Up ↑</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Field component ─────────────────────────────────────────────────

function Field({ label, type, value, onChange, placeholder, error, disabled, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:ring-red-500/30'
            : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20'
        }`}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
      {!error && hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? 'Please wait…' : label}
    </button>
  );
}
