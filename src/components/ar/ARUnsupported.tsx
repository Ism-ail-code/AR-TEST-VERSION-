import { Smartphone, Monitor, ArrowLeft } from 'lucide-react';
import type { ARCapabilities } from '@/services/ar';

export interface ARUnsupportedProps {
  capabilities: ARCapabilities;
  productName: string;
  onBack?: () => void;
}

export function ARUnsupported({ capabilities, productName: _productName, onBack }: ARUnsupportedProps) {
  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-brand-900 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Smartphone className="w-9 h-9 text-white/40" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-white text-center mb-2">AR is not available</h1>
        <p className="text-white/50 text-sm text-center leading-relaxed mb-6">
          {capabilities.reason}
        </p>

        {/* Supported devices info */}
        <div className="bg-brand-900/50 rounded-2xl border border-white/10 p-5 mb-6">
          <h2 className="text-white font-semibold text-sm mb-3">Supported devices</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">Android</p>
                <p className="text-white/40 text-2xs leading-relaxed">Chrome 79+ with ARCore support. Google Scene Viewer opens automatically.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">iOS (iPhone/iPad)</p>
                <p className="text-white/40 text-2xs leading-relaxed">Safari on iOS 12+ with ARKit. Uses Apple Quick Look for AR placement.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Monitor className="w-4 h-4 text-white/40" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">Desktop</p>
                <p className="text-white/40 text-2xs leading-relaxed">AR is not supported on desktop browsers. Use the 3D viewer below to inspect the product.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 h-11 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
