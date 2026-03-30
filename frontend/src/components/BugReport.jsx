import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BugReport({ bugs }) {
  const [expandedBug, setExpandedBug] = useState(null);

  if (!bugs || bugs.length === 0) {
    return (
      <div className="glass rounded-xl border border-slate-700 p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-white font-semibold">Perfect! No bugs detected!</p>
        <p className="text-slate-400 text-sm mt-1">Your code looks great and ready to go.</p>
      </div>
    );
  }

  const bugStats = {
    Critical: bugs.filter(b => b.severity === 'Critical').length,
    High: bugs.filter(b => b.severity === 'High').length,
    Medium: bugs.filter(b => b.severity === 'Medium').length,
    Low: bugs.filter(b => b.severity === 'Low').length,
  };

  return (
    <div className="space-y-4">
      {/* Bug Stats */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(bugStats).map(([severity, count]) => (
          <div
            key={severity}
            className={`glass rounded-lg p-3 text-center border ${
              severity === 'Critical'
                ? 'border-red-500/30'
                : severity === 'High'
                ? 'border-orange-500/30'
                : severity === 'Medium'
                ? 'border-yellow-500/30'
                : 'border-blue-500/30'
            }`}
          >
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-xs text-slate-400 mt-1">{severity}</div>
          </div>
        ))}
      </div>

      {/* Bug List */}
      <div className="space-y-3">
        {bugs.map((bug, idx) => (
          <div
            key={idx}
            className={`glass rounded-lg border cursor-pointer transition hover:border-slate-600 ${
              bug.severity === 'Critical'
                ? 'border-red-500/30'
                : bug.severity === 'High'
                ? 'border-orange-500/30'
                : bug.severity === 'Medium'
                ? 'border-yellow-500/30'
                : 'border-blue-500/30'
            }`}
            onClick={() => setExpandedBug(expandedBug === idx ? null : idx)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        bug.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-300'
                          : bug.severity === 'High'
                          ? 'bg-orange-500/20 text-orange-300'
                          : bug.severity === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {bug.severity}
                    </span>
                    <h4 className="text-white font-semibold">{bug.type}</h4>
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{bug.description}</p>
                  <p className="text-xs text-slate-500 mt-1">Line {bug.line}</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition ${
                    expandedBug === idx ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Expanded Details */}
              {expandedBug === idx && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="bg-slate-950 p-3 rounded text-xs font-mono text-slate-300 mb-3 max-h-32 overflow-auto">
                    {bug.codeSnippet || 'No code snippet available'}
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                    <p className="text-sm text-blue-300">
                      <strong>💡 Fix:</strong> {bug.suggestion || 'Review this issue carefully.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
