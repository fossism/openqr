import jsQR from 'jsqr';

export interface ScanVerificationResult {
  isScannable: boolean;
  decodedText: string | null;
  status: 'verified' | 'warning' | 'failed';
  message: string;
  matchScore: number; // 0 to 100
}

/**
 * WCAG-style contrast ratio between two hex colors (1 to 21).
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const lum = (hex: string): number => {
    const c = hex.replace('#', '');
    const full = c.length === 3 ? c.split('').map((ch) => ch + ch).join('') : c;
    const r = parseInt(full.slice(0, 2), 16) / 255;
    const g = parseInt(full.slice(2, 4), 16) / 255;
    const b = parseInt(full.slice(4, 6), 16) / 255;
    const f = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  try {
    const l1 = lum(hex1);
    const l2 = lum(hex2);
    const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 1;
  }
};

/**
 * Native BarcodeDetector is still behind a flag in some browsers and missing
 * from TS libs — declare the minimal surface we use.
 */
interface NativeDetectedBarcode {
  rawValue?: string;
}

interface NativeBarcodeDetectorInstance {
  detect(source: CanvasImageSource): Promise<NativeDetectedBarcode[]>;
}

type NativeBarcodeDetectorCtor = new (options?: { formats?: string[] }) => NativeBarcodeDetectorInstance;

const getBarcodeDetectorCtor = (): NativeBarcodeDetectorCtor | null => {
  try {
    const ctor = (window as unknown as { BarcodeDetector?: NativeBarcodeDetectorCtor }).BarcodeDetector;
    return typeof ctor === 'function' ? ctor : null;
  } catch {
    return null;
  }
};

export const supportsLiveScan = (): boolean => {
  try {
    return !!navigator.mediaDevices?.getUserMedia;
  } catch {
    return false;
  }
};

export const liveScanErrorMessage = (err: unknown): string => {
  const name = (err as { name?: string } | null)?.name ?? '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Camera blocked. Allow camera access in the browser site settings, then try again.';
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'No camera found. Use the upload tab instead.';
  }
  if (name === 'NotReadableError') {
    return 'Camera is busy in another app. Close it and try again.';
  }
  return 'Could not start the camera. Use the upload tab instead.';
};

/**
 * Decode one video frame: native BarcodeDetector first (fast path),
 * jsQR on the same pixels as fallback. Returns payload or null.
 */
export const detectFramePayload = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<string | null> => {
  const ctor = getBarcodeDetectorCtor();
  if (ctor) {
    try {
      const detector = new ctor({ formats: ['qr_code'] });
      const found = await detector.detect(canvas);
      const value = found?.[0]?.rawValue;
      if (value) return value;
    } catch {
      // Fall through to jsQR — detector may reject oversized frames.
    }
  }
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const code = jsQR(imageData.data, width, height, { inversionAttempts: 'attemptBoth' });
    return code?.data ?? null;
  } catch {
    return null;
  }
};
export const verifyQRScannability = (
  canvas: HTMLCanvasElement,
  expectedText: string
): ScanVerificationResult => {
  if (!canvas) {
    return {
      isScannable: false,
      decodedText: null,
      status: 'failed',
      message: 'Canvas reference missing',
      matchScore: 0,
    };
  }

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return {
        isScannable: false,
        decodedText: null,
        status: 'failed',
        message: 'Could not access canvas 2d context',
        matchScore: 0,
      };
    }

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) {
      return {
        isScannable: false,
        decodedText: null,
        status: 'failed',
        message: 'Canvas dimensions are 0',
        matchScore: 0,
      };
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    const qrCode = jsQR(imageData.data, width, height, {
      inversionAttempts: 'attemptBoth',
    });

    if (!qrCode) {
      return {
        isScannable: false,
        decodedText: null,
        status: 'failed',
        message: 'QR code unreadable. Raise ECC to H, reduce logo size, or improve foreground/background contrast.',
        matchScore: 0,
      };
    }

    const decoded = qrCode.data;
    const isExactMatch = decoded === expectedText;

    if (isExactMatch) {
      return {
        isScannable: true,
        decodedText: decoded,
        status: 'verified',
        message: 'Scannable and verified against live decoder',
        matchScore: 100,
      };
    } else {
      // Partial or formatted match check
      const normalize = (str: string) => str.trim().toLowerCase();
      if (normalize(decoded) === normalize(expectedText)) {
        return {
          isScannable: true,
          decodedText: decoded,
          status: 'verified',
          message: 'Scannable & Verified',
          matchScore: 95,
        };
      }

      return {
        isScannable: true,
        decodedText: decoded,
        status: 'warning',
        message: 'Scannable, but payload decoded slightly differently than input.',
        matchScore: 80,
      };
    }
  } catch (err: any) {
    return {
      isScannable: false,
      decodedText: null,
      status: 'failed',
      message: `Scanner error: ${err.message || 'Unknown issue'}`,
      matchScore: 0,
    };
  }
};
