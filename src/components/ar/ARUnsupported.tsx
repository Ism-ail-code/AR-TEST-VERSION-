import { Smartphone, Monitor, Apple } from 'lucide-react';
import type { ARCapabilities } from '@/services/ar';

export interface ARUnsupportedProps {
  capabilities: ARCapabilities;
  productName?: string;
}

/**
 * Polished explanation panel shown when the device cannot hand off to a
 * native AR session. Rendered inside the AR page's bottom sheet — the 3D
 * preview above it keeps working, so the experience never dead-ends.
 */
export function ARUnsupported({ capabilities, productName }: ARUnsupportedProps) {
  const rows = [
    {
      icon: Smartphone,
      title: 'Android',
      detail: 'Chrome 79+ with ARCore. Opens Google Scene Viewer automatically at true scale.',
      tone: 'bg-green-500/10 text-green-400',
    },
    {
      icon: Apple,
      title: 'iPhone & iPad',
      detail: 'Safari with ARKit. Uses Apple Quick Look to place the product in your room.',
      tone: 'bg-blue-500/10 text-blue-400',
    },
    {
      icon: Monitor,
      title: 'Desktop',
      detail: 'No camera-based AR — you get the full real-time 3D viewer instead.',
      tone: 'bg-white/5 text-white/40',
    },
  ];

  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20 flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5 text-accent-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm">
            {productName ? `${productName} — ` : ''}3D preview
          </h2>
          <p className="text-white/50 text-xs leading-relaxed mt-0.5">
            {capabilities.reason ||
              'Camera-based AR is not available on this device, so the live 3D model is shown instead.'}
          </p>
        </div>
      </div>

      <div className="bg-brand-900/60 rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold text-xs mb-3">Where AR works</h3>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.title} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.tone}`}>
                <row.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">{row.title}</p>
                <p className="text-white/45 text-2xs leading-relaxed mt-0.5">{row.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
