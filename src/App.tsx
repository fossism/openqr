import { useState, useEffect, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Globe,
  Wifi,
  User,
  Mail,
  MessageSquare,
  MessageCircle,
  Coins,
  Calendar,
  FileText,
  Shapes,
  Palette,
  Image as ImageIcon,
  Frame as FrameIcon,
  Download,
  RotateCcw,
  Sparkles,
  History,
  Trash2,
} from 'lucide-react';

import type {
  ContentType,
  QRDesignConfig,
  WifiData,
  VCardData,
  EmailData,
  SmsData,
  WhatsappData,
  CryptoData,
  EventData,
  PresetTheme,
} from './types/qr';

import { DEFAULT_QR_CONFIG } from './utils/presets';
import {
  formatWifi,
  formatVCard,
  formatEmail,
  formatSms,
  formatWhatsapp,
  formatCrypto,
  formatEvent,
  normalizeUrl,
} from './utils/formatters';
import { mergeQRConfig } from './utils/qrGenerator';

import { Header } from './components/Header';
import { QRPreview } from './components/QRPreview';
import type { QRPreviewHandle } from './components/QRPreview';
import { StylePicker } from './components/customization/StylePicker';
import { ColorPicker } from './components/customization/ColorPicker';
import { LogoUploader } from './components/customization/LogoUploader';
import { FramePicker } from './components/customization/FramePicker';
import { ExportPanel } from './components/customization/ExportPanel';
import { PresetTemplates } from './components/PresetTemplates';
import { BatchGenerator } from './components/BatchGenerator';
import { DecodeQR } from './components/DecodeQR';

import { UrlForm } from './components/contentForms/UrlForm';
import { WifiForm } from './components/contentForms/WifiForm';
import { VCardForm } from './components/contentForms/VCardForm';
import { EmailForm, SmsForm } from './components/contentForms/EmailSmsForm';
import { WhatsappForm } from './components/contentForms/WhatsappForm';
import { CryptoForm } from './components/contentForms/CryptoForm';
import { EventForm } from './components/contentForms/EventForm';

const STORAGE_KEY_CONFIG = 'openqr_saved_config_v1';
const STORAGE_KEY_HISTORY = 'openqr_history_v1';

interface HistoryEntry {
  id: string;
  timestamp: number;
  contentType: ContentType;
  preview: string;
  urlInput: string;
  rawText: string;
}

const parseShareHash = (): { config: Partial<QRDesignConfig>; payload: string } | null => {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#qr=')) return null;
    const encoded = hash.slice(4);
    const bin = atob(encoded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as { v: number; config: Partial<QRDesignConfig>; payload: string };
    if (!parsed || typeof parsed !== 'object') return null;
    return { config: parsed.config ?? {}, payload: parsed.payload ?? '' };
  } catch {
    return null;
  }
};

