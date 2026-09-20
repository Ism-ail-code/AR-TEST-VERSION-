import {
  RotateCcw,
  Move,
  Maximize2,
  Eye,
  ArrowLeft,
  Share2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import type { Product } from '@/types';

export interface ARControlsProps {
  product: Product;
  arSupported: boolean;
  arModeLabel: string;
  onStartAR?: () => void;
  onReset?: () => void;
  onExit?: () => void;
}

export function ARControls({ product, arSupported, arModeLabel, onStartAR, onReset, onExit }: ARControlsProps) {
  const [expanded, setExpanded] = useState(false);
  const [rotateStep, setRotateStep] = useState(0);
  const [zoomStep, setZoomStep] = useState(0);

  const handleRotate = useCallback(() => {
    const viewer = document.querySelector('model-viewer') as any;
    if (!viewer) return;
    const newStep = rotateStep + 1;
    setRotateStep(newStep);
    const baseY = (product.arConfiguration?.rotation?.y ?? 0);
    const yDeg = baseY + newStep * 45;
    viewer.cameraOrbit = `${yDeg}deg 55deg 105%`;
  }, [rotateStep, product.arConfiguration]);

  const handleScale = useCallback(() => {
    const viewer = document.querySelector('model-viewer') as any;
    if (!viewer) return;
    const newStep = zoomStep + 1;
    setZoomStep(newStep);
    const fovValues = ['30deg', '25deg', '20deg', '15deg', '30deg'];
    viewer.fieldOfView = fovValues[newStep % fovValues.length];
  }, [zoomStep]);

  const handleMove = useCallback(() => {
    const viewer = document.querySelector('model-viewer') as any;
    if (!viewer) return;
    const currentOrbit = viewer.cameraOrbit;
    const parts = currentOrbit.split(' ');
    const zPct = parseInt(parts[2]) || 105;
    const newZ = zPct > 80 ? zPct - 10 : 105;
    viewer.cameraOrbit = `${parts[0]} ${parts[1]} ${newZ}%`;
  }, []);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/ar/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `AR: ${product.name}`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [product]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      {/* Collapsed: minimal bar */}
      <div className={`transition-all duration-300 ${expanded ? 'translate-y-full opacity-0 pointer-events-none' : ''}`}>
        <div className="mx-3 mb-3 sm:mx-4 sm:mb-4">
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex items-center justify-between bg-brand-900/90 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-800 shrink-0">
                <img
                  src={product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight">{product.name}</p>
                <p className="text-white/50 text-2xs">${product.price.toLocaleString()}</p>
              </div>
            </div>
            <ChevronUp className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Expanded: full controls */}
      <div className={`transition-all duration-300 ${expanded ? '' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="bg-brand-900/95 backdrop-blur-xl border-t border-white/10 p-4 sm:p-5">
          <div className="max-w-md mx-auto">
            {/* Product info header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpanded(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                  <p className="text-white/40 text-2xs">{product.material}</p>
                </div>
              </div>
              <span className="bg-white/10 text-white/70 text-2xs font-medium px-2.5 py-1 rounded-full">{arModeLabel}</span>
            </div>

            {/* Placement instructions */}
            {arSupported && (
              <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-3.5 h-3.5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">How to use AR</p>
                    <p className="text-white/50 text-2xs leading-relaxed mt-0.5">
                      Tap &ldquo;Start AR&rdquo; and point your camera at a flat surface. Once detected, tap to place the furniture. Drag to move, pinch to resize.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Control buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { icon: Move, label: 'Move', action: handleMove },
                { icon: RotateCcw, label: 'Rotate', action: handleRotate },
                { icon: Maximize2, label: 'Scale', action: handleScale },
                { icon: RotateCcw, label: 'Reset', action: onReset },
              ].map((ctrl) => (
                <button
                  key={ctrl.label}
                  onClick={ctrl.action}
                  aria-label={ctrl.label}
                  className="flex flex-col items-center gap-1 bg-white/10 text-white py-2.5 rounded-xl text-2xs font-medium hover:bg-white/15 transition-colors"
                >
                  <ctrl.icon className="w-4 h-4" />
                  {ctrl.label}
                </button>
              ))}
            </div>

            {/* Main action row */}
            <div className="flex gap-2">
              <button
                onClick={onExit}
                aria-label="Exit AR"
                className="h-11 px-4 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Exit
              </button>

              {arSupported ? (
                <button
                  onClick={onStartAR}
                  aria-label="Start AR"
                  className="flex-1 h-11 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-accent-500/20"
                >
                  <Eye className="w-4 h-4" /> Start AR
                </button>
              ) : (
                <div className="flex-1 h-11 bg-white/5 text-white/40 rounded-xl text-sm font-medium flex items-center justify-center border border-white/5">
                  3D Viewer (AR not supported)
                </div>
              )}

              <button
                onClick={handleShare}
                className="h-11 px-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Product specs row */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              {[
                { label: 'Width', value: `${product.dimensions.width}cm` },
                { label: 'Height', value: `${product.dimensions.height}cm` },
                { label: 'Depth', value: `${product.dimensions.depth}cm` },
                { label: 'Weight', value: `${product.weight.value}${product.weight.unit}` },
              ].map((spec) => (
                <div key={spec.label} className="text-center">
                  <p className="text-white/30 text-2xs uppercase">{spec.label}</p>
                  <p className="text-white text-xs font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
