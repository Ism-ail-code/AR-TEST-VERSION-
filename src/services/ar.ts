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

/**
 * `XRSystem.isSessionSupported()` is **async**.
 *
 * It used to be called without awaiting, so the raw `Promise` was returned —
 * and a Promise is always truthy. Every browser that merely *exposed*
 * `navigator.xr` was therefore reported as WebXR-capable, which pinned
 * `ar-modes="webxr"` on devices that can never start an `immersive-ar`
 * session. Android Chrome (which does expose `navigator.xr`) then failed the
 * hand-off and reported `ar-status: failed`, while Samsung Internet — which
 * does not go down that path — happily showed the model.
 *
 * Bounded by a timeout: some browsers only settle the promise after a user
 * gesture, and the AR page must never hang on "Detecting AR capabilities…".
 */
function isWebXRSupported(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('xr' in navigator)) return Promise.resolve(false);

  let check: unknown;
  try {
    check = (navigator as Navigator & { xr?: { isSessionSupported?: (m: string) => Promise<boolean> } })
      .xr?.isSessionSupported?.('immersive-ar');
  } catch {
    return Promise.resolve(false);
  }
  if (!check || typeof (check as Promise<boolean>).then !== 'function') return Promise.resolve(false);

  const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1500));
  const settled = (check as Promise<boolean>).then((v) => v === true).catch(() => false);
  return Promise.race([settled, timeout]);
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

/**
 * Detects what this device can actually do.
 *
 * Async because WebXR support is only knowable from a promise — see
 * `isWebXRSupported()` above. Never rejects, so the AR page can always
 * settle out of its "detecting" state.
 */
export async function detectARCapabilities(): Promise<ARCapabilities> {
  const webXR = await isWebXRSupported();
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
