import React from 'react';
import { QrCode, Layers, Palette, ShieldCheck, Code } from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenBatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPresets, onOpenBatch }) => {
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
            onClick={onOpenBatch}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E8B84B] hover:bg-[#FFF8F3] text-[#241E1B] border-2 border-[#FFF8F3] text-xs font-bold transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Batch Generator</span>
          </button>

          <a
            href="https://github.com/fossism/openqr"
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-[#241E1B] hover:bg-[#16564F] text-[#FFF8F3] border-2 border-[#FFF8F3] transition-colors"
            title="OpenQR Open Source Code"
            aria-label="OpenQR GitHub repository"
          >
            <Code className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
