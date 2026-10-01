import { useCallback } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

export interface ProductQRCodeProps {
  url: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  showDownload?: boolean;
  downloadFileName?: string;
  className?: string;
}

/**
 * Renders a product's QR code from the product URL itself — never a
 * hard-coded value — and optionally exposes SVG / PNG downloads.
 */
export function ProductQRCode({
  url,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#1a1a18',
  level = 'H',
  showDownload = false,
  downloadFileName = 'rapidify-qr',
  className = '',
}: ProductQRCodeProps) {
  const handleDownload = useCallback(
    (format: 'png' | 'svg') => {
      if (format === 'png') {
        const canvas = document.querySelector(
          `canvas[data-qr-url="${CSS.escape(url)}"]`,
        ) as HTMLCanvasElement | null;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `${downloadFileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        return;
      }

      const svgEl = document.querySelector(
        `svg[data-qr-url="${CSS.escape(url)}"]`,
      ) as SVGSVGElement | null;
      if (!svgEl) return;
      const serialized = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${downloadFileName}.svg`;
      link.href = blobUrl;
      link.click();
      URL.revokeObjectURL(blobUrl);
    },
    [url, downloadFileName],
  );

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div className="p-3 bg-white rounded-2xl border border-brand-200/60 shadow-xs">
        <QRCodeSVG
          value={url}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
          marginSize={1}
          data-qr-url={url}
        />
      </div>

      {showDownload && (
        <div className="sr-only" aria-hidden="true">
          <QRCodeCanvas
            value={url}
            size={size * 2}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            marginSize={1}
            data-qr-url={url}
          />
        </div>
      )}

      {showDownload && (
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('svg')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-lg hover:bg-brand-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> SVG
          </button>
          <button
            onClick={() => handleDownload('png')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-lg hover:bg-brand-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> PNG
          </button>
        </div>
      )}
    </div>
  );
}
