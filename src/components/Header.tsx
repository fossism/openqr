import React from 'react';
import { QrCode, ScanLine, Palette, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPresets, onOpenScan }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-[#E8B84B] bg-[#241E1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E8B84B] text-[#241E1B] border-2 border-[#FFF8F3]">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg tracking-tight text-[#FFF8F3]">OpenQR</h1>
              <span className="hidden min-[500px]:flex px-2 py-0.5 bg-[#16564F] text-[#FFF8F3] text-[10px] font-bold border-2 border-[#E8B84B] items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#E8B84B]" /> No Login / 100% Client-Side
              </span>
            </div>
            <p className="text-[11px] text-[#FFF8F3]/70 hidden sm:block">
              Open-source, highly customizable & reliable QR code generator
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#16564F] hover:bg-[#FFF8F3] hover:text-[#241E1B] text-[#FFF8F3] border-2 border-[#FFF8F3] text-xs font-bold transition-all"
          >
            <Palette className="w-3.5 h-3.5 text-[#E8B84B]" />
            <span className="hidden sm:inline">Theme Presets</span>
          </button>

          <button
            type="button"
            onClick={onOpenScan}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E8B84B] hover:bg-[#FFF8F3] text-[#241E1B] border-2 border-[#FFF8F3] text-xs font-bold transition-all"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          <a
            href="https://github.com/fossism/openqr"
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-[#241E1B] hover:bg-[#16564F] text-[#FFF8F3] border-2 border-[#FFF8F3] transition-colors"
            title="OpenQR source code on GitHub"
            aria-label="OpenQR source code on GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
