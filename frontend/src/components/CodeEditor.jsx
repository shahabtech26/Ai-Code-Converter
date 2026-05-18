import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

export default function CodeEditor({ code, language, readOnly = false, onCopy = null, onDownload = null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopy && onCopy();
      })
      .catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="glass rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400" aria-label={`Language: ${language}`}>{language}</span>
        <div className="flex gap-2" role="toolbar" aria-label="Code editor actions">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
            title={copied ? 'Copied to clipboard!' : 'Copy code to clipboard'}
            aria-label="Copy code"
            aria-pressed={copied}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
              title={`Download ${language} file`}
              aria-label="Download code"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code Area */}
      <pre className="p-4 bg-slate-950 text-slate-100 font-mono text-sm overflow-auto max-h-96 rounded-b-xl" role="region" aria-label="Code output">
        <code>{code}</code>
      </pre>
    </div>
  );
}
