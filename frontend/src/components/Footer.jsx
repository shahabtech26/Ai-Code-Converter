import React from 'react';

export default function Footer() {
  return (
    <footer className="glass border-t border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">GitHub</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2026 CodeAlchemy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
