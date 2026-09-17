import React from 'react';
import { Globe, AlertTriangle, Check } from 'lucide-react';
import { isValidUrl } from '../../utils/formatters';

interface UrlFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const UrlForm: React.FC<UrlFormProps> = ({ value, onChange }) => {
  const trimmed = value.trim();
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed);
  const valid = !trimmed || isValidUrl(trimmed);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Website URL or Destination Link
        </label>
        <div className="relative rounded-xl shadow-sm">
          <input
            id="url-input"
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/my-page"
            inputMode="url"
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono text-sm"
          />
        </div>
        {trimmed && !hasScheme && (
          <button
            type="button"
            onClick={() => onChange(`https://${trimmed}`)}
            className="mt-2 flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 hover:bg-amber-500/15 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Missing https:// — click to fix to https://{trimmed}
          </button>
        )}
        {trimmed && hasScheme && (
          <p className={`mt-2 flex items-center gap-1.5 text-xs ${valid ? 'text-emerald-300' : 'text-amber-300'}`}>
            {valid ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {valid ? 'URL looks valid.' : 'This URL looks incomplete — check the domain.'}
          </p>
        )}
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
