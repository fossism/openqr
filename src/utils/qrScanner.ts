import jsQR from 'jsqr';

export interface ScanVerificationResult {
  isScannable: boolean;
  decodedText: string | null;
  status: 'verified' | 'warning' | 'failed';
  message: string;
  matchScore: number; // 0 to 100
}

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
      inversionAttempts: 'dontInvert',
    });

    if (!qrCode) {
      return {
        isScannable: false,
        decodedText: null,
        status: 'failed',
        message: 'QR code unreadable by scanner. Try increasing Error Correction (H) or reducing logo size.',
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
        message: '100% Scannable & Verified by AI Engine',
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
