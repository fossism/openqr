import React, { useState } from 'react';
import { X, Layers, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCodeStyling from 'qr-code-styling';
import type { QRDesignConfig, BatchItem } from '../types/qr';
import { createQRCodeOptions, drawFrameOnCanvas } from '../utils/qrGenerator';
import { triggerConfetti } from '../utils/exportUtils';

interface BatchGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  config: QRDesignConfig;
}

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

  if (!isOpen) return null;

  const handleParseInput = () => {
    const lines = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const items: BatchItem[] = lines.map((line, idx) => {
      const parts = line.split(',');
      const content = parts[0].trim();
      const label = parts[1]?.trim() || `QR_${idx + 1}`;
      return {
        id: `batch_${idx}_${Date.now()}`,
        content,
        label,
        status: 'pending',
      };
    });

    setBatchItems(items);
  };

  const handleGenerateZip = async () => {
    if (batchItems.length === 0) {
      handleParseInput();
    }

    setIsProcessing(true);
    setProgress(0);

    const zip = new JSZip();
    const folder = zip.folder('openqr_batch_codes');

    const total = batchItems.length;

    for (let i = 0; i < total; i++) {
      const item = batchItems[i];
      try {
        const itemConfig = { ...config };

        if (itemConfig.frame.style !== 'none') {
          itemConfig.frame = { ...itemConfig.frame, text: item.label };
        }

        const options = createQRCodeOptions(itemConfig, item.content);
        const qr = new QRCodeStyling(options);

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        qr.append(tempDiv);

        await new Promise((r) => setTimeout(r, 100));

        const rawCanvas = tempDiv.querySelector('canvas');
        if (rawCanvas) {
          const finalCanvas = drawFrameOnCanvas(rawCanvas, itemConfig.frame, itemConfig.backgroundColor);
          const dataUrl = finalCanvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

          const safeFilename = `${item.label.replace(/[^a-z0-9_-]/gi, '_')}.png`;
          folder?.file(safeFilename, base64Data, { base64: true });
        }

        document.body.removeChild(tempDiv);
      } catch (err) {
        console.error('Batch QR render error:', err);
      }

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'openqr_batch_package.zip');

    setIsProcessing(false);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
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
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            Paste Multi-Line List or CSV Format (URL / Content, Label)
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com/item1, Table 1&#10;https://example.com/item2, Table 2"
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <p className="text-[11px] text-slate-500">
            Each line represents one QR code. Use comma <code className="text-cyan-300 font-mono">,</code> to separate URL payload from custom badge text.
          </p>
        </div>

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
