/* Generates public/textures/studio-env.png — an equirectangular studio
   environment (dark surround + large soft key/fill/rim panels + floor bounce)
   so metal, glass and screens actually have something to reflect.

   Previously the viewer used <model-viewer>'s bundled "neutral" preset, which
   is a near-uniform grey field: every metal rendered as flat clay. */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** tools/ → repository root, so the script runs from any working directory. */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'public', 'textures');
const W = 2048, H = 1024;

/* ───────────── PNG encoder ───────────── */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const pngRGBA = (w, h, rgba) => {
  const stride = w * 4 + 1;
  const raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    raw[y * stride] = 0; // filter: none
    rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

/* ───────────── studio lighting ───────────── */
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };

/** Elliptical soft panel in (azimuth, elevation) degrees. Returns 0..1. */
const panel = (az, el, halfAz, halfEl, soft) => (a, e) => {
  let da = Math.abs(((a - az + 540) % 360) - 180);
  const de = Math.abs(e - el);
  const d = Math.hypot(da / halfAz, de / halfEl);
  return 1 - smooth((d - (1 - soft)) / soft);
};

/** Named light rig: key, fill, rim, top strip, plus ambient + floor bounce. */
const RIG = [
  // [panel, intensity (linear), tint]
  [panel(-58, 38, 46, 40, 0.75), 0.72, [1.00, 0.985, 0.955]], // key  — front left
  [panel(64, 26, 34, 34, 0.80), 0.38, [0.93, 0.96, 1.00]],    // fill — front right
  [panel(178, 44, 30, 44, 0.80), 0.52, [1.00, 0.99, 0.98]],    // rim  — behind
  [panel(0, 78, 170, 26, 0.70), 0.38, [1.00, 1.00, 1.00]],     // overhead soft box
  [panel(-122, 6, 16, 34, 0.85), 0.28, [1.00, 0.99, 0.97]],    // side kick — accent streaks
];

/* The PNG is sampled as sRGB (three converts sRGB → linear on load), so every
   value below is authored in LINEAR light and encoded here. Writing linear
   numbers straight into the texture is what turned the first attempt black. */
const AMBIENT = 0.24;
const toSRGB = (c) => {
  c = clamp(c);
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
};

/* Deterministic value noise so banding never shows up in the renders. */
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

mkdirSync(OUT, { recursive: true });
const rgba = Buffer.alloc(W * H * 4);

for (let y = 0; y < H; y++) {
  const el = 90 - (y / (H - 1)) * 180;        // +90 up … −90 down
  const up = smooth((el + 4) / 46);            // 1 overhead → 0 at floor
  for (let x = 0; x < W; x++) {
    const az = (x / W) * 360 - 180;

    // Bright charcoal surround — enough ambient that metal reads as its own
    // colour, while the panels above still carve visible highlights into it.
    let r = AMBIENT + 0.14 * up;
    let g = AMBIENT + 0.14 * up;
    let b = AMBIENT + 0.15 * up;

    // Floor bounce: a soft bright plane under the product.
    const bounce = smooth((-el - 6) / 40) * 0.30;
    r += bounce; g += bounce * 1.01; b += bounce * 1.03;

    for (const [f, intensity, tint] of RIG) {
      const k = f(az, el) * intensity;
      if (k <= 0) continue;
      r += k * tint[0];
      g += k * tint[1];
      b += k * tint[2];
    }

    // Break 8-bit banding on the long gradients (in linear, before encoding).
    const n = (hash(x, y) - 0.5) * 0.01;
    const i = (y * W + x) * 4;
    rgba[i] = Math.round(toSRGB(r + n) * 255);
    rgba[i + 1] = Math.round(toSRGB(g + n) * 255);
    rgba[i + 2] = Math.round(toSRGB(b + n) * 255);
    rgba[i + 3] = 255;
  }
}

const file = `${OUT}/studio-env.png`;
writeFileSync(file, pngRGBA(W, H, rgba));
console.log(`wrote ${file}  ${(statSync(file).size / 1024).toFixed(0)} KB`);
