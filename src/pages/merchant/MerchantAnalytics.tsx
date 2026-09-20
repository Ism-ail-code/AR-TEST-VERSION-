import { demoAnalytics, demoProducts } from '@/data/demo';
import { BarChart3, AlertCircle } from 'lucide-react';

export function MerchantAnalytics() {
  const eventCounts = demoAnalytics.reduce<Record<string, number>>((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-900 tracking-tight mb-1">Analytics</h1>
      <p className="text-sm text-brand-500 mb-6">Performance insights for your store</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Demo Data</p>
          <p className="text-xs text-amber-700/80 mt-0.5">All analytics shown are simulated for prototype demonstration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-brand-900">Event Breakdown</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-xs text-brand-600 w-28 shrink-0 capitalize">{type.replace('_', ' ')}</span>
                <div className="flex-1 h-5 bg-surface-100 rounded-lg overflow-hidden">
                  <div className="h-full bg-accent-500 rounded-lg" style={{ width: `${Math.round((count / Math.max(...Object.values(eventCounts))) * 100)}%` }} />
                </div>
                <span className="text-xs font-semibold text-brand-700 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
          <h2 className="text-sm font-semibold text-brand-900 mb-5">Top Products</h2>
          <div className="space-y-4">
            {demoProducts.slice(0, 5).map((product) => {
              const count = demoAnalytics.filter((e) => e.productId === product.id).length;
              return (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.images[0]?.url} alt="" className="w-9 h-9 rounded-lg object-cover bg-brand-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-900 truncate">{product.name}</p>
                  </div>
                  <span className="text-sm font-bold text-brand-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
