import React, { useState } from 'react';
import { Code2, Mail, Lock, User, Globe } from 'lucide-react';
import CodeForm from './CodeForm';
import ResultsDisplay from './ResultsDisplay';

export default function Home({ onSetActiveTab }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  
  // Auth form states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', country: '', password: '', confirmPassword: '', agree: false });

  const handleConversion = async (formData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResults({
        convertedCode: `// Converted to ${formData.targetLanguage}
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const person = "World";
greet(person);`,
        targetLanguage: formData.targetLanguage,
        bugs: [
          {
            severity: 'Medium',
            type: 'Potential Null Reference',
            description: 'Parameter "name" might be undefined or null',
            line: 2,
            codeSnippet: 'function greet(name) {',
            suggestion: 'Add a null check: if (!name) throw new Error("Name is required");'
          }
        ],
        stats: {
          linesOfCode: 42,
          conversionTime: 523,
          accuracy: 94,
          bugsFound: 1
        },
        notes: [
          'Applied proper naming conventions for target language',
          'Optimized code structure for readability',
          'Added necessary type annotations where applicable'
        ]
      });
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (signInData.email && signInData.password) {
      alert(`Signed in as: ${signInData.email}`);
      setSignInData({ email: '', password: '' });
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!signUpData.agree) {
      alert('Please agree to Terms and Conditions');
      return;
    }
    alert(`Account created for: ${signUpData.email}`);
    setSignUpData({ name: '', email: '', country: '', password: '', confirmPassword: '', agree: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CodeAlchemy</h1>
                <p className="text-xs text-slate-400">AI Code Converter</p>
              </div>
            </div>
            
            <button 
              onClick={() => onSetActiveTab('converter')}
              className="px-4 py-2 text-slate-300 hover:text-white transition font-medium"
            >
              Go to App
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Converter */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Start Converting</h2>
              <p className="text-slate-400">Convert your code between 20+ programming languages instantly</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <CodeForm onSubmit={handleConversion} loading={loading} />
            </div>

            {results && (
              <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Results:</h3>
                <ResultsDisplay results={results} />
              </div>
            )}
          </div>

          {/* Right Side - Auth */}
          <div>
            <div className="sticky top-24">
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>

                {/* Tab Buttons */}
                <div className="flex gap-4 mb-8">
                  <button 
                    onClick={() => setAuthTab('signin')}
                    className={`flex-1 py-2 px-4 rounded-lg transition ${
                      authTab === 'signin'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setAuthTab('signup')}
                    className={`flex-1 py-2 px-4 rounded-lg transition ${
                      authTab === 'signup'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Sign In Form */}
                {authTab === 'signin' && (
                  <form onSubmit={handleSignIn}>
                    <div className="mb-4">
                      <label className="block text-slate-300 font-medium mb-2">Email Address</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <Mail size={18} className="text-slate-400" />
                        <input 
                          type="email" 
                          value={signInData.email}
                          onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-slate-300 font-medium mb-2">Password</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <Lock size={18} className="text-slate-400" />
                        <input 
                          type="password" 
                          value={signInData.password}
                          onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition"
                    >
                      Sign In
                    </button>
                  </form>
                )}

                {/* Sign Up Form */}
                {authTab === 'signup' && (
                  <form onSubmit={handleSignUp} className="max-h-96 overflow-y-auto">
                    <div className="mb-4">
                      <label className="block text-slate-300 font-medium mb-2">Full Name</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <User size={18} className="text-slate-400" />
                        <input 
                          type="text" 
                          value={signUpData.name}
                          onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-slate-300 font-medium mb-2">Email Address</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <Mail size={18} className="text-slate-400" />
                        <input 
                          type="email" 
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-slate-300 font-medium mb-2">Country</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <Globe size={18} className="text-slate-400" />
                        <select 
                          value={signUpData.country}
                          onChange={(e) => setSignUpData({...signUpData, country: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                        >
                          <option value="">Select Country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-slate-300 font-medium mb-2">Password</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <Lock size={18} className="text-slate-400" />
                        <input 
                          type="password" 
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-slate-300 font-medium mb-2">Confirm Password</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus-within:border-indigo-500">
                        <Lock size={18} className="text-slate-400" />
                        <input 
                          type="password" 
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                          className="flex-1 bg-transparent text-white focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="mb-6 flex items-center">
                      <input 
                        type="checkbox" 
                        id="agree" 
                        checked={signUpData.agree}
                        onChange={(e) => setSignUpData({...signUpData, agree: e.target.checked})}
                        className="w-4 h-4 cursor-pointer accent-indigo-500"
                      />
                      <label htmlFor="agree" className="ml-2 text-sm text-slate-400">
                        I agree to the Terms and Conditions
                      </label>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition"
                    >
                      Create Account
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
