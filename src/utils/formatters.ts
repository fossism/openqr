import type { 
  WifiData, 
  VCardData, 
  EmailData, 
  SmsData, 
  WhatsappData, 
  CryptoData, 
  EventData 
} from '../types/qr';

const escapeVCardField = (str: string = ''): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

const escapeEventField = (str: string = ''): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

export const formatWifi = (data: WifiData): string => {
  const ssid = (data.ssid ?? '').trim();
  if (!ssid) return '';
  const { password, encryption, hidden } = data;
  const escapedSsid = ssid.replace(/([\\;:,"])/g, '\\$1');
  // T:WPA is the widely-supported token for WPA/WPA2/WPA3 personal.
  // Emit the specific variant when explicitly chosen, fall back to WPA otherwise.
  const tValue = encryption === 'nopass' ? 'nopass' : encryption;
  const escapedPass = (password ?? '').replace(/([\\;:,"])/g, '\\$1');
  const hFlag = hidden ? 'H:true;' : '';
  if (encryption === 'nopass') {
    return `WIFI:S:${escapedSsid};T:nopass;${hFlag};`;
  }
  return `WIFI:S:${escapedSsid};T:${tValue};P:${escapedPass};${hFlag};`;
};

export const formatVCard = (data: VCardData): string => {
  const fn = `${data.firstName} ${data.lastName}`.trim();
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCardField(data.lastName)};${escapeVCardField(data.firstName)};;;`,
    `FN:${escapeVCardField(fn)}`,
  ];

  if (data.organization) lines.push(`ORG:${escapeVCardField(data.organization)}`);
  if (data.title) lines.push(`TITLE:${escapeVCardField(data.title)}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${escapeVCardField(data.phone)}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardField(data.email)}`);
  if (data.website) lines.push(`URL:${escapeVCardField(data.website)}`);
  if (data.street || data.city || data.country) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardField(data.street)};${escapeVCardField(data.city)};;;${escapeVCardField(data.country)}`);
  }
  lines.push('END:VCARD');
  return lines.join('\n');
};

export const formatEmail = (data: EmailData): string => {
  const email = data.email.trim();
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${email}${query}`;
};

export const formatSms = (data: SmsData): string => {
  const cleanPhone = data.phone.replace(/[^\d+]/g, '');
  if (data.message) {
    return `sms:${cleanPhone}?body=${encodeURIComponent(data.message)}`;
  }
  return `sms:${cleanPhone}`;
};

export const formatWhatsapp = (data: WhatsappData): string => {
  const cleanPhone = data.phone.replace(/[^\d]/g, '');
  const encodedText = encodeURIComponent(data.message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

/**
 * Convert a decimal ETH string (e.g. "0.05") to wei as a base-10 integer string.
 * EIP-681 `ethereum:<addr>?value=` expects wei, not ETH.
 */
export const ethToWei = (amount: string): string => {
  const trimmed = (amount ?? '').trim();
  if (!trimmed) return '';
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return '';
  const [whole, fracRaw = ''] = trimmed.split('.');
  const frac = (fracRaw + '0'.repeat(18)).slice(0, 18);
  const combined = `${whole}${frac}`.replace(/^0+(?=\d)/, '');
  return combined || '0';
};

export const formatCrypto = (data: CryptoData): string => {
  const { coin, address, amount } = data;
  if (!address) return '';
  const cleanAddress = address.trim();
  if (!cleanAddress) return '';
  const trimmedAmount = (amount ?? '').trim();

  switch (coin) {
    case 'BTC': {
      const encodedAmount = trimmedAmount ? encodeURIComponent(trimmedAmount) : '';
      return encodedAmount ? `bitcoin:${cleanAddress}?amount=${encodedAmount}` : `bitcoin:${cleanAddress}`;
    }
    case 'ETH': {
      // UI takes decimal ETH; EIP-681 value is in wei.
      if (!trimmedAmount) return `ethereum:${cleanAddress}`;
      const wei = ethToWei(trimmedAmount);
      return wei ? `ethereum:${cleanAddress}?value=${wei}` : `ethereum:${cleanAddress}`;
    }
    case 'SOL': {
      const encodedAmount = trimmedAmount ? encodeURIComponent(trimmedAmount) : '';
      return encodedAmount ? `solana:${cleanAddress}?amount=${encodedAmount}` : `solana:${cleanAddress}`;
    }
    case 'UPI': {
      const params = [`pa=${encodeURIComponent(cleanAddress)}`];
      const payee = (data.upiPayee ?? '').trim();
      if (payee) params.push(`pn=${encodeURIComponent(payee)}`);
      if (trimmedAmount) params.push(`am=${encodeURIComponent(trimmedAmount)}`);
      const note = (data.upiNote ?? '').trim();
      if (note) params.push(`tn=${encodeURIComponent(note)}`);
      params.push('cu=INR');
      return `upi://pay?${params.join('&')}`;
    }
    default:
      return cleanAddress;
  }
};

