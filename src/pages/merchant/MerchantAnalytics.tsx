import { demoProducts, demoStats, getProductStats } from '@/data/products';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { BarChart3, Box, ScanLine, Eye, Check, TrendingUp, Download } from 'lucide-react';

export function MerchantAnalytics() {
  useDocumentTitle('Merchant · Analytics');

  const rows = demoProducts.map((product) => ({
    product,
    stats: getProductStats(product.id),
  }));

  const maxViews = Math.max(...rows.map((r) => r.stats.productViews), 1);
  const maxScans = Math.max(demoStats.totalQrScans, 1);

  const funnel = [
    { label: 'Product views', value: demoStats.totalProductViews, tone: 'bg-brand-900' },
    { label: 'QR scans', value: demoStats.totalQrScans, tone: 'bg-accent-500' },
    { label: 'AR views', value: demoStats.totalArViews, tone: 'bg-indigo-500' },
    { label: 'Purchases', value: demoStats.totalPurchases, tone: 'bg-success' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-brand-500 mt-1">
            Performance insights for the Casa Living catalogue
          </p>
        </div>
        <button
          className="h-9 px-4 bg-white border border-brand-200/60 rounded-xl text-sm font-medium text-brand-600 hover:bg-surface-50 transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-surface-100 border border-brand-200/60 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
        <div className="w-4 h-4 rounded-full bg-accent-500 text-white text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          !
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-800">Static demo dataset</p>
          <p className="text-xs text-brand-500 mt-0.5">
            These figures come from one local file. Per-product rows always sum to the totals
            shown above, so no number contradicts another.
          </p>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Products', value: demoStats.productsSynced, icon: BarChart3, tone: 'bg-brand-900' },
          { label: 'Product views', value: demoStats.totalProductViews.toLocaleString(), icon: Eye, tone: 'bg-blue-500' },
          { label: 'AR views', value: demoStats.totalArViews.toLocaleString(), icon: Box, tone: 'bg-indigo-500' },
          { label: 'QR scans', value: demoStats.totalQrScans.toLocaleString(), icon: ScanLine, tone: 'bg-accent-500' },
          { label: 'Conversion', value: `${demoStats.conversionRate}%`, icon: TrendingUp, tone: 'bg-success' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-brand-200/60">
            <div className={`${stat.tone} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-4.5 h-4.5 text-white" />
            </div>
            <p className="text-xl font-bold text-brand-900">{stat.value}</p>
            <p className="text-2xs text-brand-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* ─── Funnel ─── */}
        <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-accent-500" />
            <h2 className="text-sm font-semibold text-brand-900">Journey funnel</h2>
          </div>
          <div className="space-y-4">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-brand-600">{f.label}</span>
                  <span className="text-xs font-bold text-brand-900">
                    {f.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-7 bg-surface-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${f.tone} rounded-lg transition-all`}
                    style={{
                      width: `${Math.max(4, Math.round((f.value / maxViews) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-2xs text-brand-400 mt-5 leading-relaxed">
            QR scans exceed AR views because some visitors read the poster, open the product
            page, and stop before launching AR.
          </p>
        </div>

        {/* ─── Per-product table ─── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-200/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-900">Per-product breakdown</h2>
            <span className="text-2xs text-brand-400">AR {demoStats.arReady} · QR {demoStats.qrReady} active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-brand-200/60 bg-surface-50">
                  {['Product', 'Views', 'AR views', 'QR scans', 'Purchases'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-2xs font-semibold text-brand-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-200/40">
                {rows.map(({ product, stats }) => (
                  <tr key={product.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover bg-brand-100"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brand-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-2xs text-brand-400">
                            {product.arReady ? 'AR + QR active' : 'Not activated'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-brand-700">
                      {stats.productViews.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-brand-700">
                      {stats.arViews.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-brand-700">
                      {stats.qrScans.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-brand-900">
                      {stats.purchases.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-surface-50 font-semibold">
                  <td className="px-5 py-3 text-xs text-brand-700">Total</td>
                  <td className="px-5 py-3 text-sm font-bold text-brand-900">
                    {demoStats.totalProductViews.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-brand-900">
                    {demoStats.totalArViews.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-brand-900">
                    {demoStats.totalQrScans.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-brand-900">
                    {demoStats.totalPurchases.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── QR ranking ─── */}
      <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-brand-900">QR code performance</h2>
          <span className="text-2xs text-brand-400">
            {demoStats.totalQrScans.toLocaleString()} total scans
          </span>
        </div>
        <div className="space-y-4">
          {rows
            .filter(({ product }) => product.qrReady)
            .sort((a, b) => b.stats.qrScans - a.stats.qrScans)
            .map(({ product, stats }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.images[0]?.url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-brand-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-900 truncate">{product.name}</p>
                  <div className="mt-1.5 h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500 rounded-full"
                      style={{
                        width: `${Math.max(6, Math.round((stats.qrScans / maxScans) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-brand-900">
                    {stats.qrScans.toLocaleString()}
                  </p>
                  <p className="text-2xs text-brand-400">scans</p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-2xs font-semibold text-success-dark bg-success-light px-2 py-1 rounded-lg">
                  <Check className="w-3 h-3" /> Live
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
