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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Preset aesthetic themes"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Preset Aesthetic Themes</h3>
              <p className="text-xs text-slate-400">Select a curated theme to transform your QR code design</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
              className="group cursor-pointer p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/60 transition-all flex flex-col justify-between text-left"
            >
              <span className="flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center shrink-0 border border-white/10"
                  style={{ background: theme.previewGradient }}
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {theme.name}
                  </span>
                  <span className="block text-xs text-slate-400">{theme.description}</span>
                </span>
              </span>

              <span className="flex justify-end pt-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 text-xs font-medium border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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
