import React from 'react';
import { Globe } from 'lucide-react';

interface UrlFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const UrlForm: React.FC<UrlFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Website URL or Destination Link
        </label>
        <div className="relative rounded-xl shadow-sm">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/my-page"
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-1">
        <span className="text-slate-500 font-medium">Quick suggestions:</span>
        <button
          type="button"
          onClick={() => onChange('https://github.com')}
          aria-label="Use GitHub URL suggestion"
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50"
        >
          github.com
        </button>
        <button
          type="button"
          onClick={() => onChange('https://linkedin.com')}
          aria-label="Use LinkedIn URL suggestion"
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50"
        >
          linkedin.com
        </button>
        <button
          type="button"
          onClick={() => onChange('https://youtube.com')}
          aria-label="Use YouTube URL suggestion"
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50"
        >
          youtube.com
        </button>
      </div>
    </div>
  );
};
