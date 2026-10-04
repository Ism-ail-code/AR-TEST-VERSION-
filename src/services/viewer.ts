import type { ARConfiguration } from '@/types';

/**
 * Viewer helpers shared by the inline product viewer and the full-screen AR view.
 *
 * `<model-viewer>` accepts a URL or one of two built-in presets for
 * `environment-image` (`'neutral'`, `'legacy'`). The presets stored in the
 * merchant AR configuration (`apartment`, `studio`, `dawn`, …) are display
 * metadata: pass one through and the viewer tries to fetch it as a relative
 * URL, the request fails, and the model never finishes loading.
 *
 * The bundled presets are also a near-uniform grey field, so metal had nothing
 * to reflect and every product rendered as flat clay — measured luminance
 * spread of σ≈9 across the frame. `public/textures/studio-env.png` is a
 * purpose-built equirect rig (key + fill + rim + overhead + floor bounce) that
 * puts the same model at σ≈60: real highlights, a directional gradient and a
 * contact shadow, without any external fetch.
 */
const STUDIO_ENV = `${import.meta.env.BASE_URL}textures/studio-env.png`;

export function environmentImage(config?: ARConfiguration | null): string {
  return config?.lightingPreset === 'dramatic' ? 'legacy' : STUDIO_ENV;
}

/** Default camera framing — 45° yaw unless the merchant rotated the model. */
export function orbitFor(config?: ARConfiguration | null): string {
  const yaw = 45 + (config?.rotation?.y ?? 0);
  return `${yaw}deg 55deg 105%`;
}
