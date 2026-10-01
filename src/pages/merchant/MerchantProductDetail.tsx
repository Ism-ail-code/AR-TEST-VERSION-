import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findProduct, getProductStats, getProductUrl, getARUrl } from '@/data/products';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/components/ui';
import {
  ArrowLeft,
  QrCode,
  Eye,
  Save,
  Box,
  Smartphone,
  ExternalLink,
  Check,
  X,
  Ruler,
  Weight,
} from 'lucide-react';

export function MerchantProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = findProduct(productId);
  const { toast } = useToast();
  const [imageIndex, setImageIndex] = useState(0);

  useDocumentTitle(product ? `Merchant · ${product.name}` : 'Merchant');

  if (!product) {
    return (
      <div className="max-w-6xl text-center py-16">
        <h2 className="text-xl font-bold text-brand-900 mb-4">Product Not Found</h2>
        <Link
          to="/merchant/products"
          className="text-sm text-accent-600 hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const stats = getProductStats(product.id);
  const cfg = product.arConfiguration;
  const has3D = !!product.modelUrl;

  const statusRow = [
    {
      icon: Box,
      label: '3D / AR Model',
      ok: has3D,
      detail: has3D ? `${product.modelFile} · GLB` : 'No model generated',
    },
    {
      icon: Smartphone,
      label: 'AR Status',
      ok: product.arReady,
      detail: product.arReady
        ? `${cfg?.environmentPreset} · ${cfg?.lightingPreset} lighting`
        : 'Not activated',
    },
    {
      icon: QrCode,
      label: 'QR Code',
      ok: product.qrReady,
      detail: product.qrReady
        ? `${stats.qrScans.toLocaleString()} scans`
        : 'Not generated',
    },
  ];

  return (
    <div className="max-w-6xl">
      <Link
        to="/merchant/products"
        className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      {/* ─── Header ─── */}
      <div className="bg-white rounded-2xl border border-brand-200/60 p-5 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={product.images[imageIndex]?.url ?? product.images[0]?.url}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover bg-brand-100 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-brand-900 tracking-tight truncate">
                  {product.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-2xs font-bold px-2.5 py-1 rounded-full ${
                    product.arReady
                      ? 'bg-success-light text-success-dark'
                      : 'bg-surface-100 border border-brand-200/70 text-brand-500'
                  }`}
                >
                  {product.arReady ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {product.arReady ? 'AR READY' : 'AR PENDING'}
                </span>
              </div>
              <p className="text-sm text-brand-500 mt-1">
                ${product.price.toLocaleString()} · {product.category} · {product.subcategory}
              </p>
            </div>
          </div>

          {/* Required actions */}
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/merchant/products/${product.id}/preview`}
              className="h-10 px-4 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors inline-flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Preview Customer Experience
            </Link>
            <Link
              to={`/merchant/products/${product.id}/qr`}
              className="h-10 px-4 bg-surface-100 border border-brand-200/60 text-brand-700 rounded-xl text-sm font-medium hover:bg-brand-100 transition-colors inline-flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> View QR Code
            </Link>
            {product.arReady ? (
              <Link
                to={`/ar/${product.id}`}
                className="h-10 px-4 bg-accent-500 text-white rounded-xl text-sm font-medium hover:bg-accent-600 transition-colors inline-flex items-center gap-2 shadow-sm shadow-accent-500/25"
              >
                <Smartphone className="w-4 h-4" /> View in AR
              </Link>
            ) : (
              <button
                disabled
                title="Activate the AR model first"
                className="h-10 px-4 bg-surface-100 border border-dashed border-brand-300 text-brand-400 rounded-xl text-sm font-medium inline-flex items-center gap-2 cursor-not-allowed"
              >
                <Smartphone className="w-4 h-4" /> View in AR (pending)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Status cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statusRow.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl p-4 border border-brand-200/60 flex items-center gap-3"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                item.ok ? 'bg-success-light' : 'bg-surface-100'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${item.ok ? 'text-success-dark' : 'text-brand-400'}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-900">{item.label}</p>
              <p className="text-2xs text-brand-400 truncate">{item.detail}</p>
            </div>
            <span
              className={`ml-auto shrink-0 text-2xs font-bold px-2 py-0.5 rounded-full ${
                item.ok
                  ? 'text-success-dark bg-success-light'
                  : 'text-brand-500 bg-surface-100 border border-brand-200/70'
              }`}
            >
              {item.ok ? '✓ Ready' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Left: product info + images ─── */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-brand-900">Product images</h2>
              <span className="text-2xs text-brand-400">{product.images.length} uploaded</span>
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-brand-100 mb-3">
              <img
                src={product.images[imageIndex]?.url}
                alt={product.images[imageIndex]?.alt ?? product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setImageIndex(idx)}
                  aria-label={`Show image ${idx + 1}`}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    imageIndex === idx
                      ? 'border-brand-900'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-brand-900">Product details</h2>
              <span className="text-2xs text-brand-400">Demo form · not persisted</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-brand-500">Product name</label>
                <input
                  type="text"
                  defaultValue={product.name}
                  className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-500">Short description</label>
                <textarea
                  defaultValue={product.shortDescription}
                  rows={2}
                  className="mt-1.5 w-full px-3 py-2 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-500">Price ($)</label>
                  <input
                    type="number"
                    defaultValue={product.price}
                    className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-500">Category</label>
                  <input
                    type="text"
                    defaultValue={product.category}
                    className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-500">Stock</label>
                  <input
                    type="number"
                    defaultValue={product.stockCount}
                    className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-500">Material</label>
                  <input
                    type="text"
                    defaultValue={product.material}
                    className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-500">Slug</label>
                  <input
                    type="text"
                    defaultValue={product.slug}
                    className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 font-mono focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-surface-50 border border-brand-200/60 p-3">
                <label className="text-xs font-medium text-brand-500">Product URL (what the QR encodes)</label>
                <p className="mt-1 text-xs font-mono text-brand-700 break-all">
                  {getProductUrl(product)}
                </p>
              </div>

              <button
                onClick={() =>
                  toast('info', 'Static prototype — changes are not persisted')
                }
                className="flex items-center gap-2 bg-brand-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right:3D / AR model ─── */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-accent-500" />
                <h2 className="text-sm font-semibold text-brand-900">3D / AR model</h2>
              </div>
              <span
                className={`text-2xs font-bold px-2.5 py-1 rounded-full ${
                  has3D
                    ? 'bg-success-light text-success-dark'
                    : 'bg-surface-100 text-brand-500 border border-brand-200/70'
                }`}
              >
                {has3D ? '✓ Connected' : 'Not connected'}
              </span>
            </div>

            {has3D && cfg ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-surface-50 border border-brand-200/60 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-brand-500">Model file</p>
                      <p className="text-sm font-semibold text-brand-900 font-mono truncate">
                        {product.modelFile}
                      </p>
                    </div>
                    <span className="text-2xs font-semibold text-accent-700 bg-accent-50 border border-accent-100 px-2 py-1 rounded-lg shrink-0 uppercase">
                      {cfg.modelFormat}
                    </span>
                  </div>
                  <p className="text-2xs text-brand-400 mt-2 break-all">{cfg.modelUrl}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                      AR configuration
                    </h3>
                    <span className="text-2xs text-brand-400">Demo · does not persist</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-brand-500">Scale</label>
                      <input
                        type="number"
                        step="0.05"
                        defaultValue={cfg.scale}
                        className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-500">Rotation °</label>
                      <input
                        type="number"
                        defaultValue={cfg.rotation.y}
                        className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-500">Blur</label>
                      <div className="mt-1.5 h-10 flex items-center">
                        <label className="flex items-center gap-2 text-sm text-brand-700">
                          <input
                            type="checkbox"
                            defaultChecked={cfg.backgroundBlur}
                            className="rounded border-brand-300"
                          />
                          Background
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs font-medium text-brand-500">Position (X · Y · Z)</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {(['x', 'y', 'z'] as const).map((axis) => (
                        <input
                          key={axis}
                          type="number"
                          step="0.1"
                          defaultValue={cfg.position[axis]}
                          aria-label={`Position ${axis.toUpperCase()}`}
                          className="w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-xs font-medium text-brand-500">Lighting</label>
                      <select
                        defaultValue={cfg.lightingPreset}
                        className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                      >
                        <option value="studio">Studio</option>
                        <option value="natural">Natural</option>
                        <option value="dramatic">Dramatic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-500">Environment</label>
                      <select
                        defaultValue={cfg.environmentPreset}
                        className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"
                      >
                        {['apartment', 'city', 'dawn', 'forest', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse'].map(
                          (env) => (
                            <option key={env} value={env}>
                              {env[0].toUpperCase() + env.slice(1)}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-brand-700 mt-3">
                    <input
                      type="checkbox"
                      defaultChecked={cfg.placementGuide}
                      className="rounded border-brand-300"
                    />
                    Show placement guide on scan
                  </label>

                  <div className="mt-4 rounded-xl bg-accent-50 border border-accent-100 p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Check className="w-4 h-4 text-accent-600" />
                      <p className="text-xs font-semibold text-accent-800">AR Status: READY</p>
                    </div>
                    <p className="text-2xs text-accent-700/80 leading-relaxed">
                      Placement uses the model&apos;s real-world dimensions with{' '}
                      <code className="font-mono">ar-scale=&quot;auto&quot;</code>, so it lands
                      at true size and can still be pinched to fine-tune. Android hands off to
                      Scene Viewer, iOS to Quick Look (the GLB is converted to USDZ on-device),
                      and everyone else gets the real-time 3D viewer.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-brand-300 bg-surface-50 p-6 text-center">
                <Box className="w-8 h-8 text-brand-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-brand-700">
                  No 3D model connected yet
                </p>
                <p className="text-xs text-brand-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Rapidify generates a model from the product images. Once it exists, the AR
                  configuration panel and QR code appear here.
                </p>
                <a
                  href={getARUrl(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-700"
                >
                  See what the customer gets today <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <h2 className="text-sm font-semibold text-brand-900 mb-4">Specifications</h2>
            <div className="space-y-2.5">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex items-start gap-2 text-sm">
                  <span className="text-brand-400 w-36 shrink-0">{spec.label}</span>
                  <span className="text-brand-900 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <h2 className="text-sm font-semibold text-brand-900 mb-4">Dimensions &amp; Weight</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Ruler, label: 'Width', value: `${product.dimensions.width} ${product.dimensions.unit}` },
                { icon: Ruler, label: 'Height', value: `${product.dimensions.height} ${product.dimensions.unit}` },
                { icon: Ruler, label: 'Depth', value: `${product.dimensions.depth} ${product.dimensions.unit}` },
                { icon: Weight, label: 'Weight', value: `${product.weight.value} ${product.weight.unit}` },
              ].map((item) => (
                <div key={item.label} className="bg-surface-50 rounded-xl p-3 text-center">
                  <item.icon className="w-4 h-4 text-brand-400 mx-auto mb-1.5" />
                  <p className="text-2xs text-brand-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-brand-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
