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
      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs text-slate-400 animate-pulse">
        <span className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          Verifying scannability with AI decoder engine...
        </span>
      </div>
    );
  }

  if (result.status === 'verified') {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 shadow-lg shadow-emerald-500/5">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              100% Verified & Scannable
            </h4>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Score: {result.matchScore}%
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 truncate font-mono bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
            {result.decodedText}
          </p>
        </div>
      </div>
    );
  }

  if (result.status === 'warning') {
    return (
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-300">Scannability Notice</h4>
          <p className="text-xs text-slate-300 mt-0.5">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
      <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-red-300">QR Code Unscannable</h4>
        <p className="text-xs text-slate-300 mt-0.5">{result.message}</p>
      </div>
    </div>
  );
};
