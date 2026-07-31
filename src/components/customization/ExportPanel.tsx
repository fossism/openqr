import React from 'react';
import { Download, FileCode, FileText, Image as ImageIcon } from 'lucide-react';
import { exportCanvasImage, exportSvgFile, exportPdfDocument } from '../../utils/exportUtils';
import type { QRDesignConfig } from '../../types/qr';

interface ExportPanelProps {
  getCanvasRef: () => HTMLCanvasElement | null;
  getSvgRef: () => SVGElement | null;
  config: QRDesignConfig;
  payloadText: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  getCanvasRef,
  getSvgRef,
  config,
  payloadText,
}) => {
  const [resolution, setResolution] = React.useState<number>(1024);

  const handleExportPNG = () => {
    const canvas = getCanvasRef();
    if (!canvas) return;
    exportCanvasImage(canvas, 'openqr-code', 'png');
  };

  const handleExportWEBP = () => {
    const canvas = getCanvasRef();
    if (!canvas) return;
    exportCanvasImage(canvas, 'openqr-code', 'webp');
  };

  const handleExportSVG = () => {
    const svg = getSvgRef();
    if (svg) {
      exportSvgFile(svg, 'openqr-vector');
    } else {
      handleExportPNG();
    }
  };

  const handleExportPDF = () => {
    const canvas = getCanvasRef();
    if (!canvas) return;
    exportPdfDocument(canvas, 'openqr-document', config.frame.text || payloadText.substring(0, 40));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium text-slate-300">Export Resolution (Pixels)</span>
          <span className="font-mono text-indigo-400 font-bold">{resolution} x {resolution} px</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[512, 1024, 2048, 4096].map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => setResolution(res)}
              className={`py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                resolution === res
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {res >= 1000 ? `${res / 1000}k` : `${res}px`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleExportPNG}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ImageIcon className="w-4 h-4" />
          Download PNG
        </button>

        <button
          type="button"
          onClick={handleExportSVG}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          Vector SVG
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          Print PDF
        </button>

        <button
          type="button"
          onClick={handleExportWEBP}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          WEBP Image
        </button>
      </div>
    </div>
  );
};
