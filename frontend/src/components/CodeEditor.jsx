import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

export default function CodeEditor({ code, language, readOnly = false, onCopy = null, onDownload = null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy && onCopy();
  };

  return (
    <div className="glass rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{language}</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code Area */}
      <pre className="p-4 bg-slate-950 text-slate-100 font-mono text-sm overflow-auto max-h-96">
        <code>{code}</code>
      </pre>
    </div>
  );
}
