import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#16564F', '#E8B84B', '#241E1B', '#16564F', '#E8B84B'],
    });
  } catch {
    // Ignore if confetti fails in headless env
  }
};

/**
 * Sanitizes filename to eliminate path traversal and OS-restricted characters
 */
export const sanitizeFilename = (filename: string, fallback: string = 'openqr-code'): string => {
  if (!filename) return fallback;
  const clean = filename.replace(/[^a-zA-Z0-9_\-.\s]/g, '_').trim();
  return clean || fallback;
};

/**
 * Downloads a rendered Canvas as PNG, WEBP, or JPEG
 */
export const exportCanvasImage = (
  canvas: HTMLCanvasElement,
  filename: string = 'openqr-code',
  format: 'png' | 'webp' | 'jpeg' = 'png'
) => {
  if (!canvas) return;
  const mimeType = `image/${format}`;
  // toDataURL quality is ignored for PNG; only used for lossy formats
  const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL(mimeType, 0.92);
  const safeName = sanitizeFilename(filename, 'openqr-code');
  
  const link = document.createElement('a');
  link.download = `${safeName}.${format}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  triggerConfetti();
};

/**
 * Exports SVG element content to SVG file
 */
export const exportSvgFile = (svgElement: SVGElement, filename: string = 'openqr-code') => {
  if (!svgElement) return;
  const serializer = new XMLSerializer();
  let svgData = serializer.serializeToString(svgElement);

  if (!svgData.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const safeName = sanitizeFilename(filename, 'openqr-code');
  saveAs(blob, `${safeName}.svg`);

  triggerConfetti();
};

/**
 * Exports Canvas QR code to a print-friendly PDF document.
 * NOTE: this embeds a high-resolution PNG snapshot (not infinite vector).
 * Use SVG export when you need true vector.
 */
export const exportPdfDocument = (
  canvas: HTMLCanvasElement,
  filename: string = 'openqr-document',
  titleText: string = 'Scan QR Code'
) => {
  if (!canvas) return;

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Center alignment calculations for A4 (210mm x 297mm)
  const pageWidth = 210;
  const qrSize = 120;
  const x = (pageWidth - qrSize) / 2;

  // Brand header: teal on cream
  pdf.setFillColor(255, 248, 243); // #FFF8F3
  pdf.rect(0, 0, 210, 297, 'F');
  pdf.setFillColor(22, 86, 79); // #16564F
  pdf.rect(0, 0, 210, 18, 'F');
  pdf.setFillColor(232, 184, 75); // #E8B84B
  pdf.rect(0, 18, 210, 4, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(22, 86, 79); // teal
  pdf.text('OPEN QR CODE', pageWidth / 2, 26, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(22, 86, 79);
  const titleLines = pdf.splitTextToSize(titleText.slice(0, 140), 170) as string[];
  const titleStartY = 36;
  pdf.text(titleLines, pageWidth / 2, titleStartY, { align: 'center' });

  // QR position shifts down with wrapped title lines so nothing overlaps
  const y = titleStartY + titleLines.length * 7 + 8;

  // Draw QR Image
  pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

  // Border frame around QR on PDF: teal sharp
  pdf.setDrawColor(22, 86, 79);
  pdf.setLineWidth(1.2);
  pdf.rect(x - 5, y - 5, qrSize + 10, qrSize + 10);

  // Footer note
  pdf.setFontSize(10);
  pdf.setTextColor(22, 86, 79);
  pdf.text('Generated using OpenQR: Privacy-First Open Source QR Generator', pageWidth / 2, y + qrSize + 25, { align: 'center' });

  const safeName = sanitizeFilename(filename, 'openqr-document');
  pdf.save(`${safeName}.pdf`);
  triggerConfetti();
};

export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement): Promise<boolean> => {
  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
};

export const downloadSvgBlob = (blob: Blob, filename: string) => {
  const safeName = sanitizeFilename(filename, 'openqr-vector');
  saveAs(blob, `${safeName}.svg`);
  triggerConfetti();
};

export const exportConfigJson = (config: unknown, filename = 'openqr-theme') => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  saveAs(blob, `${sanitizeFilename(filename, 'openqr-theme')}.json`);
};

export const parseConfigJson = async (file: File): Promise<unknown> => {
  const text = await file.text();
  return JSON.parse(text);
};

export const encodeShareData = (data: unknown): string => {
  // lz-string is loaded lazily to keep the initial bundle small.
  // Fallback to plain base64 if the import fails (e.g. offline mid-update).
  // NOTE: this sync wrapper is kept for backwards compat; prefer encodeShareDataAsync.
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return `b64:${btoa(bin)}`;
};

export const encodeShareDataCompressed = async (data: unknown): Promise<string> => {
  const json = JSON.stringify(data);
  try {
    const mod = (await import('lz-string')) as unknown as Record<string, unknown> & {
      compressToEncodedURIComponent?: (s: string) => string;
    };
    const fn =
      mod.compressToEncodedURIComponent ??
      (mod.default as { compressToEncodedURIComponent?: (s: string) => string } | undefined)
        ?.compressToEncodedURIComponent;
    if (typeof fn === 'function') return `lz:${fn.call(mod, json)}`;
    return encodeShareData(data);
  } catch {
    return encodeShareData(data);
  }
};

export const decodeShareData = async (encoded: string): Promise<unknown | null> => {
  try {
    if (encoded.startsWith('lz:')) {
      const mod = (await import('lz-string')) as unknown as Record<string, unknown> & {
        decompressFromEncodedURIComponent?: (s: string) => string | null;
      };
      const fn =
        mod.decompressFromEncodedURIComponent ??
        (mod.default as { decompressFromEncodedURIComponent?: (s: string) => string | null } | undefined)
          ?.decompressFromEncodedURIComponent;
      if (typeof fn !== 'function') return null;
      const json = fn.call(mod, encoded.slice(3));
      if (!json) return null;
      return JSON.parse(json);
    }
    const raw = encoded.startsWith('b64:') ? encoded.slice(4) : encoded;
    const bin = atob(raw);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const decodeShareDataSync = (encoded: string): unknown | null => {
  // Sync path for legacy b64 payloads only (used during initial render).
  try {
    if (encoded.startsWith('lz:')) return null; // needs async decompress
    const raw = encoded.startsWith('b64:') ? encoded.slice(4) : encoded;
    const bin = atob(raw);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
};
