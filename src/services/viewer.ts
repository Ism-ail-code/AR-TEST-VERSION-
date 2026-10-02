import type { ARConfiguration } from '@/types';

/**
 * Viewer helpers shared by the inline product viewer and the full-screen AR view.
 *
 * `<model-viewer>` accepts only a URL or one of two built-in values for
 * `environment-image` — `'neutral'` and `'legacy'`. The presets stored in the
 * merchant AR configuration (`apartment`, `studio`, `dawn`, …) are display
 * metadata: pass one through and the viewer tries to fetch it as a relative
 * URL, the request fails, and the model never finishes loading.
 */
export function environmentImage(config?: ARConfiguration | null): string {
  return config?.lightingPreset === 'dramatic' ? 'legacy' : 'neutral';
}

/** Default camera framing — 45° yaw unless the merchant rotated the model. */
export function orbitFor(config?: ARConfiguration | null): string {
  const yaw = 45 + (config?.rotation?.y ?? 0);
  return `${yaw}deg 55deg 105%`;
}
