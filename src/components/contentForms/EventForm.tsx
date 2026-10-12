import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { EventData } from '../../types/qr';

interface EventFormProps {
  data: EventData;
  onChange: (data: EventData) => void;
}

export const EventForm: React.FC<EventFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof EventData, val: string | boolean) => {
    onChange({ ...data, [key]: val } as EventData);
  };

  const rangeInvalid =
    Boolean(data.startDate && data.endDate) && new Date(data.endDate) < new Date(data.startDate);

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
      {rangeInvalid && (
        <p className="text-[11px] text-[#241E1B] bg-[#241E1B]/5 border border-[#241E1B] px-3 py-2" role="alert">
          End time is before start time — scanners may reject this event.
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="event-floating"
          checked={data.floatingTime === true}
          onChange={(e) => updateField('floatingTime', e.target.checked)}
          className="w-4 h-4 border-[#241E1B] bg-[#FFF8F3]"
        />
        <label htmlFor="event-floating" className="text-xs text-[#241E1B] cursor-pointer">
          Floating time (don't convert to UTC — keep local time as typed)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5" htmlFor="event-description">
          Description (optional)
        </label>
        <textarea
          id="event-description"
          rows={2}
          value={data.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Agenda, notes, dress code…"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm resize-none"
        />
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
