import React from 'react';
import { Upload, X, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import type { LogoConfig, ErrorCorrectionLevel } from '../../types/qr';
import { BRAND_ICON_PRESETS, getSvgDataUrl } from '../../utils/presets';

interface LogoUploaderProps {
  logo: LogoConfig;
  errorCorrectionLevel: ErrorCorrectionLevel;
  onLogoChange: (logo: LogoConfig) => void;
  onEccChange: (ecc: ErrorCorrectionLevel) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  logo,
  errorCorrectionLevel,
  onLogoChange,
  onEccChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Invalid file format. Please upload an image file (PNG, SVG, WEBP, or JPG).');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      onLogoChange({
        ...logo,
        src,
      });

      if (errorCorrectionLevel !== 'H') {
        onEccChange('H');
      }
    };
    reader.readAsDataURL(file);
  };

  const selectBrandPreset = (svg: string) => {
    const src = getSvgDataUrl(svg);
    onLogoChange({
      ...logo,
      src,
    });
    if (errorCorrectionLevel !== 'H') {
      onEccChange('H');
    }
  };

  const removeLogo = () => {
    onLogoChange({
      ...logo,
      src: '',
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Center Logo Overlay
        </label>

        {logo.src ? (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white p-2 flex items-center justify-center shadow-md">
                <img src={logo.src} alt="Uploaded QR Logo" className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">Active Logo Image</p>
                <p className="text-[11px] text-slate-400">Scale: {Math.round(logo.scale * 100)}%</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeLogo}
              aria-label="Remove active logo"
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-800/30 hover:bg-slate-800/60 group"
          >
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
            <p className="text-xs font-medium text-slate-300">Click to upload custom logo image</p>
            <p className="text-[11px] text-slate-500 mt-1">PNG, SVG, WEBP, or JPG (Max 5MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Or select popular icon preset:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {BRAND_ICON_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectBrandPreset(item.svg)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 flex flex-col items-center gap-1 transition-all group"
            >
              <div
                className="w-6 h-6 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: item.svg }}
              />
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {logo.src && (
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Logo Size Scale</span>
              <span>{Math.round(logo.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.35"
              step="0.01"
              value={logo.scale}
              onChange={(e) => onLogoChange({ ...logo, scale: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Logo Margin / Padding</span>
              <span>{logo.margin}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              value={logo.margin}
              onChange={(e) => onLogoChange({ ...logo, margin: parseInt(e.target.value, 10) })}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-indigo-300">Reliability Guard:</span> Error Correction Level is set to{' '}
          <strong className="text-white">{errorCorrectionLevel}</strong>. When using logos, High (H - 30%) is recommended so the QR remains scannable.
          <div className="flex gap-1.5 mt-2">
            {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onEccChange(level)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  errorCorrectionLevel === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {level} {level === 'H' ? '(Recommended)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
