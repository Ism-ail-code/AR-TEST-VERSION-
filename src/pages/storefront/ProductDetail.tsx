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
import { useShop } from '@/context/ShopContext';
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
  ShoppingBag,
} from 'lucide-react';

const ModelViewer = lazy(() =>
  import('@/components/ui/ModelViewer').then((m) => ({ default: m.ModelViewer })),
);

export function ProductDetail({ productSlug }: { productSlug?: string } = {}) {
  const { productId } = useParams<{ productId: string }>();
  const lookup = productSlug ?? productId;
  const product = demoProducts.find((p) => p.slug === lookup || p.id === lookup);
  const { toast } = useToast();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

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
  const saved = isWishlisted(product.id);
  /** Friendly word for "view this ___ in your space" copy. */
  const noun = /sofa/i.test(product.name)
    ? 'sofa'
    : /chair/i.test(product.name)
      ? 'chair'
      : /table/i.test(product.name)
        ? 'table'
        : /lamp/i.test(product.name)
          ? 'lamp'
          : 'piece';
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
          { label: 'Shop', href: '/products' },
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
          </div>

          <div className="relative">
            {viewerMode === 'gallery' ? (
              <div className="relative aspect-[4/5] bg-brand-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.images[selectedImage]?.alt ?? product.name}
                  className="w-full h-full object-cover"
                />
                {product.arReady ? (
                  <Link
                    to={`/ar/${product.id}`}
                    aria-label={`View ${product.name} in AR`}
                    className="group/ar absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md pl-3.5 pr-4 py-2.5 rounded-full text-xs font-semibold text-brand-800 shadow-md ring-1 ring-black/5 transition-all duration-200 hover:bg-accent-500 hover:text-white hover:ring-accent-500 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                  >
                    <Eye className="w-4 h-4 text-accent-600 transition-colors group-hover/ar:text-white" />
                    View in AR
                  </Link>
                ) : (
                  <span className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-brand-800/70 text-white/80 text-xs font-medium px-3.5 py-2.5 rounded-full backdrop-blur-sm">
                    <Box className="w-3.5 h-3.5" /> 3D coming soon
                  </span>
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
              onClick={() => {
                addToCart(product.id, quantity, activeVariant?.id ?? null);
                toast('success', `${quantity} × ${product.name} added to your bag`);
              }}
              className="w-full h-13 bg-brand-900 text-white rounded-xl text-sm font-semibold hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart — ${(currentPrice * quantity).toLocaleString()}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast('info', saved ? 'Removed from your wishlist' : 'Saved to your wishlist');
                }}
                aria-pressed={saved}
                className={`h-12 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                  saved
                    ? 'bg-accent-50 border-accent-300 text-accent-700'
                    : 'bg-white border-brand-200/60 text-brand-800 hover:border-brand-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-accent-500 text-accent-500' : ''}`} />
                {saved ? 'Wishlisted' : 'Wishlist'}
              </button>

              <button
                onClick={handleShare}
                className="h-12 bg-white border border-brand-200/60 text-brand-800 rounded-xl text-sm font-semibold hover:border-brand-400 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* ─────────── See it in your space ─────────── */}
          <div className="mt-8 rounded-2xl border border-brand-200/70 bg-surface-100 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2.5">
              <Eye className="w-4 h-4 text-accent-600" />
              <span className="text-2xs font-semibold uppercase tracking-wider text-accent-600">
                Augmented reality
              </span>
            </div>

            <h2 className="text-lg font-bold text-brand-900">See it in your space</h2>
            <p className="text-sm text-brand-600 mt-1.5 leading-relaxed">
              Not sure how it will look? View the {noun} in your actual room before buying.
            </p>

            {product.arReady ? (
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <Link
                  to={`/ar/${product.id}`}
                  className="h-11 px-5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors inline-flex items-center justify-center gap-2 shadow-sm shadow-accent-500/25"
                >
                  <Eye className="w-4 h-4" /> View in AR
                </Link>
                <a
                  href="#qr-code"
                  className="h-11 px-5 bg-white border border-brand-200 text-brand-800 rounded-xl text-sm font-semibold hover:border-brand-400 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> Scan QR to view in AR
                </a>
              </div>
            ) : (
              <p className="mt-3 text-xs text-brand-500 leading-relaxed">
                3D and AR aren&apos;t available for this piece yet — the photos above show every
                angle.
              </p>
            )}

            <p className="mt-4 text-2xs text-brand-400">AR by Rapidify</p>
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
        </div>
      </div>

      {/* ─────────── QR section ─────────── */}
      <section
        id="qr-code"
        className="mt-8 lg:mt-10 rounded-3xl border border-brand-200/60 bg-white overflow-hidden scroll-mt-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 p-6 sm:p-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wider">
                On your phone
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-brand-900 tracking-tight">
              View this {noun} in your space
            </h2>
            <p className="text-sm text-brand-500 mt-2 leading-relaxed max-w-lg">
              {product.arReady ? (
                <>
                  Scan with your phone camera. This page opens on your phone and the{' '}
                  <Link to={`/ar/${product.id}`} className="text-accent-600 hover:text-accent-700">
                    {product.name}
                  </Link>{' '}
                  drops straight into your room.
                </>
              ) : (
                <>
                  Every product has its own code — no two share one. Scan it with your phone
                  camera to open this page on the spot.
                </>
              )}
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

            <p className="mt-4 text-2xs text-brand-400">
              Each piece has its own code — no two products share one.
            </p>
          </div>

          <div className="justify-self-center md:justify-self-end text-center">
            {product.qrReady ? (
              <>
                <ProductQRCode
                  url={productUrl}
                  size={176}
                  showDownload
                  downloadFileName={`casa-living-${product.slug}`}
                />
                <p className="text-sm font-semibold text-brand-900 mt-3">{product.name}</p>
                <p className="text-2xs text-brand-400 mt-0.5">Scan to open on your phone</p>
              </>
            ) : (
              <div className="w-[228px] rounded-2xl border-2 border-dashed border-brand-300 bg-surface-50 p-6 text-center">
                <QrCode className="w-8 h-8 text-brand-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-brand-700">No QR code yet</p>
                <p className="text-2xs text-brand-500 mt-1.5 leading-relaxed">
                  A code appears here once this piece is available in 3D.
                </p>
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
