import React from 'react';
import { Frame as FrameIcon, Type } from 'lucide-react';
import type { FrameConfig, FrameStyle } from '../../types/qr';

interface FramePickerProps {
  frame: FrameConfig;
  onChange: (frame: FrameConfig) => void;
}

export const FramePicker: React.FC<FramePickerProps> = ({ frame, onChange }) => {
  const updateField = (key: keyof FrameConfig, val: any) => {
    onChange({ ...frame, [key]: val });
  };

  const frameStyles: { id: FrameStyle; label: string }[] = [
    { id: 'none', label: 'No Frame' },
    { id: 'badge-bottom', label: 'Bottom Badge' },
    { id: 'badge-top', label: 'Top Badge' },
  ];

  return (
    <div className="space-y-5">
      {/* Frame Style Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
          <FrameIcon className="w-3.5 h-3.5 text-indigo-400" /> Frame Banner Template
        </label>
        <div className="grid grid-cols-3 gap-2">
          {frameStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => updateField('style', style.id)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                frame.style === style.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {frame.style !== 'none' && (
        <div className="space-y-4 pt-1">
          {/* Badge Text */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" /> Call to Action Text
            </label>
            <input
              type="text"
              value={frame.text}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="SCAN ME"
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Quick Preset CTA Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {['SCAN ME', 'CONNECT WIFI', 'PAY HERE', 'FOLLOW US', 'VIEW MENU', 'DOWNLOAD APP'].map((cta) => (
              <button
                key={cta}
                type="button"
                onClick={() => updateField('text', cta)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/50 transition-colors"
              >
                {cta}
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Frame Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={frame.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.textColor}
                  onChange={(e) => updateField('textColor', e.target.value)}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={frame.textColor}
                  onChange={(e) => updateField('textColor', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
