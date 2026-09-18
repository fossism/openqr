import React, { useRef, useState } from 'react';
import { X, ScanLine, Upload, Copy, Check, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import jsQR from 'jsqr';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface DecodeQRProps {
  isOpen: boolean;
  onClose: () => void;
  onUsePayload: (text: string) => void;
}

const MAX_DIM = 1600;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const looksLikeImage = (file: File): boolean => {
  if (file.type) return file.type.startsWith('image/');
  // Some sources omit the MIME type entirely: judge by extension,
  // and if there is no extension either, attempt the decode anyway.
  const m = /\.([a-z0-9]+)$/i.exec(file.name);
  if (!m) return true;
  return /^(png|jpe?g|webp|gif|bmp|avif)$/i.test(m[1]);
};

const decodeImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!looksLikeImage(file)) {
      reject(new Error('That file is not an image. Use a PNG, JPG, or WebP photo of a QR code.'));
      return;
    }
    if (file.size > MAX_SIZE) {
      reject(new Error('Image exceeds 10MB. Try a smaller photo.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Could not read the image in this browser.'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
        if (code && code.data) resolve(code.data);
        else reject(new Error('No QR code found. Try a sharper, front-facing photo with the code filling the frame.'));
      } catch {
        reject(new Error('Could not read the image in this browser.'));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load that image file.'));
    };
    img.src = url;
  });
};

export const DecodeQR: React.FC<DecodeQRProps> = ({ isOpen, onClose, onUsePayload }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decoded, setDecoded] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useModalBehavior(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  const handleFile = async (file: File | undefined) => {
    if (!file || isDecoding) return;
    setIsDecoding(true);
    setError(null);
    setDecoded(null);
    setCopied(false);
    setFileName(file.name);
    try {
      const text = await decodeImageFile(file);
      setDecoded(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not decode that image.');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCopy = async () => {
    if (!decoded) return;
    try {
      await navigator.clipboard.writeText(decoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Clipboard write was blocked by the browser.');
    }
  };

  const isUrl = !!decoded && /^https?:\/\/\S+$/i.test(decoded.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241E1B]/60 backdrop-blur-md animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Scan a QR code image"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-xl bg-[#FFF8F3] border-2 border-[#241E1B] rounded-none p-6 shadow-[6px_6px_0_#241E1B] space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#241E1B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#E8B84B] text-[#241E1B] border-2 border-[#241E1B]">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#241E1B]">Scan QR Image</h3>
              <p className="text-xs text-[#241E1B]/70">Drop a photo, paste it, or pick a file. Read fully on-device.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className="p-2 rounded-none bg-[#FFF8F3] text-[#241E1B]/70 hover:bg-[#241E1B] hover:text-[#FFF8F3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a QR code image. Drag and drop or paste supported."
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
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          onPaste={(e) => {
            const file = Array.from(e.clipboardData.files).find((f) => looksLikeImage(f));
            if (file) void handleFile(file);
          }}
          className={`border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-all group ${
            isDragging ? 'border-[#16564F] bg-[#16564F]/10' : 'border-[#241E1B] hover:border-[#16564F] bg-[#FFF8F3]'
          }`}
        >
          <Upload className="w-8 h-8 text-[#241E1B] group-hover:text-[#16564F] mx-auto mb-2 transition-colors" />
          <p className="text-xs font-bold text-[#241E1B]">
            {isDragging ? 'Drop image to scan it' : 'Click, drag & drop, or paste a QR photo'}
          </p>
          <p className="text-[11px] text-[#241E1B]/60 mt-1">PNG, JPG, or WebP (max 10MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        {isDecoding && (
          <p className="text-xs font-bold text-[#241E1B] animate-pulse" role="status">
            Reading image…
          </p>
        )}

        {error && (
          <div className="bg-[#FFF8F3] border-2 border-[#241E1B]">
            <div className="bg-[#241E1B] px-3.5 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E8B84B]" />
              <h4 className="text-xs font-bold text-[#FFF8F3]">Could not decode</h4>
            </div>
            <p className="text-xs text-[#241E1B] px-3.5 py-2.5 font-medium">{error}</p>
          </div>
        )}

        {decoded && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#241E1B]">
              Decoded payload {fileName && <span className="font-normal text-[#241E1B]/60">from {fileName}</span>}
            </p>
            <p className="text-sm text-[#241E1B] font-mono bg-[#FFF8F3] border-2 border-[#241E1B] px-3.5 py-3 break-all max-h-36 overflow-y-auto">
              {decoded}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] border border-[#241E1B] text-xs font-bold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              {isUrl && (
                <a
                  href={decoded.trim()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] border border-[#241E1B] text-xs font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open link
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  onUsePayload(decoded);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-[#241E1B] hover:bg-[#16564F] text-[#FFF8F3] border-2 border-[#241E1B] text-xs font-bold transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Edit as new QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
