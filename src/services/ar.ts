export interface ARCapabilities {
  webXRSupported: boolean;
  sceneViewerSupported: boolean;
  quickLookSupported: boolean;
  iOS: boolean;
  android: boolean;
  mobile: boolean;
  arCapable: boolean;
  reason: string;
}

const USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : '';

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(USER_AGENT) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isAndroid(): boolean {
  return /Android/i.test(USER_AGENT);
}

function isMobile(): boolean {
  return isIOS() || isAndroid() || /Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(USER_AGENT);
}

function isWebXRSupported(): boolean {
  if (!('xr' in navigator)) return false;
  try {
    return (navigator as any).xr?.isSessionSupported?.('immersive-ar') ?? false;
  } catch {
    return false;
  }
}

function isSceneViewerSupported(): boolean {
  if (!isAndroid()) return false;
  const link = document.createElement('a');
  link.href = 'intent://ar/scene-viewer?url=https://example.com#Intent;scheme=ar;package=com.google.ar.core;end;';
  return /Android/i.test(USER_AGENT);
}

function isQuickLookSupported(): boolean {
  if (!isIOS()) return false;
  const link = document.createElement('a');
  return 'relList' in link && link.relList.supports?.('ar') === true;
}

export function detectARCapabilities(): ARCapabilities {
  const webXR = isWebXRSupported();
  const sceneViewer = isSceneViewerSupported();
  const quickLook = isQuickLookSupported();
  const iOS = isIOS();
  const android = isAndroid();
  const mobile = isMobile();

  let reason = '';
  const arCapable = webXR || sceneViewer || quickLook;

  if (arCapable) {
    if (webXR) reason = 'WebXR immersive-ar is available';
    else if (sceneViewer) reason = 'Google Scene Viewer is available';
    else if (quickLook) reason = 'Apple Quick Look is available';
  } else if (!mobile) {
    reason = 'AR requires a mobile device with ARCore (Android) or ARKit (iOS)';
  } else if (iOS && !quickLook) {
    reason = 'Your iOS device does not support Quick Look AR';
  } else if (android && !sceneViewer && !webXR) {
    reason = 'Your Android device does not support Scene Viewer or WebXR';
  } else {
    reason = 'AR is not supported on this device';
  }

  return { webXRSupported: webXR, sceneViewerSupported: sceneViewer, quickLookSupported: quickLook, iOS, android, mobile, arCapable, reason };
}

export type ARMode = 'webxr' | 'scene-viewer' | 'quick-look' | 'none';

export function getPreferredARMode(capabilities: ARCapabilities): ARMode {
  if (capabilities.webXRSupported) return 'webxr';
  if (capabilities.sceneViewerSupported) return 'scene-viewer';
  if (capabilities.quickLookSupported) return 'quick-look';
  return 'none';
}

export function getARModeLabel(mode: ARMode): string {
  switch (mode) {
    case 'webxr': return 'WebXR AR';
    case 'scene-viewer': return 'Scene Viewer';
    case 'quick-look': return 'Quick Look';
    default: return '3D Viewer';
  }
}

export function getModelViewerARModes(mode: ARMode): string {
  switch (mode) {
    case 'webxr': return 'webxr';
    case 'scene-viewer': return 'scene-viewer';
    case 'quick-look': return 'quick-look';
    default: return '';
  }
}
