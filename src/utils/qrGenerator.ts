import QRCodeStyling from 'qr-code-styling';
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  Options as QRCodeStylingOptions,
} from 'qr-code-styling';
import type { QRDesignConfig } from '../types/qr';
import { DEFAULT_QR_CONFIG } from './presets';

export const mapDotStyle = (style: string): DotType => {
  switch (style) {
    case 'dots': return 'dots';
    case 'rounded': return 'rounded';
    case 'extra-rounded': return 'extra-rounded';
    case 'classy': return 'classy';
    case 'classy-rounded': return 'classy-rounded';
    case 'square':
    default: return 'square';
  }
};

export const mapCornerSquareStyle = (style: string): CornerSquareType => {
  switch (style) {
    case 'dot': return 'dot';
    case 'extra-rounded': return 'extra-rounded';
    case 'square':
    default: return 'square';
  }
};

export const mapCornerDotStyle = (style: string): CornerDotType => {
  switch (style) {
    case 'dot': return 'dot';
    case 'square':
    default: return 'square';
  }
};

export const createQRCodeOptions = (
  config: QRDesignConfig,
  data: string,
  overrides?: Partial<QRCodeStylingOptions>
): QRCodeStylingOptions => {
  const options: QRCodeStylingOptions = {
    width: config.width,
    height: config.height,
    type: 'canvas',
    data: data || 'https://openqr.io',
    margin: config.margin,
    qrOptions: {
      errorCorrectionLevel: config.errorCorrectionLevel as ErrorCorrectionLevel,
    },
    backgroundOptions: {
      color: config.transparentBackground ? 'transparent' : config.backgroundColor,
    },
    dotsOptions: {
      type: mapDotStyle(config.dotStyle),
      color: config.gradient.type === 'none' ? config.foregroundColor : undefined,
      gradient: config.gradient.type !== 'none'
        ? {
            type: config.gradient.type as 'linear' | 'radial',
            rotation: (config.gradient.rotation * Math.PI) / 180,
            colorStops: [
              { offset: 0, color: config.gradient.color1 },
              { offset: 1, color: config.gradient.color2 },
            ],
          }
        : undefined,
    },
    cornersSquareOptions: {
      type: mapCornerSquareStyle(config.cornerSquareStyle),
      color: config.cornerSquareColor || config.foregroundColor,
    },
    cornersDotOptions: {
      type: mapCornerDotStyle(config.cornerDotStyle),
      color: config.cornerDotColor || config.foregroundColor,
    },
    ...overrides,
  };

  if (config.logo.src) {
    options.image = config.logo.src;
    options.imageOptions = {
      hideBackgroundDots: true,
      imageSize: config.logo.scale,
      margin: config.logo.margin,
      crossOrigin: 'anonymous',
    };
  }

  return options;
};

/**
 * Draws frame overlay around a rendered QR canvas: sharp rectangles only (brand).
 * - badge-top / badge-bottom: colored card + CTA text
 * - card-rounded: minimal sharp card, no badge text (kept sharp per branding)
 * - ticket: badge-bottom with perforated side notches + dashed divider
 * Transparent QRs get an opaque cream inner panel when framed so they stay scannable.
 */
