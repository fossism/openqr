import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ScanVerificationResult } from '../utils/qrScanner';

interface ScannabilityIndicatorProps {
  result: ScanVerificationResult;
  isScanning: boolean;
}

export const ScannabilityIndicator: React.FC<ScannabilityIndicatorProps> = ({
  result,
  isScanning,
}) => {
  if (isScanning) {
    return (
      <div className="p-3 bg-[#FFF8F3] border-2 border-[#241E1B] flex items-center justify-between text-xs text-[#241E1B] animate-pulse">
        <span className="flex items-center gap-2 font-bold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#16564F]" />
          Verifying scannability with live decoder...
        </span>
      </div>
    );
  }

  if (result.status === 'verified') {
    return (
      <div className="p-3.5 bg-[#16564F] border-2 border-[#241E1B] flex items-start gap-3">
        <div className="p-2 bg-[#E8B84B] text-[#241E1B] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#FFF8F3] flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#E8B84B] inline-block" />
              Verified & Scannable
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#E8B84B] text-[#241E1B]">
              Score: {result.matchScore}%
            </span>
          </div>
          <p className="text-xs text-[#FFF8F3] mt-1 truncate font-mono bg-[#16564F] px-2 py-1 border border-[#E8B84B]">
            {result.decodedText}
          </p>
        </div>
      </div>
    );
  }

  if (result.status === 'warning') {
    return (
      <div className="p-3.5 bg-[#241E1B] border-2 border-[#241E1B] flex items-start gap-3">
        <div className="p-2 bg-[#E8B84B] text-[#241E1B] shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#E8B84B]">Scannability Notice</h4>
          <p className="text-xs text-[#FFF8F3] mt-0.5 font-medium">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F3] border-2 border-[#241E1B]">
      <div className="bg-[#241E1B] px-3.5 py-2 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-[#E8B84B]" />
        <h4 className="text-xs font-bold text-[#FFF8F3]">QR Code Unscannable</h4>
      </div>
      <p className="text-xs text-[#241E1B] px-3.5 py-2.5 font-medium">{result.message}</p>
    </div>
  );
};
