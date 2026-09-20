import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { demoProducts } from '@/data/demo';
import { detectARCapabilities, getPreferredARMode, getARModeLabel } from '@/services/ar';
import type { ARCapabilities, ARMode } from '@/services/ar';
import { ARControls, ARUnsupported } from '@/components/ar';
import { ArrowLeft, Box } from 'lucide-react';

const ARViewer = lazy(() =>
  import('@/components/ar/ARViewer').then((m) => ({ default: m.ARViewer }))
);

export function ARExperience() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = demoProducts.find((p) => p.id === productId || p.slug === productId);

  const [capabilities, setCapabilities] = useState<ARCapabilities | null>(null);
  const [arMode, setArMode] = useState<ARMode>('none');
  const [arStatus, setArStatus] = useState<'idle' | 'loading' | 'ar-started' | 'ar-ended' | 'error'>('idle');

  useEffect(() => {
    const caps = detectARCapabilities();
    setCapabilities(caps);
    setArMode(getPreferredARMode(caps));
  }, []);

  const handleStartAR = useCallback(() => {
    const viewer = document.querySelector('model-viewer') as any;
    if (viewer?.activateAR) {
      viewer.activateAR();
    }
  }, []);

  const handleReset = useCallback(() => {
    const viewer = document.querySelector('model-viewer') as any;
    if (viewer) {
      viewer.cameraOrbit = '45deg 55deg 105%';
      viewer.fieldOfView = '30deg';
    }
  }, []);

  const handleExit = useCallback(() => {
    if (product) {
      navigate(`/product/${product.slug}`);
    } else {
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Box className="w-7 h-7 text-white/40" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Product not found</h1>
          <p className="text-white/40 text-sm mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/products" className="h-10 px-5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors inline-flex items-center">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  // Show unsupported screen if capabilities checked and AR not available
  if (capabilities && !capabilities.arCapable) {
    return (
      <ARUnsupportedPage
        capabilities={capabilities}
        product={product}
        onBack={() => navigate(`/product/${product.slug}`)}
        arMode={arMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-950 relative overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <Link
            to={`/product/${product.slug}`}
            className="flex items-center gap-1.5 bg-brand-900/70 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-brand-900 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="flex items-center gap-2">
            {capabilities?.arCapable && (
              <span className="bg-accent-500/20 text-accent-400 text-2xs font-semibold px-2.5 py-1 rounded-full border border-accent-500/20">
                {getARModeLabel(arMode)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3D/AR viewer - full screen */}
      <div className="absolute inset-0">
        {capabilities === null ? (
          /* Detecting capabilities */
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-50">
            <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
            <p className="text-xs text-brand-500 mt-3 font-medium">Detecting AR capabilities...</p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-50">
                <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
                <p className="text-xs text-brand-500 mt-3 font-medium">Loading 3D viewer...</p>
              </div>
            }
          >
            <ARViewer
              modelUrl={product.arModelUrl ?? ''}
              productName={product.name}
              arMode={arMode}
              arConfiguration={product.arConfiguration}
              onARStatusChange={setArStatus}
              className="w-full h-full"
            />
          </Suspense>
        )}
      </div>

      {/* AR status indicator */}
      {arStatus === 'ar-started' && (
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center">
          <div className="bg-accent-500/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-accent-500/20 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            AR Active - Tap to place
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <ARControls
        product={product}
        arSupported={capabilities?.arCapable ?? false}
        arModeLabel={capabilities ? getARModeLabel(arMode) : 'Detecting...'}
        onStartAR={handleStartAR}
        onReset={handleReset}
        onExit={handleExit}
      />
    </div>
  );
}

/* ─── Unsupported fallback with 3D viewer ─── */
function ARUnsupportedPage({
  capabilities,
  product,
  onBack,
  arMode: _arMode,
}: {
  capabilities: ARCapabilities;
  product: NonNullable<ReturnType<typeof demoProducts.find>>;
  onBack: () => void;
  arMode: ARMode;
}) {
  return (
    <div className="min-h-screen bg-brand-950 relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 bg-brand-900/70 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-brand-900 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="bg-white/10 text-white/50 text-2xs font-medium px-2.5 py-1 rounded-full border border-white/10">
            3D Viewer
          </span>
        </div>
      </div>

      {/* 3D viewer as fallback */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-50">
              <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
              <p className="text-xs text-brand-500 mt-3 font-medium">Loading 3D viewer...</p>
            </div>
          }
        >
          <ARViewer
            modelUrl={product.arModelUrl ?? ''}
            productName={product.name}
            arMode="none"
            arConfiguration={product.arConfiguration}
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Unsupported info panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-brand-900/95 backdrop-blur-xl border-t border-white/10 p-4 sm:p-5">
          <div className="max-w-md mx-auto">
            <ARUnsupported capabilities={capabilities} productName={product.name} />

            {/* Product info */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-800 shrink-0">
                <img
                  src={product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                <p className="text-white/40 text-2xs">${product.price.toLocaleString()}</p>
              </div>
              <Link to={`/product/${product.slug}`} className="h-9 px-4 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/15 transition-colors inline-flex items-center">
                View details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
