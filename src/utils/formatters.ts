import type { 
  WifiData, 
  VCardData, 
  EmailData, 
  SmsData, 
  WhatsappData, 
  CryptoData, 
  EventData 
} from '../types/qr';

export const formatWifi = (data: WifiData): string => {
  const { ssid, password, encryption, hidden } = data;
  const escapedSsid = ssid.replace(/([\\;:,"])/g, '\\$1');
  const escapedPass = password.replace(/([\\;:,"])/g, '\\$1');
  const hFlag = hidden ? 'H:true;' : '';
  return `WIFI:S:${escapedSsid};T:${encryption};P:${escapedPass};${hFlag};`;
};

export const formatVCard = (data: VCardData): string => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`.trim(),
  ];

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  if (data.website) lines.push(`URL:${data.website}`);
  if (data.street || data.city || data.country) {
    lines.push(`ADR;TYPE=WORK:;;${data.street};${data.city};;;${data.country}`);
  }
  lines.push('END:VCARD');
  return lines.join('\n');
};

export const formatEmail = (data: EmailData): string => {
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${data.email}${query}`;
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
  switch (coin) {
    case 'BTC':
      return amount ? `bitcoin:${address}?amount=${amount}` : `bitcoin:${address}`;
    case 'ETH':
      return amount ? `ethereum:${address}?value=${amount}` : `ethereum:${address}`;
    case 'SOL':
      return amount ? `solana:${address}?amount=${amount}` : `solana:${address}`;
    case 'UPI':
      return amount ? `upi://pay?pa=${address}&am=${amount}` : `upi://pay?pa=${address}`;
    default:
      return address;
  }
};

export const formatEvent = (data: EventData): string => {
  const formatDate = (dtStr: string) => {
    if (!dtStr) return '';
    const date = new Date(dtStr);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = [
    'BEGIN:VEVENT',
    `SUMMARY:${data.title}`,
  ];
  if (data.startDate) lines.push(`DTSTART:${formatDate(data.startDate)}`);
  if (data.endDate) lines.push(`DTEND:${formatDate(data.endDate)}`);
  if (data.location) lines.push(`LOCATION:${data.location}`);
  if (data.description) lines.push(`DESCRIPTION:${data.description}`);
  lines.push('END:VEVENT');
  return lines.join('\n');
};
