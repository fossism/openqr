import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { WhatsappData } from '../../types/qr';

interface WhatsappFormProps {
  data: WhatsappData;
  onChange: (data: WhatsappData) => void;
}

export const WhatsappForm: React.FC<WhatsappFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof WhatsappData, val: string) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Number (with Country Code)
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="e.g. +14155552671 or 919876543210"
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">Include country code without leading plus sign if preferred (e.g. 14155552671)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Pre-filled Chat Message
        </label>
        <textarea
          rows={3}
          value={data.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Hello! I would like to book a appointment / ask a question..."
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
        />
      </div>
    </div>
  );
};
