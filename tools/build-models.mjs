/* Builds the 16 electronics / appliance GLBs for the static catalog.
   Every model is sized in metres and grounded at y = 0 so `ar-scale="auto"`
   places it at true real-world size. Run:  node build-models.mjs  */

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  box, cyl, sphere, torus, softBox, xf,
  T, RX, RY, RZ, writeGLB, groundAndCentre, registerTextures,
} from './lib-glb.mjs';
import { buildTextures } from './textures.mjs';

/** tools/ → repository root, so the script runs from any working directory. */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'public', 'models');
mkdirSync(OUT, { recursive: true });

/* Brushing, acoustic weave, foam grain, QLED content, watch face and the
   appliance displays are all generated here so every GLB is self-contained. */
registerTextures(buildTextures());

const D = Math.PI / 180;
const parts = [];
const add = (name, material, g, ...mats) =>
  parts.push({ name, material, geo: mats.length ? xf(g, ...mats) : g });

function build(file, fn) {
  parts.length = 0;
  fn();
  const { height } = groundAndCentre(parts);
  const { bytes, tris } = writeGLB(`${OUT}/${file}.glb`, parts, file);
  console.log(
    `${file.padEnd(22)} ${(bytes / 1024).toFixed(0).padStart(5)} KB  ` +
    `${String(tris).padStart(5)} tris  height ${height.toFixed(2)} m`,
  );
}

/* ══════════════ HOME APPLIANCES ══════════════ */

build('refrigerator', () => {
  // French-door fridge, 90 × 178 × 72 cm
  add('body', 'steelLight', softBox(0.45, 0.89, 0.36, 8), T(0, 0.89, 0));
  add('door-left', 'steel', softBox(0.222, 0.52, 0.022, 6), T(-0.226, 1.24, 0.362));
  add('door-right', 'steel', softBox(0.222, 0.52, 0.022, 6), T(0.226, 1.24, 0.362));
  add('freezer-drawer', 'steel', softBox(0.448, 0.30, 0.022, 6), T(0, 0.36, 0.362));
  add('drawer-top', 'steelDark', softBox(0.448, 0.012, 0.024, 5), T(0, 0.675, 0.362));
  add('handle-left', 'chrome', cyl(0.016, 0.016, 0.94, 20), T(-0.052, 1.24, 0.398));
  add('handle-right', 'chrome', cyl(0.016, 0.016, 0.94, 20), T(0.052, 1.24, 0.398));
  add('handle-drawer', 'chrome', cyl(0.015, 0.015, 0.64, 20), T(0, 0.62, 0.398), RZ(Math.PI / 2));
  add('dispenser', 'glossBlack', softBox(0.17, 0.30, 0.03, 5), T(-0.226, 1.16, 0.372));
  add('dispenser-lip', 'graphite', box(0.13, 0.02, 0.04), T(-0.226, 1.0, 0.398));
  add('water-spout', 'chrome', box(0.05, 0.03, 0.03), T(-0.226, 1.33, 0.396));
  // Both plates must sit just PROUD of the door skin (front face ≈ 0.384 at
  // this height) — at 0.372 they were buried inside the door and invisible.
  add('display', 'panelUI', box(0.055, 0.018, 0.006), T(0.30, 1.52, 0.387));
  add('badge', 'graphite', box(0.10, 0.016, 0.006), T(0.20, 1.66, 0.387));
  // Door gaskets — a recessed shadow line where the French doors and the
  // freezer drawer meet, otherwise the front reads as one flat sheet of steel.
  add('gasket', 'blackSoft', box(0.008, 0.50, 0.006), T(0, 1.24, 0.366));
  add('gasket', 'blackSoft', box(0.87, 0.008, 0.006), T(0, 0.70, 0.366));
  // Condenser grille — the catalog shots look down onto the lid. Sized to sit
  // inside the shell at that height: the lid tapers, so a wider plate floats.
  add('top-grille', 'graphite', box(0.64, 0.010, 0.13), T(0, 1.776, -0.115));
  for (let k = 0; k < 9; k++) {
    add('vent-slat', 'black', box(0.60, 0.005, 0.007), T(0, 1.782, -0.166 + k * 0.014));
  }
});


