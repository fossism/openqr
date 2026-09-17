import React from 'react';
import { Coins } from 'lucide-react';
import type { CryptoData } from '../../types/qr';

interface CryptoFormProps {
  data: CryptoData;
  onChange: (data: CryptoData) => void;
}

export const CryptoForm: React.FC<CryptoFormProps> = ({ data, onChange }) => {
  const updateField = (key: keyof CryptoData, val: string) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-[#241E1B] mb-1.5 flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#241E1B]" /> Currency / Network
          </label>
          <select
            value={data.coin}
            onChange={(e) => updateField('coin', e.target.value as any)}
            aria-label="Currency / Network"
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3 py-3 text-[#241E1B] focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="UPI">UPI Payment (India)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#241E1B] mb-1.5">
            Wallet Address or VPA ID
          </label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder={data.coin === 'UPI' ? 'username@bank' : '0x... or bc1q...'}
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#241E1B] mb-1.5">
          Requested Amount (Optional)
        </label>
        <input
          type="text"
          value={data.amount}
          onChange={(e) => updateField('amount', e.target.value)}
          placeholder="0.05"
          className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-4 py-3 text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F] text-sm font-mono"
        />
      </div>
    </div>
  );
};
