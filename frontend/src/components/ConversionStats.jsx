import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ConversionStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="glass rounded-xl border border-slate-700 p-6" role="region" aria-label="Conversion statistics">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">Conversion Statistics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition" role="listitem">
          <div className="text-2xl font-bold text-indigo-400" aria-label={`Lines of Code: ${stats.linesOfCode}`}>{stats.linesOfCode}</div>
          <div className="text-xs text-slate-400 mt-1">Lines of Code</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition" role="listitem">
          <div className="text-2xl font-bold text-purple-400" aria-label={`Conversion Time: ${stats.conversionTime}ms`}>{stats.conversionTime}ms</div>
          <div className="text-xs text-slate-400 mt-1">Conversion Time</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition" role="listitem">
          <div className="text-2xl font-bold text-indigo-300\" aria-label={`Accuracy: ${stats.accuracy}%`}>{stats.accuracy}%</div>
          <div className="text-xs text-slate-400 mt-1">Accuracy</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition" role="listitem">
          <div className="text-2xl font-bold text-purple-300" aria-label={`Bugs Found: ${stats.bugsFound}`}>{stats.bugsFound}</div>
          <div className="text-xs text-slate-400 mt-1">Bugs Found</div>
        </div>
      </div>
    </div>
  );
}