build('washing-machine', () => {
  // Front-loading washer, 60 × 85 × 62 cm
  add('body', 'white', softBox(0.30, 0.425, 0.31, 8), T(0, 0.425, 0));
  add('control-panel', 'graphite', softBox(0.285, 0.07, 0.014, 5), T(0, 0.755, 0.31));
  add('drawer', 'offWhite', box(0.14, 0.075, 0.03), T(-0.185, 0.755, 0.312));
  add('display', 'panelUI', box(0.11, 0.035, 0.012), T(0.0, 0.755, 0.318));
  add('dial', 'steel', cyl(0.036, 0.036, 0.024, 26), T(0.20, 0.755, 0.325), RX(Math.PI / 2));
  add('dial-mark', 'chrome', box(0.006, 0.02, 0.014), T(0.20, 0.782, 0.338));
  for (let k = 0; k < 3; k++) {
    add('button', 'offWhite', cyl(0.008, 0.008, 0.010, 14),
      T(0.082 + k * 0.026, 0.755, 0.324), RX(Math.PI / 2));
  }
  add('porthole-rim', 'steel', torus(0.205, 0.02, 34, 10), T(0, 0.38, 0.318));
  add('door-seal', 'blackSoft', torus(0.186, 0.013, 32, 8), T(0, 0.38, 0.312));
  add('porthole-glass', 'darkGlass', cyl(0.185, 0.185, 0.03, 34), T(0, 0.38, 0.30), RX(Math.PI / 2));
  add('drum', 'steelDark', cyl(0.16, 0.16, 0.20, 30, { top: false }), T(0, 0.38, 0.20), RX(Math.PI / 2));
  add('drum-floor', 'steelDark', cyl(0.16, 0.16, 0.01, 30), T(0, 0.38, 0.10), RX(Math.PI / 2));
  add('brand', 'steelDark', box(0.13, 0.014, 0.01), T(0, 0.60, 0.316));
  add('lid-seam', 'offWhite', box(0.55, 0.01, 0.58), T(0, 0.846, 0));
  add('foot', 'graphite', cyl(0.026, 0.03, 0.03, 14), T(-0.24, -0.015, 0.24));
  add('foot', 'graphite', cyl(0.026, 0.03, 0.03, 14), T(0.24, -0.015, 0.24));
  add('foot', 'graphite', cyl(0.026, 0.03, 0.03, 14), T(-0.24, -0.015, -0.24));
  add('foot', 'graphite', cyl(0.026, 0.03, 0.03, 14), T(0.24, -0.015, -0.24));
});

build('air-conditioner', () => {
  // Split wall unit, 86 × 30 × 22 cm (with its wall plate)
  add('body', 'white', softBox(0.43, 0.15, 0.11, 8), T(0, 0.15, 0));
  add('wall-plate', 'graphite', box(0.80, 0.26, 0.012), T(0, 0.15, -0.116));
  add('air-outlet', 'graphite', box(0.76, 0.055, 0.014), T(0, 0.055, 0.104));
  add('louver', 'offWhite', box(0.78, 0.026, 0.055), T(0, 0.028, 0.125), RX(-22 * D));
  add('swing-vane', 'steelDark', box(0.74, 0.012, 0.03), T(0, 0.05, 0.126), RX(-8 * D));
  for (let k = 0; k < 4; k++) {
    add('outlet-slat', 'offWhite', box(0.74, 0.007, 0.016),
      T(0, 0.034 + k * 0.013, 0.108), RX(-25 * D));
  }
  add('intake-grille', 'offWhite', box(0.72, 0.012, 0.16), T(0, 0.302, -0.01));
  for (let k = 0; k < 6; k++) {
    add('intake-slat', 'graphite', box(0.66, 0.006, 0.010), T(0, 0.308, -0.062 + k * 0.022));
  }
  add('display', 'panelUI', box(0.07, 0.026, 0.01), T(0.27, 0.21, 0.112));
  add('brand', 'steelDark', box(0.10, 0.016, 0.01), T(-0.30, 0.245, 0.11));
  add('filter-line', 'steelDark', box(0.84, 0.008, 0.012), T(0, 0.255, 0.106));
  add('pipe', 'steelDark', cyl(0.02, 0.02, 0.16, 14), T(-0.34, 0.10, -0.10), RX(70 * D));
});

build('microwave-oven', () => {
  // Countertop microwave, 50 × 30 × 38 cm
  add('body', 'steel', softBox(0.25, 0.15, 0.19, 7), T(0, 0.15, 0));
  add('door', 'matteBlack', softBox(0.163, 0.132, 0.014, 5), T(-0.055, 0.15, 0.188));
  add('door-window', 'darkGlass', softBox(0.128, 0.094, 0.008, 5), T(-0.055, 0.15, 0.197));
  add('window-inner', 'black', box(0.20, 0.13, 0.02), T(-0.055, 0.15, 0.184));
  add('handle', 'chrome', cyl(0.013, 0.013, 0.21, 16), T(0.086, 0.15, 0.212));
  add('panel', 'matteBlack', softBox(0.068, 0.132, 0.014, 5), T(0.172, 0.15, 0.188));
  add('display', 'panelUI', box(0.086, 0.03, 0.01), T(0.172, 0.245, 0.197));
  add('buttons', 'graphite', box(0.086, 0.016, 0.008), T(0.172, 0.20, 0.197));
  add('buttons', 'graphite', box(0.086, 0.016, 0.008), T(0.172, 0.176, 0.197));
  add('buttons', 'graphite', box(0.086, 0.016, 0.008), T(0.172, 0.152, 0.197));
  add('dial', 'steel', cyl(0.024, 0.024, 0.016, 22), T(0.172, 0.10, 0.199), RX(Math.PI / 2));
  add('vent', 'graphite', box(0.44, 0.012, 0.30), T(0, 0.304, 0));
  // Magnetically-shielded side louvres — visible from the catalog's 3/4 angle.
  for (let k = 0; k < 7; k++) {
    add('side-vent', 'black', box(0.010, 0.011, 0.26),
      T(-0.249, 0.078 + k * 0.019, 0));
    add('side-vent', 'black', box(0.010, 0.011, 0.26),
      T(0.249, 0.078 + k * 0.019, 0));
  }
  add('foot', 'rubber', cyl(0.018, 0.018, 0.02, 12), T(-0.20, -0.01, 0.15));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.02, 12), T(0.20, -0.01, 0.15));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.02, 12), T(-0.20, -0.01, -0.15));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.02, 12), T(0.20, -0.01, -0.15));
});

