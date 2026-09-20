import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress, Html, Environment, ContactShadows } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
  Box,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

// ─── Loading indicator ───
function ViewerLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
        <p className="text-xs text-brand-500 font-medium">Loading 3D model... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// ─── The actual 3D model ───
function Model({ url }: { url: string }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Scene contents ───
function Scene({ modelUrl, autoRotate }: { modelUrl: string; autoRotate: boolean }) {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    // auto-rotate is handled by OrbitControls
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, 5, -5]} intensity={0.3} />

      <Suspense fallback={<ViewerLoader />}>
        <Model url={modelUrl} />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <Environment preset="apartment" />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// ─── Error boundary ───
interface ViewerErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function ViewerErrorState({ message = 'Failed to load 3D model', onRetry }: ViewerErrorStateProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-warning-light flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-warning" />
      </div>
      <p className="text-sm font-semibold text-brand-900">{message}</p>
      <p className="text-xs text-brand-500 mt-1 max-w-xs text-center">
        The 3D model file could not be loaded. This may be a placeholder URL.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 h-9 px-4 bg-brand-900 text-white rounded-lg text-xs font-medium hover:bg-brand-800 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ─── Placeholder (no model URL) ───
function ViewerPlaceholder({ productName }: { productName: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-brand-200/50 flex items-center justify-center mb-4">
        <Box className="w-8 h-8 text-brand-400" />
      </div>
      <p className="text-sm font-semibold text-brand-900">3D model coming soon</p>
      <p className="text-xs text-brand-500 mt-1 max-w-xs text-center">
        A 3D model for the {productName} will be available here.
      </p>
    </div>
  );
}

// ─── Main ModelViewer component ───
interface ModelViewerProps {
  modelUrl?: string | null;
  productName: string;
  className?: string;
}

export function ModelViewer({ modelUrl, productName, className = '' }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewerKey, setViewerKey] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const hasValidModel = modelUrl && !modelUrl.includes('placehold.co');

  const handleReset = useCallback(() => {
    setViewerKey((k) => k + 1);
    setLoadError(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // No model at all — show placeholder
  if (!hasValidModel) {
    return (
      <div className={`relative ${className}`}>
        <ViewerPlaceholder productName={productName} />
      </div>
    );
  }

  // Load error
  if (loadError) {
    return (
      <div className={`relative ${className}`}>
        <ViewerErrorState onRetry={handleReset} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        key={viewerKey}
        camera={{ position: [3, 2, 5], fov: 45 }}
        className="rounded-2xl"
        style={{ background: 'transparent' }}
        onCreated={() => setLoadError(false)}
        onError={() => setLoadError(true)}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene modelUrl={modelUrl} autoRotate={autoRotate} />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Left controls */}
        <div className="flex items-center gap-1 bg-brand-900/80 backdrop-blur-md rounded-xl p-1 shadow-lg">
          <ControlBtn
            icon={<RotateCcw className="w-4 h-4" />}
            active={autoRotate}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Auto-rotate"
          />
          <div className="w-px h-5 bg-white/10" />
          <ControlBtn icon={<ZoomIn className="w-4 h-4" />} title="Zoom in (scroll)" />
          <ControlBtn icon={<ZoomOut className="w-4 h-4" />} title="Zoom out (scroll)" />
          <ControlBtn icon={<Move className="w-4 h-4" />} title="Pan (right-click drag)" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 bg-brand-900/80 backdrop-blur-md rounded-xl p-1 shadow-lg">
          <ControlBtn icon={<RotateCcw className="w-4 h-4" />} onClick={handleReset} title="Reset view" />
          <ControlBtn
            icon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          />
        </div>
      </div>

      {/* Model info */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-brand-900/80 backdrop-blur-md text-white text-2xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
          <Box className="w-3 h-3" />
          <span>GLB &middot; Drag to rotate &middot; Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}

// ─── Small control button ───
function ControlBtn({
  icon,
  active,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        active
          ? 'bg-accent-500 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
    </button>
  );
}
