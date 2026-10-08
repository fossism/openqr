import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import type { ReactNode } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Copy, Check, ZoomIn, ZoomOut, Image as ImageIcon, Download } from 'lucide-react';
import type { QRDesignConfig } from '../types/qr';
import { createQRCodeOptions, drawFrameOnCanvas, renderQRCanvasAtSize, renderQRSvgBlob } from '../utils/qrGenerator';
import { verifyQRScannability } from '../utils/qrScanner';
import type { ScanVerificationResult } from '../utils/qrScanner';
import { copyCanvasToClipboard } from '../utils/exportUtils';
import { ScannabilityIndicator } from './ScannabilityIndicator';

export interface QRPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getSvg: () => SVGElement | null;
  getHighResCanvas: (size: number) => Promise<HTMLCanvasElement | null>;
  getSvgBlob: () => Promise<Blob | null>;
}

interface QRPreviewProps {
  config: QRDesignConfig;
  payloadText: string;
  exportPanel?: ReactNode;
}

export const QRPreview = forwardRef<QRPreviewHandle, QRPreviewProps>(
  ({ config, payloadText, exportPanel }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const finalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [copied, setCopied] = useState(false);
    const [copiedImage, setCopiedImage] = useState(false);
    const [zoom, setZoom] = useState<number>(1);
    const [showExport, setShowExport] = useState<boolean>(false);
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
      getHighResCanvas: (size: number) => renderQRCanvasAtSize(config, payloadText, size),
      getSvgBlob: () => renderQRSvgBlob(config, payloadText),
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
          // Process frame if enabled (pass transparency explicitly)
          const canvasToVerify = drawFrameOnCanvas(
            rawCanvas,
            config.frame,
            config.backgroundColor,
            config.transparentBackground
          );
          finalCanvasRef.current = canvasToVerify;

          // Replace container display with framed canvas if frame enabled
          if (config.frame.style !== 'none') {
            containerRef.current.innerHTML = '';
            canvasToVerify.style.maxWidth = '100%';
            canvasToVerify.style.height = 'auto';
            canvasToVerify.style.borderRadius = '0';
            containerRef.current.appendChild(canvasToVerify);
          } else {
            // Constrain raw canvas to the preview box (sharp, no overflow)
            rawCanvas.style.maxWidth = '100%';
            rawCanvas.style.height = 'auto';
            rawCanvas.style.borderRadius = '0';
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

    const handleCopyPayload = async () => {
      try {
        await navigator.clipboard.writeText(payloadText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    };

    const handleCopyImage = async () => {
      const canvas = finalCanvasRef.current;
      if (!canvas) return;
      const ok = await copyCanvasToClipboard(canvas);
      if (ok) {
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      }
    };

    return (
      <div className="flex flex-col items-center justify-between h-full space-y-5">
        {/* Scannability Verification Badge */}
        <div className="w-full">
          <ScannabilityIndicator result={scanResult} isScanning={isScanning} />
        </div>

        {/* QR Code Canvas Display Box */}
        <div className="relative group flex items-center justify-center p-8 rounded-none bg-[#FFF8F3] border border-[#241E1B] shadow-[4px_4px_0_#241E1B] backdrop-blur-xl transition-all hover:border-[#241E1B] w-full max-w-[380px]">
          {/* Zoom controls overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-[#FFF8F3] backdrop-blur-md rounded-none p-1 border border-[#241E1B]/30 z-10">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.15, 1.4))}
              className="p-1.5 text-[#241E1B] hover:text-[#FFF8F3] rounded-none hover:bg-[#16564F]"
              title="Zoom In"
              aria-label="Zoom preview in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
              className="p-1.5 text-[#241E1B] hover:text-[#FFF8F3] rounded-none hover:bg-[#16564F]"
              title="Zoom Out"
              aria-label="Zoom preview out"
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

        {/* Primary Download CTA + inline export options */}
        {exportPanel && (
          <button
            type="button"
            onClick={() => setShowExport((v) => !v)}
            aria-expanded={showExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#241E1B] hover:bg-[#E8B84B] hover:text-[#241E1B] text-[#FFF8F3] font-bold text-sm border-2 border-[#241E1B] shadow-[4px_4px_0_#241E1B] transition-all"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
        )}
        {exportPanel && showExport && (
          <div className="w-full p-4 rounded-none bg-[#FFF8F3] border-2 border-[#241E1B] shadow-[4px_4px_0_#241E1B]">
            {exportPanel}
          </div>
        )}

        {/* Payload Quick Bar */}
        <div className="w-full p-3 rounded-none bg-[#FFF8F3] border border-[#241E1B] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate pr-2 min-w-0">
            <span className="text-[#241E1B]/60 font-medium shrink-0">Payload:</span>
            <span className="text-[#241E1B] font-mono truncate">{payloadText || 'https://openqr.io'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyImage}
              title="Copy QR image to clipboard"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] font-medium transition-colors"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-[#241E1B]" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedImage ? 'Copied' : 'Image'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyPayload}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] text-[#241E1B] font-medium shrink-0 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#241E1B]" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

QRPreview.displayName = 'QRPreview';