build('vacuum-cleaner', () => {
  // Cordless stick vacuum, ~126 cm tall
  add('floor-head', 'graphite', softBox(0.135, 0.026, 0.105, 6), T(0, 0.026, 0.03));
  add('headlight', 'screenBright', box(0.10, 0.013, 0.010), T(0, 0.032, 0.131));
  add('head-strip', 'black', box(0.24, 0.006, 0.02), T(0, 0.054, 0.09));
  add('head-top', 'graphite', softBox(0.11, 0.02, 0.08, 6), T(0, 0.055, 0.01));
  add('head-neck', 'steelDark', box(0.05, 0.10, 0.05), T(0, 0.085, -0.035), RX(30 * D));
  add('head-joint', 'steel', sphere(0.03, 16, 10), T(0, 0.115, -0.055));
  add('wand', 'steel', cyl(0.017, 0.017, 0.76, 20), T(0, 0.49, -0.055));
  add('wand-collar', 'graphite', cyl(0.024, 0.024, 0.05, 18), T(0, 0.75, -0.055));
  add('inlet', 'graphite', cyl(0.03, 0.026, 0.07, 20), T(0, 0.89, -0.055));
  add('dust-bin', 'glass', cyl(0.062, 0.062, 0.17, 26), T(0, 1.0, -0.055));
  add('bin-cage', 'graphite', cyl(0.066, 0.066, 0.02, 26), T(0, 0.93, -0.055));
  add('motor-body', 'titanium', cyl(0.068, 0.058, 0.14, 26), T(0, 1.15, -0.055));
  add('motor-cap', 'steelDark', cyl(0.05, 0.04, 0.05, 24), T(0, 1.245, -0.055));
  add('hepa-ring', 'steel', torus(0.05, 0.006, 24, 8), T(0, 1.19, -0.055), RX(Math.PI / 2));
  add('handle-arm', 'black', box(0.05, 0.03, 0.11), T(0, 1.20, -0.125), RX(25 * D));
  add('handle-grip', 'rubber', cyl(0.016, 0.016, 0.13, 16), T(0, 1.155, -0.175), RX(65 * D));
  add('trigger', 'accent', box(0.03, 0.02, 0.024), T(0, 1.16, -0.135));
  add('power-led', 'led', box(0.026, 0.01, 0.008), T(0, 1.26, -0.03));
  add('cyclone', 'steelDark', cyl(0.05, 0.05, 0.04, 22), T(0, 1.06, -0.055));
});

