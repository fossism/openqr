import React from 'react';
import { Square, Circle, Sparkles, Maximize2 } from 'lucide-react';
import type { DotStyle, CornerSquareStyle, CornerDotStyle } from '../../types/qr';

interface StylePickerProps {
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  canvasSize: number;
  margin: number;
  onChange: (key: string, value: string | number) => void;
}

export const StylePicker: React.FC<StylePickerProps> = ({
  dotStyle,
  cornerSquareStyle,
  cornerDotStyle,
  canvasSize,
  margin,
  onChange,
}) => {
  const dotStyles: { id: DotStyle; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'dots', label: 'Dots' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'extra-rounded', label: 'Pill' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy Smooth' },
  ];

  const cornerSquareStyles: { id: CornerSquareStyle; label: string }[] = [
    { id: 'square', label: 'Sharp Square' },
    { id: 'extra-rounded', label: 'Smooth Rounded' },
    { id: 'dot', label: 'Circular' },
  ];

  const cornerDotStyles: { id: CornerDotStyle; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'dot', label: 'Circle' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Pattern Modules
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {dotStyles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange('dotStyle', item.id)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                dotStyle === item.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
          <Square className="w-3.5 h-3.5 text-indigo-400" /> Corner Outer Frame
        </label>
        <div className="grid grid-cols-3 gap-2">
          {cornerSquareStyles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange('cornerSquareStyle', item.id)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                cornerSquareStyle === item.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
          <Circle className="w-3.5 h-3.5 text-indigo-400" /> Corner Inner Eye
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cornerDotStyles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange('cornerDotStyle', item.id)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                cornerDotStyle === item.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> Canvas & Quiet Zone
        </p>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Preview size</span>
            <span className="font-mono text-indigo-300">{canvasSize} px</span>
          </div>
          <input
            type="range"
            min={256}
            max={800}
            step={8}
            value={canvasSize}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              onChange('width', v);
              onChange('height', v);
            }}
            className="w-full accent-indigo-500"
            aria-label="QR preview size"
          />
          <p className="text-[11px] text-slate-500 mt-1">Preview only. Final export uses Export resolution.</p>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Quiet-zone margin</span>
            <span className="font-mono text-indigo-300">{margin}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            value={margin}
            onChange={(e) => onChange('margin', parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500"
            aria-label="QR quiet zone margin"
          />
          <p className="text-[11px] text-slate-500 mt-1">Keep at least 10px for reliable scanning.</p>
        </div>
      </div>
    </div>
  );
};
