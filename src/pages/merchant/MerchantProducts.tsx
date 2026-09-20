import { Link } from 'react-router-dom';
import { demoProducts, getProductPageUrl, getQRCodesForProduct } from '@/data/demo';
import {
  Eye,
  QrCode,
  Box,
  Smartphone,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink,
  Check,
} from 'lucide-react';

export function MerchantProducts() {
  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Products</h1>
          <p className="text-sm text-brand-500 mt-1">{demoProducts.length} products in your catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              className="h-9 pl-9 pr-4 bg-white border border-brand-200/60 rounded-lg text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 w-56"
            />
          </div>
          <button className="h-9 px-4 bg-surface-100 border border-brand-200/60 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-100 transition-colors flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="h-9 px-4 bg-brand-900 text-white rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {demoProducts.map((product) => {
          const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
          const has3D = !!product.arModelUrl;
          const hasAR = !!product.arConfiguration;
          const hasQR = getQRCodesForProduct(product.id).length > 0;
          const productUrl = getProductPageUrl(product);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-brand-200/60 overflow-hidden group hover:shadow-md hover:shadow-brand-900/5 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-brand-100 overflow-hidden">
                <img
                  src={primaryImage?.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status badges overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {has3D && (
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-brand-800 text-2xs font-semibold px-2 py-1 rounded-lg">
                      <Box className="w-3 h-3" /> 3D Ready
                    </span>
                  )}
                  {hasAR && (
                    <span className="inline-flex items-center gap-1 bg-accent-500/90 backdrop-blur-sm text-white text-2xs font-semibold px-2 py-1 rounded-lg">
                      <Smartphone className="w-3 h-3" /> AR Ready
                    </span>
                  )}
                  {hasQR && (
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-brand-800 text-2xs font-semibold px-2 py-1 rounded-lg">
                      <QrCode className="w-3 h-3" /> QR
                    </span>
                  )}
                </div>
                {/* Price badge */}
                <div className="absolute bottom-3 right-3">
                  <span className="bg-brand-900/80 backdrop-blur-sm text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name + category */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-brand-900 truncate">{product.name}</h3>
                  <p className="text-2xs text-brand-400 mt-0.5">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</p>
                </div>

                {/* Status grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-surface-50 rounded-lg px-2.5 py-2 text-center">
                    <Box className="w-3.5 h-3.5 text-brand-400 mx-auto mb-1" />
                    <p className="text-2xs font-medium text-brand-700">3D Model</p>
                    <p className={`text-2xs font-semibold ${has3D ? 'text-emerald-600' : 'text-brand-400'}`}>
                      {has3D ? '✓ Ready' : '— None'}
                    </p>
                  </div>
                  <div className="bg-surface-50 rounded-lg px-2.5 py-2 text-center">
                    <Smartphone className="w-3.5 h-3.5 text-brand-400 mx-auto mb-1" />
                    <p className="text-2xs font-medium text-brand-700">AR Experience</p>
                    <p className={`text-2xs font-semibold ${hasAR ? 'text-emerald-600' : 'text-brand-400'}`}>
                      {hasAR ? '✓ Ready' : '— None'}
                    </p>
                  </div>
                  <div className="bg-surface-50 rounded-lg px-2.5 py-2 text-center">
                    <QrCode className="w-3.5 h-3.5 text-brand-400 mx-auto mb-1" />
                    <p className="text-2xs font-medium text-brand-700">QR Code</p>
                    <p className={`text-2xs font-semibold ${hasQR ? 'text-emerald-600' : 'text-brand-400'}`}>
                      {hasQR ? '✓ Generated' : '— None'}
                    </p>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/merchant/products/${product.id}`}
                    className="flex-1 h-9 bg-brand-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Manage
                  </Link>
                  <Link
                    to={`/merchant/products/${product.id}/qr`}
                    className="h-9 px-3 bg-surface-100 border border-brand-200/60 text-brand-600 rounded-lg text-xs font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-1"
                    aria-label="QR Code"
                    title="QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/merchant/products/${product.id}/preview`}
                    className="h-9 px-3 bg-surface-100 border border-brand-200/60 text-brand-600 rounded-lg text-xs font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-1"
                    aria-label="Customer Preview"
                    title="Customer Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/product/${product.slug}`}
                    className="h-9 px-3 bg-surface-100 border border-brand-200/60 text-brand-600 rounded-lg text-xs font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-1"
                    aria-label="View live"
                    title="View live"
                    target="_blank"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
