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
    description: 'Ink modules on cream: default brand',
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
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Warm terracotta on cream',
    previewGradient: 'linear-gradient(135deg, #AD544B 0%, #8E433C 100%)',
    config: {
      foregroundColor: '#AD544B',
      backgroundColor: '#FFF8F3',
      cornerSquareColor: '#8E433C',
      cornerDotColor: '#AD544B',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#AD544B',
        color2: '#AD544B',
      },
    },
  },
  {
    id: 'foss-terminal',
    name: 'FOSS Terminal',
    description: 'FOSS mint on code-night black',
    previewGradient: 'linear-gradient(135deg, #1A1A1A 0%, #08B74F 100%)',
    config: {
      foregroundColor: '#08B74F',
      backgroundColor: '#1A1A1A',
      cornerSquareColor: '#08B74F',
      cornerDotColor: '#08B74F',
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      gradient: {
        type: 'none',
        rotation: 0,
        color1: '#08B74F',
        color2: '#08B74F',
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

// SVG Brand Preset Icons: ink strokes (teal reserved for links/accents)
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
    id: 'instagram',
    name: 'Instagram',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#241E1B"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>`,
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
