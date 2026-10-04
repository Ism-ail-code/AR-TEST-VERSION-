import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer';
import type { ARMode } from '@/services/ar';
import type { ARConfiguration } from '@/types';
import { Box, RotateCcw } from 'lucide-react';
import { environmentImage, orbitFor } from '@/services/viewer';

export type ViewerStatus =
  | 'loading'
  | 'ready'
  | 'ar-started'
  | 'ar-ended'
  /** The model is on screen, but the camera AR hand-off was refused. */
  | 'ar-unavailable'
  /** The model itself never loaded — there is genuinely nothing to show. */
  | 'error';

export interface ARViewerProps {
  modelUrl: string;
  productName: string;
  /** Used by the error state to link back to the storefront. */
  productSlug?: string;
  arMode: ARMode;
  configuration?: ARConfiguration | null;
  className?: string;
  /** Allows the page to call `activateAR()` / reset the camera imperatively. */
  viewerRef?: React.MutableRefObject<ModelViewerElement | null>;
  onStatusChange?: (status: ViewerStatus) => void;
}

function arModesAttr(mode: ARMode): string {
  switch (mode) {
    case 'webxr':
      return 'webxr';
    case 'scene-viewer':
      return 'scene-viewer';
    case 'quick-look':
      return 'quick-look';
    default:
      return 'webxr scene-viewer quick-look';
  }
}

/**
 * Full-screen 3D / AR viewer.
 *
 * Uses `<model-viewer>`'s built-in AR hand-off (WebXR on desktop/Android
 * Chrome, Google Scene Viewer on Android, Apple Quick Look on iOS) while the
 * surrounding page provides the product-specific controls.
 */
export function ARViewer({
  modelUrl,
  productName,
  productSlug,
  arMode,
  configuration,
  className = '',
  viewerRef,
  onStatusChange,
}: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ViewerStatus>('loading');
  const [progress, setProgress] = useState(0);
  const [errorDetail, setErrorDetail] = useState('');
  /** `load` and the final `progress` land in the same tick — remember which came first. */
  const loadedRef = useRef(false);
  /**
   * A refused AR hand-off is not a model failure. Keeping it separate stops
   * the page from covering a perfectly rendered model with a
   * "Could not load the 3D model" screen — which is exactly what Android
   * Chrome used to see when WebXR was claimed but couldn't start.
   */
  const arFailedRef = useRef(false);

  const update = useCallback(
    (next: ViewerStatus) => {
      setStatus(next);
      onStatusChange?.(next);
    },
    [onStatusChange],
  );

  const handleRetry = useCallback(() => {
    const el = viewerRef?.current;
    if (!el) return;
    loadedRef.current = false;
    arFailedRef.current = false;
    setErrorDetail('');
    update('loading');
    setProgress(0);
    el.src = '';
    requestAnimationFrame(() => {
      el.src = modelUrl;
    });
  }, [modelUrl, update, viewerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const viewer = container.querySelector('model-viewer') as ModelViewerElement | null;
    if (viewerRef) viewerRef.current = viewer;
    if (!viewer) return;
    loadedRef.current = false;

    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent<{ totalProgress?: number }>).detail;
      setProgress(Math.round((detail?.totalProgress ?? 0) * 100));
      // One more `progress` (the environment map) fires just AFTER `load`;
      // without this guard it would put the viewer back into a loading state
      // that never resolves.
      if (!loadedRef.current) update('loading');
    };
    const onLoad = () => {
      loadedRef.current = true;
      update(arFailedRef.current ? 'ar-unavailable' : 'ready');
    };
    const onError = (e: Event) => {
      // A stray `error` after a successful load must never hide a model
      // that is already on screen.
      if (viewer.loaded) return;
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setErrorDetail(typeof detail?.message === 'string' ? detail.message : '');
      update('error');
    };
    const onARStatus = (e: Event) => {
      const detail = (e as CustomEvent<{ status?: string }>).detail;
      switch (detail?.status) {
        case 'session-started':
        case 'object-unplaced':
        case 'object-placed':
          arFailedRef.current = false;
          update('ar-started');
          break;
        case 'session-ended':
          update('ready');
          break;
        case 'failed':
        case 'not-supporting-browser':
          // AR could not start — the model is fine, so keep it visible.
          arFailedRef.current = true;
          update(loadedRef.current ? 'ar-unavailable' : 'loading');
          break;
      }
    };

    viewer.addEventListener('progress', onProgress);
    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);
    viewer.addEventListener('ar-status', onARStatus);
    return () => {
      viewer.removeEventListener('progress', onProgress);
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
      viewer.removeEventListener('ar-status', onARStatus);
    };
  }, [viewerRef, update]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <model-viewer
        src={modelUrl}
        alt={`Place the ${productName} in your room`}
        camera-controls
        auto-rotate
        auto-rotate-delay="1500"
        rotation-per-second="22deg"
        shadow-intensity={configuration?.backgroundBlur ? '0' : '1'}
        shadow-softness="0.8"
        exposure="1"
        environment-image={environmentImage(configuration)}
        camera-orbit={orbitFor(configuration)}
        min-camera-orbit="auto auto 55%"
        max-camera-orbit="auto 160deg 200%"
        field-of-view="30deg"
        interpolation-decay="100"
        ar
        ar-modes={arModesAttr(arMode)}
        /* 'auto' keeps the model at its real-world size; 'fixed' would let the
           user rescale it, which breaks the "does it actually fit?" promise. */
        ar-scale="auto"
        ar-hint="false"
        ar-poster=""
        interaction-prompt="none"
        reveal="auto"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      />

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-950/90 backdrop-blur-sm z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-white/15 border-t-accent-500 animate-spin" />
          <p className="text-xs text-white/50 mt-3 font-medium">Loading model… {progress}%</p>
        </div>
      )}

      {/* Error overlay — never a dead end */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-950/95 backdrop-blur-sm z-10 text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-900 border border-white/10 flex items-center justify-center mb-4">
            <Box className="w-7 h-7 text-white/40" />
          </div>
          <p className="text-white text-sm font-semibold mb-1.5">Could not load the 3D model</p>
          <div className="mb-5">
            <p className="text-white/45 text-xs max-w-xs leading-relaxed">
              The model file did not load — product photos are still available on the product
              page.
            </p>
            {errorDetail && (
              <p className="text-white/25 text-2xs max-w-sm mt-2 break-words leading-relaxed">
                {errorDetail}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              to={productSlug ? `/product/${productSlug}` : '/products'}
              className="h-10 px-5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors inline-flex items-center"
            >
              Product page
            </Link>
            <button
              onClick={handleRetry}
              className="h-10 px-5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
