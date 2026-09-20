import { useState, useCallback, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoProducts, getRelatedProducts, getReviewsForProduct } from '@/data/demo';
import { Breadcrumbs, Badge, ProductCard } from '@/components/ui';

const ModelViewer = lazy(() =>
  import('@/components/ui/ModelViewer').then((m) => ({ default: m.ModelViewer }))
);
import {
  Eye,
  Box,
  Star,
  ChevronRight,
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
  Layers,
  ArrowRight,
} from 'lucide-react';

export function ProductDetail({ productSlug }: { productSlug?: string } = {}) {
  const { productId } = useParams<{ productId: string }>();
  const lookup = productSlug ?? productId;
  const product = demoProducts.find((p) => p.slug === lookup || p.id === lookup);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [viewerMode, setViewerMode] = useState<'gallery' | '3d'>('gallery');

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <Box className="w-7 h-7 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-brand-900 mb-3">Product Not Found</h1>
        <p className="text-sm text-brand-500 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link to="/products" className="inline-flex h-10 px-5 bg-brand-900 text-white rounded-xl text-sm font-medium items-center gap-2 hover:bg-brand-800 transition-colors">Browse Products</Link>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const reviews = getReviewsForProduct(product.id);
  const activeVariant = product.variants.find((v) => v.id === selectedVariant);
  const currentPrice = activeVariant ? product.price + activeVariant.priceModifier : product.price;
  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const otherVariants = product.variants.filter((v) => v.type !== 'color');

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [product.name]);

  // Group specifications by group
  const specGroups = product.specifications.reduce<Record<string, typeof product.specifications>>((acc, spec) => {
    const group = spec.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {});

  return (
    <div className="container-page py-6 sm:py-8 lg:py-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
        className="mb-6 lg:mb-8"
      />

      {/* ─── Main product section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left: Image / 3D viewer */}
        <div>
          {/* Viewer mode toggle */}
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
              Images
            </button>
            <button
              onClick={() => setViewerMode('3d')}
              aria-pressed={viewerMode === '3d'}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewerMode === '3d'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-surface-100 text-brand-600 hover:bg-brand-100'
              }`}
            >
              <Box className="w-4 h-4" /> 3D View
            </button>
          </div>

          {/* Main display area */}
          <div className="relative">
            {viewerMode === 'gallery' ? (
              /* Image gallery */
              <div className="relative aspect-[4/5] bg-brand-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.images[selectedImage]?.alt}
                  className="w-full h-full object-cover"
                />
                {/* AR badge on image */}
                {product.arModelUrl && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="accent" size="md" icon={<Eye className="w-3.5 h-3.5" />}>
                      AR Ready
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              /* 3D viewer */
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-surface-100 border border-brand-200/60">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
                      <p className="text-xs text-brand-500 mt-3 font-medium">Loading 3D viewer...</p>
                    </div>
                  }
                >
                  <ModelViewer
                    modelUrl={product.arModelUrl}
                    productName={product.name}
                    className="w-full h-full"
                  />
                </Suspense>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {viewerMode === 'gallery' && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === idx
                      ? 'border-brand-900 shadow-sm'
                      : 'border-transparent hover:border-brand-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
              {/* 3D thumbnail */}
              <button
                onClick={() => setViewerMode('3d')}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-transparent hover:border-accent-400 bg-surface-100 flex items-center justify-center transition-all opacity-60 hover:opacity-100"
              >
                <div className="text-center">
                  <Box className="w-5 h-5 text-brand-500 mx-auto" />
                  <span className="text-2xs text-brand-500 mt-0.5 block">3D</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col">
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default" size="sm">{product.category}</Badge>
            {product.subcategory && (
              <span className="text-xs text-brand-400">&middot; {product.subcategory}</span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2.5 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-accent-400 text-accent-400' : 'text-brand-200'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-brand-700">{product.rating}</span>
            <span className="text-sm text-brand-400">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-900">${currentPrice.toLocaleString()}</span>
            {activeVariant && activeVariant.priceModifier > 0 && (
              <span className="text-sm text-brand-400 line-through">${product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Short description */}
          <p className="text-brand-600 mt-4 leading-relaxed">{product.shortDescription}</p>

          {/* Color variants */}
          {colorVariants.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-brand-700">
                Color: <span className="text-brand-900">{colorVariants.find((v) => v.id === selectedVariant)?.name || colorVariants[0]?.name}</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {colorVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    disabled={!v.inStock}
                    aria-label={v.name}
                    className={`relative w-10 h-10 rounded-xl border-2 transition-all ${
                      selectedVariant === v.id
                        ? 'border-brand-900 ring-2 ring-brand-900/20'
                        : v.inStock
                        ? 'border-brand-200 hover:border-brand-400'
                        : 'border-brand-200 opacity-40 cursor-not-allowed'
                    }`}
                    title={v.name}
                  >
                    <div className="absolute inset-1.5 rounded-lg" style={{ backgroundColor: v.value }} />
                    {!v.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-brand-400 rotate-45" />
                      </div>
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
                {otherVariants[0]?.type === 'finish' ? 'Finish' : 'Option'}:
                <span className="text-brand-900 ml-1">
                  {otherVariants.find((v) => v.id === selectedVariant)?.name || 'Select'}
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
                    {!v.inStock && <span className="text-2xs ml-1 opacity-50">(unavail.)</span>}
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
                <span className="w-12 text-center text-sm font-semibold text-brand-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-brand-500 hover:text-brand-900 transition-colors rounded-r-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-brand-500">
                {product.stockCount > 20 ? 'In stock' : `${product.stockCount} left`} &mdash; ships in 3-5 business days
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 space-y-3">
            {/* Add to Cart */}
            <button
              disabled={!product.inStock}
              className="w-full h-13 bg-brand-900 text-white rounded-xl text-sm font-semibold hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Package className="w-4 h-4" />
              Add to Cart &mdash; ${(currentPrice * quantity).toLocaleString()}
            </button>

            {/* View in 3D + View in AR side by side */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setViewerMode('3d')}
                className="h-12 bg-surface-100 border border-brand-200/60 text-brand-800 rounded-xl text-sm font-semibold hover:bg-brand-100 hover:border-brand-300 transition-all flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" /> View in 3D
              </button>
              <Link to={`/ar/${product.id}`} className="flex-1">
                <button className="w-full h-12 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-accent-500/20">
                  <Eye className="w-4 h-4" /> View in AR
                </button>
              </Link>
            </div>
          </div>

          {/* Trust badges */}
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

          {/* Share / Wishlist */}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-error transition-colors">
              <Heart className="w-3.5 h-3.5" /> Save to wishlist
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3D / AR distinction panel ─── */}
      <section className="mt-12 lg:mt-16 bg-surface-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-brand-900 mb-5">3D &amp; AR Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-brand-200/60">
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
              Rotate, zoom, and explore the {product.name} from every angle in the interactive 3D viewer. Examine materials, proportions, and craftsmanship before buying.
            </p>
            <button
              onClick={() => setViewerMode('3d')}
              className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Open 3D viewer <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="bg-white rounded-xl p-5 border border-brand-200/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-900">View in AR</h3>
                <p className="text-2xs text-brand-500">Place in your room</p>
              </div>
            </div>
            <p className="text-xs text-brand-600 leading-relaxed">
              Use your phone camera to place the {product.name} in your actual space. See how it looks at true scale next to your existing furniture.
            </p>
            <Link to={`/ar/${product.id}`} className="mt-3 text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1">
              Open AR experience <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About this product ─── */}
      <section className="mt-12 lg:mt-16 max-w-3xl">
        <h2 className="text-xl font-bold text-brand-900 mb-4">About this product</h2>
        <p className="text-brand-600 leading-relaxed text-[0.9375rem]">{product.fullDescription}</p>
      </section>

      {/* ─── Dimensions ─── */}
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

      {/* ─── Specifications ─── */}
      {product.specifications.length > 0 && (
        <section className="mt-12 lg:mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-brand-900 mb-5">Specifications</h2>
          <div className="bg-white rounded-2xl border border-brand-200/60 overflow-hidden">
            {Object.entries(specGroups).map(([group, specs], groupIdx) => (
              <div key={group}>
                <div className="px-5 py-2.5 bg-surface-50 border-b border-brand-200/60">
                  <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">{group}</h3>
                </div>
                {specs.map((spec, i) => (
                  <div key={i} className={`flex px-5 py-3 ${i < specs.length - 1 ? 'border-b border-brand-200/40' : ''}`}>
                    <span className="text-sm text-brand-500 w-44 shrink-0">{spec.label}</span>
                    <span className="text-sm text-brand-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Reviews ─── */}
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
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-accent-400 text-accent-400' : 'text-brand-200'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-2xs text-brand-400 shrink-0">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-semibold text-brand-900 text-sm mt-3">{review.title}</h4>
                <p className="text-sm text-brand-600 mt-1.5 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-900">You might also like</h2>
            <Link to="/products" className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group">
              View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
