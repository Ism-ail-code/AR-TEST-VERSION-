import { useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  findProduct,
  getProductUrl,
  getProductStats,
  demoStore,
} from '@/data/products';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ArrowLeft, Download, Eye, Smartphone, Printer, QrCode, ScanLine } from 'lucide-react';

export function QRCodePage() {
  const { productId } = useParams<{ productId: string }>();
  const product = findProduct(productId);
  const posterRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(product ? `QR poster · ${product.name}` : 'QR poster');

  const handleDownloadSVG = useCallback(() => {
    const svgEl = posterRef.current?.querySelector('svg[data-qr]') as SVGSVGElement | null;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `rapidify-qr-${product!.slug}.svg`;
    link.href = blobUrl;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }, [product]);

  const handleDownloadPNG = useCallback(() => {
    const svgEl = posterRef.current?.querySelector('svg[data-qr]') as SVGSVGElement | null;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(blobUrl);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `rapidify-qr-${product!.slug}.png`;
      link.href = pngUrl;
      link.click();
    };
    img.src = blobUrl;
  }, [product]);

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-brand-900 mb-4">Product Not Found</h2>
        <Link to="/merchant/products" className="text-sm text-accent-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const qrUrl = getProductUrl(product);
  const stats = getProductStats(product.id);
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const active = product.qrReady;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-surface-50 -m-4 sm:-m-6">
      {/* Top actions (hidden on print) */}
      <div className="no-print px-4 sm:px-6 py-4 border-b border-brand-200/60 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/merchant/products/${product.id}`}
            className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {product.name}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/merchant/products/${product.id}/preview`}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-brand-700 bg-brand-100 rounded-xl hover:bg-brand-200 transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview experience
            </Link>
            <Link
              to={`/ar/${product.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-accent-500 rounded-xl hover:bg-accent-600 transition-colors"
            >
              <Smartphone className="w-4 h-4" /> View in AR
            </Link>
            {active && (
              <>
                <button
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-brand-700 bg-brand-100 rounded-xl hover:bg-brand-200 transition-colors"
                >
                  <Download className="w-4 h-4" /> SVG
                </button>
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-brand-700 bg-brand-100 rounded-xl hover:bg-brand-200 transition-colors"
                >
                  <Download className="w-4 h-4" /> PNG
                </button>
              </>
            )}
            <button
              onClick={() => window.print()}
              disabled={!active}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-brand-900 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* ─── The poster (this is what gets printed) ─── */}
      <div className="flex justify-center py-8 px-4">
        <div
          ref={posterRef}
          className="w-full max-w-[560px] bg-white rounded-2xl border border-brand-200/60 shadow-sm overflow-hidden print:shadow-none print:border-none print:rounded-none"
        >
          {active ? (
            <div className="p-8 sm:p-10 flex flex-col items-center text-center">
              {/* Brand header */}
              <div className="flex items-center gap-2.5 mb-7">
                <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{demoStore.logoInitials}</span>
                </div>
                <span className="text-brand-900 font-semibold tracking-tight">
                  {demoStore.name}
                </span>
                <span className="w-px h-4 bg-brand-200" />
                <span className="text-2xs font-bold uppercase tracking-widest text-accent-600">
                  Rapidify
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-900 leading-[1.05] tracking-tight">
                SCAN TO SEE IT
                <br />
                IN YOUR SPACE
              </h1>

              <div className="flex items-center gap-1.5 text-brand-500 text-xs font-medium mt-3 mb-7">
                <ScanLine className="w-3.5 h-3.5 text-accent-500" />
                Point your phone camera at the code — no app needed
              </div>

              {/* QR code */}
              <div
                data-qr
                className="p-4 bg-white rounded-2xl border border-brand-200/70 shadow-xs"
              >
                <QRCodeSVG
                  value={qrUrl}
                  size={210}
                  bgColor="#ffffff"
                  fgColor="#1a1a18"
                  level="H"
                  marginSize={1}
                />
              </div>

              <p className="text-brand-400 text-2xs font-mono mt-3 break-all max-w-[300px]">
                {qrUrl}
              </p>

              {/* Product */}
              <div className="mt-7 w-full border-t border-brand-200/70 pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-100 shrink-0">
                    {primaryImage && (
                      <img
                        src={primaryImage.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-lg font-bold text-brand-900 truncate">{product.name}</p>
                    <p className="text-sm text-brand-500">
                      ${product.price.toLocaleString()} · {product.material}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5 bg-accent-500 text-white text-xs font-bold px-3 py-2 rounded-xl">
                    <Eye className="w-3.5 h-3.5" /> View in AR
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 mt-5 text-brand-400">
                  <span className="text-2xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> View in 3D
                  </span>
                  <span className="text-2xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> True scale
                  </span>
                  <span className="text-2xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> In your room
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-7 pt-5 border-t border-brand-200/70 w-full">
                <p className="text-2xs text-brand-400">
                  Powered by <span className="font-semibold text-brand-500">Rapidify</span> · AR
                  commerce for furniture retailers
                </p>
              </div>
            </div>
          ) : (
            /* ─── Not-yet-activated state ─── */
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center mb-6">
                <span className="text-white font-bold text-sm">{demoStore.logoInitials}</span>
              </div>
              <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-brand-300 bg-surface-50 flex flex-col items-center justify-center">
                <QrCode className="w-10 h-10 text-brand-300 mb-2" />
                <p className="text-2xs text-brand-400 uppercase tracking-wider">
                  Not generated
                </p>
              </div>
              <h1 className="text-xl font-bold text-brand-900 mt-6">{product.name}</h1>
              <p className="text-sm text-brand-500 mt-2 max-w-[320px] leading-relaxed">
                Rapidify generates a QR code once this product&apos;s 3D model has been
                created and the AR experience is configured.
              </p>
              <Link
                to={`/merchant/products/${product.id}`}
                className="mt-5 h-10 px-5 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors inline-flex items-center"
              >
                Back to product setup
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar (hidden on print) */}
      <div className="no-print max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-white rounded-xl border border-brand-200/60 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xs text-brand-400 uppercase tracking-wider">QR status</p>
              <p
                className={`text-sm font-semibold ${active ? 'text-success-dark' : 'text-brand-500'}`}
              >
                {active ? '✓ Ready to print' : 'Pending activation'}
              </p>
            </div>
            <div>
              <p className="text-2xs text-brand-400 uppercase tracking-wider">Scans (demo)</p>
              <p className="text-lg font-bold text-brand-900">
                {stats.qrScans.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-2xs text-brand-400 uppercase tracking-wider">Encoded URL</p>
              <p className="text-sm font-semibold text-brand-900 max-w-[280px] truncate font-mono">
                {qrUrl}
              </p>
            </div>
          </div>
          <Link
            to={`/merchant/products/${product.id}`}
            className="text-xs font-medium text-accent-600 hover:text-accent-700"
          >
            View product →
          </Link>
        </div>
        <p className="text-2xs text-brand-400 mt-3">
          Static prototype: set <code className="font-mono">VITE_BASE_URL</code> at build time
          so printed codes resolve to your deployed demo instead of localhost.
        </p>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
