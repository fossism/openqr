import type { PresetTheme, QRDesignConfig } from '../types/qr';

export const BRAND = {
  teal: '#16564F',
  mustard: '#E8B84B',
  ink: '#241E1B',
  cream: '#FFF8F3',
} as const;

export const DEFAULT_QR_CONFIG: QRDesignConfig = {
  width: 400,
  height: 400,
  margin: 10,
  errorCorrectionLevel: 'M',
  foregroundColor: '#241E1B',
  backgroundColor: '#FFF8F3',
  transparentBackground: false,
  gradient: {
    type: 'none',
    rotation: 45,
    color1: '#241E1B',
    color2: '#16564F',
  },
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerSquareColor: '#241E1B',
  cornerDotStyle: 'square',
  cornerDotColor: '#241E1B',
  logo: {
    src: '',
    scale: 0.22,
    margin: 4,
    backgroundType: 'white-circle',
    backgroundColor: '#FFF8F3',
  },
  frame: {
    style: 'none',
    text: 'SCAN ME',
    textColor: '#FFF8F3',
    backgroundColor: '#241E1B',
    borderColor: '#241E1B',
    fontSize: 14,
  },
};

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'classic-ink',
    name: 'Classic Ink',
    description: 'Ink modules on cream — default brand',
    previewGradient: 'linear-gradient(135deg, #241E1B 0%, #241E1B 100%)',
    config: {
      foregroundColor: '#241E1B',
      backgroundColor: '#FFF8F3',
      cornerSquareColor: '#241E1B',
      cornerDotColor: '#241E1B',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#241E1B',
        color2: '#241E1B',
      },
    },
  },
  {
    id: 'inverse-ink',
    name: 'Inverse Ink',
    description: 'Cream modules on solid ink',
    previewGradient: 'linear-gradient(135deg, #241E1B 0%, #241E1B 100%)',
    config: {
      foregroundColor: '#FFF8F3',
      backgroundColor: '#241E1B',
      cornerSquareColor: '#E8B84B',
      cornerDotColor: '#E8B84B',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#FFF8F3',
        color2: '#FFF8F3',
      },
    },
  },
  {
    id: 'brand-teal',
    name: 'Brand Teal',
    description: 'Teal modules on cream',
    previewGradient: 'linear-gradient(135deg, #16564F 0%, #16564F 100%)',
    config: {
      foregroundColor: '#16564F',
      backgroundColor: '#FFF8F3',
      cornerSquareColor: '#16564F',
      cornerDotColor: '#16564F',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#16564F',
        color2: '#16564F',
      },
    },
  },
  {
    id: 'inverse-teal',
    name: 'Inverse Teal',
    description: 'Cream modules on solid teal',
    previewGradient: 'linear-gradient(135deg, #16564F 0%, #16564F 100%)',
    config: {
      foregroundColor: '#FFF8F3',
      backgroundColor: '#16564F',
      cornerSquareColor: '#E8B84B',
      cornerDotColor: '#E8B84B',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#FFF8F3',
        color2: '#FFF8F3',
      },
    },
  },
  {
    id: 'brand-duo',
    name: 'Brand Duo',
    description: 'Ink to teal gradient on cream',
    previewGradient: 'linear-gradient(135deg, #241E1B 0%, #16564F 100%)',
    config: {
      foregroundColor: '#241E1B',
      backgroundColor: '#FFF8F3',
      cornerSquareColor: '#241E1B',
      cornerDotColor: '#16564F',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      gradient: {
        type: 'linear',
        rotation: 45,
        color1: '#241E1B',
        color2: '#16564F',
      },
    },
  },
  {
    id: 'sharp-ink',
    name: 'Sharp Ink',
    description: 'Ultra-sharp square modules, brand only',
    previewGradient: 'linear-gradient(135deg, #241E1B 0%, #FFF8F3 100%)',
    config: {
      foregroundColor: '#241E1B',
      backgroundColor: '#FFF8F3',
      cornerSquareColor: '#241E1B',
      cornerDotColor: '#241E1B',
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#241E1B',
        color2: '#241E1B',
      },
    },
  },
];

// SVG Brand Preset Icons — ink strokes (teal reserved for links/accents)
export const BRAND_ICON_PRESETS = [
  {
    id: 'wifi',
    name: 'Wi-Fi',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#241E1B" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  },
  {
    id: 'link',
    name: 'Website',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#241E1B" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#241E1B"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`,
  },
  {
    id: 'github',
    name: 'GitHub',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#241E1B"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#241E1B"><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.24 15.538.362 9.11 1.962 2.67 8.475-1.24 14.905.362c6.429 1.602 10.339 8.113 8.733 14.542zM16.634 10.42c.241-1.613-.987-2.48-2.666-3.058l.545-2.188-1.332-.332-.53 2.127a14.77 14.77 0 00-1.067-.25l.534-2.138-1.331-.332-.545 2.187c-.29-.066-.583-.133-.872-.202l.002-.008-1.837-.458-.354 1.423s.988.227.967.241c.54.135.638.491.622.774l-.624 2.502c.037.009.085.023.138.044l-.14-.035-.874 3.504c-.066.164-.234.41-.613.316.014.02-.968-.242-.968-.242l-.66 1.522 1.734.433c.323.08.64.164.953.243l-.55 2.21 1.33.332.546-2.189c.364.099.718.19 1.066.277l-.543 2.176 1.332.332.55-2.207c2.274.43 3.985.257 4.706-1.8 0.58-1.656-.028-2.611-1.229-3.233.874-.202 1.534-.778 1.71-1.967zm-3.064 4.29c-.412 1.66-3.2.763-4.103.539l.732-2.936c.904.226 3.79.673 3.37 2.397zm.413-4.316c-.377 1.512-2.702.744-3.454.557l.664-2.662c.753.187 3.171.536 2.79 2.105z"/></svg>`,
  },
  {
    id: 'mail',
    name: 'Email',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#241E1B" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  },
];

export const getSvgDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};
