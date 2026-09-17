import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import type { EmailData, SmsData } from '../../types/qr';

interface EmailFormProps {
  data: EmailData;
  onChange: (data: EmailData) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof EmailData, val: string) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#241E1B]" /> Recipient Email
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="support@company.com"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5">
          Email Subject
        </label>
        <input
          type="text"
          value={data.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          placeholder="Inquiry about services"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5">
          Message Body
        </label>
        <textarea
          rows={3}
          value={data.body}
          onChange={(e) => updateField('body', e.target.value)}
          placeholder="Hello, I would like to get in touch regarding..."
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm resize-none"
        />
      </div>
    </div>
  );
};

interface SmsFormProps {
  data: SmsData;
  onChange: (data: SmsData) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof SmsData, val: string) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#241E1B]" /> Phone Number
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+1234567890"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5">
          Preset SMS Text
        </label>
        <textarea
          rows={3}
          value={data.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Hi! I am scanning your QR code to confirm..."
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm resize-none"
        />
      </div>
    </div>
  );
};
