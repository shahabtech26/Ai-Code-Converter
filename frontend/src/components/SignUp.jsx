import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function SignUp({ onBack, onSignInClick }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !country || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!agree) {
      alert('Please agree to Terms and Conditions');
      return;
    }
    alert(`Account created for: ${email}`);
    setName('');
    setEmail('');
    setCountry('');
    setPassword('');
    setConfirmPassword('');
    setAgree(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Dark Card with Gradient Border */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          {/* Content */}
          <div className="max-h-[90vh] overflow-y-auto">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>

            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label className="block text-slate-300 font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-slate-300 font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-slate-300 font-medium mb-2">Country</label>
                <select 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  required
                >
                  <option value="" className="bg-slate-800">Select Country</option>
                  <option value="United States" className="bg-slate-800">United States</option>
                  <option value="United Kingdom" className="bg-slate-800">United Kingdom</option>
                  <option value="Canada" className="bg-slate-800">Canada</option>
                  <option value="Australia" className="bg-slate-800">Australia</option>
                  <option value="India" className="bg-slate-800">India</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-slate-300 font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-300 font-medium mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="mb-6 flex items-center">
                <input 
                  type="checkbox" 
                  id="agree" 
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-indigo-500"
                />
                <label htmlFor="agree" className="ml-2 text-sm text-slate-400">
                  I agree to the Terms and Conditions
                </label>
              </div>
              
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 hover:shadow-lg shadow-indigo-500/20 transition uppercase tracking-wide mb-4"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-slate-400">
              Already have an account?{' '}
              <button 
                onClick={onSignInClick}
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
