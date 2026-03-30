import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function SignIn({ onBack, onSignUpClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (email && password) {
      alert(`Signed in as: ${email}`);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Dark Card with Gradient Border */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          {/* Content */}
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>

            <form onSubmit={handleSignIn}>
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
              
              <div className="mb-6">
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
              
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 hover:shadow-lg shadow-indigo-500/20 transition uppercase tracking-wide mb-4"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-slate-400">
              Don't have an account?{' '}
              <button 
                onClick={onSignUpClick}
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
