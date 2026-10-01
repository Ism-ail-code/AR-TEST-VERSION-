import { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoProducts, demoStats, getProductUrl } from '@/data/products';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/components/ui';
import {
  Eye,
  QrCode,
  Box,
  Smartphone,
  Plus,
  Search,
  ArrowUpRight,
  ExternalLink,
  Check,
  X,
  Calendar,
} from 'lucide-react';

type StatusFilter = 'all' | 'ready' | 'pending';

export function MerchantProducts() {
  useDocumentTitle('Merchant · Products');
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = demoProducts.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'ready' && p.arReady) ||
      (statusFilter === 'pending' && !p.arReady);
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Products</h1>
          <p className="text-sm text-brand-500 mt-1">
            {demoStats.productsSynced} products synced from {`Casa Living`} &middot;{' '}
            <span className="text-success-dark font-medium">{demoStats.arReady} AR ready</span>{' '}
            &middot; {demoStats.qrReady} QR ready
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-9 w-full pl-9 pr-4 bg-white border border-brand-200/60 rounded-lg text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
            />
          </div>

          <div className="flex items-center bg-white border border-brand-200/60 rounded-lg overflow-hidden h-9">
            {(
              [
                ['all', 'All'],
                ['ready', 'AR ready'],
                ['pending', 'Pending'],
              ] as [StatusFilter, string][]
            ).map(([value, label], i) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 h-full text-xs font-medium transition-colors ${i > 0 ? 'border-l border-brand-200/60' : ''} ${
                  statusFilter === value
                    ? 'bg-brand-900 text-white'
                    : 'text-brand-500 hover:text-brand-900 hover:bg-surface-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => toast('info', 'Static prototype — new products are not persisted')}
            className="h-9 px-4 bg-brand-900 text-white rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
            const has3D = !!product.modelUrl;
            const hasAR = product.arReady;
            const hasQR = product.qrReady;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-brand-200/60 overflow-hidden group hover:shadow-card-hover transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-brand-100 overflow-hidden">
                  <img
                    src={primaryImage?.url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {hasAR ? (
                      <span className="inline-flex items-center gap-1 bg-accent-500/95 backdrop-blur-sm text-white text-2xs font-semibold px-2 py-1 rounded-lg">
                        <Smartphone className="w-3 h-3" /> AR Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-brand-900/85 backdrop-blur-sm text-white/90 text-2xs font-semibold px-2 py-1 rounded-lg">
                        <X className="w-3 h-3" /> AR pending
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-brand-900/85 backdrop-blur-sm text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-brand-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-2xs text-brand-400 mt-0.5">
                      {product.category} · {product.subcategory}
                    </p>
                  </div>

                  {/* Status grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-surface-50 rounded-lg px-2 py-2 text-center">
                      <Box className="w-3.5 h-3.5 text-brand-400 mx-auto mb-1" />
                      <p className="text-2xs font-medium text-brand-700">3D Model</p>
                      <p
                        className={`text-2xs font-semibold ${has3D ? 'text-success-dark' : 'text-brand-400'}`}
                      >
                        {has3D ? '✓ Connected' : '— None'}
                      </p>
                    </div>
                    <div className="bg-surface-50 rounded-lg px-2 py-2 text-center">
                      <Smartphone className="w-3.5 h-3.5 text-brand-400 mx-auto mb-1" />
                      <p className="text-2xs font-medium text-brand-700">AR Status</p>
                      <p
                        className={`text-2xs font-semibold ${hasAR ? 'text-success-dark' : 'text-brand-400'}`}
                      >
                        {hasAR ? '✓ Ready' : '— Pending'}
                      </p>
                    </div>
                    <div className="bg-surface-50 rounded-lg px-2 py-2 text-center">
                      <QrCode className="w-3.5 h-3.5 text-brand-400 mx-auto mb-1" />
                      <p className="text-2xs font-medium text-brand-700">QR Status</p>
                      <p
                        className={`text-2xs font-semibold ${hasQR ? 'text-success-dark' : 'text-brand-400'}`}
                      >
                        {hasQR ? '✓ Generated' : '— None'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-2xs text-brand-400 mb-4">
                    <Calendar className="w-3 h-3" />
                    Updated {new Date(product.lastUpdated).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2">
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
                    <a
                      href={getProductUrl(product)}
                      target="_blank"
                      rel="noreferrer"
                      className="h-9 px-3 bg-surface-100 border border-brand-200/60 text-brand-600 rounded-lg text-xs font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-1"
                      aria-label="View live"
                      title="View live"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-brand-200/60">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-brand-400" />
          </div>
          <h3 className="text-base font-semibold text-brand-900">No products match</h3>
          <p className="text-sm text-brand-500 mt-1.5">Try a different search or status filter.</p>
          <button
            onClick={() => {
              setQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 h-9 px-4 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors inline-flex items-center gap-1.5"
          >
            Reset filters <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <p className="text-2xs text-brand-400 mt-5 flex items-center gap-1.5">
        <Check className="w-3 h-3 text-success" /> The catalogue, dashboard and customer
        storefront all read from the same static product list.
      </p>
    </div>
  );
}
