import React, { useState } from 'react';
import { Upload, X, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import type { LogoConfig, ErrorCorrectionLevel } from '../../types/qr';
import { BRAND_ICON_PRESETS, getSvgDataUrl } from '../../utils/presets';
import { bakeLogoWithBackground } from '../../utils/qrGenerator';

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
  const [isDragging, setIsDragging] = useState(false);
  const [rawSrc, setRawSrc] = useState<string>(logo.src);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const applyLogo = async (src: string, base: LogoConfig = logo) => {
    const baked = await bakeLogoWithBackground(src, base.backgroundType, base.backgroundColor);
    setRawSrc(src);
    onLogoChange({ ...base, src: baked });
    if (errorCorrectionLevel !== 'H') onEccChange('H');
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file format. Use PNG, SVG, WEBP, or JPG.');
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('File exceeds 5MB limit.');
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      void applyLogo(src);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const selectBrandPreset = (svg: string) => {
    const src = getSvgDataUrl(svg);
    void applyLogo(src);
  };

  const removeLogo = () => {
    setRawSrc('');
    onLogoChange({ ...logo, src: '' });
  };

  const changeBackground = async (key: 'backgroundType' | 'backgroundColor', val: string) => {
    const next = { ...logo, [key]: val };
    onLogoChange(next);
    if (rawSrc || logo.src) {
      const source = rawSrc || logo.src;
      const baked = await bakeLogoWithBackground(source, next.backgroundType, next.backgroundColor);
      onLogoChange({ ...next, src: baked });
    }
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
                <img src={logo.src} alt="Active QR logo" className="max-w-full max-h-full object-contain" />
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
            role="button"
            tabIndex={0}
            aria-label="Upload logo image. Drag and drop supported."
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-800/30 group ${
              isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/60 hover:bg-slate-800/60'
            }`}
          >
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
            <p className="text-xs font-medium text-slate-300">
              {isDragging ? 'Drop image to use as logo' : 'Click or drag & drop logo image'}
            </p>
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
        {uploadError && (
          <p className="mt-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2" role="alert">
            {uploadError}
          </p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label htmlFor="logo-bg-type" className="block text-xs font-medium text-slate-300 mb-1">
            Logo background
          </label>
          <select
            id="logo-bg-type"
            value={logo.backgroundType}
            onChange={(e) => void changeBackground('backgroundType', e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="none">None (transparent)</option>
            <option value="white-circle">White circle</option>
            <option value="white-square">White rounded square</option>
            <option value="custom-circle">Tinted circle</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Background color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={logo.backgroundColor}
              onChange={(e) => void changeBackground('backgroundColor', e.target.value)}
              disabled={logo.backgroundType === 'none'}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-0.5 disabled:opacity-40"
              aria-label="Logo background color"
            />
            <span className="text-xs font-mono text-slate-300">{logo.backgroundColor}</span>
          </div>
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
              aria-label="Logo size scale"
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
              aria-label="Logo margin"
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
