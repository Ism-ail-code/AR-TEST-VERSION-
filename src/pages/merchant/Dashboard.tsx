import { Link } from 'react-router-dom';
import {
  demoProducts,
  demoStore,
  demoStats,
  demoActivity,
  getProductStats,
} from '@/data/products';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/components/ui';
import {
  Eye,
  Box,
  QrCode,
  ScanLine,
  TrendingUp,
  ArrowRight,
  Package,
  Check,
  X,
  RefreshCw,
  Store,
  Clock,
} from 'lucide-react';

function StatusPill({ ok, label, pending }: { ok: boolean; label: string; pending: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-2xs font-semibold px-2 py-1 rounded-lg ${
        ok
          ? 'bg-success-light text-success-dark'
          : 'bg-surface-100 border border-brand-200/70 text-brand-500'
      }`}
    >
      {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {ok ? label : pending}
    </span>
  );
}

const activityIcons: Record<string, typeof Eye> = {
  qr_scan: ScanLine,
  ar_view: Eye,
  product_view: Package,
};

const activityColors: Record<string, string> = {
  qr_scan: 'bg-accent-500',
  ar_view: 'bg-indigo-500',
  product_view: 'bg-brand-900',
};

export function MerchantDashboard() {
  useDocumentTitle('Merchant Dashboard');
  const { toast } = useToast();

  const rows = demoProducts.map((product) => ({
    product,
    stats: getProductStats(product.id),
  }));

  const maxViews = Math.max(...rows.map((r) => r.stats.productViews), 1);

  /** The dashboard shows a slice — the catalogue page carries the full list. */
  const byViews = [...rows].sort((a, b) => b.stats.productViews - a.stats.productViews);
  const tableRows = byViews.slice(0, 10);
  const engagementRows = byViews.slice(0, 8);

  return (
    <div className="max-w-6xl">
      {/* ─── Connected Store header ─── */}
      <div className="bg-white rounded-2xl border border-brand-200/60 p-5 sm:p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-brand-900 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-bold text-xl tracking-tight">
                {demoStore.logoInitials}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-brand-900 tracking-tight">
                  {demoStore.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-success-light text-success-dark text-2xs font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Connected Store
                </span>
              </div>
              <p className="text-sm text-brand-500 mt-1">
                {demoStore.tagline} · Shopify sync · last synced just now
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-2xs text-brand-400 mr-1">
              <Clock className="w-3 h-3" /> Connected since{' '}
              {new Date(demoStore.connectedSince).toLocaleDateString()}
            </div>
            <button
              onClick={() => toast('info', 'Static demo — catalogue refresh is simulated')}
              className="h-9 px-4 bg-surface-100 border border-brand-200/60 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-100 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync now
            </button>
            <Link
              to="/merchant/products"
              className="h-9 px-4 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" /> Manage catalogue
            </Link>
          </div>
        </div>

        {/* Sync stats */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-brand-200/60">
          {[
            { label: 'Products synced', value: demoStats.productsSynced, icon: Package },
            { label: 'AR Ready', value: demoStats.arReady, icon: Box },
            { label: 'QR Ready', value: demoStats.qrReady, icon: QrCode },
          ].map((s) => (
            <div key={s.label} className="bg-surface-100 rounded-xl px-4 py-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <s.icon className="w-4 h-4 text-brand-400" />
                <p className="text-2xs font-medium text-brand-500 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
              <p className="text-3xl font-bold text-brand-900 leading-none">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Demo data notice ─── */}
      <div className="bg-surface-100 border border-brand-200/60 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
        <div className="w-4 h-4 rounded-full bg-accent-500 text-white text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          !
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-800">Static demo data</p>
          <p className="text-xs text-brand-500 mt-0.5">
            This prototype has no backend. Every number below comes from one local dataset and
            is internally consistent — no real customer traffic is shown.
          </p>
        </div>
      </div>

      {/* ─── Headline metrics ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Product views', value: demoStats.totalProductViews, icon: Eye, tone: 'bg-blue-500' },
          { label: 'AR views', value: demoStats.totalArViews, icon: Box, tone: 'bg-indigo-500' },
          { label: 'QR scans', value: demoStats.totalQrScans, icon: ScanLine, tone: 'bg-accent-500' },
          { label: 'Conversion', value: `${demoStats.conversionRate}%`, icon: TrendingUp, tone: 'bg-success' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-brand-200/60">
            <div className={`${stat.tone} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-4.5 h-4.5 text-white" />
            </div>
            <p className="text-2xl font-bold text-brand-900">{stat.value}</p>
            <p className="text-2xs text-brand-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Product management table ─── */}
      <div className="bg-white rounded-2xl border border-brand-200/60 overflow-hidden mb-8">
        <div className="px-5 sm:px-6 py-4 border-b border-brand-200/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-brand-900">Product management</h2>
            <p className="text-2xs text-brand-400 mt-0.5">
              Top {tableRows.length} by views · {demoStats.arReady} of {demoStats.productsSynced}{' '}
              products activated
            </p>
          </div>
          <Link
            to="/merchant/products"
            className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-brand-200/60 bg-surface-50">
                {['Product', 'Price', '3D Model', 'AR Status', 'QR Status', 'Last updated', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-2xs font-semibold text-brand-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200/40">
              {tableRows.map(({ product }) => (
                <tr key={product.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]?.url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-brand-100"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-brand-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-2xs text-brand-400 truncate">
                          {product.category} · {product.subcategory}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-brand-900">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill
                      ok={!!product.modelUrl}
                      label={product.modelFile ?? 'Connected'}
                      pending="No model"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill ok={product.arReady} label="AR Ready" pending="Not ready" />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill ok={product.qrReady} label="QR Ready" pending="Not generated" />
                  </td>
                  <td className="px-5 py-3.5 text-2xs text-brand-500 whitespace-nowrap">
                    {new Date(product.lastUpdated).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/merchant/products/${product.id}`}
                      className="inline-flex h-8 px-3.5 bg-brand-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors items-center"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Engagement + activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-brand-200/60">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-brand-900">Engagement by product</h2>
            <span className="text-2xs text-brand-400">Static demo dataset</span>
          </div>
          <div className="space-y-4">
            {engagementRows.map(({ product, stats }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.images[0]?.url}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover bg-brand-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <p className="text-sm font-medium text-brand-900 truncate">
                      {product.name}
                    </p>
                    <span className="text-xs font-semibold text-brand-700 shrink-0">
                      {stats.productViews.toLocaleString()} views
                    </span>
                  </div>
                  <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500 rounded-full"
                      style={{ width: `${Math.round((stats.productViews / maxViews) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-2xs text-brand-400 flex items-center gap-1">
                      <Box className="w-3 h-3" /> {stats.arViews.toLocaleString()} AR views
                    </span>
                    <span className="text-2xs text-brand-400 flex items-center gap-1">
                      <ScanLine className="w-3 h-3" /> {stats.qrScans.toLocaleString()} scans
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-brand-900">Recent activity</h2>
            <span className="text-2xs text-brand-400">Sample events</span>
          </div>
          <div className="space-y-3.5">
            {demoActivity.map((event) => {
              const product = demoProducts.find((p) => p.id === event.productId);
              const Icon = activityIcons[event.type] ?? Eye;
              return (
                <div key={event.id} className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg ${activityColors[event.type] ?? 'bg-brand-400'} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-brand-900 truncate">{event.label}</p>
                    <p className="text-2xs text-brand-400 truncate">{product?.name}</p>
                  </div>
                  <span className="text-2xs text-brand-400 shrink-0">{event.when}</span>
                </div>
              );
            })}
          </div>

          <Link
            to="/merchant/analytics"
            className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
          >
            Full analytics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ─── Next steps ─── */}
      <div className="bg-white rounded-2xl border border-brand-200/60 p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-accent-500" />
          <h2 className="text-sm font-semibold text-brand-900">Recommended next steps</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: 'Activate Forma Coffee Table',
              desc: `Generate a 3D model to bring AR ready to ${demoStats.productsSynced} of ${demoStats.productsSynced}.`,
              href: `/merchant/products/prod-003`,
              cta: 'Open product',
            },
            {
              title: 'Print the Oslo QR poster',
              desc: 'Place it next to the chair on the showroom floor.',
              href: `/merchant/products/prod-001/qr`,
              cta: 'View QR code',
            },
            {
              title: 'Preview the customer view',
              desc: 'Confirm what shoppers see before you publish.',
              href: `/merchant/products/prod-001/preview`,
              cta: 'Preview',
            },
          ].map((n) => (
            <div
              key={n.title}
              className="bg-surface-100 rounded-xl p-4 flex flex-col items-start"
            >
              <p className="text-sm font-semibold text-brand-900">{n.title}</p>
              <p className="text-xs text-brand-500 mt-1 flex-1 leading-relaxed">{n.desc}</p>
              <Link
                to={n.href}
                className="mt-3 text-xs font-semibold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
              >
                {n.cta} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
