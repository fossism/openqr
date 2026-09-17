import React from 'react';
import { Palette, Eye, RotateCw, AlertTriangle } from 'lucide-react';
import type { QRDesignConfig, GradientOptions } from '../../types/qr';
import { getContrastRatio } from '../../utils/qrScanner';

interface ColorPickerProps {
  config: QRDesignConfig;
  onChange: (key: string, value: any) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ config, onChange }) => {
  const updateGradient = (key: keyof GradientOptions, val: string | number) => {
    onChange('gradient', { ...config.gradient, [key]: val });
  };

  const contrast = config.transparentBackground
    ? null
    : getContrastRatio(config.foregroundColor, config.backgroundColor);
  const lowContrast = contrast !== null && contrast < 3;

  return (
    <div className="space-y-5">
      {/* Fill Type Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-indigo-400" /> Module Fill Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'none', label: 'Solid Color' },
            { id: 'linear', label: 'Linear Gradient' },
            { id: 'radial', label: 'Radial Gradient' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => updateGradient('type', type.id)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                config.gradient.type === type.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors input */}
      {config.gradient.type === 'none' ? (
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Module Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.foregroundColor}
              onChange={(e) => onChange('foregroundColor', e.target.value)}
              className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={config.foregroundColor}
              onChange={(e) => onChange('foregroundColor', e.target.value)}
              className="w-28 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Gradient Color 1
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.gradient.color1}
                  onChange={(e) => updateGradient('color1', e.target.value)}
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={config.gradient.color1}
                  onChange={(e) => updateGradient('color1', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Gradient Color 2
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.gradient.color2}
                  onChange={(e) => updateGradient('color2', e.target.value)}
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={config.gradient.color2}
                  onChange={(e) => updateGradient('color2', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {config.gradient.type === 'linear' && (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> Gradient Angle</span>
                <span>{config.gradient.rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={config.gradient.rotation}
                onChange={(e) => updateGradient('rotation', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Background Color & Transparent */}
      <div className="border-t border-slate-800 pt-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Background
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.backgroundColor}
              disabled={config.transparentBackground}
              onChange={(e) => onChange('backgroundColor', e.target.value)}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-0.5 disabled:opacity-40"
            />
            <span className="text-xs text-slate-300 font-mono">{config.backgroundColor}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="transparent-bg"
              checked={config.transparentBackground}
              onChange={(e) => onChange('transparentBackground', e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600"
            />
            <label htmlFor="transparent-bg" className="text-xs text-slate-300 cursor-pointer">
              Transparent Background (PNG/SVG)
            </label>
          </div>
        </div>
      </div>

      {/* Eyes / Corners Colors */}
      <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-indigo-400" /> Corner Frame Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.cornerSquareColor}
              onChange={(e) => onChange('cornerSquareColor', e.target.value)}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={config.cornerSquareColor}
              onChange={(e) => onChange('cornerSquareColor', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-indigo-400" /> Corner Dot Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.cornerDotColor}
              onChange={(e) => onChange('cornerDotColor', e.target.value)}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={config.cornerDotColor}
              onChange={(e) => onChange('cornerDotColor', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {contrast !== null && (
        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            lowContrast
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
          }`}
        >
          {!lowContrast ? (
            <Eye className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <p>
            Contrast {contrast.toFixed(2)}:1 —{' '}
            {lowContrast
              ? 'below 3:1. Scanners may fail. Darken modules or lighten background.'
              : 'good for scanning.'}
          </p>
        </div>
      )}
    </div>
  );
};
