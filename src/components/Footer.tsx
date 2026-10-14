import React, { useEffect, useState } from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import type { ContentType } from '../types/qr';

interface FooterProps {
  onSelectContentType: (type: ContentType) => void;
  onOpenPresets: () => void;
  onOpenScan: () => void;
  onOpenBatch: () => void;
  onResetDesign: () => void;
}

const APP_VERSION = 'v0.1.0';
const REPO_URL = 'https://github.com/fossism/openqr';

const linkCls =
  'inline-flex items-center min-h-[36px] px-1 py-1 text-xs text-[#FFF8F3]/80 hover:text-[#E8B84B] underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B84B]';

export const Footer: React.FC<FooterProps> = ({
  onSelectContentType,
  onOpenPresets,
  onOpenScan,
  onOpenBatch,
  onResetDesign,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-4 border-[#E8B84B] bg-[#241E1B] text-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + trust */}
        <div className="space-y-3">
          <p className="text-sm font-bold tracking-tight">OpenQR</p>
          <p className="text-xs text-[#FFF8F3]/70 leading-relaxed">
            Nothing you type leaves your device. Codes generate locally, no uploads, no cookies, no
            analytics.
          </p>
          <p className="flex items-center gap-2 text-xs" role="status">
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#08B74F]' : 'bg-[#E8B84B]'}`}
              aria-hidden="true"
            />
            <span className="font-medium">{isOnline ? 'Offline ready' : "You're offline — still works"}</span>
          </p>
          <p className="text-[11px] text-[#FFF8F3]/50 font-mono">
            {APP_VERSION} · Free forever (MIT) · Offline after first load
          </p>
        </div>

        {/* Create */}
        <nav aria-label="Create a QR code" className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8B84B]">Create</p>
          <ul className="flex flex-col items-start">
            {(
              [
                ['url', 'Website URL'],
                ['wifi', 'Wi-Fi login'],
                ['vcard', 'vCard contact'],
                ['event', 'Calendar event'],
              ] as Array<[ContentType, string]>
            ).map(([id, label]) => (
              <li key={id}>
                <button type="button" onClick={() => onSelectContentType(id)} className={linkCls}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Style */}
        <nav aria-label="Style the QR code" className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8B84B]">Style</p>
          <ul className="flex flex-col items-start">
            <li>
              <button type="button" onClick={onOpenPresets} className={linkCls}>
                Browse aesthetic themes
              </button>
            </li>
            <li>
              <button type="button" onClick={onResetDesign} className={linkCls}>
                Reset design
              </button>
            </li>
          </ul>
        </nav>

        {/* Tools + source */}
        <nav aria-label="Tools and source code" className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8B84B]">Tools</p>
          <ul className="flex flex-col items-start">
            <li>
              <button type="button" onClick={onOpenBatch} className={linkCls}>
                Batch generator
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenScan} className={linkCls}>
                Scan a QR code
              </button>
            </li>
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className={`${linkCls} gap-1.5 font-bold text-[#FFF8F3]`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Open source (MIT)
              </a>
            </li>
            <li>
              <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer" className={linkCls}>
                Report an issue / request a feature
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#FFF8F3]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#FFF8F3]/60">
          <p>© {year} OpenQR · Privacy-first QR studio</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8B84B]" aria-hidden="true" />
            Print tip: test-scan at ≥3 cm before bulk printing.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`${REPO_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              title="OpenQR source code is MIT licensed — free for personal and commercial use"
              className="inline-flex items-center min-h-[44px] text-[11px] font-bold text-[#FFF8F3] underline-offset-4 hover:underline hover:text-[#E8B84B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B84B]"
            >
              MIT License
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 min-h-[44px] px-2 font-bold text-[#FFF8F3] hover:text-[#E8B84B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B84B]"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
