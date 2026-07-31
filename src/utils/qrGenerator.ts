import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  Options as QRCodeStylingOptions,
} from 'qr-code-styling';
import type { QRDesignConfig } from '../types/qr';

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
  data: string
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
 * Draws frame badge overlay around canvas if frame is enabled
 */
export const drawFrameOnCanvas = (
  rawCanvas: HTMLCanvasElement,
  frameConfig: QRDesignConfig['frame'],
  bgColor: string = '#ffffff'
): HTMLCanvasElement => {
  if (frameConfig.style === 'none') {
    return rawCanvas;
  }

  const qrWidth = rawCanvas.width;
  const qrHeight = rawCanvas.height;
  const framePadding = 24;
  const badgeHeight = 44;

  const totalWidth = qrWidth + framePadding * 2;
  const totalHeight = qrHeight + framePadding * 2 + badgeHeight;

  const framedCanvas = document.createElement('canvas');
  framedCanvas.width = totalWidth;
  framedCanvas.height = totalHeight;
  const ctx = framedCanvas.getContext('2d');
  if (!ctx) return rawCanvas;

  // Background card with rounded corners
  const radius = 16;
  ctx.fillStyle = frameConfig.backgroundColor || '#4f46e5';
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(totalWidth - radius, 0);
  ctx.quadraticCurveTo(totalWidth, 0, totalWidth, radius);
  ctx.lineTo(totalWidth, totalHeight - radius);
  ctx.quadraticCurveTo(totalWidth, totalHeight, totalWidth - radius, totalHeight);
  ctx.lineTo(radius, totalHeight);
  ctx.quadraticCurveTo(0, totalHeight, 0, totalHeight - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Border line
  ctx.lineWidth = 4;
  ctx.strokeStyle = frameConfig.borderColor || '#3730a3';
  ctx.stroke();

  // Draw inner white container for QR code
  const innerMargin = 12;
  const innerX = innerMargin;
  const isTopBadge = frameConfig.style === 'badge-top';
  const innerY = isTopBadge ? badgeHeight + innerMargin : innerMargin;

  ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, totalWidth - innerMargin * 2, qrHeight + framePadding, 12);
  ctx.fill();

  // Draw QR canvas image inside
  const qrX = framePadding;
  const qrY = isTopBadge ? badgeHeight + framePadding / 2 + innerMargin : framePadding;
  ctx.drawImage(rawCanvas, qrX, qrY);

  // Draw Badge Text
  ctx.fillStyle = frameConfig.textColor || '#ffffff';
  ctx.font = `bold ${frameConfig.fontSize || 16}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textY = isTopBadge 
    ? (badgeHeight + innerMargin) / 2 
    : totalHeight - badgeHeight / 2 - 4;

  ctx.fillText(frameConfig.text.toUpperCase(), totalWidth / 2, textY);

  return framedCanvas;
};
