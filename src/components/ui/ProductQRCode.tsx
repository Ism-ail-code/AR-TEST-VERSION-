import { useRef, useCallback } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

export interface ProductQRCodeProps {
  url: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  showDownload?: boolean;
  downloadFileName?: string;
  className?: string;
}

export function ProductQRCode({
  url,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#1a1a2e',
  level = 'H',
  includeMargin = false,
  showDownload = false,
  downloadFileName = 'rapidify-qr',
  className = '',
}: ProductQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = useCallback(
    (format: 'png' | 'svg') => {
      if (format === 'png') {
        const canvas = document.querySelector(`canvas[data-qr-url="${CSS.escape(url)}"]`) as HTMLCanvasElement | null;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `${downloadFileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const svgEl = document.querySelector(`svg[data-qr-url="${CSS.escape(url)}"]`) as SVGSVGElement | null;
        if (!svgEl) return;
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgEl);
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${downloadFileName}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    },
    [url, downloadFileName]
  );

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      {/* SVG version (for display + SVG download) */}
      <div className="relative">
        <QRCodeSVG
          value={url}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
          includeMargin={includeMargin}
          data-qr-url={url}
        />
      </div>

      {/* Hidden canvas version (for PNG download) */}
      {showDownload && (
        <div className="sr-only" aria-hidden="true">
          <QRCodeCanvas
            value={url}
            size={size * 2}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            includeMargin={includeMargin}
            data-qr-url={url}
          />
        </div>
      )}

      {/* Download buttons */}
      {showDownload && (
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('svg')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-lg hover:bg-brand-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> SVG
          </button>
          <button
            onClick={() => handleDownload('png')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-lg hover:bg-brand-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> PNG
          </button>
        </div>
      )}
    </div>
  );
}
