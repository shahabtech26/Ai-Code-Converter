import React from 'react';
import { Code2, Zap, Bug, BarChart3, Lock, Cpu } from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Multi-Language Support',
    description: 'Convert between 20+ programming languages seamlessly'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get conversion results in milliseconds'
  },
  {
    icon: Bug,
    title: 'Smart Bug Detection',
    description: 'AI-powered bug detection and vulnerability scanning'
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Conversion stats and quality metrics'
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your code is never stored or shared'
  },
  {
    icon: Cpu,
    title: 'Auto-Detection',
    description: 'Automatically detect source programming language'
  }
];

export default function FeatureHighlights() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">✨ Why CodeAlchemy?</h2>
          <p className="text-slate-400 text-lg">Powerful features to transform your code</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition hover:bg-slate-900/50"
              >
                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg w-fit mb-4">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
