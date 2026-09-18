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
        <label htmlFor="url-input" className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#241E1B]" />
          Website URL or Destination Link
        </label>
        <div className="relative rounded-none shadow-[2px_2px_0_#241E1B]">
          <input
            id="url-input"
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/my-page"
            inputMode="url"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] focus:border-[#241E1B] transition-all font-mono text-sm"
          />
        </div>
        {trimmed && !hasScheme && (
          <button
            type="button"
            onClick={() => onChange(`https://${trimmed}`)}
            className="mt-2 flex items-center gap-1.5 text-xs text-[#241E1B] bg-[#241E1B]/5 border border-[#241E1B] rounded-none px-3 py-2 hover:bg-[#241E1B]/5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Missing https://: click to fix to https://{trimmed}
          </button>
        )}
        {trimmed && hasScheme && (
          <p className={`mt-2 flex items-center gap-1.5 text-xs ${valid ? 'text-[#241E1B]' : 'text-[#241E1B]'}`}>
            {valid ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {valid ? 'URL looks valid.' : 'This URL looks incomplete: check the domain.'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[#241E1B]/70 pt-1">
        <span className="text-[#241E1B]/60 font-medium">Quick suggestions:</span>
        <button
          type="button"
          onClick={() => onChange('https://github.com')}
          aria-label="Use GitHub URL suggestion"
          className="px-2.5 py-1 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] transition-colors border border-[#241E1B]/30"
        >
          github.com
        </button>
        <button
          type="button"
          onClick={() => onChange('https://linkedin.com')}
          aria-label="Use LinkedIn URL suggestion"
          className="px-2.5 py-1 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] transition-colors border border-[#241E1B]/30"
        >
          linkedin.com
        </button>
        <button
          type="button"
          onClick={() => onChange('https://youtube.com')}
          aria-label="Use YouTube URL suggestion"
          className="px-2.5 py-1 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] transition-colors border border-[#241E1B]/30"
        >
          youtube.com
        </button>
      </div>
    </div>
  );
};
