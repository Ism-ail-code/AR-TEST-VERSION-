import { useState, useCallback } from 'react';
import type { ModelViewerElement } from '@google/model-viewer';
import {
  Move,
  RotateCw,
  Maximize2,
  Crosshair,
  RotateCcw,
  ArrowLeft,
  Share2,
  ChevronUp,
  ChevronDown,
  Eye,
} from 'lucide-react';
import type { Product } from '@/types';

export interface ARControlsProps {
  product: Product;
  arSupported: boolean;
  arModeLabel: string;
  viewerRef: React.MutableRefObject<ModelViewerElement | null>;
  onStartAR?: () => void;
  onExit?: () => void;
}

const FOV_STEPS = ['30deg', '24deg', '18deg', '14deg'];
const TARGET_STEPS = ['-0.25 0 0', '0 0 0', '0.25 0 0'];

/**
 * Bottom control sheet for the full-screen AR experience.
 * Place in Room · Rotate · Move · Scale · Reset — plus a way back to the product.
 */
export function ARControls({
  product,
  arSupported,
  arModeLabel,
  viewerRef,
  onStartAR,
  onExit,
}: ARControlsProps) {
  const [expanded, setExpanded] = useState(false);
  const [moveStep, setMoveStep] = useState(1);
  const [rotateStep, setRotateStep] = useState(0);
  const [fovStep, setFovStep] = useState(0);

  const handlePlace = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    if (typeof el.activateAR === 'function') el.activateAR();
    else onStartAR?.();
  }, [onStartAR, viewerRef]);

  const handleMove = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    const next = (moveStep + 1) % TARGET_STEPS.length;
    setMoveStep(next);
    el.cameraTarget = TARGET_STEPS[next];
  }, [moveStep, viewerRef]);

  const handleRotate = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    const next = rotateStep + 1;
    setRotateStep(next);
    const base = product.arConfiguration?.rotation?.y ?? 0;
    el.cameraOrbit = `${base + next * 45}deg 55deg 105%`;
  }, [rotateStep, product.arConfiguration, viewerRef]);

  const handleScale = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    const next = (fovStep + 1) % FOV_STEPS.length;
    setFovStep(next);
    el.fieldOfView = FOV_STEPS[next];
  }, [fovStep, viewerRef]);

  const handleReset = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    const cfg = product.arConfiguration;
    setMoveStep(1);
    setRotateStep(0);
    setFovStep(0);
    el.cameraOrbit = `${45 + (cfg?.rotation?.y ?? 0)}deg 55deg 105%`;
    el.cameraTarget = '0 0 0';
    el.fieldOfView = '30deg';
  }, [product.arConfiguration, viewerRef]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/ar/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* user dismissed */
      }
    } else {
      await navigator.clipboard?.writeText(url);
    }
  }, [product]);

  const primaryImage =
    product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? '';

  const tools = [
    { label: 'Rotate', icon: RotateCw, action: handleRotate },
    { label: 'Move', icon: Move, action: handleMove },
    { label: 'Scale', icon: Maximize2, action: handleScale },
    { label: 'Reset', icon: RotateCcw, action: handleReset },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 z-20">
      <div className="relative">
        {/* ── Collapsed bar ── */}
        <div
          className={`transition-all duration-300 ${
            expanded ? 'opacity-0 translate-y-3 pointer-events-none' : ''
          }`}
        >
          <div className="mx-3 sm:mx-4">
            <button
              onClick={() => setExpanded(true)}
              aria-label="Open AR controls"
              className="w-full flex items-center justify-between bg-brand-900/90 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-800 shrink-0">
                  <img src={primaryImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">{product.name}</p>
                  <p className="text-white/50 text-2xs">
                    ${product.price.toLocaleString()} &middot; tap for controls
                  </p>
                </div>
              </div>
              <ChevronUp className="w-4 h-4 text-white/60" />
            </button>
            <p className="text-center text-white/45 text-[0.625rem] mt-2.5 tracking-wide">
              Powered by Rapidify
            </p>
          </div>
        </div>

        {/* ── Expanded controls ── */}
        <div
          className={`absolute inset-x-0 bottom-0 transition-all duration-300 ${
            expanded ? '' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-brand-900/95 backdrop-blur-xl border-t border-white/10 p-4 sm:p-5 rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setExpanded(false)}
                    aria-label="Collapse controls"
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
                    <p className="text-white/40 text-2xs truncate">{product.material}</p>
                  </div>
                </div>
                <span className="bg-white/10 text-white/70 text-2xs font-medium px-2.5 py-1 rounded-full shrink-0">
                  {arModeLabel}
                </span>
              </div>

              {/* Instructions */}
              <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-3.5 h-3.5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">Place it in your room</p>
                    <p className="text-white/50 text-2xs leading-relaxed mt-0.5">
                      {arSupported
                        ? 'Tap “Place in Room”, point your camera at a flat surface, then tap to set it down. Drag to move, pinch to resize.'
                        : 'AR placement isn’t available on this device, so you’re viewing the real-time 3D preview. Open this page on a phone to put it in your room.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Place in Room */}
              <button
                onClick={handlePlace}
                disabled={!arSupported}
                aria-label="Place in Room"
                className={`w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  arSupported
                    ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm shadow-accent-500/30'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <Crosshair className="w-4 h-4" /> Place in Room
              </button>

              {/* Rotate / Move / Scale / Reset */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {tools.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={tool.action}
                    aria-label={tool.label}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[0.625rem] font-medium bg-white/10 text-white hover:bg-white/15 transition-colors"
                  >
                    <tool.icon className="w-4 h-4" />
                    {tool.label}
                  </button>
                ))}
              </div>

              {/* Back to product */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={onExit}
                  aria-label="Back to product"
                  className="flex-1 h-11 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to product
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share link"
                  className="h-11 px-4 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Specs */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                {[
                  { label: 'Width', value: `${product.dimensions.width}cm` },
                  { label: 'Height', value: `${product.dimensions.height}cm` },
                  { label: 'Depth', value: `${product.dimensions.depth}cm` },
                  { label: 'Weight', value: `${product.weight.value}${product.weight.unit}` },
                ].map((spec) => (
                  <div key={spec.label} className="text-center">
                    <p className="text-white/30 text-2xs uppercase tracking-wider">{spec.label}</p>
                    <p className="text-white text-xs font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-white/35 text-[0.625rem] mt-4 tracking-wide">
                Powered by Rapidify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
