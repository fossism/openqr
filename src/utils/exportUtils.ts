import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
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
  const clean = filename.replace(/[^a-zA-Z0-9_\-\.\s]/g, '_').trim();
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
  const dataUrl = canvas.toDataURL(mimeType, 1.0);
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

  if (!svgData.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const safeName = sanitizeFilename(filename, 'openqr-code');
  saveAs(blob, `${safeName}.svg`);

  triggerConfetti();
};

/**
 * Exports Canvas QR code to printable vector/high-res PDF document
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
  const y = 50;

  // Modern clean Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(15, 23, 42); // slate-900
  pdf.text('OPEN QR CODE', pageWidth / 2, 30, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(71, 85, 105); // slate-600
  pdf.text(titleText, pageWidth / 2, 40, { align: 'center' });

  // Draw QR Image
  pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

  // Border frame around QR on PDF
  pdf.setDrawColor(226, 232, 240); // slate-200
  pdf.setLineWidth(0.5);
  pdf.rect(x - 5, y - 5, qrSize + 10, qrSize + 10);

  // Footer note
  pdf.setFontSize(10);
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text('Generated using OpenQR — Privacy-First Open Source QR Generator', pageWidth / 2, y + qrSize + 25, { align: 'center' });

  const safeName = sanitizeFilename(filename, 'openqr-document');
  pdf.save(`${safeName}.pdf`);
  triggerConfetti();
};
