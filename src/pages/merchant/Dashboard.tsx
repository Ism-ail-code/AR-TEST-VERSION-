import { Link } from 'react-router-dom';
import {
  demoDashboardStats,
  demoProducts,
  demoAnalytics,
  demoStore,
  demoQRCodes,
  getQRCodesForProduct,
} from '@/data/demo';
import {
  Eye,
  Box,
  Smartphone,
  QrCode,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
  Package,
  BarChart3,
  DollarSign,
  Users,
} from 'lucide-react';

const eventTypeLabels: Record<string, string> = {
  view: 'Product View',
  ar_open: 'AR Opened',
  ar_capture: 'AR Capture',
  qr_scan: 'QR Scanned',
  add_to_cart: 'Added to Cart',
  purchase: 'Purchase',
};

const eventTypeIcons: Record<string, typeof Eye> = {
  view: Eye,
  ar_open: Smartphone,
  ar_capture: Eye,
  qr_scan: QrCode,
  add_to_cart: ShoppingCart,
  purchase: DollarSign,
};

const eventTypeColors: Record<string, string> = {
  view: 'bg-blue-500',
  ar_open: 'bg-purple-500',
  ar_capture: 'bg-indigo-500',
  qr_scan: 'bg-green-500',
  add_to_cart: 'bg-amber-500',
  purchase: 'bg-emerald-600',
};