build('standing-fan', () => {
  // Pedestal fan, 38 cm head at 136 cm
  add('base', 'matteWhite', cyl(0.17, 0.145, 0.05, 40), T(0, 0.025, 0));
  add('base-ring', 'steelDark', torus(0.15, 0.01, 36, 8), T(0, 0.05, 0), RX(Math.PI / 2));
  add('base-cap', 'graphite', cyl(0.05, 0.05, 0.02, 24), T(0, 0.055, 0));
  add('pole', 'steel', cyl(0.019, 0.017, 0.78, 20), T(0, 0.44, 0));
  add('collar', 'graphite', cyl(0.026, 0.026, 0.07, 22), T(0, 0.845, 0));
  add('upper-pole', 'steel', cyl(0.015, 0.015, 0.27, 20), T(0, 1.015, 0));
  add('tilt-joint', 'graphite', sphere(0.036, 18, 12), T(0, 1.155, -0.03));
  add('motor-housing', 'matteWhite', cyl(0.075, 0.06, 0.17, 26), T(0, 1.19, -0.105), RX(Math.PI / 2));
  add('motor-rear', 'graphite', cyl(0.05, 0.03, 0.05, 22), T(0, 1.19, -0.20), RX(Math.PI / 2));
  add('hub', 'graphite', cyl(0.038, 0.038, 0.05, 22), T(0, 1.19, 0.008), RX(Math.PI / 2));
  add('hub-cap', 'steelDark', cyl(0.03, 0.03, 0.02, 22), T(0, 1.19, 0.04), RX(Math.PI / 2));
  for (let k = 0; k < 4; k++) {
    const a = k * 90 * D;
    // NOTE: transforms apply right-to-left, so the hub move is listed first.
    add('blade', 'blade', box(0.15, 0.062, 0.007),
      T(0, 1.19, 0.016), RZ(a), T(0.1, 0, 0), RX(30 * D));
  }
  add('guard-front', 'steelDark', torus(0.19, 0.005, 44, 8), T(0, 1.19, 0.05));
  add('guard-rear', 'steelDark', torus(0.19, 0.005, 44, 8), T(0, 1.19, -0.03));
  add('guard-mid', 'graphite', torus(0.13, 0.004, 40, 8), T(0, 1.19, 0.01));
  for (let k = 0; k < 12; k++) {
    const a = k * 30 * D;
    add('spoke', 'graphite', box(0.186, 0.005, 0.005), T(0, 1.19, 0.05), RZ(a), T(0.093, 0, 0));
    add('spoke', 'graphite', box(0.186, 0.005, 0.005), T(0, 1.19, -0.03), RZ(a), T(0.093, 0, 0));
  }
  add('guard-cap', 'matteWhite', cyl(0.045, 0.045, 0.02, 26), T(0, 1.19, 0.055), RX(Math.PI / 2));
  add('control', 'graphite', box(0.06, 0.03, 0.03), T(0, 0.99, 0.02));
  add('control-led', 'led', box(0.014, 0.01, 0.008), T(0, 0.99, 0.036));
});

/* ══════════════ KITCHEN APPLIANCES ══════════════ */

build('juicer', () => {
  // Centrifugal juicer with jug, 45 cm tall
  add('base', 'matteBlack', softBox(0.10, 0.055, 0.12, 6), T(0, 0.055, -0.01));
  add('base-trim', 'steelDark', softBox(0.104, 0.012, 0.124, 5), T(0, 0.014, -0.01));
  add('column', 'steel', softBox(0.07, 0.14, 0.07, 6), T(0, 0.24, -0.075));
  add('column-cap', 'graphite', softBox(0.072, 0.02, 0.072, 5), T(0, 0.375, -0.075));
  add('bowl', 'glass', cyl(0.10, 0.088, 0.15, 30), T(0, 0.185, 0.035));
  add('bowl-ring', 'steelDark', torus(0.10, 0.008, 30, 8), T(0, 0.115, 0.035), RX(Math.PI / 2));
  add('filter-basket', 'steel', cyl(0.085, 0.07, 0.085, 28), T(0, 0.29, 0.035));
  add('mesh', 'steelLight', cyl(0.086, 0.086, 0.05, 28), T(0, 0.255, 0.035));
  add('lid', 'black', cyl(0.097, 0.09, 0.04, 30), T(0, 0.345, 0.035));
  add('feed-chute', 'black', cyl(0.036, 0.036, 0.07, 22), T(0, 0.39, 0.035));
  add('pusher', 'graphite', cyl(0.03, 0.03, 0.09, 22), T(0, 0.435, 0.035));
  add('pusher-cap', 'steelDark', cyl(0.034, 0.034, 0.016, 22), T(0, 0.485, 0.035));
  add('spout', 'steelDark', box(0.045, 0.032, 0.075), T(0, 0.20, 0.135), RX(18 * D));
  add('spout-tip', 'steelDark', box(0.04, 0.03, 0.03), T(0, 0.185, 0.175));
  add('jug', 'glass', cyl(0.055, 0.05, 0.13, 26), T(0, 0.065, 0.20));
  add('jug-lip', 'steelDark', torus(0.05, 0.005, 26, 8), T(0, 0.13, 0.20), RX(Math.PI / 2));
  add('jug-handle', 'black', box(0.02, 0.07, 0.03), T(0.062, 0.075, 0.20));
  add('speed-dial', 'steel', cyl(0.026, 0.026, 0.018, 22), T(0, 0.062, 0.112), RX(Math.PI / 2));
  add('power-led', 'led', box(0.02, 0.01, 0.008), T(-0.06, 0.062, 0.112));
});

