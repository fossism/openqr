import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Copy, Check, ZoomIn, ZoomOut } from 'lucide-react';
import type { QRDesignConfig } from '../types/qr';
import { createQRCodeOptions, drawFrameOnCanvas } from '../utils/qrGenerator';
import { verifyQRScannability } from '../utils/qrScanner';
import type { ScanVerificationResult } from '../utils/qrScanner';
import { ScannabilityIndicator } from './ScannabilityIndicator';

export interface QRPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getSvg: () => SVGElement | null;
}

interface QRPreviewProps {
  config: QRDesignConfig;
  payloadText: string;
}

export const QRPreview = forwardRef<QRPreviewHandle, QRPreviewProps>(
  ({ config, payloadText }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const finalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [copied, setCopied] = useState(false);
    const [zoom, setZoom] = useState<number>(1);
    const [scanResult, setScanResult] = useState<ScanVerificationResult>({
      isScannable: false,
      decodedText: null,
      status: 'failed',
      message: 'Initial rendering...',
      matchScore: 0,
    });
    const [isScanning, setIsScanning] = useState<boolean>(true);

    useImperativeHandle(ref, () => ({
      getCanvas: () => finalCanvasRef.current,
      getSvg: () => containerRef.current?.querySelector('svg') || null,
    }));

    // Initialize or update QR instance
    useEffect(() => {
      if (!containerRef.current) return;

      const options = createQRCodeOptions(config, payloadText);
      const qr = new QRCodeStyling(options);

      containerRef.current.innerHTML = '';
      qr.append(containerRef.current);

      // Perform frame composition and verification after short tick for canvas render
      const timer = setTimeout(() => {
        if (!containerRef.current) return;
        const rawCanvas = containerRef.current.querySelector('canvas');
        if (rawCanvas) {
          // Process frame if enabled
          const canvasToVerify = drawFrameOnCanvas(rawCanvas, config.frame, config.backgroundColor);
          finalCanvasRef.current = canvasToVerify;

          // Replace container display with framed canvas if frame enabled
          if (config.frame.style !== 'none') {
            containerRef.current.innerHTML = '';
            canvasToVerify.style.maxWidth = '100%';
            canvasToVerify.style.height = 'auto';
            canvasToVerify.style.borderRadius = '16px';
            containerRef.current.appendChild(canvasToVerify);
          }

          // Run scan verification
          setIsScanning(true);
          const result = verifyQRScannability(canvasToVerify, payloadText);
          setScanResult(result);
          setIsScanning(false);
        }
      }, 150);

      return () => clearTimeout(timer);
    }, [config, payloadText]);

    const handleCopyPayload = () => {
      navigator.clipboard.writeText(payloadText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="flex flex-col items-center justify-between h-full space-y-6">
        {/* Scannability Verification Badge */}
        <div className="w-full">
          <ScannabilityIndicator result={scanResult} isScanning={isScanning} />
        </div>

        {/* QR Code Canvas Display Box */}
        <div className="relative group flex items-center justify-center p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition-all hover:border-slate-700/80 w-full max-w-[380px]">
          {/* Zoom controls overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/80 backdrop-blur-md rounded-xl p-1 border border-slate-700/60 z-10">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.15, 1.4))}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={containerRef}
            className="flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>

        {/* Payload Quick Bar */}
        <div className="w-full p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="text-slate-500 font-medium shrink-0">Payload:</span>
            <span className="text-slate-300 font-mono truncate">{payloadText || 'https://openqr.io'}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyPayload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    );
  }
);

QRPreview.displayName = 'QRPreview';
