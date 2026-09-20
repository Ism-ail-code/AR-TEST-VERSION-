import { useParams, Link } from 'react-router-dom';
import { demoProducts, getQRCodesForProduct } from '@/data/demo';
import { ArrowLeft, QrCode, Eye, Save, Box, Smartphone, ExternalLink } from 'lucide-react';

export function MerchantProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = demoProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-6xl text-center py-16">
        <h2 className="text-xl font-bold text-brand-900 mb-4">Product Not Found</h2>
        <Link to="/merchant/products" className="text-sm text-accent-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  const hasQR = getQRCodesForProduct(product.id).length > 0;

  return (
    <div className="max-w-6xl">
      <Link to="/merchant/products" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={product.images[0]?.url} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-brand-100" />
          <div>
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight">{product.name}</h1>
            <p className="text-sm text-brand-500">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/merchant/products/${product.id}/qr`} className="flex items-center gap-2 bg-brand-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors">
            <QrCode className="w-4 h-4" /> QR Code
          </Link>
          <Link to={`/merchant/products/${product.id}/preview`} className="flex items-center gap-2 bg-surface-100 border border-brand-200/60 text-brand-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-100 transition-colors">
            <Eye className="w-4 h-4" /> Customer Preview
          </Link>
          <Link to={`/product/${product.slug}`} className="flex items-center gap-2 bg-surface-100 border border-brand-200/60 text-brand-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-100 transition-colors" target="_blank">
            <ExternalLink className="w-4 h-4" /> Live view
          </Link>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '3D Model', icon: Box, ready: !!product.arModelUrl, detail: product.arModelUrl ? 'GLB format loaded' : 'No model uploaded' },
          { label: 'AR Experience', icon: Smartphone, ready: !!product.arConfiguration, detail: product.arConfiguration ? `${product.arConfiguration.environmentPreset} environment` : 'Not configured' },
          { label: 'QR Code', icon: QrCode, ready: hasQR, detail: hasQR ? `${getQRCodesForProduct(product.id)[0].scanCount.toLocaleString()} scans` : 'Not generated' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 border border-brand-200/60 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.ready ? 'bg-emerald-50' : 'bg-surface-100'}`}>
              <item.icon className={`w-5 h-5 ${item.ready ? 'text-emerald-600' : 'text-brand-400'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-900">{item.label}</p>
              <p className="text-2xs text-brand-400">{item.detail}</p>
            </div>
            {item.ready && <span className="ml-auto text-2xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Ready</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
          <h2 className="text-sm font-semibold text-brand-900 mb-5">Product Details</h2>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-brand-500">Name</label><input type="text" defaultValue={product.name} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
            <div><label className="text-xs font-medium text-brand-500">Short Description</label><textarea defaultValue={product.shortDescription} rows={2} className="mt-1.5 w-full px-3 py-2 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 resize-none" /></div>
            <div><label className="text-xs font-medium text-brand-500">Full Description</label><textarea defaultValue={product.fullDescription} rows={4} className="mt-1.5 w-full px-3 py-2 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 resize-none" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-brand-500">Price ($)</label><input type="number" defaultValue={product.price} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
              <div><label className="text-xs font-medium text-brand-500">Category</label><input type="text" defaultValue={product.category} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
              <div><label className="text-xs font-medium text-brand-500">Stock</label><input type="number" defaultValue={product.stockCount} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-brand-500">Material</label><input type="text" defaultValue={product.material} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
              <div><label className="text-xs font-medium text-brand-500">Slug</label><input type="text" defaultValue={product.slug} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
            </div>
            <button className="flex items-center gap-2 bg-brand-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <h2 className="text-sm font-semibold text-brand-900 mb-5">AR Configuration</h2>
            {product.arConfiguration ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-brand-500">Scale</label><input type="number" defaultValue={product.arConfiguration.scale} step={0.1} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
                  <div><label className="text-xs font-medium text-brand-500">Lighting</label><select defaultValue={product.arConfiguration.lightingPreset} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"><option value="studio">Studio</option><option value="natural">Natural</option><option value="dramatic">Dramatic</option></select></div>
                </div>
                <div><label className="text-xs font-medium text-brand-500">Model URL</label><input type="text" defaultValue={product.arConfiguration.modelUrl} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400" /></div>
                <div><label className="text-xs font-medium text-brand-500">Environment</label><select defaultValue={product.arConfiguration.environmentPreset} className="mt-1.5 w-full h-10 px-3 bg-surface-50 border border-brand-200/60 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400"><option value="apartment">Apartment</option><option value="lobby">Lobby</option><option value="studio">Studio</option><option value="warehouse">Warehouse</option></select></div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-brand-700"><input type="checkbox" defaultChecked={product.arConfiguration.backgroundBlur} className="rounded border-brand-300" /> Background Blur</label>
                  <label className="flex items-center gap-2 text-sm text-brand-700"><input type="checkbox" defaultChecked={product.arConfiguration.placementGuide} className="rounded border-brand-300" /> Placement Guide</label>
                </div>
              </div>
            ) : <p className="text-sm text-brand-400">No AR configuration for this product.</p>}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <h2 className="text-sm font-semibold text-brand-900 mb-4">Specifications</h2>
            <div className="space-y-2.5">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-brand-400 w-32 shrink-0">{spec.label}</span>
                  <span className="text-brand-900 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
            <h2 className="text-sm font-semibold text-brand-900 mb-4">Dimensions & Weight</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-brand-400">Width:</span> <span className="text-brand-900 font-medium">{product.dimensions.width} {product.dimensions.unit}</span></div>
              <div><span className="text-brand-400">Height:</span> <span className="text-brand-900 font-medium">{product.dimensions.height} {product.dimensions.unit}</span></div>
              <div><span className="text-brand-400">Depth:</span> <span className="text-brand-900 font-medium">{product.dimensions.depth} {product.dimensions.unit}</span></div>
              <div><span className="text-brand-400">Weight:</span> <span className="text-brand-900 font-medium">{product.weight.value} {product.weight.unit}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
