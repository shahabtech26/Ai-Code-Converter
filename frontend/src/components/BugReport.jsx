import React, { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import QuestionnaireModal from './QuestionnaireModal';

export default function BugReport({ bugs }) {
  const [expandedBug, setExpandedBug] = useState(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [selectedBugIdx, setSelectedBugIdx] = useState(null);

  const bugReportQuestions = [
    {
      id: 'hasOccurred',
      type: 'multiple-choice',
      question: 'Has this bug occurred in your code?',
      options: ['Yes, confirmed', 'Not sure', 'No, not relevant'],
      required: true
    },
    {
      id: 'severity',
      type: 'multiple-choice',
      question: 'How critical is this issue for your use case?',
      options: ['Critical - breaks functionality', 'High - causes issues', 'Medium - performance impact', 'Low - minor concern'],
      required: true
    },
    {
      id: 'context',
      type: 'textarea',
      question: 'Provide any additional context or details about this bug:',
      placeholder: 'Describe your specific situation...',
      required: false
    }
  ];

  const handleReportBug = (bugIdx) => {
    setSelectedBugIdx(bugIdx);
    setIsQuestionnaireOpen(true);
  };

  const handleQuestionnaireSubmit = (answers) => {
    console.log('Bug Report Submitted:', { bug: bugs[selectedBugIdx], answers });
    alert('Thank you for your feedback! We will use this to improve our analysis.');
  };

  if (!bugs || bugs.length === 0) {
    return (
      <div className="glass rounded-xl border border-slate-700 p-6 text-center" role="status" aria-label="No bugs detected">
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
                ? 'border-red-500/35 bg-red-500/5'
                : severity === 'High'
                ? 'border-orange-500/35 bg-orange-500/5'
                : severity === 'Medium'
                ? 'border-yellow-500/35 bg-yellow-500/5'
                : 'border-blue-500/35 bg-blue-500/5'
            }`}
            aria-label={`${count} ${severity} severity bugs`}
          >
            <div className={`text-2xl font-bold ${
              severity === 'Critical'
                ? 'text-red-400'
                : severity === 'High'
                ? 'text-orange-400'
                : severity === 'Medium'
                ? 'text-yellow-400'
                : 'text-blue-400'
            }`}>{count}</div>
            <div className="text-xs text-slate-400 mt-1">{severity}</div>
          </div>
        ))}
      </div>

      {/* Bug List */}
      <div className="space-y-3">
        <p className="text-sm text-slate-400 px-1">Found {bugs.length} issue{bugs.length !== 1 ? 's' : ''}</p>
        {bugs.map((bug, idx) => (
          <div
            key={idx}
            className={`glass rounded-lg border cursor-pointer transition hover:border-slate-600 ${
              bug.severity === 'Critical'
                ? 'border-red-500/35 hover:bg-red-500/5'
                : bug.severity === 'High'
                ? 'border-orange-500/35 hover:bg-orange-500/5'
                : bug.severity === 'Medium'
                ? 'border-yellow-500/35 hover:bg-yellow-500/5'
                : 'border-blue-500/35 hover:bg-blue-500/5'
            }`}
            onClick={() => setExpandedBug(expandedBug === idx ? null : idx)}
            role="button"
            tabIndex={0}
            aria-expanded={expandedBug === idx}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpandedBug(expandedBug === idx ? null : idx);
              }
            }}
            aria-label={`${bug.severity} issue: ${bug.type} on line ${bug.line}. Click to expand details`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                        bug.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-300'
                          : bug.severity === 'High'
                          ? 'bg-orange-500/20 text-orange-300'
                          : bug.severity === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                      aria-label={`Severity: ${bug.severity}`}
                    >
                      <AlertTriangle className="w-3 h-3" />
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
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded mb-4">
                    <p className="text-sm text-indigo-300">
                      <strong>💡 Fix:</strong> {bug.suggestion || 'Review this issue carefully.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReportBug(idx)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded hover:bg-indigo-500/30 transition text-sm"
                    aria-label={`Report ${bug.severity} issue: ${bug.type}`}
                    title="Share feedback about this bug"
                  >
                    <Send className="w-4 h-4" />
                    Report Issue
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Questionnaire Modal for Bug Reporting */}
      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSubmit={handleQuestionnaireSubmit}
        title="Report Bug Issue"
        questions={bugReportQuestions}
      />
    </div>
  );
}
