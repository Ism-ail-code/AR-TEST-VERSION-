import { Link, useNavigate } from 'react-router-dom';
import { Eye, Star, Heart, Box } from 'lucide-react';
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

  if (layout === 'list') {
    return (
      <div className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white rounded-2xl border border-brand-200/60 overflow-hidden hover:shadow-card-hover transition-all duration-300 ${className}`}>
        <Link to={`/product/${product.slug}`} className="relative w-full sm:w-40 h-48 sm:h-auto sm:min-h-[180px] bg-brand-100 overflow-hidden shrink-0">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.arModelUrl && (
            <div className="absolute top-2.5 left-2.5 bg-accent-500 text-white text-2xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Eye className="w-3 h-3" /> AR Ready
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col p-4 sm:p-5 sm:pr-5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
              <span className="text-xs font-medium text-brand-700">{product.rating}</span>
            </div>
            <span className="text-xs text-brand-400">({product.reviewCount} reviews)</span>
          </div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base font-semibold text-brand-900 group-hover:text-accent-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-brand-500 mt-1.5 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xs text-brand-400">{product.material.split(',')[0]?.trim()}</span>
            {colorVariants.length > 1 && (
              <>
                <span className="text-brand-300">&middot;</span>
                <span className="text-2xs text-brand-400">{colorVariants.length} colors</span>
              </>
            )}
          </div>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-brand-900">${product.price.toLocaleString()}</span>
            <div className="flex items-center gap-2">
              {product.arModelUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/ar/${product.id}`); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-50 text-accent-600 rounded-lg text-xs font-semibold hover:bg-accent-100 transition-colors"
                >
                  <Box className="w-3.5 h-3.5" /> View in 3D
                </button>
              )}
              <Link
                to={`/product/${product.slug}`}
                className="px-3.5 py-1.5 bg-brand-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white rounded-2xl border border-brand-200/60 overflow-hidden hover:shadow-card-hover transition-all duration-300 ${className}`}>
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-brand-100 overflow-hidden">
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.arModelUrl && (
            <span className="bg-accent-500 text-white text-2xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm backdrop-blur-sm">
              <Eye className="w-3 h-3" /> AR Ready
            </span>
          )}
          {product.stockCount <= 10 && product.inStock && (
            <span className="bg-warning text-white text-2xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
              Low Stock
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-brand-400 hover:text-error transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        >
          <Heart className="w-4 h-4" />
        </button>
        {/* Color swatches */}
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
        {/* View in 3D overlay */}
        {product.arModelUrl && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/ar/${product.id}`); }}
              className="w-full py-2.5 bg-brand-900/90 backdrop-blur-sm text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-brand-900 transition-colors shadow-lg"
            >
              <Box className="w-3.5 h-3.5" /> View in 3D &amp; AR
            </button>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
            <span className="text-xs font-medium text-brand-700">{product.rating}</span>
          </div>
          <span className="text-xs text-brand-400">({product.reviewCount})</span>
          <span className="ml-auto text-2xs text-brand-400 font-medium">{product.material.split(',')[0]?.trim()}</span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-brand-500 mt-1.5 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-lg font-bold text-brand-900">${product.price.toLocaleString()}</span>
          <span
            className={`text-2xs font-medium px-2 py-0.5 rounded-full ${
              product.inStock
                ? 'bg-success-light text-success-dark'
                : 'bg-error-light text-error-dark'
            }`}
          >
            {product.inStock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>
    </div>
  );
}
