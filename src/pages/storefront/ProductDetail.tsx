import { useState, useCallback, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  demoProducts,
  getRelatedProducts,
  getReviewsForProduct,
  getProductUrl,
} from '@/data/products';
import { Breadcrumbs, Badge, ProductCard, ProductQRCode } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/components/ui';
import {
  Box,
  Eye,
  Star,
  Check,
  Truck,
  Shield,
  Package,
  Heart,
  Share2,
  Minus,
  Plus,
  Ruler,
  Weight,
  ArrowRight,
  QrCode,
  Copy,
  Printer,
  Sparkles,
} from 'lucide-react';

const ModelViewer = lazy(() =>
  import('@/components/ui/ModelViewer').then((m) => ({ default: m.ModelViewer })),
);

export function ProductDetail({ productSlug }: { productSlug?: string } = {}) {
  const { productId } = useParams<{ productId: string }>();
  const lookup = productSlug ?? productId;
  const product = demoProducts.find((p) => p.slug === lookup || p.id === lookup);
  const { toast } = useToast();

  useDocumentTitle(product?.name);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [viewerMode, setViewerMode] = useState<'gallery' | '3d'>('gallery');

  const handleShare = useCallback(() => {
    if (navigator.share) {
      void navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
    } else {
      void navigator.clipboard?.writeText(window.location.href);
      toast('info', 'Product link copied to clipboard');
    }
  }, [toast]);

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <Box className="w-7 h-7 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-brand-900 mb-3">Product not found</h1>
        <p className="text-sm text-brand-500 mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          to="/products"
          className="inline-flex h-10 px-5 bg-brand-900 text-white rounded-xl text-sm font-medium items-center gap-2 hover:bg-brand-800 transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const reviews = getReviewsForProduct(product.id);
  const activeVariant = product.variants.find((v) => v.id === selectedVariant);
  const currentPrice = activeVariant ? product.price + activeVariant.priceModifier : product.price;
  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const otherVariants = product.variants.filter((v) => v.type !== 'color');
  const productUrl = getProductUrl(product);

  const specGroups = product.specifications.reduce<Record<string, typeof product.specifications>>(
    (acc, spec) => {
      const group = spec.group || 'General';
      (acc[group] ??= []).push(spec);
      return acc;
    },
    {},
  );

  const copyProductUrl = () => {
    void navigator.clipboard?.writeText(productUrl);
    toast('success', 'Product link copied — paste it anywhere');
  };

  return (
    <div className="container-page py-6 sm:py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
        className="mb-6 lg:mb-8"
      />

      {/* ─────────── Main product section ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left — gallery / 3D */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setViewerMode('gallery')}
              aria-pressed={viewerMode === 'gallery'}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewerMode === 'gallery'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-surface-100 text-brand-600 hover:bg-brand-100'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setViewerMode('3d')}
              aria-pressed={viewerMode === '3d'}
              disabled={!product.modelUrl}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                viewerMode === '3d'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-surface-100 text-brand-600 hover:bg-brand-100'
              }`}
            >
              <Box className="w-4 h-4" /> 3D View
            </button>
            {product.arReady && (
              <Link
                to={`/ar/${product.id}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-all shadow-sm shadow-accent-500/20"
              >
                <Eye className="w-4 h-4" /> View in AR
              </Link>
            )}
          </div>

          <div className="relative">
            {viewerMode === 'gallery' ? (
              <div className="relative aspect-[4/5] bg-brand-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.images[selectedImage]?.alt ?? product.name}
                  className="w-full h-full object-cover"
                />
                {product.arReady && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="accent" size="md" icon={<Eye className="w-3.5 h-3.5" />}>
                      AR ready
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-surface-100 border border-brand-200/60">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
                      <p className="text-xs text-brand-500 mt-3 font-medium">Loading 3D viewer…</p>
                    </div>
                  }
                >
                  <ModelViewer
                    modelUrl={product.modelUrl}
                    productName={product.name}
                    configuration={product.arConfiguration}
                    className="w-full h-full"
                  />
                </Suspense>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {viewerMode === 'gallery' && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                    selectedImage === idx
                      ? 'border-brand-900 shadow-sm'
                      : 'border-transparent hover:border-brand-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}

              {product.modelUrl && (
                <button
                  onClick={() => setViewerMode('3d')}
                  aria-label="View in 3D"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-transparent hover:border-accent-400 bg-surface-100 flex flex-col items-center justify-center gap-0.5 transition-all opacity-70 hover:opacity-100 shrink-0"
                >
                  <Box className="w-5 h-5 text-brand-600" />
                  <span className="text-2xs font-semibold text-brand-600">3D</span>
                </button>
              )}

              {product.arReady && (
                <Link
                  to={`/ar/${product.id}`}
                  aria-label="Open AR experience"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-transparent hover:border-accent-500 bg-accent-50 flex flex-col items-center justify-center gap-0.5 transition-all opacity-80 hover:opacity-100 shrink-0"
                >
                  <Eye className="w-5 h-5 text-accent-600" />
                  <span className="text-2xs font-semibold text-accent-600">AR</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right — product info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default" size="sm">{product.category}</Badge>
            <span className="text-xs text-brand-400">· {product.subcategory}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2.5 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-accent-400 text-accent-400'
                      : 'text-brand-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-brand-700">{product.rating}</span>
            <span className="text-sm text-brand-400">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-900">
              ${currentPrice.toLocaleString()}
            </span>
            {activeVariant && activeVariant.priceModifier > 0 && (
              <span className="text-sm text-brand-400 line-through">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-brand-600 mt-4 leading-relaxed">{product.shortDescription}</p>

          {/* Colour variants */}
          {colorVariants.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-brand-700">
                Colour:{' '}
                <span className="text-brand-900">
                  {colorVariants.find((v) => v.id === selectedVariant)?.name ??
                    colorVariants[0]?.name}
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {colorVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    disabled={!v.inStock}
                    aria-label={v.name}
                    title={v.name}
                    className={`relative w-10 h-10 rounded-xl border-2 transition-all ${
                      selectedVariant === v.id
                        ? 'border-brand-900 ring-2 ring-brand-900/20'
                        : v.inStock
                          ? 'border-brand-200 hover:border-brand-400'
                          : 'border-brand-200 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className="absolute inset-1.5 rounded-lg"
                      style={{ backgroundColor: v.value }}
                    />
                    {!v.inStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-brand-400 rotate-45" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Other variants */}
          {otherVariants.length > 0 && (
            <div className="mt-5">
              <label className="text-sm font-medium text-brand-700">
                Finish: <span className="text-brand-900 ml-1">
                  {otherVariants.find((v) => v.id === selectedVariant)?.name ?? otherVariants[0]?.name}
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {otherVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    disabled={!v.inStock}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedVariant === v.id
                        ? 'border-brand-900 bg-brand-900 text-white shadow-sm'
                        : v.inStock
                          ? 'border-brand-200 text-brand-700 hover:border-brand-400'
                          : 'border-brand-200 text-brand-300 cursor-not-allowed'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label className="text-sm font-medium text-brand-700">Quantity</label>
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center bg-surface-100 rounded-xl border border-brand-200/60">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-brand-500 hover:text-brand-900 transition-colors rounded-l-xl"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-brand-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-brand-500 hover:text-brand-900 transition-colors rounded-r-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-brand-500">
                {product.stockCount > 20 ? 'In stock' : `${product.stockCount} left`} — ships in
                3–5 business days
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              disabled={!product.inStock}
              onClick={() =>
                toast('success', `${quantity} × ${product.name} added (demo — no checkout)`)
              }
              className="w-full h-13 bg-brand-900 text-white rounded-xl text-sm font-semibold hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Package className="w-4 h-4" />
              Add to Cart — ${(currentPrice * quantity).toLocaleString()}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => (product.modelUrl ? setViewerMode('3d') : undefined)}
                disabled={!product.modelUrl}
                className="h-12 bg-surface-100 border border-brand-200/60 text-brand-800 rounded-xl text-sm font-semibold hover:bg-brand-100 hover:border-brand-300 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Box className="w-4 h-4" /> View in 3D
              </button>

              {product.arReady ? (
                <Link
                  to={`/ar/${product.id}`}
                  className="h-12 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-accent-500/25"
                >
                  <Eye className="w-4 h-4" /> View in AR
                </Link>
              ) : (
                <div className="h-12 bg-surface-100 border border-dashed border-brand-300 text-brand-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> AR coming soon
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5 mt-6 pt-6 border-t border-brand-200/60">
            {[
              { icon: Truck, label: 'Free shipping' },
              { icon: Shield, label: '2-year warranty' },
              { icon: Package, label: 'Easy returns' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs text-brand-500">
                <item.icon className="w-3.5 h-3.5 text-brand-400" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={() => toast('info', 'Saved to wishlist (demo)')}
              className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-error transition-colors"
            >
              <Heart className="w-3.5 h-3.5" /> Save to wishlist
            </button>
          </div>
        </div>
      </div>

      {/* ─────────── 3D & AR panel ─────────── */}
      <section className="mt-12 lg:mt-16 bg-surface-100 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-brand-900">3D &amp; AR Experience</h2>
          {product.arReady ? (
            <Badge variant="success" size="md" icon={<Check className="w-3 h-3" />}>
              Activated by Rapidify
            </Badge>
          ) : (
            <Badge variant="warning" size="md">Awaiting activation</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-brand-200/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Box className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-900">View in 3D</h3>
                <p className="text-2xs text-brand-500">Inspect every detail</p>
              </div>
            </div>
            <p className="text-xs text-brand-600 leading-relaxed">
              Rotate, zoom and explore the {product.name} from every angle in the real-time 3D
              viewer. Examine materials, proportions and craftsmanship before buying.
            </p>
            <button
              onClick={() => product.modelUrl && setViewerMode('3d')}
              disabled={!product.modelUrl}
              className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.modelUrl ? 'Open 3D viewer' : 'Model not generated yet'}{' '}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div
            className={`rounded-2xl p-5 border ${
              product.arReady
                ? 'bg-white border-brand-200/60'
                : 'bg-surface-50 border-dashed border-brand-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  product.arReady ? 'bg-accent-50' : 'bg-brand-100'
                }`}
              >
                <Eye
                  className={`w-5 h-5 ${product.arReady ? 'text-accent-600' : 'text-brand-400'}`}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-900">View in AR</h3>
                <p className="text-2xs text-brand-500">Place it in your room</p>
              </div>
            </div>
            <p className="text-xs text-brand-600 leading-relaxed">
              Use your phone camera to place the {product.name} in your actual space at true scale
              next to your existing furniture.
            </p>
            {product.arReady ? (
              <Link
                to={`/ar/${product.id}`}
                className="mt-3 text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
              >
                Open AR experience <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <p className="mt-3 text-xs text-brand-400">
                The merchant hasn&apos;t generated a model for this product yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─────────── QR section ─────────── */}
      <section className="mt-8 lg:mt-10 rounded-3xl border border-brand-200/60 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 p-6 sm:p-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wider">
                Take it to the showroom
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-900 tracking-tight">
              Scan to see it in your space
            </h2>
            <p className="text-sm text-brand-500 mt-2 leading-relaxed max-w-lg">
              Every Rapidify product has its own QR code. Point a phone camera at it — in-store or
              from this page — to land straight on this product and open the AR experience.
            </p>

            <div className="mt-4 flex items-center gap-2 bg-surface-100 border border-brand-200/60 rounded-xl px-3 py-2.5 max-w-md">
              <span className="text-xs font-mono text-brand-500 truncate flex-1">{productUrl}</span>
              <button
                onClick={copyProductUrl}
                aria-label="Copy product link"
                className="shrink-0 p-1.5 rounded-lg text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/merchant/products/${product.id}/qr`}
                className="h-10 px-4 bg-brand-900 text-white rounded-xl text-xs font-semibold hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Open printable poster
              </Link>
              {product.arReady && (
                <Link
                  to={`/ar/${product.id}`}
                  className="h-10 px-4 bg-accent-50 text-accent-700 border border-accent-200 rounded-xl text-xs font-semibold hover:bg-accent-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> View in AR
                </Link>
              )}
            </div>
          </div>

          <div className="justify-self-center md:justify-self-end">
            {product.qrReady ? (
              <div className="text-center">
                <ProductQRCode url={productUrl} size={176} showDownload downloadFileName={`rapidify-${product.slug}`} />
                <p className="text-2xs text-brand-400 mt-3 max-w-[13rem]">
                  Encodes this product&apos;s exact URL
                </p>
              </div>
            ) : (
              <div className="w-[228px] rounded-2xl border-2 border-dashed border-brand-300 bg-surface-50 p-6 text-center">
                <QrCode className="w-8 h-8 text-brand-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-brand-700">QR not generated</p>
                <p className="text-2xs text-brand-500 mt-1.5 leading-relaxed">
                  Rapidify generates a code for this product once its 3D model is activated.
                </p>
                <Link
                  to={`/merchant/products/${product.id}`}
                  className="mt-3 inline-flex text-2xs font-semibold text-accent-600 hover:text-accent-700"
                >
                  Open in dashboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────── About ─────────── */}
      <section className="mt-12 lg:mt-16 max-w-3xl">
        <h2 className="text-xl font-bold text-brand-900 mb-4">About this product</h2>
        <p className="text-brand-600 leading-relaxed text-[0.9375rem]">{product.description}</p>
      </section>

      {/* ─────────── Dimensions ─────────── */}
      <section className="mt-12 lg:mt-16">
        <h2 className="text-xl font-bold text-brand-900 mb-5">Dimensions &amp; Weight</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Ruler, label: 'Width', value: `${product.dimensions.width} ${product.dimensions.unit}` },
            { icon: Ruler, label: 'Height', value: `${product.dimensions.height} ${product.dimensions.unit}` },
            { icon: Ruler, label: 'Depth', value: `${product.dimensions.depth} ${product.dimensions.unit}` },
            { icon: Weight, label: 'Weight', value: `${product.weight.value} ${product.weight.unit}` },
          ].map((item) => (
            <div key={item.label} className="bg-surface-100 rounded-xl p-4 text-center">
              <item.icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
              <p className="text-2xs text-brand-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold text-brand-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── Specifications ─────────── */}
      {product.specifications.length > 0 && (
        <section className="mt-12 lg:mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-brand-900 mb-5">Specifications</h2>
          <div className="bg-white rounded-2xl border border-brand-200/60 overflow-hidden">
            {Object.entries(specGroups).map(([group, specs]) => (
              <div key={group}>
                <div className="px-5 py-2.5 bg-surface-50 border-b border-brand-200/60">
                  <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
                    {group}
                  </h3>
                </div>
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex px-5 py-3 ${
                      i < specs.length - 1 ? 'border-b border-brand-200/40' : ''
                    }`}
                  >
                    <span className="text-sm text-brand-500 w-44 shrink-0">{spec.label}</span>
                    <span className="text-sm text-brand-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────── Reviews ─────────── */}
      {reviews.length > 0 && (
        <section className="mt-12 lg:mt-16 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-900">Reviews ({reviews.length})</h2>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
              <span className="text-sm font-semibold text-brand-900">{product.rating}</span>
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-brand-200/60 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {review.authorName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-brand-900">{review.authorName}</p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-2xs font-medium text-success-dark bg-success-light px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? 'fill-accent-400 text-accent-400'
                              : 'text-brand-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-2xs text-brand-400 shrink-0">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold text-brand-900 text-sm mt-3">{review.title}</h4>
                <p className="text-sm text-brand-600 mt-1.5 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────── Related ─────────── */}
      {related.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-900">You might also like</h2>
            <Link
              to="/products"
              className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group"
            >
              View all{' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
