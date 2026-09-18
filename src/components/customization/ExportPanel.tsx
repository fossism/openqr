import React, { useRef, useState } from 'react';
import { Download, FileCode, FileText, Image as ImageIcon, Copy, Check, FileJson, Upload, Link2, Loader2, Layers } from 'lucide-react';
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
  onOpenBatch: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  getCanvasRef,
  getHighResCanvas,
  getSvgBlob,
  config,
  payloadText,
  onImportConfig,
  onOpenBatch,
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
          <label htmlFor="export-filename" className="block text-xs font-medium text-[#241E1B] mb-1.5">
            File name
          </label>
          <input
            id="export-filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="openqr-code"
            maxLength={60}
            className="w-full bg-[#FFF8F3] border border-[#241E1B] rounded-none px-3.5 py-2.5 text-sm text-[#241E1B] placeholder-[#241E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#16564F]"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-[#241E1B]/70 mb-1.5">
            <span className="font-medium text-[#241E1B]">Export resolution</span>
            <span className="font-mono text-[#241E1B] font-bold">{resolution} px</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[512, 1024, 2048, 4096].map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`py-2 rounded-none border text-xs font-mono font-medium transition-all ${
                  resolution === res
                    ? 'bg-[#16564F]/10 border-[#241E1B] text-[#241E1B]'
                    : 'bg-[#FFF8F3] border-[#241E1B]/30 text-[#241E1B]/70 hover:text-[#241E1B]'
                }`}
              >
                {res >= 1000 ? `${res / 1000}k` : `${res}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {config.frame.style !== 'none' && (
        <p className="text-[11px] text-[#241E1B]/70 bg-[#FFF8F3] border border-[#241E1B]/30 rounded-none px-3 py-2">
          Frame is baked into PNG / WEBP / PDF. SVG export is frameless vector.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleExportPNG}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#241E1B] hover:bg-[#16564F] disabled:opacity-60 text-[#FFF8F3] font-bold text-sm border-2 border-[#241E1B] shadow-[4px_4px_0_#241E1B] transition-all"
        >
          {btnBusy('png') ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          PNG
        </button>

        <button
          type="button"
          onClick={handleExportSVG}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] disabled:opacity-60 text-[#241E1B] font-medium text-sm border border-[#241E1B] transition-all"
        >
          {btnBusy('svg') ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4 text-[#241E1B]" />}
          Vector SVG
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] disabled:opacity-60 text-[#241E1B] font-medium text-sm border border-[#241E1B] transition-all"
        >
          {btnBusy('pdf') ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-[#241E1B]" />}
          Print PDF
        </button>

        <button
          type="button"
          onClick={handleExportWEBP}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] disabled:opacity-60 text-[#241E1B] font-medium text-sm border border-[#241E1B] transition-all"
        >
          {btnBusy('webp') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#241E1B]" />}
          WEBP
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={handleCopyImage}
          disabled={!!busy}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] border border-[#241E1B]/30 text-xs text-[#241E1B] transition-colors disabled:opacity-60"
        >
          {btnBusy('copy') ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
          Copy image
        </button>
        <button
          type="button"
          onClick={handleShareLink}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] border border-[#241E1B]/30 text-xs text-[#241E1B] transition-colors"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-[#241E1B]" /> : <Link2 className="w-3.5 h-3.5" />}
          {copiedLink ? 'Copied' : 'Share link'}
        </button>
        <button
          type="button"
          onClick={() => exportConfigJson(config, filename || 'openqr-theme')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] border border-[#241E1B]/30 text-xs text-[#241E1B] transition-colors"
        >
          <FileJson className="w-3.5 h-3.5 text-[#241E1B]" />
          Save theme
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#FFF8F3] hover:bg-[#16564F] hover:text-[#FFF8F3] border border-[#241E1B]/30 text-xs text-[#241E1B] transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-[#241E1B]" />
          Load theme
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleImportFile} className="hidden" />
      </div>

      <div className="p-4 rounded-none bg-[#FFF8F3] border-2 border-[#241E1B] shadow-[4px_4px_0_#241E1B] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#241E1B]" />
          <div>
            <p className="text-xs font-bold text-[#241E1B]">Need many codes at once?</p>
            <p className="text-[11px] text-[#241E1B]/60">Bulk-generate a labeled set as ZIP.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenBatch}
          className="px-3.5 py-2 rounded-none bg-[#241E1B] hover:bg-[#16564F] text-[#FFF8F3] text-xs font-bold border-2 border-[#241E1B] transition-colors shrink-0"
        >
          Batch mode
        </button>
      </div>

      {notice && (
        <p className="text-xs text-[#241E1B] bg-[#241E1B]/5 border border-[#241E1B]/30 rounded-none px-3 py-2" role="status">
          {notice}
        </p>
      )}
    </div>
  );
};