const stableUid = (seed: string): string => {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) | 0;
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  let random = '';
  try {
    const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
    if (c && 'randomUUID' in c && typeof c.randomUUID === 'function') {
      return `${c.randomUUID()}@openqr`;
    }
    if (c && typeof c.getRandomValues === 'function') {
      const bytes = c.getRandomValues(new Uint8Array(8));
      random = Array.from(bytes as Uint8Array, (b: number) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fall through
  }
  if (!random) random = `${Date.now().toString(16)}${Math.floor(Math.random() * 0xffffffff).toString(16)}`;
  return `${hex}-${random}@openqr`;
};

export const formatEvent = (data: EventData): string => {
  const floating = data.floatingTime === true;
  const formatDate = (dtStr: string) => {
    if (!dtStr) return '';
    const date = new Date(dtStr);
    if (isNaN(date.getTime())) return '';
    if (floating) {
      // Floating local time: YYYYMMDDTHHMMSS with no Z suffix, no UTC shift.
      const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(dtStr);
      if (m) {
        const [, y, mo, d, h, mi, s = '00'] = m;
        return `${y}${mo}${d}T${h}${mi}${s}`;
      }
    }
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const uidSeed = `${data.title}|${data.startDate}|${data.endDate}|${data.location}`;
  const eventLines = [
    'BEGIN:VEVENT',
    `UID:${stableUid(uidSeed)}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `SUMMARY:${escapeEventField(data.title)}`,
  ];
  if (data.startDate) {
    const formattedStart = formatDate(data.startDate);
    if (formattedStart) eventLines.push(`DTSTART:${formattedStart}`);
  }
  if (data.endDate) {
    const formattedEnd = formatDate(data.endDate);
    if (formattedEnd) eventLines.push(`DTEND:${formattedEnd}`);
  }
  if (data.location) eventLines.push(`LOCATION:${escapeEventField(data.location)}`);
  if (data.description) eventLines.push(`DESCRIPTION:${escapeEventField(data.description)}`);
  eventLines.push('END:VEVENT');

  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//OpenQR//EN', ...eventLines, 'END:VCALENDAR'].join('\n');
};

export const normalizeUrl = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const isValidUrl = (input: string): boolean => {
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
};

export type PayloadDensity = 'easy' | 'medium' | 'dense' | 'very-dense';

export const getPayloadDensity = (payload: string): { length: number; level: PayloadDensity; hint: string } => {
  const length = payload.length;
  if (length > 2000) {
    return { length, level: 'very-dense', hint: 'Very dense: may fail on low-end cameras. Shorten content or raise ECC to H.' };
  }
  if (length > 800) {
    return { length, level: 'dense', hint: 'Dense QR: test print size at least 4cm and use ECC Q/H.' };
  }
  if (length > 200) {
    return { length, level: 'medium', hint: 'Medium density: scans reliably.' };
  }
  return { length, level: 'easy', hint: 'Compact payload: fast scanning.' };
};
