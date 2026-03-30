import React from 'react';
import CodeEditor from './CodeEditor';
import BugReport from './BugReport';
import ConversionStats from './ConversionStats';

export default function ResultsDisplay({ results }) {
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([results.convertedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `converted.${getFileExtension(results.targetLanguage)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (language) => {
    const extensions = {
      'Python': 'py',
      'JavaScript': 'js',
      'TypeScript': 'ts',
      'C++': 'cpp',
      'C#': 'cs',
      'Go': 'go',
      'SQL': 'sql',
      'Java': 'java',
      'Rust': 'rs',
      'PHP': 'php',
    };
    return extensions[language] || 'txt';
  };

  if (!results) return null;

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Converted Code Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🔄 Converted Code</h3>
        <CodeEditor
          code={results.convertedCode}
          language={results.targetLanguage}
          readOnly
          onDownload={handleDownload}
        />
      </div>

      {/* Statistics */}
      {results.stats && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">📊 Statistics</h3>
          <ConversionStats stats={results.stats} />
        </div>
      )}

      {/* Bug Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🐛 Bug Analysis</h3>
        <BugReport bugs={results.bugs} />
      </div>

      {/* Conversion Notes */}
      {results.notes && results.notes.length > 0 && (
        <div className="glass rounded-xl border border-slate-700 p-6 bg-purple-500/10 border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">📝 Conversion Notes</h3>
          <ul className="space-y-2">
            {results.notes.map((note, idx) => (
              <li key={idx} className="flex gap-2 text-slate-300 text-sm">
                <span className="text-purple-400">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
