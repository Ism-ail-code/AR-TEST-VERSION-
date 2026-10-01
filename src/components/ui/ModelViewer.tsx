import { useRef, useState, useCallback, useEffect } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer';
import { Box, RotateCcw, Maximize2, Minimize2, AlertTriangle, Play, Pause } from 'lucide-react';
import type { ARConfiguration } from '@/types';

export interface ModelViewerProps {
  modelUrl?: string | null;
  productName: string;
  configuration?: ARConfiguration | null;
  className?: string;
  /** Show the hover control bar (auto-rotate / reset / fullscreen). */
  controls?: boolean;
}

function environmentImage(config?: ARConfiguration | null): string {
  if (!config) return 'neutral';
  switch (config.lightingPreset) {
    case 'studio':
      return 'studio';
    case 'dramatic':
      return 'dawn';
    default:
      return config.environmentPreset || 'neutral';
  }
}

function orbitFor(config?: ARConfiguration | null): string {
  const yaw = 45 + (config?.rotation?.y ?? 0);
  return `${yaw}deg 55deg 105%`;
}

/**
 * Inline 3D viewer used on the product detail page.
 *
 * Renders the same model, lighting and camera framing as the AR experience so
 * the customer always sees one consistent representation of the product.
 * Loading / error states are overlays — the `<model-viewer>` element is never
 * unmounted, which keeps retry behaviour predictable.
 */
export function ModelViewer({
  modelUrl,
  productName,
  configuration,
  className = '',
  controls = true,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ModelViewerElement | null>(null);

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasValidModel = !!modelUrl && !modelUrl.includes('placehold.co');

  const handleRetry = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer || !modelUrl) return;
    setStatus('loading');
    setProgress(0);
    viewer.src = '';
    requestAnimationFrame(() => {
      viewer.src = modelUrl;
    });
  }, [modelUrl]);

  const handleReset = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.cameraOrbit = orbitFor(configuration);
    viewer.fieldOfView = '30deg';
  }, [configuration]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) void el.requestFullscreen?.();
    else void document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Attach to the element whenever it (re)appears in the DOM.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const viewer = container.querySelector('model-viewer') as ModelViewerElement | null;
    viewerRef.current = viewer;
    if (!viewer) return;

    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent<{ totalProgress?: number }>).detail;
      setProgress(Math.round((detail?.totalProgress ?? 0) * 100));
      setStatus('loading');
    };
    const onLoad = () => setStatus('ready');
    const onError = () => setStatus('error');

    viewer.addEventListener('progress', onProgress);
    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);
    return () => {
      viewer.removeEventListener('progress', onProgress);
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
    };
  }, [modelUrl]);

  // ── No model configured ─────────────────────────────────────────────
  if (!hasValidModel) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100 rounded-2xl text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-200/60 flex items-center justify-center mb-4">
            <Box className="w-7 h-7 text-brand-400" />
          </div>
          <p className="text-sm font-semibold text-brand-900">3D model coming soon</p>
          <p className="text-xs text-brand-500 mt-1.5 max-w-[16rem]">
            A 3D model for the {productName} has not been generated yet. Rapidify adds it when
            the merchant activates this product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative group/vv ${className}`}>
      <model-viewer
        src={modelUrl ?? undefined}
        alt={`Interactive 3D model of the ${productName}`}
        camera-controls
        auto-rotate={autoRotate}
        auto-rotate-delay="1200"
        rotation-per-second="24deg"
        shadow-intensity="1"
        shadow-softness="0.7"
        exposure="1"
        environment-image={environmentImage(configuration)}
        camera-orbit={orbitFor(configuration)}
        min-camera-orbit="auto auto 55%"
        max-camera-orbit="auto 160deg 200%"
        field-of-view="30deg"
        interpolation-decay="100"
        interaction-prompt="none"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      />

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100/90 backdrop-blur-sm rounded-2xl pointer-events-none z-10">
          <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
          <p className="text-xs text-brand-500 mt-3 font-medium">
            Loading 3D model… {progress}%
          </p>
        </div>
      )}

      {/* Error overlay — the viewer stays mounted so retry always works */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100/95 backdrop-blur-sm rounded-2xl text-center px-6 z-20">
          <div className="w-14 h-14 rounded-2xl bg-warning-light flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-warning" />
          </div>
          <p className="text-sm font-semibold text-brand-900">Could not load the 3D model</p>
          <p className="text-xs text-brand-500 mt-1.5 max-w-xs">
            Check your connection and try again — the product photos are still available.
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 h-9 px-4 bg-brand-900 text-white rounded-lg text-xs font-medium hover:bg-brand-800 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Interaction hint */}
      {status === 'ready' && (
        <div className="absolute top-3 left-3 opacity-0 group-hover/vv:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-brand-900/85 backdrop-blur-md text-white text-2xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
            <Box className="w-3 h-3" />
            <span>GLB · drag to rotate · scroll to zoom</span>
          </div>
        </div>
      )}

      {/* Controls */}
      {controls && status === 'ready' && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover/vv:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 bg-brand-900/85 backdrop-blur-md rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setAutoRotate((v) => !v)}
              title={autoRotate ? 'Pause auto-rotate' : 'Start auto-rotate'}
              aria-label={autoRotate ? 'Pause auto-rotate' : 'Start auto-rotate'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                autoRotate
                  ? 'bg-accent-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleReset}
              title="Reset view"
              aria-label="Reset view"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="w-8 h-8 rounded-lg bg-brand-900/85 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
