import React, { useState, useEffect } from 'react';
import { X, Layers, Download, FileSpreadsheet, RefreshCw, Eye } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCodeStyling from 'qr-code-styling';
import type { QRDesignConfig, BatchItem } from '../types/qr';
import { createQRCodeOptions, drawFrameOnCanvas } from '../utils/qrGenerator';
import { triggerConfetti, sanitizeFilename } from '../utils/exportUtils';

interface BatchGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  config: QRDesignConfig;
}

const parseLines = (inputText: string): BatchItem[] => {
  const lines = inputText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, idx) => {
    // Split on last comma so URLs with commas in query still work reasonably;
    // first token is payload, remainder is label.
    const sep = line.lastIndexOf(',');
    const content = (sep >= 0 ? line.slice(0, sep) : line).trim();
    const label = (sep >= 0 ? line.slice(sep + 1) : '').trim() || `QR_${idx + 1}`;
    let status: BatchItem['status'] = 'pending';
    if (!content) status = 'error';
    else if (content.length > 2000) status = 'error';
    return {
      id: `batch_${idx}_${Date.now()}`,
      content,
      label,
      status,
    };
  });
};

export const BatchGenerator: React.FC<BatchGeneratorProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [inputText, setInputText] = useState<string>(
    `https://openqr.io/table-1, Table 1
https://openqr.io/table-2, Table 2
https://openqr.io/table-3, Table 3`
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleParseInput = () => {
    const items = parseLines(inputText);
    setBatchItems(items);
    setError(items.length === 0 ? 'Add at least one line.' : null);
  };

  const handleGenerateZip = async () => {
    let itemsToProcess = batchItems;
    if (itemsToProcess.length === 0) {
      itemsToProcess = parseLines(inputText);
      setBatchItems(itemsToProcess);
    }

    const valid = itemsToProcess.filter((i) => i.status !== 'error' && i.content);
    if (valid.length === 0) {
      setError('No valid rows. Each line needs content under 2000 chars.');
      return;
    }
    setError(null);

    const total = valid.length;
    setIsProcessing(true);
    setProgress(0);

    const zip = new JSZip();
    const folder = zip.folder('openqr_batch_codes');

    const filenameCountMap: Record<string, number> = {};

    for (let i = 0; i < total; i++) {
      const item = valid[i];
      let tempDiv: HTMLDivElement | null = null;
      try {
        const itemConfig = { ...config };

        if (itemConfig.frame.style !== 'none') {
          itemConfig.frame = { ...itemConfig.frame, text: item.label };
        }

        const options = createQRCodeOptions(itemConfig, item.content);
        const qr = new QRCodeStyling(options);

        tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        qr.append(tempDiv);

        await new Promise((r) => setTimeout(r, 140));

        const rawCanvas = tempDiv.querySelector('canvas');
        if (rawCanvas) {
          const finalCanvas = drawFrameOnCanvas(
            rawCanvas,
            itemConfig.frame,
            itemConfig.backgroundColor,
            itemConfig.transparentBackground
          );
          const dataUrl = finalCanvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

          const rawLabel = sanitizeFilename(item.label.replace(/[^a-z0-9_-]/gi, '_') || `qr_${i + 1}`, `qr_${i + 1}`);
          const currentCount = (filenameCountMap[rawLabel] || 0) + 1;
          filenameCountMap[rawLabel] = currentCount;
          const safeFilename = currentCount > 1 ? `${rawLabel}_${currentCount}.png` : `${rawLabel}.png`;

          folder?.file(safeFilename, base64Data, { base64: true });
          setBatchItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: 'ready' as const } : p))
          );
        }
      } catch (err) {
        console.error('Batch QR render error:', err);
        setBatchItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: 'error' as const } : p))
        );
      } finally {
        if (tempDiv && document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
      }

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'openqr_batch_package.zip');
      triggerConfetti();
    } catch (err) {
      console.error('ZIP export failed:', err);
      setError('ZIP export failed. Try fewer rows.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Batch QR generator"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Batch QR Generator</h3>
              <p className="text-xs text-slate-400">
                Bulk generate multiple QR codes and export all as a ZIP archive
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close batch modal"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="batch-input" className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            Paste Multi-Line List or CSV Format (URL / Content, Label)
          </label>
          <textarea
            id="batch-input"
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com/item1, Table 1&#10;https://example.com/item2, Table 2"
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <p className="text-[11px] text-slate-500">
            Each line represents one QR code. Use comma <code className="text-cyan-300 font-mono">,</code> to separate URL payload from custom badge text.
          </p>
          <div>
            <button
              type="button"
              onClick={handleParseInput}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-300" />
              Preview {inputText.split('\n').filter((l) => l.trim()).length} rows
            </button>
          </div>
        </div>

        {batchItems.length > 0 && (
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-2 bg-slate-800/60 text-[11px] text-slate-400 font-medium">
              {batchItems.filter((b) => b.status !== 'error').length} valid / {batchItems.length} total
            </div>
            <ul className="max-h-40 overflow-y-auto divide-y divide-slate-800/80 text-xs">
              {batchItems.slice(0, 50).map((item) => (
                <li key={item.id} className="px-4 py-2 flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-slate-300" title={item.content}>
                    {item.content || '(empty)'}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-500 truncate max-w-[120px]">{item.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'ready'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : item.status === 'error'
                            ? 'bg-red-500/15 text-red-300'
                            : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {batchItems.length > 50 && (
              <div className="px-4 py-2 text-[11px] text-slate-500">Showing first 50 rows.</div>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2" role="alert">
            {error}
          </p>
        )}

        {isProcessing && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Generating batch QR canvas images...
              </span>
              <span className="font-bold text-cyan-400">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerateZip}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Generate & Download ZIP
          </button>
        </div>
      </div>
    </div>
  );
};
