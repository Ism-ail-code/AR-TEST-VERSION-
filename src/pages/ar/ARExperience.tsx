import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { ModelViewerElement } from '@google/model-viewer';
import { findProduct, demoProducts } from '@/data/products';
import { detectARCapabilities, getPreferredARMode, getARModeLabel } from '@/services/ar';
import type { ARCapabilities, ARMode } from '@/services/ar';
import { ARControls, ARUnsupported } from '@/components/ar';
import type { ViewerStatus } from '@/components/ar/ARViewer';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ArrowLeft, ArrowRight, Box, ExternalLink } from 'lucide-react';

const ARViewer = lazy(() =>
  import('@/components/ar/ARViewer').then((m) => ({ default: m.ARViewer })),
);

/**
 * Full-screen, phone-first AR experience.
 *
 * Flow: detect AR capability → hand off to the native AR session when
 * possible → otherwise show the same real-time 3D model with a polished
 * explanation instead of a dead end.
 */
export function ARExperience() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = findProduct(productId);

  const [capabilities, setCapabilities] = useState<ARCapabilities | null>(null);
  const [arMode, setArMode] = useState<ARMode>('none');
  const [status, setStatus] = useState<ViewerStatus>('loading');
  const viewerRef = useRef<ModelViewerElement | null>(null);

  useDocumentTitle(product ? `AR · ${product.name}` : 'AR');

  useEffect(() => {
    // WebXR support can only be known from a promise — see `isWebXRSupported()`.
    let alive = true;
    detectARCapabilities().then((caps) => {
      if (!alive) return;
      setCapabilities(caps);
      setArMode(getPreferredARMode(caps));
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleExit = useCallback(() => {
    navigate(product ? `/product/${product.slug}` : '/products');
  }, [product, navigate]);

  const handleStartAR = useCallback(() => {
    const el = viewerRef.current;
    if (el && typeof el.activateAR === 'function') el.activateAR();
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Box className="w-7 h-7 text-white/40" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Product not found</h1>
          <p className="text-white/40 text-sm mb-6">
            This AR link does not match any product in the Casa Living catalogue.
          </p>
          <Link
            to="/products"
            className="h-10 px-5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors inline-flex items-center"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  // ── Product has no 3D model yet — don't dead-end in an empty viewer ──
  if (!product.modelUrl) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand-900 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Box className="w-7 h-7 text-white/40" />
          </div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-accent-400 mb-2">
            Not AR activated
          </p>
          <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            This piece doesn&apos;t have a 3D model yet, so there&apos;s nothing to place in your
            room.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              to={`/product/${product.slug}`}
              className="h-10 px-5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/15 transition-colors inline-flex items-center"
            >
              Product page
            </Link>
            <Link
              to={`/ar/${demoProducts.find((p) => p.arReady)?.id ?? ''}`}
              className="h-10 px-5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors inline-flex items-center gap-2"
            >
              Try an AR product <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const arCapable = capabilities?.arCapable ?? false;
  /**
   * AR is only *offered* while it is actually working. When the browser
   * refuses the hand-off the model is already on screen, so we downgrade the
   * controls to 3D mode rather than throwing a full-screen error over it.
   */
  const arActive = arCapable && status !== 'ar-unavailable';
  /**
   * The explainer sheet is for phones that were expected to hand off to AR
   * but can't. Desktop keeps the full control sheet — it just disables
   * "Place in Room" — so [Rotate] [Move] [Scale] [Reset] stay reachable.
   */
  const showUnsupportedSheet = !arCapable && (capabilities?.mobile ?? false);
  const modeLabel = capabilities ? (arActive ? getARModeLabel(arMode) : '3D preview') : 'Detecting…';
  const primaryImage =
    product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? '';

  return (
    <div className="min-h-screen bg-brand-950 relative overflow-hidden">
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 bg-brand-900/70 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-brand-900 transition-colors border border-white/10 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex-1 min-w-0 text-center">
            <p className="text-white text-sm font-semibold truncate [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
              {product.name}
            </p>
            <p className="text-white/55 text-[0.625rem] tracking-wide">AR by Rapidify</p>
          </div>

          {capabilities && (
            <span
              className={`shrink-0 text-2xs font-semibold px-2.5 py-1.5 rounded-full border backdrop-blur-md ${
                arActive
                  ? 'bg-accent-500/20 text-accent-400 border-accent-500/25'
                  : 'bg-white/10 text-white/50 border-white/10'
              }`}
            >
              {modeLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── Viewer ── */}
      <div className="absolute inset-0">
        {capabilities === null ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-accent-500 animate-spin" />
            <p className="text-xs text-white/40 mt-3 font-medium">Detecting AR capabilities…</p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-accent-500 animate-spin" />
                <p className="text-xs text-white/40 mt-3 font-medium">Loading 3D viewer…</p>
              </div>
            }
          >
            <ARViewer
              modelUrl={product.modelUrl ?? ''}
              productName={product.name}
              productSlug={product.slug}
              arMode={arMode}
              configuration={product.arConfiguration}
              viewerRef={viewerRef}
              onStatusChange={setStatus}
              className="w-full h-full"
            />
          </Suspense>
        )}
      </div>

      {/* ── AR-active banner ── */}
      {status === 'ar-started' && (
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center px-4">
          <div className="bg-accent-500/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            AR active — tap the surface to place
          </div>
        </div>
      )}

      {/* ── AR hand-off refused: model stays, only placement is off ── */}
      {status === 'ar-unavailable' && (
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center px-4">
          <div className="bg-brand-900/85 backdrop-blur-md text-white/75 text-2xs font-medium px-4 py-2 rounded-full border border-white/10 text-center">
            AR couldn't start — you're viewing the live 3D model
          </div>
        </div>
      )}

      {/* ── Not-capable: product shortcut under the 3D preview ── */}
      {capabilities && showUnsupportedSheet && (
        <div className="absolute top-16 right-3 z-20 hidden sm:block">
          <Link
            to={`/product/${product.slug}`}
            className="flex items-center gap-1.5 bg-brand-900/70 backdrop-blur-md text-white/80 px-3 py-1.5 rounded-lg text-2xs font-medium hover:text-white border border-white/10"
          >
            <ExternalLink className="w-3 h-3" /> Product page
          </Link>
        </div>
      )}

      {/* ── Bottom sheet ── */}
      {capabilities && showUnsupportedSheet ? (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-brand-900/95 backdrop-blur-xl border-t border-white/10 p-4 sm:p-5 rounded-t-3xl">
            <div className="max-w-md mx-auto">
              <ARUnsupported capabilities={capabilities} productName={product.name} />

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-800 shrink-0">
                  <img src={primaryImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-white/40 text-2xs">${product.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/product/${product.slug}`}
                    className="h-9 px-3.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/15 transition-colors inline-flex items-center"
                  >
                    View details
                  </Link>
                  <button
                    onClick={handleExit}
                    className="h-9 px-3.5 bg-accent-500 text-white rounded-xl text-xs font-semibold hover:bg-accent-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ARControls
          product={product}
          arSupported={arActive}
          arModeLabel={modeLabel}
          viewerRef={viewerRef}
          onStartAR={handleStartAR}
          onExit={handleExit}
        />
      )}
    </div>
  );
}
