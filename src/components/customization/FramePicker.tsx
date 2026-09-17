import React from 'react';
import { Frame as FrameIcon, Type } from 'lucide-react';
import type { FrameConfig, FrameStyle } from '../../types/qr';

interface FramePickerProps {
  frame: FrameConfig;
  onChange: (frame: FrameConfig) => void;
}

export const FramePicker: React.FC<FramePickerProps> = ({ frame, onChange }) => {
  const updateField = (key: keyof FrameConfig, val: string | number) => {
    onChange({ ...frame, [key]: val });
  };

  const frameStyles: { id: FrameStyle; label: string; hint: string }[] = [
    { id: 'none', label: 'No Frame', hint: 'Bare QR' },
    { id: 'badge-bottom', label: 'Bottom Badge', hint: 'CTA below' },
    { id: 'badge-top', label: 'Top Badge', hint: 'CTA above' },
    { id: 'card-rounded', label: 'Sharp Card', hint: 'Minimal border' },
    { id: 'ticket', label: 'Ticket Stub', hint: 'Perforated' },
  ];

  const hasBadge = frame.style === 'badge-top' || frame.style === 'badge-bottom' || frame.style === 'ticket';

  return (
    <div className="space-y-5">
      {/* Frame Style Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#241E1B]/70 mb-2 flex items-center gap-2">
          <FrameIcon className="w-3.5 h-3.5 text-[#241E1B]" /> Frame Banner Template
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {frameStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => updateField('style', style.id)}
              title={style.hint}
              className={`px-3 py-2.5 rounded-none border text-xs font-medium transition-all ${
                frame.style === style.id
                  ? 'bg-[#16564F]/10 border-[#241E1B] text-[#241E1B] shadow-[2px_2px_0_#241E1B]'
                  : 'bg-[#FFF8F3] border-[#241E1B]/30 text-[#241E1B]/70 hover:text-[#241E1B]'
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
          {hasBadge && (
            <>
              <div>
                <label htmlFor="frame-text" className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#241E1B]" /> Call to Action Text
                </label>
                <input
                  id="frame-text"
                  type="text"
                  value={frame.text}
                  onChange={(e) => updateField('text', e.target.value)}
                  placeholder="SCAN ME"
                  maxLength={42}
                  className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-2.5 text-[#241E1B] text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#16564F]"
                />
              </div>

              {/* Quick Preset CTA Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {['SCAN ME', 'CONNECT WIFI', 'PAY HERE', 'FOLLOW US', 'VIEW MENU', 'DOWNLOAD APP'].map((cta) => (
                  <button
                    key={cta}
                    type="button"
                    onClick={() => updateField('text', cta)}
                    className="px-2.5 py-1 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[11px] text-[#241E1B] border border-[#241E1B]/30 transition-colors"
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#241E1B] mb-1">
                Frame Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded-none bg-[#FFF8F3] border border-[#241E1B] cursor-pointer p-0.5"
                  aria-label="Frame background color"
                />
                <input
                  type="text"
                  value={frame.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-2 py-1 text-xs font-mono text-[#241E1B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#241E1B] mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.textColor}
                  onChange={(e) => updateField('textColor', e.target.value)}
                  className="w-8 h-8 rounded-none bg-[#FFF8F3] border border-[#241E1B] cursor-pointer p-0.5"
                  aria-label="Frame text color"
                />
                <input
                  type="text"
                  value={frame.textColor}
                  onChange={(e) => updateField('textColor', e.target.value)}
                  className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-2 py-1 text-xs font-mono text-[#241E1B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#241E1B] mb-1">
                Border Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.borderColor}
                  onChange={(e) => updateField('borderColor', e.target.value)}
                  className="w-8 h-8 rounded-none bg-[#FFF8F3] border border-[#241E1B] cursor-pointer p-0.5"
                  aria-label="Frame border color"
                />
                <input
                  type="text"
                  value={frame.borderColor}
                  onChange={(e) => updateField('borderColor', e.target.value)}
                  className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-2 py-1 text-xs font-mono text-[#241E1B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {hasBadge && (
            <div>
              <div className="flex justify-between text-xs text-[#241E1B]/70 mb-1">
                <span>Badge text size</span>
                <span>{frame.fontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="28"
                value={frame.fontSize}
                onChange={(e) => updateField('fontSize', parseInt(e.target.value, 10))}
                className="w-full accent-[#16564F]"
                aria-label="Frame font size"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
