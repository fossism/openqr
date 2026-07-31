import React from 'react';
import { Square, Circle, Sparkles } from 'lucide-react';
import type { DotStyle, CornerSquareStyle, CornerDotStyle } from '../../types/qr';

interface StylePickerProps {
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  onChange: (key: string, value: any) => void;
}

export const StylePicker: React.FC<StylePickerProps> = ({
  dotStyle,
  cornerSquareStyle,
  cornerDotStyle,
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
    </div>
  );
};