build('blender', () => {
  // Countertop blender, 42 cm tall
  add('base', 'graphite', softBox(0.095, 0.05, 0.095, 6), T(0, 0.05, 0));
  add('base-plinth', 'black', softBox(0.10, 0.014, 0.10, 5), T(0, 0.014, 0));
  add('collar', 'steelDark', cyl(0.078, 0.074, 0.035, 28), T(0, 0.115, 0));
  add('jar', 'glass', cyl(0.076, 0.102, 0.26, 32), T(0, 0.265, 0));
  add('jar-band', 'steel', torus(0.079, 0.006, 30, 8), T(0, 0.14, 0), RX(Math.PI / 2));
  add('jar-base', 'steelDark', cyl(0.075, 0.075, 0.03, 28), T(0, 0.135, 0));
  add('lid', 'black', cyl(0.104, 0.096, 0.035, 32), T(0, 0.415, 0));
  add('lid-cap', 'glass', cyl(0.04, 0.036, 0.03, 24), T(0, 0.447, 0));
  add('handle', 'black', box(0.022, 0.17, 0.032), T(0.12, 0.26, 0));
  add('handle-top', 'black', box(0.05, 0.024, 0.032), T(0.096, 0.34, 0));
  add('handle-bottom', 'black', box(0.05, 0.024, 0.032), T(0.096, 0.175, 0));
  add('pour-spout', 'glass', box(0.05, 0.03, 0.055), T(-0.075, 0.395, 0.035), RY(-18 * D), RZ(12 * D));
  add('dial', 'steel', cyl(0.028, 0.028, 0.018, 24), T(0, 0.06, 0.096), RX(Math.PI / 2));
  add('dial-mark', 'steelDark', box(0.005, 0.016, 0.012), T(0, 0.073, 0.104));
  add('buttons', 'graphite', box(0.024, 0.016, 0.01), T(-0.045, 0.06, 0.096));
  add('buttons', 'graphite', box(0.024, 0.016, 0.01), T(-0.016, 0.06, 0.096));
  add('buttons', 'graphite', box(0.024, 0.016, 0.01), T(0.045, 0.06, 0.096));
  add('pulse-led', 'led', box(0.02, 0.008, 0.008), T(0.045, 0.078, 0.098));
  add('blade-hub', 'steelDark', cyl(0.028, 0.02, 0.03, 20), T(0, 0.155, 0));
});

build('air-fryer', () => {
  // Basket air fryer, 30 × 34 × 38 cm
  add('body', 'matteBlack', softBox(0.15, 0.17, 0.19, 5), T(0, 0.17, 0));
  add('crown', 'graphite', softBox(0.132, 0.03, 0.17, 5), T(0, 0.31, -0.004));
  add('rear-vent', 'graphite', box(0.18, 0.07, 0.02), T(0, 0.24, -0.192));
  for (let k = 0; k < 4; k++) {
    add('rear-slat', 'black', box(0.15, 0.010, 0.014), T(0, 0.215 + k * 0.017, -0.199));
  }
  add('drawer', 'graphite', softBox(0.138, 0.088, 0.03, 5), T(0, 0.095, 0.174));
  add('drawer-face', 'matteBlack', softBox(0.132, 0.08, 0.014, 5), T(0, 0.095, 0.192));
  add('handle', 'graphite', cyl(0.014, 0.014, 0.21, 20), T(0, 0.145, 0.214), RZ(Math.PI / 2));
  add('handle-post', 'graphite', box(0.024, 0.03, 0.03), T(-0.09, 0.145, 0.198));
  add('handle-post', 'graphite', box(0.024, 0.03, 0.03), T(0.09, 0.145, 0.198));
  add('control-ring', 'steelDark', cyl(0.06, 0.06, 0.018, 30), T(0, 0.253, 0.186), RX(Math.PI / 2));
  // Circular dial display: cylinder caps use radial UVs, so the map lands as a
  // disc exactly the way a real air-fryer's face does.
  add('control-face', 'dialUI', cyl(0.052, 0.052, 0.02, 30), T(0, 0.253, 0.194), RX(Math.PI / 2));
  add('temp-ring', 'led', torus(0.044, 0.004, 30, 8), T(0, 0.253, 0.204));
  add('mode-button', 'graphite', cyl(0.016, 0.016, 0.014, 20), T(0, 0.20, 0.186), RX(Math.PI / 2));
  add('foot', 'rubber', cyl(0.02, 0.02, 0.018, 14), T(-0.11, -0.009, 0.14));
  add('foot', 'rubber', cyl(0.02, 0.02, 0.018, 14), T(0.11, -0.009, 0.14));
  add('foot', 'rubber', cyl(0.02, 0.02, 0.018, 14), T(-0.11, -0.009, -0.14));
  add('foot', 'rubber', cyl(0.02, 0.02, 0.018, 14), T(0.11, -0.009, -0.14));
});

