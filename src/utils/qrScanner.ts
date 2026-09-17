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
 * Validates whether a rendered canvas containing a QR code is scannable
 * and matches the expected payload text.
 */
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
