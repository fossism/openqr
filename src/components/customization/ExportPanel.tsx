import React, { useRef, useState } from 'react';
import { Download, FileCode, FileText, Image as ImageIcon, Copy, Check, FileJson, Upload, Link2, Loader2 } from 'lucide-react';
import {
  exportCanvasImage,
  exportPdfDocument,
  downloadSvgBlob,
  copyCanvasToClipboard,
  exportConfigJson,
  parseConfigJson,
  triggerConfetti,
} from '../../utils/exportUtils';
import { mergeQRConfig } from '../../utils/qrGenerator';
import type { QRDesignConfig } from '../../types/qr';

interface ExportPanelProps {
  getCanvasRef: () => HTMLCanvasElement | null;
  getHighResCanvas: (size: number) => Promise<HTMLCanvasElement | null>;
  getSvgBlob: () => Promise<Blob | null>;
  config: QRDesignConfig;
  payloadText: string;
  onImportConfig: (config: QRDesignConfig) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  getCanvasRef,
  getHighResCanvas,
  getSvgBlob,
  config,
  payloadText,
  onImportConfig,
}) => {
  const [resolution, setResolution] = useState<number>(1024);
  const [filename, setFilename] = useState<string>('openqr-code');
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const withBusy = async (key: string, fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(key);
    try {
      await fn();
    } catch (err) {
      console.warn('Export failed:', err);
      flash('Export failed. Try a smaller resolution.');
    } finally {
      setBusy(null);
    }
  };

  const handleExportPNG = () => withBusy('png', async () => {
    const canvas = await getHighResCanvas(resolution);
    const fallback = canvas ?? getCanvasRef();
    if (!fallback) return flash('Preview not ready yet.');
    exportCanvasImage(fallback, filename || 'openqr-code', 'png');
  });

  const handleExportWEBP = () => withBusy('webp', async () => {
    const canvas = await getHighResCanvas(resolution);
    const fallback = canvas ?? getCanvasRef();
    if (!fallback) return flash('Preview not ready yet.');
    exportCanvasImage(fallback, filename || 'openqr-code', 'webp');
  });

  const handleExportSVG = () => withBusy('svg', async () => {
    const blob = await getSvgBlob();
    if (blob) {
      downloadSvgBlob(blob, filename || 'openqr-vector');
      if (config.frame.style !== 'none') flash('Note: SVG is frameless vector. Use PNG/PDF to keep the frame.');
    } else {
      const canvas = getCanvasRef();
      if (canvas) exportCanvasImage(canvas, filename || 'openqr-code', 'png');
      else flash('Preview not ready yet.');
    }
  });

  const handleExportPDF = () => withBusy('pdf', async () => {
    const canvas = await getHighResCanvas(Math.min(resolution, 2048));
    const fallback = canvas ?? getCanvasRef();
    if (!fallback) return flash('Preview not ready yet.');
    exportPdfDocument(fallback, `${filename || 'openqr-document'}`, config.frame.text || payloadText.substring(0, 48));
  });

  const handleCopyImage = () => withBusy('copy', async () => {
    const canvas = await getHighResCanvas(Math.min(resolution, 2048));
    const target = canvas ?? getCanvasRef();
    if (!target) return flash('Preview not ready yet.');
    const ok = await copyCanvasToClipboard(target);
    flash(ok ? 'QR image copied to clipboard.' : 'Clipboard image copy blocked by browser.');
    if (ok) triggerConfetti();
  });

  const handleShareLink = async () => {
    try {
      // Exclude logo bitmap (can be MBs) from share URL; design + payload only
      const shareable = { ...config, logo: { ...config.logo, src: '' } };
      const data = JSON.stringify({ v: 1, config: shareable, payload: payloadText.slice(0, 2000) });
      const bytes = new TextEncoder().encode(data);
      let bin = '';
      bytes.forEach((b) => {
        bin += String.fromCharCode(b);
      });
      const encoded = btoa(bin);
      const url = `${window.location.origin}${window.location.pathname}#qr=${encoded}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      flash('Share link copied (logo excluded for URL size).');
    } catch {
      flash('Could not build share link.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = (await parseConfigJson(file)) as Partial<QRDesignConfig>;
      onImportConfig(mergeQRConfig(parsed));
      flash('Theme JSON imported.');
    } catch {
      flash('Invalid theme JSON file.');
    } finally {
      e.target.value = '';
    }
  };

  const btnBusy = (key: string) => busy === key;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="export-filename" className="block text-xs font-medium text-slate-300 mb-1.5">
            File name
          </label>
          <input
            id="export-filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="openqr-code"
            maxLength={60}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300">Export resolution</span>
            <span className="font-mono text-indigo-400 font-bold">{resolution} px</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[512, 1024, 2048, 4096].map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`py-2 rounded-lg border text-xs font-mono font-medium transition-all ${
                  resolution === res
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {res >= 1000 ? `${res / 1000}k` : `${res}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {config.frame.style !== 'none' && (
        <p className="text-[11px] text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2">
          Frame is baked into PNG / WEBP / PDF. SVG export is frameless vector.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleExportPNG}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {btnBusy('png') ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          PNG
        </button>

        <button
          type="button"
          onClick={handleExportSVG}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-100 font-medium text-sm border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {btnBusy('svg') ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4 text-cyan-400" />}
          Vector SVG
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-100 font-medium text-sm border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {btnBusy('pdf') ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-amber-400" />}
          Print PDF
        </button>

        <button
          type="button"
          onClick={handleExportWEBP}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-100 font-medium text-sm border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {btnBusy('webp') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-emerald-400" />}
          WEBP
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={handleCopyImage}
          disabled={!!busy}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-xs text-slate-200 transition-colors disabled:opacity-60"
        >
          {btnBusy('copy') ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
          Copy image
        </button>
        <button
          type="button"
          onClick={handleShareLink}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-xs text-slate-200 transition-colors"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
          {copiedLink ? 'Copied' : 'Share link'}
        </button>
        <button
          type="button"
          onClick={() => exportConfigJson(config, filename || 'openqr-theme')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-xs text-slate-200 transition-colors"
        >
          <FileJson className="w-3.5 h-3.5 text-indigo-300" />
          Save theme
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-xs text-slate-200 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-300" />
          Load theme
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleImportFile} className="hidden" />
      </div>

      {notice && (
        <p className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2" role="status">
          {notice}
        </p>
      )}
    </div>
  );
};
