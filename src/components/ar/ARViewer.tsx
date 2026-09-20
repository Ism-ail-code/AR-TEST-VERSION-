import { useRef, useEffect, useCallback, useState } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer';
import type { ARMode } from '@/services/ar';
import type { ARConfiguration } from '@/types';

export interface ARViewerProps {
  modelUrl: string;
  productName: string;
  arMode: ARMode;
  arConfiguration?: ARConfiguration | null;
  className?: string;
  onARStatusChange?: (status: 'idle' | 'loading' | 'ar-started' | 'ar-ended' | 'error') => void;
}

function getEnvironmentImage(config?: ARConfiguration | null): string {
  if (!config) return 'neutral';
  switch (config.lightingPreset) {
    case 'studio': return 'studio';
    case 'dramatic': return 'dawn';
    case 'natural':
    default: return config.environmentPreset || 'neutral';
  }
}

export function ARViewer({ modelUrl, productName, arMode, arConfiguration, className = '', onARStatusChange }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ar-started' | 'ar-ended' | 'error'>('idle');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const updateStatus = useCallback(
    (newStatus: typeof status) => {
      setStatus(newStatus);
      onARStatusChange?.(newStatus);
    },
    [onARStatusChange]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewer = container.querySelector('model-viewer') as ModelViewerElement | null;
    if (!viewer) return;
    viewerRef.current = viewer;

    const onProgress = (e: any) => {
      setLoadProgress(Math.round((e.detail?.totalProgress ?? 0) * 100));
      if (status !== 'loading') updateStatus('loading');
    };

    const onLoad = () => {
      setModelLoaded(true);
      updateStatus('idle');
    };

    const onError = () => {
      updateStatus('error');
    };

    const onARStatus = (e: any) => {
      const arStatus = e.detail?.status;
      if (arStatus === 'session-started') updateStatus('ar-started');
      else if (arStatus === 'object-unplaced') updateStatus('ar-started');
      else if (arStatus === 'object-placed') updateStatus('ar-started');
      else if (arStatus === 'failed' || arStatus === 'not-supporting-browser') updateStatus('error');
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
  }, [status, updateStatus]);

  const arModesAttr = arMode === 'none' ? undefined : getModelViewerARAttr(arMode);
  const envImage = getEnvironmentImage(arConfiguration);
  const cameraOrbit = arConfiguration
    ? `${45 + (arConfiguration.rotation?.y ?? 0)}deg 55deg 105%`
    : '45deg 55deg 105%';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <model-viewer
        src={modelUrl}
        alt={productName}
        camera-controls
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="25deg"
        shadow-intensity={arConfiguration?.backgroundBlur ? '0' : '1'}
        shadow-softness={arConfiguration?.backgroundBlur ? '0' : '0.5'}
        exposure="1"
        environment-image={envImage}
        camera-orbit={cameraOrbit}
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="Infinity 160deg 200%"
        field-of-view="30deg"
        interpolation-decay="100"
        ar
        ar-modes={arModesAttr}
        ar-scale={arConfiguration ? String(arConfiguration.scale) : 'auto'}
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      />

      {/* Loading overlay */}
      {(!modelLoaded && status !== 'error') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-50/80 backdrop-blur-sm pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
          <p className="text-xs text-brand-500 mt-3 font-medium">
            {status === 'loading' ? `Loading model... ${loadProgress}%` : 'Preparing 3D model...'}
          </p>
        </div>
      )}
    </div>
  );
}

function getModelViewerARAttr(mode: ARMode): string {
  switch (mode) {
    case 'webxr': return 'webxr';
    case 'scene-viewer': return 'scene-viewer';
    case 'quick-look': return 'quick-look';
    default: return 'webxr scene-viewer quick-look';
  }
}
