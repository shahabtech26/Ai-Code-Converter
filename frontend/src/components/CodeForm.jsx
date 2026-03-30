import React, { useState } from 'react';
import { ArrowRightLeft, Zap } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'C++',
  'C#',
  'Go',
  'SQL',
  'Java',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Scala',
  'R',
  'MATLAB',
  'VB.NET',
  'Perl',
  'Lua',
  'Bash'
];

export default function CodeForm({ onSubmit, loading }) {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('JavaScript');
  const [autoDetect, setAutoDetect] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sourceCode.trim()) {
      alert('Please enter code to convert');
      return;
    }
    onSubmit({
      code: sourceCode,
      sourceLanguage: autoDetect ? 'auto' : sourceLanguage,
      targetLanguage
    });
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl border border-slate-700 p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-6">✏️ Input Code</h2>

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Source Language
          </label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            disabled={autoDetect}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={swapLanguages}
            className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-300 hover:text-white"
            title="Swap languages"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Target Language
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Auto Detect */}
      <div className="flex items-center mb-6 p-3 bg-slate-900 rounded-lg border border-slate-700">
        <input
          type="checkbox"
          id="autoDetect"
          checked={autoDetect}
          onChange={(e) => setAutoDetect(e.target.checked)}
          className="w-4 h-4 rounded accent-indigo-500"
        />
        <label htmlFor="autoDetect" className="ml-2 text-sm text-slate-300">
          🤖 Auto-detect source language
        </label>
      </div>

      {/* Code Input */}
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        Paste Your Code
      </label>
      <textarea
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        placeholder="Paste your code here..."
        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500 min-h-64"
      />

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              Converting...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Convert & Analyze
            </>
          )}
        </button>
        <button
          type="button"
          className="px-6 bg-slate-900 text-slate-300 rounded-lg font-semibold hover:bg-slate-800 hover:text-white transition border border-slate-700"
          onClick={() => setSourceCode('')}
        >
          Clear
        </button>
      </div>

      {/* Character Count */}
      <div className="mt-3 text-xs text-slate-500">
        {sourceCode.length} characters
      </div>
    </form>
  );
}
