import React from 'react';
import { Wifi, Lock, Eye, EyeOff } from 'lucide-react';
import type { WifiData } from '../../types/qr';

interface WifiFormProps {
  data: WifiData;
  onChange: (data: WifiData) => void;
}

export const WifiForm: React.FC<WifiFormProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const updateField = (key: keyof WifiData, val: any) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-[#241E1B]" />
          Network Name (SSID)
        </label>
        <input
          type="text"
          value={data.ssid}
          onChange={(e) => updateField('ssid', e.target.value)}
          placeholder="e.g. MyHome_WiFi_5G"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] focus:border-[#241E1B] text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#241E1B]" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Wi-Fi Password"
              disabled={data.encryption === 'nopass'}
              className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none pl-4 pr-10 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] focus:border-[#241E1B] text-sm transition-all disabled:opacity-50"
            />
            {data.encryption !== 'nopass' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#241E1B]/70 hover:text-[#241E1B]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#241E1B] mb-1.5">
            Encryption Security
          </label>
          <select
            value={data.encryption}
            onChange={(e) => updateField('encryption', e.target.value as any)}
            aria-label="Encryption Security"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] focus:outline-none focus:ring-2 focus:ring-[#16564F] focus:border-[#241E1B] text-sm transition-all"
          >
            <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="hidden-net"
          checked={data.hidden}
          onChange={(e) => updateField('hidden', e.target.checked)}
          className="w-4 h-4 rounded-none border-[#241E1B] bg-[#FFF8F3] text-[#241E1B] focus:ring-[#16564F]"
        />
        <label htmlFor="hidden-net" className="text-xs text-[#241E1B] cursor-pointer">
          Hidden Wi-Fi Network (SSID broadcast disabled)
        </label>
      </div>
    </div>
  );
};