build('coffee-maker', () => {
  // Drip coffee maker with glass carafe, 42 cm tall
  add('base', 'black', softBox(0.10, 0.018, 0.16, 6), T(0, 0.018, 0.01));
  add('plate', 'steel', cyl(0.078, 0.078, 0.008, 30), T(0, 0.04, 0.055));
  add('plate-ring', 'steelDark', torus(0.078, 0.006, 30, 8), T(0, 0.042, 0.055), RX(Math.PI / 2));
  add('reservoir', 'glass', softBox(0.09, 0.17, 0.05, 6), T(0, 0.20, -0.105));
  add('reservoir-cap', 'graphite', softBox(0.092, 0.02, 0.052, 5), T(0, 0.368, -0.105));
  add('water-level', 'screen', box(0.02, 0.14, 0.012), T(0.07, 0.20, -0.082));
  add('bridge', 'black', softBox(0.09, 0.05, 0.14, 6), T(0, 0.375, -0.02));
  add('bridge-neck', 'black', softBox(0.09, 0.10, 0.055, 6), T(0, 0.32, -0.1));
  add('filter-basket', 'graphite', cyl(0.076, 0.062, 0.075, 28), T(0, 0.278, 0.045));
  add('filter-rim', 'steelDark', torus(0.076, 0.007, 28, 8), T(0, 0.312, 0.045), RX(Math.PI / 2));
  add('shower-head', 'steelDark', cyl(0.05, 0.05, 0.016, 24), T(0, 0.335, 0.045));
  add('carafe', 'glass', cyl(0.074, 0.066, 0.155, 30), T(0, 0.122, 0.055));
  add('carafe-band', 'steelDark', torus(0.074, 0.005, 30, 8), T(0, 0.05, 0.055), RX(Math.PI / 2));
  add('carafe-lid', 'black', cyl(0.072, 0.068, 0.022, 30), T(0, 0.208, 0.055));
  add('carafe-handle', 'black', box(0.02, 0.11, 0.032), T(0.088, 0.128, 0.055));
  add('carafe-handle-top', 'black', box(0.034, 0.02, 0.032), T(0.068, 0.188, 0.055));
  add('carafe-handle-bottom', 'black', box(0.034, 0.02, 0.032), T(0.068, 0.068, 0.055));
  add('power-button', 'graphite', box(0.032, 0.014, 0.014), T(-0.062, 0.375, 0.116));
  add('power-led', 'led', box(0.014, 0.01, 0.01), T(-0.062, 0.375, 0.125));
  add('brand', 'steelDark', box(0.07, 0.014, 0.01), T(0, 0.375, 0.056));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.016, 12), T(-0.07, -0.008, 0.13));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.016, 12), T(0.07, -0.008, 0.13));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.016, 12), T(-0.07, -0.008, -0.1));
  add('foot', 'rubber', cyl(0.018, 0.018, 0.016, 12), T(0.07, -0.008, -0.1));
});

build('electric-kettle', () => {
  // 1.7 L jug kettle, 28 cm tall
  add('base', 'black', cyl(0.088, 0.082, 0.024, 34), T(0, 0.012, 0));
  add('base-plate', 'graphite', cyl(0.07, 0.07, 0.006, 30), T(0, 0.026, 0));
  add('body', 'polished', cyl(0.086, 0.062, 0.22, 34), T(0, 0.136, 0));
  add('body-ring', 'steelDark', cyl(0.088, 0.086, 0.014, 34), T(0, 0.036, 0));
  add('window', 'screen', box(0.03, 0.10, 0.02), T(0, 0.13, 0.077));
  add('lid', 'black', cyl(0.06, 0.056, 0.026, 30), T(0, 0.259, 0));
  add('lid-seam', 'steelDark', torus(0.058, 0.005, 30, 8), T(0, 0.246, 0), RX(Math.PI / 2));
  add('lid-knob', 'steel', cyl(0.02, 0.017, 0.02, 24), T(0, 0.28, 0));
  add('spout', 'steel', cyl(0.024, 0.032, 0.075, 24), T(0, 0.20, 0.086), RX(58 * D));
  add('spout-lip', 'steelDark', cyl(0.034, 0.034, 0.014, 24), T(0, 0.221, 0.121), RX(58 * D));
  add('handle-arm', 'black', box(0.026, 0.026, 0.07), T(0, 0.235, -0.083));
  add('handle-grip', 'black', box(0.026, 0.17, 0.03), T(0, 0.145, -0.117));
  add('handle-foot', 'black', box(0.026, 0.026, 0.06), T(0, 0.06, -0.09));
  add('switch', 'graphite', box(0.03, 0.036, 0.022), T(0, 0.055, -0.098));
  add('switch-led', 'led', box(0.016, 0.01, 0.01), T(0, 0.05, -0.108));
  add('filter', 'offWhite', cyl(0.03, 0.03, 0.01, 20), T(0, 0.21, 0.028));
});

