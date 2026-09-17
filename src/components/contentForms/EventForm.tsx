import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { EventData } from '../../types/qr';

interface EventFormProps {
  data: EventData;
  onChange: (data: EventData) => void;
}

export const EventForm: React.FC<EventFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof EventData, val: string) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#241E1B]" /> Event Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Product Launch Keynote"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1">Start Date & Time</label>
          <input
            type="datetime-local"
            value={data.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#241E1B] mb-1">End Date & Time</label>
          <input
            type="datetime-local"
            value={data.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-[#241E1B] text-sm focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#241E1B]" /> Venue Location
        </label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="Grand Ballroom, Plaza Hotel, NY or Online URL"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm"
        />
      </div>
    </div>
  );
};
