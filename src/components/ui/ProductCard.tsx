import { Link, useNavigate } from 'react-router-dom';
import { Eye, Star, Box, Check, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, className = '', layout = 'grid' }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const navigate = useNavigate();
  const detailPath = `/product/${product.slug}`;

  const arChip = product.arReady ? (
    <span className="inline-flex items-center gap-1 bg-accent-500 text-white text-2xs font-semibold px-2 py-1 rounded-lg shadow-sm backdrop-blur-sm">
      <Eye className="w-3 h-3" /> View in AR
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-brand-800/80 text-white/70 text-2xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
      <Box className="w-3 h-3" /> 3D coming soon
    </span>
  );

  /* ───────────── list layout ───────────── */
  if (layout === 'list') {
    return (
      <div
        className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white rounded-2xl border border-brand-200/60 overflow-hidden hover:shadow-card-hover transition-all duration-300 ${className}`}
      >
        <Link
          to={detailPath}
          className="relative w-full sm:w-56 h-52 sm:h-auto sm:min-h-[200px] bg-brand-100 overflow-hidden shrink-0"
        >
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">{arChip}</div>
        </Link>

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
                View Product <ArrowRight className="w-3 h-3" />
              </Link>
              {product.arReady && (
                <button
                  onClick={() => navigate(`/ar/${product.id}`)}
                  className="px-4 py-2 bg-accent-50 text-accent-700 border border-accent-200 rounded-lg text-xs font-semibold hover:bg-accent-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> View in AR
                </button>
              )}
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
      <Link
        to={detailPath}
        className="block relative aspect-[4/5] bg-brand-100 overflow-hidden"
      >
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {arChip}
          {product.stockCount <= 10 && product.inStock && (
            <span className="bg-warning text-white text-2xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              Low stock
            </span>
          )}
        </div>

        {colorVariants.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
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
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xs font-semibold text-accent-600 uppercase tracking-wider">
            {product.subcategory}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
            <span className="text-xs font-medium text-brand-700">{product.rating}</span>
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={detailPath}
            className="h-9 bg-brand-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors flex items-center justify-center gap-1.5"
          >
            View Product
          </Link>
          {product.arReady ? (
            <button
              onClick={() => navigate(`/ar/${product.id}`)}
              className="h-9 bg-accent-500 text-white rounded-lg text-xs font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-accent-500/20"
            >
              <Eye className="w-3.5 h-3.5" /> View in AR
            </button>
          ) : (
            <Link
              to={detailPath}
              className="h-9 bg-surface-100 border border-brand-200/70 text-brand-500 rounded-lg text-xs font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Box className="w-3.5 h-3.5" /> 3D soon
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