build('toaster', () => {
  // 2-slice toaster, 30 × 20 × 19 cm
  add('body', 'steel', softBox(0.15, 0.10, 0.095, 7), T(0, 0.10, 0));
  add('top-plate', 'steelDark', softBox(0.13, 0.012, 0.082, 5), T(0, 0.19, 0));
  add('slot', 'black', box(0.026, 0.012, 0.15), T(-0.04, 0.204, 0));
  add('slot', 'black', box(0.026, 0.012, 0.15), T(0.04, 0.204, 0));
  add('crumb-tray', 'steelDark', box(0.304, 0.014, 0.19), T(0, 0.03, 0));
  add('tray-pull', 'steelDark', box(0.05, 0.02, 0.02), T(0, 0.03, 0.098));
  add('lever', 'black', box(0.016, 0.05, 0.032), T(0.157, 0.14, 0.01));
  add('lever-cap', 'graphite', box(0.02, 0.014, 0.036), T(0.159, 0.165, 0.01));
  add('dial', 'graphite', cyl(0.026, 0.026, 0.016, 24), T(0.155, 0.07, 0.03), RZ(Math.PI / 2));
  add('dial-mark', 'steelLight', box(0.012, 0.016, 0.005), T(0.164, 0.082, 0.03));
  add('browning-marks', 'graphite', box(0.008, 0.012, 0.075), T(0.152, 0.03, -0.03));
  add('reheat-led', 'ledAmber', box(0.012, 0.01, 0.008), T(0.152, 0.03, 0.045));
  add('foot', 'rubber', cyl(0.016, 0.016, 0.014, 12), T(-0.11, -0.007, 0.07));
  add('foot', 'rubber', cyl(0.016, 0.016, 0.014, 12), T(0.11, -0.007, 0.07));
  add('foot', 'rubber', cyl(0.016, 0.016, 0.014, 12), T(-0.11, -0.007, -0.07));
  add('foot', 'rubber', cyl(0.016, 0.016, 0.014, 12), T(0.11, -0.007, -0.07));
});

/* ══════════════ CONSUMER ELECTRONICS ══════════════ */

build('smart-tv', () => {
  // 55" 4K panel, 124 × 72 cm on table feet
  add('panel', 'glossBlack', softBox(0.62, 0.36, 0.022, 9), T(0, 0.42, 0));
  // A box, not a softBox: planar UVs map the QLED frame 1:1, where the
  // superellipsoid's spherical unwrap would squash it into a thin band.
  add('screen', 'tvScreen', box(1.196, 0.676, 0.010), T(0, 0.42, 0.022));
  add('bezel-bottom', 'graphite', box(0.18, 0.016, 0.01), T(0, 0.072, 0.026));
  add('brand', 'chrome', box(0.05, 0.01, 0.008), T(0, 0.072, 0.03));
  add('back-hump', 'graphite', softBox(0.24, 0.17, 0.02, 7), T(0, 0.44, -0.032));
  add('back-ports', 'black', box(0.07, 0.09, 0.014), T(0.2, 0.34, -0.05));
  add('vESA', 'steelDark', box(0.3, 0.24, 0.008), T(0, 0.44, -0.046));
  add('foot', 'steelDark', softBox(0.07, 0.03, 0.05, 6), T(-0.44, 0.03, 0.02));
  add('foot', 'steelDark', softBox(0.07, 0.03, 0.05, 6), T(0.44, 0.03, 0.02));
  add('foot-bar', 'steelDark', box(0.16, 0.016, 0.10), T(-0.44, 0.01, 0.02));
  add('foot-bar', 'steelDark', box(0.16, 0.016, 0.10), T(0.44, 0.01, 0.02));
  add('status-led', 'led', box(0.03, 0.006, 0.006), T(-0.28, 0.072, 0.028));
});

build('bluetooth-speaker', () => {
  // Pill speaker, 38 cm long lying on its side
  add('body', 'midnight', cyl(0.07, 0.07, 0.24, 34), T(0, 0.07, 0), RZ(Math.PI / 2));
  add('cap', 'midnight', sphere(0.07, 24, 14), T(-0.12, 0.07, 0));
  add('cap', 'midnight', sphere(0.07, 24, 14), T(0.12, 0.07, 0));
  add('grille', 'meshMidnight', cyl(0.0715, 0.0715, 0.17, 34), T(0, 0.07, 0), RZ(Math.PI / 2));
  add('band-left', 'rubber', torus(0.07, 0.008, 30, 8), T(-0.1, 0.07, 0), RY(Math.PI / 2));
  add('band-right', 'rubber', torus(0.07, 0.008, 30, 8), T(0.1, 0.07, 0), RY(Math.PI / 2));
  add('radiator', 'steelDark', cyl(0.044, 0.044, 0.014, 26), T(0.187, 0.07, 0), RZ(Math.PI / 2));
  add('radiator-cone', 'graphite', cyl(0.03, 0.03, 0.01, 22), T(0.196, 0.07, 0), RZ(Math.PI / 2));
  add('button', 'graphite', box(0.024, 0.012, 0.02), T(-0.05, 0.142, 0));
  add('button', 'graphite', box(0.024, 0.012, 0.02), T(-0.01, 0.143, 0));
  add('button', 'graphite', box(0.024, 0.012, 0.02), T(0.03, 0.142, 0));
  add('plus', 'steelLight', box(0.012, 0.005, 0.005), T(0.03, 0.149, 0));
  add('minus', 'steelLight', box(0.012, 0.005, 0.005), T(-0.05, 0.149, 0));
  add('brand-plate', 'steelDark', box(0.05, 0.02, 0.006), T(0.0, 0.07, 0.0715));
  add('port', 'black', box(0.03, 0.012, 0.014), T(-0.14, 0.03, 0.05));
  add('lanyard', 'steelDark', torus(0.014, 0.004, 20, 8), T(-0.19, 0.05, 0), RY(Math.PI / 2));
});