export function MerchantDashboard() {
  // Aggregate analytics
  const totalViews = demoAnalytics.filter((e) => e.eventType === 'view').length;
  const total3DViews = demoAnalytics.filter((e) => e.eventType === 'view' && e.source === 'web').length;
  const totalARLaunches = demoAnalytics.filter((e) => e.eventType === 'ar_open').length;
  const totalQRScans = demoAnalytics.filter((e) => e.eventType === 'qr_scan').length;
  const totalCartAdds = demoAnalytics.filter((e) => e.eventType === 'add_to_cart').length;
  const totalPurchases = demoAnalytics.filter((e) => e.eventType === 'purchase').length;
  const totalRevenue = demoAnalytics
    .filter((e) => e.eventType === 'purchase')
    .reduce((sum, e) => {
      const product = demoProducts.find((p) => p.id === e.productId);
      return sum + (product?.price ?? 0);
    }, 0);

  // Event type breakdown
  const eventBreakdown = Object.entries(
    demoAnalytics.reduce<Record<string, number>>((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const maxEventCount = Math.max(...eventBreakdown.map(([, count]) => count));

  // Product engagement (top products by total events)
  const productEngagement = demoProducts
    .map((product) => {
      const events = demoAnalytics.filter((e) => e.productId === product.id);
      const views = events.filter((e) => e.eventType === 'view').length;
      const arOpens = events.filter((e) => e.eventType === 'ar_open').length;
      const qrScans = events.filter((e) => e.eventType === 'qr_scan').length;
      const carts = events.filter((e) => e.eventType === 'add_to_cart').length;
      const purchases = events.filter((e) => e.eventType === 'purchase').length;
      return { product, views, arOpens, qrScans, carts, purchases, total: events.length };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-brand-500 mt-1">{demoStore.name} &mdash; Merchant Portal</p>
        </div>
      </div>

      {/* DEMO DATA banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Demo Data</p>
          <p className="text-xs text-amber-700/80 mt-0.5">All analytics shown are simulated for prototype demonstration.</p>
        </div>
      </div>

      {/* ─── Stat cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Product Views', value: totalViews, icon: Eye, color: 'bg-blue-500', change: '+12%', up: true },
          { label: 'AR Launches', value: totalARLaunches, icon: Smartphone, color: 'bg-purple-500', change: '+24%', up: true },
          { label: 'QR Scans', value: totalQRScans, icon: QrCode, color: 'bg-green-500', change: '+8%', up: true },
          { label: 'Cart Adds', value: totalCartAdds, icon: ShoppingCart, color: 'bg-amber-500', change: '+18%', up: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-brand-200/60">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xs font-semibold flex items-center gap-0.5 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-brand-900">{stat.value.toLocaleString()}</p>
            <p className="text-2xs text-brand-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Secondary stats row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: demoDashboardStats.totalProducts, icon: Package },
          { label: '3D Model Views', value: total3DViews, icon: Box },
          { label: 'Purchases', value: totalPurchases, icon: DollarSign },
          { label: 'Conversion Rate', value: `${demoDashboardStats.conversionRate}%`, icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-brand-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-brand-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-brand-900">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
              <p className="text-2xs text-brand-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* ─── Event breakdown chart ─── */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-brand-200/60">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-brand-900">Event Breakdown</h2>
            <span className="text-2xs text-brand-400">{demoAnalytics.length} total events</span>
          </div>
          <div className="space-y-3">
            {eventBreakdown.map(([type, count]) => {
              const Icon = eventTypeIcons[type] ?? Eye;
              const pct = Math.round((count / maxEventCount) * 100);
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${eventTypeColors[type] ?? 'bg-brand-400'}`} />
                    <span className="text-xs text-brand-600 truncate">{eventTypeLabels[type] ?? type}</span>
                  </div>
                  <div className="flex-1 h-6 bg-surface-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full rounded-lg ${eventTypeColors[type] ?? 'bg-brand-400'} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-brand-700 w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Recent activity ─── */}
        <div className="bg-white rounded-xl p-6 border border-brand-200/60">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-brand-900">Recent Activity</h2>
            <span className="text-2xs text-brand-400">Last 8 events</span>
          </div>
          <div className="space-y-3">
            {demoDashboardStats.recentActivity.map((event) => {
              const product = demoProducts.find((p) => p.id === event.productId);
              const Icon = eventTypeIcons[event.eventType] ?? Eye;
              return (
                <div key={event.id} className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${eventTypeColors[event.eventType] ?? 'bg-brand-400'} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-brand-900 truncate">{eventTypeLabels[event.eventType]}</p>
                    <p className="text-2xs text-brand-400 truncate">{product?.name ?? 'Unknown'}</p>
                  </div>
                  <span className="text-2xs text-brand-400 bg-surface-100 px-1.5 py-0.5 rounded shrink-0">{event.source}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Product engagement table ─── */}
      <div className="bg-white rounded-xl border border-brand-200/60 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-brand-200/60 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-900">Product Engagement</h2>
          <Link to="/merchant/products" className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-200/60">
              {['Product', 'Views', 'AR Opens', 'QR Scans', 'Cart Adds', 'Purchases', ''].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-2xs font-semibold text-brand-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-200/40">
            {productEngagement.map(({ product, views, arOpens, qrScans, carts, purchases }) => (
              <tr key={product.id} className="hover:bg-surface-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]?.url} alt="" className="w-9 h-9 rounded-lg object-cover bg-brand-100" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-900 truncate">{product.name}</p>
                      <p className="text-2xs text-brand-400">${product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-brand-700">{views}</td>
                <td className="px-5 py-3 text-sm text-brand-700">{arOpens}</td>
                <td className="px-5 py-3 text-sm text-brand-700">{qrScans}</td>
                <td className="px-5 py-3 text-sm text-brand-700">{carts}</td>
                <td className="px-5 py-3 text-sm font-medium text-brand-900">{purchases}</td>
                <td className="px-5 py-3">
                  <Link to={`/merchant/products/${product.id}`} className="text-xs font-medium text-accent-600 hover:text-accent-700">
                    Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Bottom row: Top products + QR performance ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-xl p-6 border border-brand-200/60">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-brand-900">Top Products</h2>
            <BarChart3 className="w-4 h-4 text-brand-400" />
          </div>
          <div className="space-y-4">
            {productEngagement.slice(0, 3).map(({ product, total }, idx) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-brand-300 w-5">#{idx + 1}</span>
                <img src={product.images[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover bg-brand-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-900 truncate">{product.name}</p>
                  <p className="text-2xs text-brand-400">{total} total events</p>
                </div>
                <div className="w-20 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 rounded-full"
                    style={{ width: `${Math.round((total / productEngagement[0].total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR performance */}
        <div className="bg-white rounded-xl p-6 border border-brand-200/60">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-brand-900">QR Code Performance</h2>
            <QrCode className="w-4 h-4 text-brand-400" />
          </div>
          <div className="space-y-4">
            {demoQRCodes.map((qr) => {
              const product = demoProducts.find((p) => p.id === qr.productId);
              if (!product) return null;
              return (
                <div key={qr.id} className="flex items-center gap-3">
                  <img src={product.images[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover bg-brand-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-900 truncate">{product.name}</p>
                    <p className="text-2xs text-brand-400 truncate">{qr.url}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-brand-900">{qr.scanCount.toLocaleString()}</p>
                    <p className="text-2xs text-brand-400">scans</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
