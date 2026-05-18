import React from 'react';
import { Code2, LogOut } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, userName, onLogout }) {

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-700" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Code2 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CodeAlchemy</h1>
              <p className="text-xs text-slate-400">AI Code Converter & Bug Detector</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-4 items-center" aria-label="Main navigation">
            <button 
              onClick={() => setActiveTab('converter')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                activeTab === 'converter'
                  ? 'bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-indigo-500/20'
              }`}
              aria-current={activeTab === 'converter' ? 'page' : undefined}
              title="Go to converter tab"
            >
              🔄 Converter
            </button>
            <button 
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                activeTab === 'features'
                  ? 'bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-indigo-500/20'
              }`}
              aria-current={activeTab === 'features' ? 'page' : undefined}
              title="View features"
            >
              ✨ Features
            </button>
          </nav>

          <div className="flex gap-4 items-center">
            {userName && (
              <>
                <div className="text-slate-300 px-4 py-2 font-medium" role="status" aria-label="User status">
                  👤 {userName}
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition font-medium border border-slate-600 rounded-lg hover:border-slate-500"
                  aria-label="Log out from CodeAlchemy"
                  title="Sign out of your account"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
