import React from 'react';
import { Gauge, ShieldCheck } from 'lucide-react';
import { getPayloadDensity } from '../utils/formatters';
import type { ErrorCorrectionLevel } from '../types/qr';

interface PayloadInsightsProps {
  payloadText: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  onEccChange?: (level: ErrorCorrectionLevel) => void;
}

const ECC_ORDER: Record<ErrorCorrectionLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };

const DENSITY_STYLE: Record<string, string> = {
  easy: 'bg-[#16564F] text-[#FFF8F3]',
  medium: 'bg-[#E8B84B] text-[#241E1B]',
  dense: 'bg-[#E8B84B] text-[#241E1B] border border-[#241E1B]',
  'very-dense': 'bg-[#241E1B] text-[#E8B84B]',
};

export const PayloadInsights: React.FC<PayloadInsightsProps> = ({
  payloadText,
  errorCorrectionLevel,
  onEccChange,
}) => {
  const density = getPayloadDensity(payloadText);
  const suggested: ErrorCorrectionLevel =
    density.level === 'very-dense' ? 'H' : density.level === 'dense' ? 'Q' : 'M';
  const needsBoost = ECC_ORDER[errorCorrectionLevel] < ECC_ORDER[suggested];

  return (
    <div className="p-3 rounded-none bg-[#FFF8F3] border-2 border-[#241E1B] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#241E1B]">
          <Gauge className="w-3.5 h-3.5" />
          Payload
        </span>
        <span className="text-[11px] font-mono text-[#241E1B]/70">
          {density.length} chars
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${DENSITY_STYLE[density.level]}`}>
          {density.level}
        </span>
        <span className="text-[11px] font-mono text-[#241E1B]/70">
          ECC {errorCorrectionLevel}
        </span>
      </div>
      <p className="text-[11px] text-[#241E1B]/80 font-medium">{density.hint}</p>
      {needsBoost && onEccChange && (
        <button
          type="button"
          onClick={() => onEccChange(suggested)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none bg-[#241E1B] hover:bg-[#16564F] text-[#FFF8F3] text-[11px] font-bold border-2 border-[#241E1B] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#E8B84B]" />
          Raise ECC to {suggested} for this density
        </button>
      )}
    </div>
  );
};
