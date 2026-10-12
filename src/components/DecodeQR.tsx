import React, { useEffect, useRef, useState } from 'react';
import { X, ScanLine, Upload, Copy, Check, ExternalLink, ArrowRight, AlertTriangle, Camera, ImagePlus, RotateCcw } from 'lucide-react';
import jsQR from 'jsqr';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { detectFramePayload, liveScanErrorMessage, supportsLiveScan } from '../utils/qrScanner';

interface DecodeQRProps {
  isOpen: boolean;
  onClose: () => void;
  onUsePayload: (text: string) => void;
}

const MAX_DIM = 1600;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const SCAN_W = 640;
const SCAN_INTERVAL_MS = 280;

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

const stopStream = (stream: MediaStream | null) => {
  try {
    stream?.getTracks().forEach((t) => t.stop());
  } catch {
    // ignore
  }
};

export const DecodeQR: React.FC<DecodeQRProps> = ({ isOpen, onClose, onUsePayload }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastScanRef = useRef<number>(0);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [isDragging, setIsDragging] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decoded, setDecoded] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [camState, setCamState] = useState<'idle' | 'starting' | 'live' | 'blocked'>('idle');
  const cameraSupported = supportsLiveScan();

  useModalBehavior(isOpen, dialogRef, onClose);

  // Reset per open; default to camera when supported.
  useEffect(() => {
    if (!isOpen) return;
    setDecoded(null);
    setError(null);
    setFileName('');
    setCopied(false);
    setMode(cameraSupported ? 'camera' : 'upload');
    setCamState('idle');
  }, [isOpen, cameraSupported]);

  // Live camera lifecycle: start on camera tab, stop on tab switch / close.
  useEffect(() => {
    if (!isOpen || mode !== 'camera' || !cameraSupported) return;
    let cancelled = false;
    const videoEl = videoRef.current;
    setCamState('starting');
    setError(null);

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stopStream(stream);
          return;
        }
        streamRef.current = stream;
        const video = videoEl;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        if (!cancelled) setCamState('live');
        lastScanRef.current = 0;

        const loop = async (now: number) => {
          if (cancelled) return;
          try {
            const v = videoRef.current;
            const canvas = scanCanvasRef.current;
            if (v && canvas && v.readyState >= 2 && v.videoWidth > 0) {
              if (now - lastScanRef.current >= SCAN_INTERVAL_MS) {
                lastScanRef.current = now;
                const scale = Math.min(1, SCAN_W / v.videoWidth);
                const w = Math.max(1, Math.round(v.videoWidth * scale));
                const h = Math.max(1, Math.round(v.videoHeight * scale));
                if (canvas.width !== w || canvas.height !== h) {
                  canvas.width = w;
                  canvas.height = h;
                }
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                  ctx.drawImage(v, 0, 0, w, h);
                  const payload = await detectFramePayload(canvas, ctx, w, h);
                  if (payload && !cancelled) {
                    setDecoded(payload);
                    setFileName('live camera');
                    setCamState('idle');
                    stopStream(streamRef.current);
                    streamRef.current = null;
                    return; // stop loop on success
                  }
                }
              }
            }
          } catch {
            // Keep scanning — transient frame errors are normal.
          }
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        if (!cancelled) {
          setCamState('blocked');
          setError(liveScanErrorMessage(err));
        }
      }
    };
    void start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      stopStream(streamRef.current);
      streamRef.current = null;
      if (videoEl) videoEl.srcObject = null;
    };
  }, [isOpen, mode, cameraSupported]);

  // Stop camera when the dialog closes.
  useEffect(() => {
    if (!isOpen) {
      cancelAnimationFrame(rafRef.current);
      stopStream(streamRef.current);
      streamRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const restartCamera = () => {
    setDecoded(null);
    setError(null);
    setFileName('');
    // Flip through idle to retrigger the lifecycle effect.
    setCamState('idle');
    setMode('upload');
    requestAnimationFrame(() => setMode('camera'));
  };

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
      aria-label="Scan a QR code"
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
              <h3 className="text-lg font-bold text-[#241E1B]">Scan QR</h3>
              <p className="text-xs text-[#241E1B]/70">Point your camera or drop a photo. Read fully on-device.</p>
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

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FFF8F3] border-2 border-[#241E1B]" role="tablist" aria-label="Scan mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'camera'}
            onClick={() => setMode('camera')}
            disabled={!cameraSupported}
            title={cameraSupported ? 'Scan with camera' : 'Camera API unavailable in this browser'}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold transition-all disabled:opacity-40 ${
              mode === 'camera' ? 'bg-[#241E1B] text-[#FFF8F3]' : 'text-[#241E1B]/70 hover:text-[#241E1B]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Live camera
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'upload'}
            onClick={() => setMode('upload')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold transition-all ${
              mode === 'upload' ? 'bg-[#241E1B] text-[#FFF8F3]' : 'text-[#241E1B]/70 hover:text-[#241E1B]'
            }`}
          >
            <ImagePlus className="w-3.5 h-3.5" /> Upload image
          </button>
        </div>

        {mode === 'camera' && cameraSupported && (
          <div className="space-y-2">
            <div className="relative border-2 border-[#241E1B] bg-[#241E1B] overflow-hidden">
              <video ref={videoRef} playsInline muted className="w-full aspect-video object-cover" aria-label="Live camera preview" />
              {/* Viewfinder overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-[#E8B84B] relative">
                  <span className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-[#FFF8F3]" />
                  <span className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-[#FFF8F3]" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-[#FFF8F3]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-[#FFF8F3]" />
                </div>
              </div>
              {camState === 'starting' && (
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold bg-[#241E1B] text-[#E8B84B] px-2.5 py-1 animate-pulse" role="status">
                  Starting camera…
                </p>
              )}
              {camState === 'live' && !decoded && (
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold bg-[#16564F] text-[#FFF8F3] px-2.5 py-1 animate-pulse" role="status">
                  Point at a QR code…
                </p>
              )}
            </div>
            <canvas ref={scanCanvasRef} className="hidden" aria-hidden="true" />
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-[#241E1B]/60">Native detector first, jsQR fallback. Nothing leaves your device.</p>
              {decoded && (
                <button
                  type="button"
                  onClick={restartCamera}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold border border-[#241E1B] hover:bg-[#241E1B] hover:text-[#FFF8F3] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Scan again
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'upload' && (
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
        )}

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