export function App() {
  // Content Tab State
  const [activeContentType, setActiveContentType] = useState<ContentType>('url');

  // Customization Section State
  const [activeCustomTab, setActiveCustomTab] = useState<'content' | 'styles' | 'colors' | 'logo' | 'frame' | 'export'>('content');

  // Payload Form States
  const [urlInput, setUrlInput] = useState<string>('https://openqr.io');
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: 'Home_WiFi',
    password: 'password123',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: 'Alex',
    lastName: 'Morgan',
    organization: 'OpenQR Studio',
    title: 'Lead Designer',
    phone: '+1 (555) 234-5678',
    email: 'alex@openqr.io',
    website: 'https://openqr.io',
    street: '100 Market St',
    city: 'San Francisco',
    country: 'USA',
  });
  const [emailData, setEmailData] = useState<EmailData>({
    email: 'contact@openqr.io',
    subject: 'Hello from OpenQR',
    body: 'I wanted to reach out regarding...',
  });
  const [smsData, setSmsData] = useState<SmsData>({
    phone: '+15550192834',
    message: 'Hello, please confirm your booking.',
  });
  const [whatsappData, setWhatsappData] = useState<WhatsappData>({
    phone: '14155552671',
    message: 'Hi! I scanned your OpenQR code.',
  });
  const [cryptoData, setCryptoData] = useState<CryptoData>({
    coin: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: '0.01',
  });
  const [eventData, setEventData] = useState<EventData>({
    title: 'OpenQR Tech Launch Event',
    location: 'San Francisco & Online',
    description: 'Join us for the live demonstration of open source QR technology.',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
  });
  const [rawText, setRawText] = useState<string>('Welcome to OpenQR!');

  // QR Design Configuration State (restored from LocalStorage / share link if available)
  const [config, setConfig] = useState<QRDesignConfig>(() => {
    const shared = typeof window !== 'undefined' ? parseShareHash() : null;
    if (shared) {
      try {
        return mergeQRConfig(shared.config);
      } catch {
        // fall through to storage
      }
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return mergeQRConfig(JSON.parse(saved) as Partial<QRDesignConfig>);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_QR_CONFIG;
  });

  // Apply shared payload once on mount
  useEffect(() => {
    const shared = parseShareHash();
    if (!shared || !shared.payload) return;
    const payload = shared.payload;
    if (/^https?:\/\//i.test(payload) && payload.length < 500) {
      setUrlInput(payload);
      setActiveContentType('url');
    } else {
      setRawText(payload);
      setActiveContentType('text');
    }
    setActiveCustomTab('content');
    // Clear hash so refresh doesn't re-apply
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  // History
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? (JSON.parse(saved) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  // Modal Dialog States
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);

  // Ref to QRPreview instance
  const previewRef = useRef<QRPreviewHandle>(null);

  // Persist design config changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignore in private window
    }
  }, [config]);

  // Compute standard payload text string based on active form tab
  const payloadText = useMemo(() => {
    switch (activeContentType) {
      case 'url': {
        const trimmed = urlInput.trim();
        if (!trimmed) return 'https://openqr.io';
        return normalizeUrl(trimmed);
      }
      case 'wifi':
        return formatWifi(wifiData);
      case 'vcard':
        return formatVCard(vcardData);
      case 'email':
        return formatEmail(emailData);
      case 'sms':
        return formatSms(smsData);
      case 'whatsapp':
        return formatWhatsapp(whatsappData);
      case 'crypto':
        return formatCrypto(cryptoData) || 'https://openqr.io';
      case 'event':
        return formatEvent(eventData);
      case 'text':
      default:
        return rawText.trim() ? rawText : 'Welcome to OpenQR!';
    }
  }, [
    activeContentType,
    urlInput,
    wifiData,
    vcardData,
    emailData,
    smsData,
    whatsappData,
    cryptoData,
    eventData,
    rawText,
  ]);

  // Debounced history tracking (url/text only for reliable restore)
  useEffect(() => {
    if (activeContentType !== 'url' && activeContentType !== 'text') return;
    const preview = payloadText.slice(0, 80);
    if (!preview) return;
    const timer = setTimeout(() => {
      setHistory((prev) => {
        if (prev[0]?.preview === preview && prev[0]?.contentType === activeContentType) return prev;
        const entry: HistoryEntry = {
          id: `${Date.now()}`,
          timestamp: Date.now(),
          contentType: activeContentType,
          preview,
          urlInput,
          rawText,
        };
        const next = [entry, ...prev].slice(0, 8);
        try {
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [payloadText, activeContentType, urlInput, rawText]);

  const updateConfigField = (key: string, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyPresetTheme = (theme: PresetTheme) => {
    setConfig((prev) => ({
      ...prev,
      ...theme.config,
      gradient: { ...prev.gradient, ...(theme.config.gradient ?? {}) },
    }));
  };

  const handleResetDesign = () => {
    setConfig(DEFAULT_QR_CONFIG);
  };

  const handleUseDecodedPayload = (text: string) => {
    const trimmed = text.trim();
    if (/^https?:\/\/\S+$/i.test(trimmed) && trimmed.length < 500) {
      setUrlInput(trimmed);
      setActiveContentType('url');
    } else {
      setRawText(text);
      setActiveContentType('text');
    }
    setActiveCustomTab('content');
  };

  const restoreHistoryEntry = (entry: HistoryEntry) => {
    setActiveContentType(entry.contentType);
    setUrlInput(entry.urlInput);
    setRawText(entry.rawText);
    setActiveCustomTab('content');
  };

  const contentTypes: { id: ContentType; label: string; icon: ReactNode }[] = [
    { id: 'url', label: 'Website URL', icon: <Globe className="w-4 h-4" /> },
    { id: 'wifi', label: 'Wi-Fi Network', icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: 'vCard Contact', icon: <User className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4 text-[#241E1B]" /> },
    { id: 'crypto', label: 'Crypto & Pay', icon: <Coins className="w-4 h-4 text-[#241E1B]" /> },
    { id: 'event', label: 'Event iCal', icon: <Calendar className="w-4 h-4 text-[#241E1B]" /> },
    { id: 'text', label: 'Plain Text', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-[#241E1B] font-sans antialiased selection:bg-[#E8B84B] selection:text-[#241E1B] flex flex-col">
      {/* Header */}
      <Header
        onOpenPresets={() => setShowPresetsModal(true)}
        onOpenScan={() => setShowScanModal(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Form & Customization Studio (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Content Type Selector Pills */}
          <div className="p-1.5 rounded-none bg-[#FFF8F3] border-2 border-[#241E1B] shadow-[4px_4px_0_#241E1B] flex flex-wrap gap-1">
            {contentTypes.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveContentType(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-none text-xs font-medium transition-all ${
                  activeContentType === tab.id
                    ? 'bg-[#16564F] text-[#FFF8F3] shadow-[4px_4px_0_#241E1B]'
                    : 'text-[#241E1B]/70 hover:text-[#241E1B] hover:bg-[#FFF8F3]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Customization Navigation Bar */}
          <div className="bg-[#FFF8F3] border-2 border-[#241E1B] rounded-none p-6 shadow-[6px_6px_0_#241E1B] space-y-6">
            <div className="flex items-center gap-2 border-b border-[#241E1B] pb-4 overflow-x-auto">
              {[
                  { id: 'content', label: 'Payload', icon: <Globe className="w-3.5 h-3.5" /> },
                  { id: 'styles', label: 'Shapes', icon: <Shapes className="w-3.5 h-3.5" /> },
                  { id: 'colors', label: 'Colors', icon: <Palette className="w-3.5 h-3.5" /> },
                  { id: 'logo', label: 'Logo', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                  { id: 'frame', label: 'Frame', icon: <FrameIcon className="w-3.5 h-3.5" /> },
                  { id: 'export', label: 'Export', icon: <Download className="w-3.5 h-3.5" /> },
                ].map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveCustomTab(step.id as typeof activeCustomTab)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-medium transition-all shrink-0 ${
                      activeCustomTab === step.id
                        ? 'bg-[#FFF8F3] text-[#241E1B] border border-[#241E1B] shadow-[2px_2px_0_#241E1B]'
                        : 'text-[#241E1B]/70 hover:text-[#241E1B] hover:bg-[#FFF8F3]/40 border border-transparent'
                    }`}
                  >
                    {step.icon}
                    <span>{step.label}</span>
                  </button>
                ))}

              <button
                type="button"
                onClick={handleResetDesign}
                title="Reset to default design style"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-medium transition-colors shrink-0 ml-auto text-[#241E1B]/70 hover:text-[#241E1B] hover:bg-[#FFF8F3]/40 border border-transparent"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Customization Tab Panels */}
            <div className="pt-2">
              {activeCustomTab === 'content' && (
                <div className="space-y-4">
                  {activeContentType === 'url' && (
                    <UrlForm value={urlInput} onChange={setUrlInput} />
                  )}
                  {activeContentType === 'wifi' && (
                    <WifiForm data={wifiData} onChange={setWifiData} />
                  )}
                  {activeContentType === 'vcard' && (
                    <VCardForm data={vcardData} onChange={setVcardData} />
                  )}
                  {activeContentType === 'email' && (
                    <EmailForm data={emailData} onChange={setEmailData} />
                  )}
                  {activeContentType === 'sms' && (
                    <SmsForm data={smsData} onChange={setSmsData} />
                  )}
                  {activeContentType === 'whatsapp' && (
                    <WhatsappForm data={whatsappData} onChange={setWhatsappData} />
                  )}
                  {activeContentType === 'crypto' && (
                    <CryptoForm data={cryptoData} onChange={setCryptoData} />
                  )}
                  {activeContentType === 'event' && (
                    <EventForm data={eventData} onChange={setEventData} />
                  )}
                  {activeContentType === 'text' && (
                    <div>
                      <label htmlFor="raw-text" className="block text-sm font-medium text-[#241E1B] mb-1.5">
                        Raw Text Content
                      </label>
                      <textarea
                        id="raw-text"
                        rows={4}
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="Enter any custom plain text..."
                        className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeCustomTab === 'styles' && (
                <StylePicker
                  dotStyle={config.dotStyle}
                  cornerSquareStyle={config.cornerSquareStyle}
                  cornerDotStyle={config.cornerDotStyle}
                  canvasSize={config.width}
                  margin={config.margin}
                  onChange={updateConfigField}
                />
              )}

              {activeCustomTab === 'colors' && (
                <ColorPicker config={config} onChange={updateConfigField} />
              )}

              {activeCustomTab === 'logo' && (
                <LogoUploader
                  logo={config.logo}
                  errorCorrectionLevel={config.errorCorrectionLevel}
                  onLogoChange={(logo) => updateConfigField('logo', logo)}
                  onEccChange={(ecc) => updateConfigField('errorCorrectionLevel', ecc)}
                />
              )}

              {activeCustomTab === 'frame' && (
                <FramePicker
                  frame={config.frame}
                  onChange={(frame) => updateConfigField('frame', frame)}
                />
              )}

              {activeCustomTab === 'export' && (
                <ExportPanel
                  getCanvasRef={() => previewRef.current?.getCanvas() || null}
                  getHighResCanvas={(size) => previewRef.current?.getHighResCanvas(size) ?? Promise.resolve(null)}
                  getSvgBlob={() => previewRef.current?.getSvgBlob() ?? Promise.resolve(null)}
                  config={config}
                  payloadText={payloadText}
                  onImportConfig={setConfig}
                  onOpenBatch={() => setShowBatchModal(true)}
                />
              )}
            </div>
          </div>

          {/* Quick Aesthetic Preset Bar */}
          <div className="p-4 rounded-none bg-[#241E1B]/5 border border-[#241E1B]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#241E1B]" />
              <span className="text-xs text-[#241E1B] font-medium">Looking for quick inspiration?</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPresetsModal(true)}
              className="px-3 py-1.5 rounded-none bg-[#241E1B] hover:bg-[#16564F] text-[#FFF8F3] text-xs font-bold border-2 border-[#241E1B] transition-colors"
            >
              Browse Aesthetic Themes
            </button>
          </div>

          {history.length > 0 && (
            <div className="p-4 rounded-none bg-[#FFF8F3] border border-[#241E1B] space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#241E1B] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#241E1B]/70" /> Recent (this browser)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setHistory([]);
                    try {
                      localStorage.removeItem(STORAGE_KEY_HISTORY);
                    } catch {
                      // ignore
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#241E1B]/60 hover:text-[#241E1B] transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.slice(0, 6).map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => restoreHistoryEntry(h)}
                    title={`${h.contentType}: ${h.preview}`}
                    className="max-w-[220px] truncate px-2.5 py-1.5 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] border border-[#241E1B]/30 text-[11px] font-mono text-[#241E1B] transition-colors"
                  >
                    {h.preview}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Preview & Verification Engine (Cols 8-12) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="bg-[#FFF8F3] border-2 border-[#241E1B] rounded-none p-6 shadow-[6px_6px_0_#241E1B]">
              <h2 className="text-sm font-bold text-[#241E1B] mb-4 flex items-center justify-between">
                <span>Live Studio Preview</span>
                <span className="text-[11px] font-mono font-normal text-[#241E1B]/70">
                  ECC Level: <strong className="text-[#241E1B]">{config.errorCorrectionLevel}</strong>
                </span>
              </h2>

              <QRPreview
                ref={previewRef}
                config={config}
                payloadText={payloadText}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PresetTemplates
        isOpen={showPresetsModal}
        onClose={() => setShowPresetsModal(false)}
        onSelectTheme={handleApplyPresetTheme}
        currentConfig={config}
      />

      <BatchGenerator
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        config={config}
      />

      <DecodeQR
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onUsePayload={handleUseDecodedPayload}
      />

      {/* Footer */}
      <footer className="mt-auto border-t-4 border-[#E8B84B] py-6 bg-[#241E1B] text-center text-xs text-[#FFF8F3]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} OpenQR: Privacy-First Open Source QR Code Generator</p>
          <div className="flex items-center gap-4">
            <span className="text-[#E8B84B] font-bold">● 100% Client-Side Engine</span>
            <span>No Login Required</span>
            <span>Offline Capable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