build('wireless-headphones', () => {
  // Over-ear headphones standing upright, 21 cm wide
  const bandY = 0.05, bandR = 0.105;
  add('band', 'charcoal', torus(bandR, 0.011, 44, 10, 0.05 * Math.PI, 0.95 * Math.PI), T(0, bandY, 0));
  add('cushion', 'leather', torus(bandR, 0.017, 34, 10, 0.2 * Math.PI, 0.8 * Math.PI), T(0, bandY, 0));
  add('band-slider', 'aluminium', box(0.016, 0.05, 0.03), T(0.104, 0.075, 0));
  add('band-slider', 'aluminium', box(0.016, 0.05, 0.03), T(-0.104, 0.075, 0));
  add('cup', 'charcoal', cyl(0.05, 0.05, 0.032, 30), T(0.104, 0.05, 0), RZ(Math.PI / 2));
  add('cup', 'charcoal', cyl(0.05, 0.05, 0.032, 30), T(-0.104, 0.05, 0), RZ(Math.PI / 2));
  add('cup-ring', 'graphite', torus(0.04, 0.006, 30, 8), T(0.121, 0.05, 0), RY(Math.PI / 2));
  add('cup-ring', 'graphite', torus(0.04, 0.006, 30, 8), T(-0.121, 0.05, 0), RY(Math.PI / 2));
  add('pad', 'leather', cyl(0.052, 0.052, 0.024, 30), T(0.076, 0.05, 0), RZ(Math.PI / 2));
  add('pad', 'leather', cyl(0.052, 0.052, 0.024, 30), T(-0.076, 0.05, 0), RZ(Math.PI / 2));
  add('driver', 'graphite', cyl(0.036, 0.036, 0.008, 26), T(0.064, 0.05, 0), RZ(Math.PI / 2));
  add('driver', 'graphite', cyl(0.036, 0.036, 0.008, 26), T(-0.064, 0.05, 0), RZ(Math.PI / 2));
  add('logo', 'chrome', cyl(0.016, 0.016, 0.008, 24), T(0.124, 0.05, 0), RZ(Math.PI / 2));
  add('logo', 'chrome', cyl(0.016, 0.016, 0.008, 24), T(-0.124, 0.05, 0), RZ(Math.PI / 2));
  add('button', 'graphite', box(0.01, 0.02, 0.014), T(0.124, 0.075, 0.014));
  add('port', 'black', box(0.012, 0.014, 0.01), T(-0.124, 0.03, 0.012));
  add('hinge', 'steel', sphere(0.017, 16, 10), T(0.104, 0.098, 0));
  add('hinge', 'steel', sphere(0.017, 16, 10), T(-0.104, 0.098, 0));
});

build('smartwatch', () => {
  // Watch standing on its own strap loop — loop Ø82 mm, case 42 × 46 mm
  const R = 0.034, tube = 0.0068, cy = R + tube;
  add('strap', 'midnight', torus(R, tube, 44, 12), T(0, cy, -0.004));
  const caseCy = cy + R + tube + 0.023 - 0.010;
  add('case', 'aluminium', softBox(0.021, 0.023, 0.009, 7), T(0, caseCy, 0));
  add('frame', 'glossBlack', softBox(0.0195, 0.0215, 0.0035, 7), T(0, caseCy, 0.0105));
  // A box, not a softBox: planar UVs map the face square, where the
  // superellipsoid's spherical unwrap would squash it into a thin band.
  add('screen', 'watchFace', box(0.030, 0.033, 0.004), T(0, caseCy, 0.0130));
  add('sensor', 'graphite', cyl(0.009, 0.009, 0.004, 24), T(0, caseCy, -0.0105), RX(Math.PI / 2));
  add('crown', 'steel', cyl(0.005, 0.005, 0.008, 22), T(0.024, caseCy + 0.011, 0), RZ(Math.PI / 2));
  add('side-button', 'steel', box(0.006, 0.015, 0.005), T(0.0225, caseCy - 0.008, 0));
  add('buckle', 'steel', softBox(0.013, 0.008, 0.008, 6), T(0, 0.008, -0.004));
});

console.log('\nAll models written.');
