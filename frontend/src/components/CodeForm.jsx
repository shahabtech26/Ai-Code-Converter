import React, { useState } from 'react';
import { ArrowRightLeft, Zap, AlertCircle, CheckCircle, Info } from 'lucide-react';

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

const MAX_CODE_LENGTH = 50000;
const MIN_CODE_LENGTH = 10;

export default function CodeForm({ onSubmit, loading }) {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('JavaScript');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    if (!sourceCode.trim()) {
      setError('Please enter code to convert');
      return;
    }
    
    if (sourceCode.trim().length < MIN_CODE_LENGTH) {
      setError(`Code must be at least ${MIN_CODE_LENGTH} characters long`);
      return;
    }
    
    if (sourceLanguage === targetLanguage) {
      setError('Source and target languages must be different');
      return;
    }
    
    onSubmit({
      code: sourceCode,
      sourceLanguage,
      targetLanguage
    });
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    if (newCode.length <= MAX_CODE_LENGTH) {
      setSourceCode(newCode);
      setError(null);
    } else {
      setError(`Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setSourceCode(content);
          setError(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearFile = () => {
    setFileName('');
    setSourceCode('');
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
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3" role="alert" aria-live="polite">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm">Validation Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Info Alert */}
      {!sourceCode && (
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-3" role="status">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-blue-300 text-sm">You can paste code directly or upload a file to get started</p>
        </div>
      )}

      {/* Code Input */}
      <label htmlFor="code-input" className="block text-sm font-semibold text-slate-300 mb-2">
        Paste Your Code or Upload a File
      </label>
      
      {/* File Upload */}
      <div className="mb-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
        <label htmlFor="file-input" className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 transition">
          <input
            id="file-input"
            type="file"
            onChange={handleFileUpload}
            accept=".py,.js,.ts,.cpp,.c,.cs,.go,.sql,.java,.rs,.php,.rb,.swift,.kt,.scala,.r,.m,.vb,.pl,.lua,.sh,.h"
            className="hidden"
            aria-label="Upload code file"
          />
          <span className="text-sm">📁 Upload code file</span>
        </label>
        {fileName && (
          <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
            <span>✓ {fileName}</span>
            <button
              type="button"
              onClick={handleClearFile}
              className="text-red-400 hover:text-red-300 text-xs"
              aria-label="Clear uploaded file"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Textarea */}
      <textarea
        id="code-input"
        value={sourceCode}
        onChange={handleCodeChange}
        placeholder="Paste your code here... (max 50,000 characters)"
        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500 min-h-64"
        aria-label="Code input"
        aria-describedby="char-count"
      />

      {/* Character Count */}
      <div id="char-count" className="mt-3 text-xs text-slate-500">
        <span className={sourceCode.length > MAX_CODE_LENGTH * 0.9 ? 'text-yellow-400' : ''}>
          {sourceCode.length} / {MAX_CODE_LENGTH} characters
        </span>
        {sourceCode.length > 0 && (
          <span className="ml-4 text-slate-400">
            {sourceCode.split('\n').length} lines
          </span>
        )}
      </div>
    </form>
  );
}