export const drawFrameOnCanvas = (
  rawCanvas: HTMLCanvasElement,
  frameConfig: QRDesignConfig['frame'],
  bgColor: string = '#FFF8F3',
  transparentBackground = false
): HTMLCanvasElement => {
  if (frameConfig.style === 'none') {
    return rawCanvas;
  }

  const qrWidth = rawCanvas.width;
  const qrHeight = rawCanvas.height;
  const framePadding = 24;
  const hasBadge = frameConfig.style === 'badge-top' || frameConfig.style === 'badge-bottom' || frameConfig.style === 'ticket';
  const badgeHeight = hasBadge ? 48 : 0;

  const totalWidth = qrWidth + framePadding * 2;
  const totalHeight = qrHeight + framePadding * 2 + badgeHeight;

  const framedCanvas = document.createElement('canvas');
  framedCanvas.width = totalWidth;
  framedCanvas.height = totalHeight;
  const ctx = framedCanvas.getContext('2d');
  if (!ctx) return rawCanvas;

  // Outer card: sharp rectangle, brand teal default
  ctx.fillStyle = frameConfig.backgroundColor || '#241E1B';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  ctx.lineWidth = 4;
  ctx.strokeStyle = frameConfig.borderColor || '#241E1B';
  ctx.strokeRect(2, 2, totalWidth - 4, totalHeight - 4);

  // Mustard top rule for brand
  ctx.fillStyle = '#E8B84B';
  ctx.fillRect(0, 0, totalWidth, 6);

  // Inner QR panel: always opaque when framed for scannability
  const innerMargin = 12;
  const isTopBadge = frameConfig.style === 'badge-top';
  const innerY = isTopBadge && hasBadge ? badgeHeight + innerMargin : innerMargin;
  const innerH = qrHeight + framePadding;
  const opaqueInner = transparentBackground ? '#FFF8F3' : bgColor;

  ctx.fillStyle = opaqueInner;
  ctx.fillRect(innerMargin, innerY, totalWidth - innerMargin * 2, innerH);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#241E1B';
  ctx.strokeRect(innerMargin, innerY, totalWidth - innerMargin * 2, innerH);

  const qrX = framePadding;
  const qrY = isTopBadge && hasBadge ? badgeHeight + framePadding / 2 + innerMargin : framePadding;
  ctx.drawImage(rawCanvas, qrX, qrY);

  if (hasBadge) {
    // Ticket divider + notches
    if (frameConfig.style === 'ticket') {
      const dividerY = totalHeight - badgeHeight - 6;
      ctx.strokeStyle = '#E8B84B';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(16, dividerY);
      ctx.lineTo(totalWidth - 16, dividerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Side cutouts to suggest a ticket stub (leave border gap open)
      ctx.fillStyle = '#16564F'; // erased via destination-out
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, dividerY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(totalWidth, dividerY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.fillStyle = frameConfig.textColor || '#FFF8F3';
    const fontSize = Math.min(Math.max(frameConfig.fontSize || 15, 10), 28);
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = (frameConfig.text || 'SCAN ME').toUpperCase().slice(0, 42);
    const textY = isTopBadge ? (badgeHeight + innerMargin) / 2 : totalHeight - badgeHeight / 2 - 2;
    ctx.fillText(label, totalWidth / 2, textY);
  }

  return framedCanvas;
};

/** Wait for qr-code-styling to finish painting a canvas inside a temp node. */
const waitForCanvas = async (root: HTMLElement, timeoutMs = 1200): Promise<HTMLCanvasElement | null> => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const canvas = root.querySelector('canvas');
    if (canvas && canvas.width > 0) {
      // Give the lib one extra frame to finish image/logo compositing
      await new Promise((r) => setTimeout(r, 120));
      return root.querySelector('canvas');
    }
    await new Promise((r) => setTimeout(r, 60));
  }
  return root.querySelector('canvas');
};

/**
 * Render a QR at an exact export size (e.g. 512/1024/2048/4096), including frame compositing.
 */
export const renderQRCanvasAtSize = async (
  config: QRDesignConfig,
  payload: string,
  size: number
): Promise<HTMLCanvasElement | null> => {
  const exportConfig: QRDesignConfig = {
    ...config,
    width: size,
    height: size,
  };
  const options = createQRCodeOptions(exportConfig, payload);
  const qr = new QRCodeStyling(options);
  const holder = document.createElement('div');
  holder.style.position = 'fixed';
  holder.style.left = '-9999px';
  holder.style.top = '0';
  document.body.appendChild(holder);
  try {
    qr.append(holder);
    const raw = await waitForCanvas(holder);
    if (!raw) return null;
    return drawFrameOnCanvas(raw, config.frame, config.backgroundColor, config.transparentBackground);
  } finally {
    if (document.body.contains(holder)) document.body.removeChild(holder);
  }
};

/** Render a frameless vector SVG blob for the current QR design. */
export const renderQRSvgBlob = async (
  config: QRDesignConfig,
  payload: string
): Promise<Blob | null> => {
  const options = createQRCodeOptions(config, payload, { type: 'svg', width: 1024, height: 1024 });
  const qr = new QRCodeStyling(options);
  try {
    const raw = await qr.getRawData('svg');
    if (!raw) return null;
    if (raw instanceof Blob) return raw;
    return new Blob([raw as unknown as BlobPart], { type: 'image/svg+xml' });
  } catch {
    return null;
  }
};

/** Deep-merge a saved config over defaults so nested gradient/logo/frame survive upgrades. */
export const mergeQRConfig = (saved: Partial<QRDesignConfig>): QRDesignConfig => {
  return {
    ...DEFAULT_QR_CONFIG,
    ...saved,
    gradient: { ...DEFAULT_QR_CONFIG.gradient, ...(saved.gradient ?? {}) },
    logo: { ...DEFAULT_QR_CONFIG.logo, ...(saved.logo ?? {}) },
    frame: { ...DEFAULT_QR_CONFIG.frame, ...(saved.frame ?? {}) },
  };
};

/**
 * Bake a logo background (sharp square per brand) into the image itself so
 * qr-code-styling, which has no native logo-background option, still shows one.
 */
export const bakeLogoWithBackground = (
  src: string,
  backgroundType: QRDesignConfig['logo']['backgroundType'],
  backgroundColor: string
): Promise<string> => {
  if (!src || backgroundType === 'none') return Promise.resolve(src);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const pad = 24;
        const size = Math.max(img.naturalWidth, img.naturalHeight) + pad * 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);
        ctx.fillStyle = backgroundColor || '#FFF8F3';
        const cx = size / 2;
        const cy = size / 2;
        const r = size / 2 - 4;
        if (backgroundType === 'white-circle' || backgroundType === 'custom-circle') {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp rectangle per brand guideline
          ctx.fillRect(4, 4, size - 8, size - 8);
        }
        const dx = (size - img.naturalWidth) / 2;
        const dy = (size - img.naturalHeight) / 2;
        ctx.drawImage(img, dx, dy, img.naturalWidth, img.naturalHeight);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
};
