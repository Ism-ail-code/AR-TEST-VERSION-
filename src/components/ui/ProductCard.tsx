import { Link } from 'react-router-dom';
import { Eye, Star, Box, Check, Heart, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { useShop } from '@/context/ShopContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, className = '', layout = 'grid' }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const { toggleWishlist, isWishlisted } = useShop();
  const detailPath = `/product/${product.slug}`;
  const saved = isWishlisted(product.id);

  /**
   * AR entry point — a small pill that sits ON the photo, in the same spot on
   * every card, the way a wishlist heart would. It is the only AR call to
   * action on the card, and it carries this product's own id.
   */
  const arWidget = product.arReady ? (
    <Link
      to={`/ar/${product.id}`}
      aria-label={`View ${product.name} in AR`}
      className="group/ar absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md pl-2.5 pr-3 py-1.5 rounded-full text-2xs font-semibold text-brand-800 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:bg-accent-500 hover:text-white hover:ring-accent-500 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <Eye className="w-3.5 h-3.5 text-accent-600 transition-colors group-hover/ar:text-white" />
      View in AR
    </Link>
  ) : (
    <span className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 bg-brand-800/70 text-white/75 text-2xs font-medium px-2.5 py-1.5 rounded-full backdrop-blur-sm">
      <Box className="w-3 h-3" /> 3D coming soon
    </span>
  );

  const lowStock =
    product.stockCount <= 10 && product.inStock ? (
      <span className="bg-warning text-white text-2xs font-semibold px-2 py-1 rounded-lg shadow-sm">
        Low stock
      </span>
    ) : null;

  /* ───────────── list layout ───────────── */
  if (layout === 'list') {
    return (
      <div
        className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white rounded-2xl border border-brand-200/60 overflow-hidden hover:shadow-card-hover transition-all duration-300 ${className}`}
      >
        <div className="relative w-full sm:w-56 h-52 sm:h-auto sm:min-h-[200px] bg-brand-100 overflow-hidden shrink-0">
          <Link to={detailPath} className="absolute inset-0 block">
            <img
              src={primaryImage?.url}
              alt={primaryImage?.alt}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-3 left-3">{lowStock}</div>
          {arWidget}
        </div>

        <div className="flex-1 min-w-0 flex flex-col p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xs font-semibold text-accent-600 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-brand-300">·</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
              <span className="text-xs font-medium text-brand-700">{product.rating}</span>
              <span className="text-xs text-brand-400">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={detailPath}>
            <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-brand-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xl font-bold text-brand-900">
              ${product.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to={detailPath}
                className="px-4 py-2 bg-brand-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
              >
                View Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────── grid layout ───────────── */
  return (
    <div
      className={`group bg-white rounded-2xl border border-brand-200/60 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col ${className}`}
    >
      <div className="relative aspect-[4/5] bg-brand-100 overflow-hidden">
        <Link to={detailPath} className="absolute inset-0 block">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {lowStock}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors ${
            saved
              ? 'bg-accent-500 text-white'
              : 'bg-white/90 text-brand-500 hover:text-accent-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>

        {colorVariants.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 pointer-events-none">
            {colorVariants.slice(0, 5).map((v) => (
              <div
                key={v.id}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: v.value }}
                title={v.name}
              />
            ))}
          </div>
        )}

        {arWidget}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xs font-semibold text-accent-600 uppercase tracking-wider">
            {product.subcategory}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
            <span className="text-xs font-medium text-brand-700">{product.rating}</span>
            <span className="text-xs text-brand-400">({product.reviewCount})</span>
          </div>
        </div>

        <Link to={detailPath}>
          <h3 className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-brand-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <span className="text-lg font-bold text-brand-900">
            ${product.price.toLocaleString()}
          </span>
          <span
            className={`text-2xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              product.inStock
                ? 'bg-success-light text-success-dark'
                : 'bg-error-light text-error-dark'
            }`}
          >
            {product.inStock ? <Check className="w-2.5 h-2.5" /> : null}
            {product.inStock ? 'In stock' : 'Sold out'}
          </span>
        </div>

        <div className="mt-4">
          <Link
            to={detailPath}
            className="h-9 w-full bg-brand-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors flex items-center justify-center gap-1.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
