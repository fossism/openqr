import React from 'react';
import { User, Building, Phone, Mail, Globe, MapPin } from 'lucide-react';
import type { VCardData } from '../../types/qr';

interface VCardFormProps {
  data: VCardData;
  onChange: (data: VCardData) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof VCardData, val: string) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#241E1B]" /> First Name
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="John"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#241E1B]" /> Last Name
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Doe"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#241E1B]" /> Company / Org
          </label>
          <input
            type="text"
            value={data.organization}
            onChange={(e) => updateField('organization', e.target.value)}
            placeholder="Acme Corp"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Senior Architect"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#241E1B]" /> Phone Number
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#241E1B]" /> Email Address
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="john@example.com"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#241E1B]" /> Website
          </label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://johndoe.com"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#241E1B]" /> City / Country
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="San Francisco, USA"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
      </div>
    </div>
  );
};
