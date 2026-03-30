import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ConversionStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="glass rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Conversion Statistics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-indigo-400">{stats.linesOfCode}</div>
          <div className="text-xs text-slate-400 mt-1">Lines of Code</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-purple-400">{stats.conversionTime}ms</div>
          <div className="text-xs text-slate-400 mt-1">Conversion Time</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-green-400">{stats.accuracy}%</div>
          <div className="text-xs text-slate-400 mt-1">Accuracy</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-orange-400">{stats.bugsFound}</div>
          <div className="text-xs text-slate-400 mt-1">Bugs Found</div>
        </div>
      </div>
    </div>
  );
}
