import { Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findProduct } from '@/data/products';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ExternalLink, Smartphone, Box, QrCode, Check } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Lazily share the exact same storefront component as the customer route. */
const ProductDetail = lazy(() =>
  import('@/pages/storefront/ProductDetail').then((m) => ({ default: m.ProductDetail })),
);

/**
 * Customer preview — renders the *same* storefront product component the
 * customer sees, driven by the *same* static product object. It only wraps it
 * in a merchant toolbar so the reviewer can jump straight back to the dashboard.
 */
export function CustomerPreview() {
  const { productId } = useParams<{ productId: string }>();
  const product = findProduct(productId);

  useDocumentTitle(product ? `Preview · ${product.name}` : 'Customer preview');

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-900 mb-4">Product Not Found</h2>
          <Link to="/merchant/products" className="text-sm text-accent-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* ─── Merchant preview toolbar ─── */}
      <div className="sticky top-0 z-50 bg-brand-900 border-b border-brand-700 shadow-lg shadow-brand-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          {/* Left: back + context */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/merchant/products/${product.id}`}
              className="flex items-center gap-1.5 text-brand-300 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />{' '}
              <span className="hidden sm:inline text-sm font-medium">Merchant</span>
            </Link>
            <div className="w-px h-5 bg-brand-700" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-accent-500 text-white text-2xs font-bold px-2 py-0.5 rounded-full shrink-0">
                PREVIEW
              </span>
              <span className="text-sm text-brand-300 truncate hidden sm:inline">
                Exactly what the customer sees
              </span>
            </div>
          </div>

          {/* Center: product info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={primaryImage?.url}
              alt=""
              className="w-6 h-6 rounded-md object-cover bg-brand-700 shrink-0"
            />
            <span className="text-sm font-medium text-white truncate">{product.name}</span>
            <span className="text-brand-400 text-2xs hidden md:inline">
              ${product.price.toLocaleString()}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 mr-2">
              {[
                { icon: Box, label: '3D', ok: !!product.modelUrl },
                { icon: Smartphone, label: 'AR', ok: product.arReady },
                { icon: QrCode, label: 'QR', ok: product.qrReady },
              ].map((f) => (
                <span
                  key={f.label}
                  className={`inline-flex items-center gap-1 text-2xs font-medium px-1.5 py-0.5 rounded ${
                    f.ok ? 'bg-success/20 text-success-dark' : 'bg-brand-700 text-brand-400'
                  }`}
                >
                  {f.ok && <Check className="w-2.5 h-2.5" />}
                  {f.label}
                </span>
              ))}
            </div>
            <Link
              to={`/product/${product.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 h-7 px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-2xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />{' '}
              <span className="hidden sm:inline">Open live</span>
            </Link>
            <Link
              to={`/merchant/products/${product.id}`}
              className="flex items-center gap-1.5 h-7 px-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-2xs font-semibold transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ─── The real customer experience (reused component + data) ─── */}
      <div className="flex flex-col min-h-[calc(100vh-48px)]">
        <Navbar />
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
              </div>
            }
          >
            <ProductDetail productSlug={product.slug} />
          </Suspense>
        </main>
        <Footer />
      </div>

      {/* ─── Floating preview badge ─── */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-brand-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-lg border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-2xs font-medium">Same product object</span>
          <span className="text-brand-400 text-2xs">&middot;</span>
          <Link
            to={`/merchant/products/${product.id}`}
            className="text-2xs text-accent-400 hover:text-accent-300 font-medium transition-colors"
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
}
