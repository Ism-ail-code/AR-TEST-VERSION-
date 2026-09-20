import { useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { demoProducts, demoStore, getProductPageUrl, getQRCodesForProduct } from '@/data/demo';
import { ArrowLeft, Download, Eye, Smartphone, Printer } from 'lucide-react';

export function QRCodePage() {
  const { productId } = useParams<{ productId: string }>();
  const product = demoProducts.find((p) => p.id === productId || p.slug === productId);
  const posterRef = useRef<HTMLDivElement>(null);

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

  const qrUrl = getProductPageUrl(product);
  const qr = getQRCodesForProduct(product.id)[0];
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  const handleDownloadSVG = useCallback(() => {
    const svgEl = posterRef.current?.querySelector('svg[data-qr]') as SVGSVGElement | null;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-${product.slug}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [product.slug]);

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
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-${product.slug}.png`;
      link.href = pngUrl;
      link.click();
    };
    img.src = url;
  }, [product.slug]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top actions (hidden on print) */}
      <div className="no-print px-6 py-4 border-b border-brand-200/60 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to={`/merchant/products/${product.id}`}
            className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to product
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={`/merchant/products/${product.id}/preview`}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-accent-500 rounded-xl hover:bg-accent-600 transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview experience
            </Link>
            <Link
              to={`/product/${product.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-brand-700 bg-brand-100 rounded-xl hover:bg-brand-200 transition-colors"
            >
              Open live
            </Link>
            <button
              onClick={handleDownloadSVG}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-brand-900 rounded-xl hover:bg-brand-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Download SVG
            </button>
            <button
              onClick={handleDownloadPNG}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-brand-900 rounded-xl hover:bg-brand-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-brand-700 bg-brand-100 rounded-xl hover:bg-brand-200 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Poster content (this is what gets printed) */}
      <div className="flex justify-center py-8 px-4">
        <div
          ref={posterRef}
          className="w-full max-w-[680px] bg-white rounded-2xl border border-brand-200/60 shadow-sm overflow-hidden print:shadow-none print:border-none print:rounded-none"
        >
          {/* Poster layout */}
          <div className="p-8 sm:p-12 flex flex-col items-center text-center">
            {/* Brand header */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-brand-900 font-semibold tracking-tight">Casa Living</span>
            </div>

            {/* Product image */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-brand-100 mb-8 border border-brand-200/40">
              {primaryImage && (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Product name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="text-brand-500 text-sm mb-8">{product.material}</p>

            {/* QR Code */}
            <div className="mb-6">
              <QRCodeSVG
                value={qrUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#1a1a2e"
                level="H"
                includeMargin={false}
                data-qr
              />
            </div>

            {/* URL display */}
            <p className="text-brand-400 text-xs font-mono mb-3 break-all max-w-[280px]">{qrUrl}</p>

            {/* Scan instruction */}
            <div className="flex items-center gap-2 text-brand-700 mb-2">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm font-semibold">Scan to view this product</span>
            </div>

            {/* Feature callouts */}
            <div className="flex items-center gap-4 mt-4 text-brand-400">
              <span className="text-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> View in 3D
              </span>
              <span className="text-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> View in AR
              </span>
              <span className="text-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> Add to cart
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-brand-900 mt-6">${product.price.toLocaleString()}</p>

            {/* Footer branding */}
            <div className="mt-10 pt-6 border-t border-brand-200/60 w-full">
              <p className="text-2xs text-brand-400">
                Powered by <span className="font-semibold text-brand-500">Rapidify</span> &middot; AR Commerce Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar (hidden on print) */}
      {qr && (
        <div className="no-print max-w-5xl mx-auto px-6 pb-8">
          <div className="bg-white rounded-xl border border-brand-200/60 p-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xs text-brand-400 uppercase tracking-wider">Total scans</p>
                <p className="text-lg font-bold text-brand-900">{qr.scanCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-2xs text-brand-400 uppercase tracking-wider">Format</p>
                <p className="text-sm font-semibold text-brand-900 uppercase">{qr.format}</p>
              </div>
              <div>
                <p className="text-2xs text-brand-400 uppercase tracking-wider">Created</p>
                <p className="text-sm font-semibold text-brand-900">{new Date(qr.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <Link
              to={`/merchant/products/${product.id}`}
              className="text-xs font-medium text-accent-600 hover:text-accent-700"
            >
              View analytics →
            </Link>
          </div>
        </div>
      )}

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
