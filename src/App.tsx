import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Sparkles
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
  PresetTheme
} from './types/qr';

import { DEFAULT_QR_CONFIG } from './utils/presets';
import { 
  formatWifi, 
  formatVCard, 
  formatEmail, 
  formatSms, 
  formatWhatsapp, 
  formatCrypto, 
  formatEvent 
} from './utils/formatters';

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

import { UrlForm } from './components/contentForms/UrlForm';
import { WifiForm } from './components/contentForms/WifiForm';
import { VCardForm } from './components/contentForms/VCardForm';
import { EmailForm, SmsForm } from './components/contentForms/EmailSmsForm';
import { WhatsappForm } from './components/contentForms/WhatsappForm';
import { CryptoForm } from './components/contentForms/CryptoForm';
import { EventForm } from './components/contentForms/EventForm';

const STORAGE_KEY_CONFIG = 'openqr_saved_config_v1';

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
    message: 'Hi! I scanner your OpenQR code.',
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

  // QR Design Configuration State (restored from LocalStorage if available)
  const [config, setConfig] = useState<QRDesignConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_QR_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_QR_CONFIG;
  });

  // Modal Dialog States
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);

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
      case 'url':
        return urlInput.trim() || 'https://openqr.io';
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
        return formatCrypto(cryptoData);
      case 'event':
        return formatEvent(eventData);
      case 'text':
      default:
        return rawText;
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

  const updateConfigField = (key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyPresetTheme = (theme: PresetTheme) => {
    setConfig((prev) => ({
      ...prev,
      ...theme.config,
    }));
  };

  const handleResetDesign = () => {
    setConfig(DEFAULT_QR_CONFIG);
  };

  const contentTypes: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: 'Website URL', icon: <Globe className="w-4 h-4" /> },
    { id: 'wifi', label: 'Wi-Fi Network', icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: 'vCard Contact', icon: <User className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4 text-emerald-400" /> },
    { id: 'crypto', label: 'Crypto & Pay', icon: <Coins className="w-4 h-4 text-amber-400" /> },
    { id: 'event', label: 'Event iCal', icon: <Calendar className="w-4 h-4 text-purple-400" /> },
    { id: 'text', label: 'Plain Text', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        onOpenPresets={() => setShowPresetsModal(true)}
        onOpenBatch={() => setShowBatchModal(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Customization Studio (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Content Type Selector Pills */}
          <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-wrap gap-1">
            {contentTypes.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveContentType(tab.id);
                  setActiveCustomTab('content');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeContentType === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Customization Navigation Bar */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 overflow-x-auto gap-2">
              <div className="flex items-center gap-1">
                {[
                  { id: 'content', label: '1. Payload', icon: <Globe className="w-3.5 h-3.5" /> },
                  { id: 'styles', label: '2. Shapes', icon: <Shapes className="w-3.5 h-3.5" /> },
                  { id: 'colors', label: '3. Colors', icon: <Palette className="w-3.5 h-3.5" /> },
                  { id: 'logo', label: '4. Logo', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                  { id: 'frame', label: '5. Frame', icon: <FrameIcon className="w-3.5 h-3.5" /> },
                  { id: 'export', label: '6. Export', icon: <Download className="w-3.5 h-3.5" /> },
                ].map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveCustomTab(step.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeCustomTab === step.id
                        ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {step.icon}
                    <span>{step.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleResetDesign}
                title="Reset to default design style"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
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
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Raw Text Content
                      </label>
                      <textarea
                        rows={4}
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="Enter any custom plain text or markdown..."
                        className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
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
                  getSvgRef={() => previewRef.current?.getSvg() || null}
                  config={config}
                  payloadText={payloadText}
                />
              )}
            </div>
          </div>

          {/* Quick Aesthetic Preset Bar */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-300 font-medium">Looking for quick inspiration?</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPresetsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
            >
              Browse Aesthetic Themes
            </button>
          </div>
        </div>

        {/* Right Column: Live Visual Preview & Verification Engine (Cols 8-12) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
                <span>Live Studio Preview</span>
                <span className="text-[11px] font-mono font-normal text-slate-400">
                  ECC Level: <strong className="text-indigo-300">{config.errorCorrectionLevel}</strong>
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

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 py-6 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} OpenQR — Privacy-First Open Source QR Code Generator</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">● 100% Client-Side Engine</span>
            <span>No Login Required</span>
            <span>Offline Capable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
