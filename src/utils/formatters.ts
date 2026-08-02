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
  const { ssid, password, encryption, hidden } = data;
  const escapedSsid = ssid.replace(/([\\;:,"])/g, '\\$1');
  const escapedPass = password.replace(/([\\;:,"])/g, '\\$1');
  const hFlag = hidden ? 'H:true;' : '';
  return `WIFI:S:${escapedSsid};T:${encryption};P:${escapedPass};${hFlag};`;
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
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${encodeURIComponent(data.email)}${query}`;
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

export const formatCrypto = (data: CryptoData): string => {
  const { coin, address, amount } = data;
  if (!address) return '';
  const cleanAddress = address.trim();
  const encodedAmount = amount ? encodeURIComponent(amount.trim()) : '';

  switch (coin) {
    case 'BTC':
      return encodedAmount ? `bitcoin:${cleanAddress}?amount=${encodedAmount}` : `bitcoin:${cleanAddress}`;
    case 'ETH':
      return encodedAmount ? `ethereum:${cleanAddress}?value=${encodedAmount}` : `ethereum:${cleanAddress}`;
    case 'SOL':
      return encodedAmount ? `solana:${cleanAddress}?amount=${encodedAmount}` : `solana:${cleanAddress}`;
    case 'UPI':
      return encodedAmount ? `upi://pay?pa=${cleanAddress}&am=${encodedAmount}` : `upi://pay?pa=${cleanAddress}`;
    default:
      return cleanAddress;
  }
};

export const formatEvent = (data: EventData): string => {
  const formatDate = (dtStr: string) => {
    if (!dtStr) return '';
    const date = new Date(dtStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = [
    'BEGIN:VEVENT',
    `SUMMARY:${escapeEventField(data.title)}`,
  ];
  if (data.startDate) {
    const formattedStart = formatDate(data.startDate);
    if (formattedStart) lines.push(`DTSTART:${formattedStart}`);
  }
  if (data.endDate) {
    const formattedEnd = formatDate(data.endDate);
    if (formattedEnd) lines.push(`DTEND:${formattedEnd}`);
  }
  if (data.location) lines.push(`LOCATION:${escapeEventField(data.location)}`);
  if (data.description) lines.push(`DESCRIPTION:${escapeEventField(data.description)}`);
  lines.push('END:VEVENT');
  return lines.join('\n');
};
