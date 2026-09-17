import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PRESET_THEMES } from '../utils/presets';
import type { PresetTheme, QRDesignConfig } from '../types/qr';

interface PresetTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (theme: PresetTheme) => void;
  currentConfig: QRDesignConfig;
}

export const PresetTemplates: React.FC<PresetTemplatesProps> = ({
  isOpen,
  onClose,
  onSelectTheme,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FFF8F3] backdrop-blur-md animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Preset aesthetic themes"
    >
      <div className="relative w-full max-w-2xl bg-[#FFF8F3] border border-[#241E1B] rounded-none p-6 shadow-[6px_6px_0_#241E1B] space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#241E1B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#241E1B]/5 text-[#241E1B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FFF8F3]">Preset Aesthetic Themes</h3>
              <p className="text-xs text-[#241E1B]/70">Select a curated theme to transform your QR code design</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-none bg-[#FFF8F3] text-[#241E1B]/70 hover:text-[#FFF8F3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                onSelectTheme(theme);
                onClose();
              }}
              className="group cursor-pointer p-4 rounded-none bg-[#FFF8F3] hover:bg-[#FFF8F3] border border-[#241E1B]/30 hover:border-[#241E1B] transition-all flex flex-col justify-between text-left"
            >
              <span className="flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 rounded-none shadow-[3px_3px_0_#241E1B] flex items-center justify-center shrink-0 border border-[#241E1B]/30"
                  style={{ background: theme.previewGradient }}
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-bold text-[#241E1B] group-hover:text-[#241E1B] transition-colors">
                    {theme.name}
                  </span>
                  <span className="block text-xs text-[#241E1B]/70">{theme.description}</span>
                </span>
              </span>

              <span className="flex justify-end pt-2">
                <span className="px-3 py-1 rounded-none bg-[#16564F]/10 text-[#241E1B] text-xs font-medium border border-[#241E1B]/30 group-hover:bg-[#16564F] group-hover:text-[#FFF8F3] transition-colors">
                  Apply Theme
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
