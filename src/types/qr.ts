export type ContentType = 
  | 'url' 
  | 'wifi' 
  | 'vcard' 
  | 'email' 
  | 'sms' 
  | 'whatsapp' 
  | 'crypto' 
  | 'text' 
  | 'event';

export type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';

export type CornerSquareStyle = 'square' | 'dot' | 'extra-rounded';

export type CornerDotStyle = 'square' | 'dot';

export type GradientType = 'none' | 'linear' | 'radial';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type FrameStyle = 'none' | 'badge-top' | 'badge-bottom' | 'card-rounded' | 'ticket';

export type ExportFormat = 'png' | 'svg' | 'webp' | 'pdf';

export interface GradientOptions {
  type: GradientType;
  rotation: number; // in degrees
  color1: string;
  color2: string;
}

export interface LogoConfig {
  src: string; // Baked data URL actually rendered (may include background padding)
  originalSrc?: string; // Raw unbaked upload / preset — the only safe re-bake source
  scale: number; // 0.1 to 0.4
  margin: number; // margin around logo in px
  backgroundType: 'none' | 'white-circle' | 'white-square' | 'custom-circle';
  backgroundColor: string;
}

export interface FrameConfig {
  style: FrameStyle;
  text: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  fontSize: number;
}

export interface QRDesignConfig {
  width: number;
  height: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  
  // Colors & Gradients
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  gradient: GradientOptions;

  // Custom Shapes
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerSquareColor: string;
  cornerDotStyle: CornerDotStyle;
  cornerDotColor: string;

  // Logo & Frame
  logo: LogoConfig;
  frame: FrameConfig;
}

// Preset content form interfaces
export type WifiEncryption = 'WPA' | 'WPA2' | 'WPA3' | 'WEP' | 'nopass';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  country: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface WhatsappData {
  phone: string;
  message: string;
}

export interface CryptoData {
  coin: 'BTC' | 'ETH' | 'SOL' | 'UPI';
  address: string;
  amount: string;
  /** UPI-only: payee display name (pn) */
  upiPayee?: string;
  /** UPI-only: transaction note (tn) */
  upiNote?: string;
}

export interface EventData {
  title: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  /** When true, emit floating local time (no Z / no UTC conversion). */
  floatingTime?: boolean;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  config: Partial<QRDesignConfig>;
}

export interface BatchItem {
  id: string;
  content: string;
  label: string;
  status?: 'pending' | 'ready' | 'error';
  previewUrl?: string;
}
