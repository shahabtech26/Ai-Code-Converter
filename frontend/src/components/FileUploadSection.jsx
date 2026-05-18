import React, { useState } from 'react';
import { Upload, X, ArrowRightLeft, Zap, AlertCircle, CheckCircle } from 'lucide-react';

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

// File extension to language mapping
const FILE_EXTENSION_MAP = {
  'py': 'Python',
  'js': 'JavaScript',
  'jsx': 'JavaScript',
  'ts': 'TypeScript',
  'tsx': 'TypeScript',
  'cpp': 'C++',
  'cc': 'C++',
  'cxx': 'C++',
  'c++': 'C++',
  'cs': 'C#',
  'go': 'Go',
  'sql': 'SQL',
  'java': 'Java',
  'rs': 'Rust',
  'php': 'PHP',
  'rb': 'Ruby',
  'swift': 'Swift',
  'kt': 'Kotlin',
  'scala': 'Scala',
  'r': 'R',
  'm': 'MATLAB',
  'vb': 'VB.NET',
  'pl': 'Perl',
  'lua': 'Lua',
  'sh': 'Bash',
  'bash': 'Bash'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUploadSection({ onConvert, loading }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('JavaScript');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const detectLanguageFromExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return FILE_EXTENSION_MAP[ext] || 'Python';
  };

  const handleFileUpload = (file) => {
    setError(null);
    setSuccessMessage(null);
    
    if (!file) return;
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 5MB limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }
    
    // Validate file type
    const validExtensions = ['py', 'js', 'jsx', 'ts', 'tsx', 'cpp', 'cc', 'cxx', 'c++', 'cs', 'go', 'sql', 'java', 'rs', 'php', 'rb', 'swift', 'kt', 'scala', 'r', 'm', 'vb', 'pl', 'lua', 'sh', 'bash', 'c', 'h'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError(`Unsupported file type: .${ext}. Please upload a valid source code file.`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const detected = detectLanguageFromExtension(file.name);
        setUploadedFile(file);
        setFileContent(content);
        setDetectedLanguage(detected);
        setSuccessMessage(`✓ File loaded successfully. Detected language: ${detected}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleClear = () => {
    setUploadedFile(null);
    setFileContent('');
    setDetectedLanguage('Python');
    setTargetLanguage('JavaScript');
    setError(null);
    setSuccessMessage(null);
  };

  const handleSwapLanguages = () => {
    setDetectedLanguage(targetLanguage);
    setTargetLanguage(detectedLanguage);
  };

  const handleConvert = () => {
    setError(null);
    
    if (!uploadedFile) {
      setError('Please upload a file first');
      return;
    }
    
    if (!fileContent.trim()) {
      setError('Uploaded file is empty. Please provide a valid code file.');
      return;
    }
    
    if (detectedLanguage === targetLanguage) {
      setError('Source and target languages must be different');
      return;
    }
    
    onConvert({
      code: fileContent,
      sourceLanguage: detectedLanguage,
      targetLanguage,
      fileName: uploadedFile?.name
    });
  };

  return (
    <div className="glass rounded-xl border border-slate-700 p-6 h-full flex flex-col shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">📁 File Upload & Convert</h2>

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Detected Language
          </label>
          <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm flex items-center justify-between">
            <span>{detectedLanguage}</span>
            <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-1 rounded">Auto</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwapLanguages}
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
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3" role="alert" aria-live="polite">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm">Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-3" role="status" aria-live="polite">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/5'
            : 'border-slate-700 hover:border-slate-600'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Drop code file here or click to upload"
      >
        <input
          type="file"
          id="file-upload"
          onChange={handleInputChange}
          accept=".py,.js,.ts,.jsx,.tsx,.cpp,.c,.cs,.go,.sql,.java,.rs,.php,.rb,.swift,.kt,.scala,.r,.m,.vb,.pl,.lua,.sh,.bash"
          className="hidden"
        />

        {uploadedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📄</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{uploadedFile.name}</p>
                <p className="text-slate-400 text-sm">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer block">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">
              Drag and drop your code file here
            </p>
            <p className="text-slate-400 text-sm mb-3">or click to select a file</p>
            <p className="text-xs text-slate-500">
              Supported: Python, JavaScript, TypeScript, C++, C#, Go, SQL, Java, Rust, PHP, Ruby, Swift, etc.
            </p>
          </label>
        )}
      </div>

      {/* File Preview */}
      {fileContent && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            📝 Code Preview
          </label>
          <pre className="p-4 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 text-xs font-mono overflow-auto max-h-40">
            <code>{fileContent.substring(0, 500)}{fileContent.length > 500 ? '...' : ''}</code>
          </pre>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleConvert}
          disabled={!fileContent.trim() || loading}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          aria-busy={loading}
          aria-disabled={!fileContent.trim() || loading}
          title={!fileContent.trim() ? 'Upload a file first' : 'Convert code to target language'}
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              Converting...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Convert File
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          className="px-6 bg-slate-900 text-slate-300 rounded-lg font-semibold hover:bg-slate-800 hover:text-white transition border border-slate-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
