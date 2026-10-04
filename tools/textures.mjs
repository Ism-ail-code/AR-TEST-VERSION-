/* Procedural textures for the catalog GLBs. Everything is generated locally —
   no downloads, no licensing.

   Two kinds of map:
   • modulation maps (baseColor / metallicRoughness): glTF MULTIPLIES these by
     the material's scalar factors, so they can only darken. They are centred
     just below 1.0 and add streaks, weave and wear without changing the
     material's authored colour.
   • emissive maps (screens): the map IS the content, lit by emissiveFactor,
     so these carry real colour.

   Colour spaces follow glTF: baseColor/emissive are sRGB, metallicRoughness
   is linear. */

import { deflateSync } from 'node:zlib';

/* ───────────── PNG ───────────── */
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
export const pngRGBA = (w, h, rgba) => {
  const stride = w * 4 + 1;
  const raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

/* ───────────── helpers ───────────── */
const cl = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const vnoise = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
};
/** sRGB-encode a linear fraction (baseColor/emissive maps). */
const srgb = (c) => {
  c = cl(c);
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
};
const px = (buf, i, r, g, b, a = 255) => {
  buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = a;
};
const hex = (h) => [
  parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16),
];
const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t,
];
const srgbMix = (a, b, t) => {
  const m = mix(a, b, t);
  return [Math.round(srgb(m[0] / 255) * 255), Math.round(srgb(m[1] / 255) * 255), Math.round(srgb(m[2] / 255) * 255)];
};

/* ───────────── 7-segment digits (appliance displays) ───────────── */
const SEG = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',
  5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
};
/** Draws one digit into `set(x, y, r, g, b)`-style fill rects. */
const drawDigit = (fill, ch, x, y, w, h, t, col) => {
  const on = SEG[ch];
  if (on === undefined) return;
  const H = h / 2;
  const seg = {
    a: [x + t, y, w - 2 * t, t],
    g: [x + t, y + H - t / 2, w - 2 * t, t],
    d: [x + t, y + h - t, w - 2 * t, t],
    f: [x, y + t, t, H - 1.5 * t],
    b: [x + w - t, y + t, t, H - 1.5 * t],
    e: [x, y + H + t / 2, t, H - 1.5 * t],
    c: [x + w - t, y + H + t / 2, t, H - 1.5 * t],
  };
  for (const s of on) fill(seg[s][0], seg[s][1], seg[s][2], seg[s][3], col);
};
const drawNumber = (fill, text, x, y, w, h, t, gap, col) => {
  let cx = x;
  for (const ch of text) {
    if (ch === ':') {
      fill(cx + t, y + h * 0.28, t, t, col);
      fill(cx + t, y + h * 0.64, t, t, col);
      cx += t * 3;
    } else if (ch === ' ') {
      cx += w * 0.35;
    } else {
      drawDigit(fill, ch, cx, y, w, h, t, col);
      cx += w + gap;
    }
  }
  return cx;
};

/* ───────────── maps ───────────── */

/** Visible brushing grain (baseColor modulation, sRGB).
    A real stainless panel varies roughly 12% across its grain; roughness alone
    can't carry that, so metals were reading as smooth white plastic. Encoded
    with srgb() because baseColor textures decode from sRGB to linear. */
const brushedBase = (w = 512, h = 512) => {
  const d = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const n = vnoise(u * 4, v * 170) * 0.6 + vnoise(u * 12, v * 460) * 0.4;
      const blotch = vnoise(u * 3 + 5, v * 3 + 9);
      // 0.88 … 1.00, mean ≈ 0.95 — enough to see, not enough to look dirty.
      const f = cl(1 - (0.09 * (n - 0.5) + 0.03 * (blotch - 0.5)) * 2, 0.86, 1);
      const c = Math.round(srgb(f) * 255);
      px(d, (y * w + x) * 4, c, c, c);
    }
  }
  return pngRGBA(w, h, d);
};

/** Brushed-metal streaks: anisotropic roughness (glTF: G = roughness). */
const brushed = (w = 512, h = 512) => {
  const d = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      // long in u, very fine in v → the grain reads as horizontal brushing
      let n = vnoise(u * 5, v * 150) * 0.62 + vnoise(u * 14, v * 420) * 0.38;
      const blotch = vnoise(u * 4 + 11, v * 4 + 7);
      const rough = cl(1 - (0.30 * (n - 0.5) + 0.14 * (blotch - 0.5)) * 2, 0.5, 1);
      const metal = cl(1 - 0.05 * (n - 0.5) * 2, 0.9, 1);
      px(d, (y * w + x) * 4, 255, Math.round(rough * 255), Math.round(metal * 255));
    }
  }
  return pngRGBA(w, h, d);
};

/** Acoustic weave for speaker grilles (baseColor modulation, sRGB).
    Sized to the grille's actual 449 × 170 mm surface so the holes come out
    square rather than stretched into ovals. */
const MESH_COLS = 54, MESH_ROWS = 20;
const meshBase = (w = 512, h = 192) => {
  const d = Buffer.alloc(w * h * 4);
  const cw = w / MESH_COLS, chh = h / MESH_ROWS;
  const rad = Math.min(cw, chh) * 0.44;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const fx = (x % cw) - cw / 2 + 0.5;
      const fy = (y % chh) - chh / 2 + 0.5;
      const dist = Math.hypot(fx, fy);
      const hole = cl(1 - (dist - rad * 0.55) / (rad * 0.55));
      const weave = 0.94 + 0.06 * (vnoise(x / 7, y / 7) - 0.5) * 2;
      const f = cl((1 - 0.80 * hole) * weave, 0.06, 1);
      const c = Math.round(srgb(f) * 255);
      px(d, (y * w + x) * 4, c, c, c);
    }
  }
  return pngRGBA(w, h, d);
};

/** Roughness for the same weave (linear — metallicRoughness space). */
const meshMR = (w = 512, h = 192) => {
  const d = Buffer.alloc(w * h * 4);
  const cw = w / MESH_COLS, chh = h / MESH_ROWS;
  const rad = Math.min(cw, chh) * 0.44;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const fx = (x % cw) - cw / 2 + 0.5;
      const fy = (y % chh) - chh / 2 + 0.5;
      const hole = cl(1 - (Math.hypot(fx, fy) - rad * 0.55) / (rad * 0.55));
      const rough = cl(1 - 0.35 * hole - 0.06 * (vnoise(x / 5, y / 5) - 0.5), 0.5, 1);
      px(d, (y * w + x) * 4, 255, Math.round(rough * 255), 255);
    }
  }
  return pngRGBA(w, h, d);
};

/** Foam / leather grain for cushions and straps (linear MR). */
const leatherMR = (w = 256, h = 256) => {
  const d = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const g = vnoise(x / 4.5, y / 4.5) * 0.55 + vnoise(x / 17, y / 17) * 0.45;
      const rough = cl(1 - 0.30 * (g - 0.5) * 2, 0.55, 1);
      px(d, (y * w + x) * 4, 255, Math.round(rough * 255), 255);
    }
  }
  return pngRGBA(w, h, d);
};

/** QLED content: a landscape frame so the panel reads as "on", not painted. */
const tvContent = (w = 1024, h = 576) => {
  const d = Buffer.alloc(w * h * 4);
  const skyTop = hex('#06183a'), skyMid = hex('#1f7fae'), skyLow = hex('#f2a45e');
  const far = hex('#123a55'), near = hex('#081522'), glow = hex('#ffe6b8');
  const sun = [0.72, 0.63];
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      let c;
      if (v < 0.62) {
        const t = v / 0.62;
        c = t < 0.7 ? mix(skyTop, skyMid, t / 0.7) : mix(skyMid, skyLow, (t - 0.7) / 0.3);
      } else {
        c = mix(skyLow, near, (v - 0.62) / 0.38);
      }
      // sun bloom
      const dd = Math.hypot((u - sun[0]) * 1.0, (v - sun[1]) * 1.6);
      const bloom = Math.exp(-dd * dd * 90);
      c = mix(c, glow, bloom * 0.9);
      // ridges
      const r1 = 0.60 + 0.045 * Math.sin(u * 7.1 + 1.4) + 0.02 * Math.sin(u * 17.3);
      const r2 = 0.655 + 0.05 * Math.sin(u * 4.3 + 3.1) + 0.024 * Math.sin(u * 11.9 + 0.7);
      if (v > r1 && v < r2) c = mix(c, far, cl((v - r1) / 0.03) * 0.95);
      if (v > r2) c = mix(c, near, cl((v - r2) / 0.05));
      const i = (y * w + x) * 4;
      // hex() already yields display (sRGB) values — encoding them a second
      // time washed the frame out and pushed it far brighter than authored.
      px(d, i, Math.round(c[0]), Math.round(c[1]), Math.round(c[2]));
    }
  }
  return pngRGBA(w, h, d);
};

/* ───────────── small drawing surface ─────────────
   Screen maps are stored as sRGB display values: whatever colour goes in is
   the colour that shows up on the panel. */
const canvas = (w, h) => {
  const buf = Buffer.alloc(w * h * 4);
  const rect = (x, y, ww, hh, col) => {
    const x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(w, Math.round(x + ww)), y1 = Math.min(h, Math.round(y + hh));
    for (let yy = y0; yy < y1; yy++)
      for (let xx = x0; xx < x1; xx++) {
        const i = (yy * w + xx) * 4;
        buf[i] = col[0]; buf[i + 1] = col[1]; buf[i + 2] = col[2]; buf[i + 3] = 255;
      }
  };
  const backdrop = (top, bottom) => {
    for (let y = 0; y < h; y++) {
      const c = mix(top, bottom, h > 1 ? y / (h - 1) : 0);
      const col = [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])];
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        buf[i] = col[0]; buf[i + 1] = col[1]; buf[i + 2] = col[2]; buf[i + 3] = 255;
      }
    }
  };
  const ring = (cx, cy, r, thick, from, to, col) => {
    for (let yy = 0; yy < h; yy++)
      for (let xx = 0; xx < w; xx++) {
        const dist = Math.hypot(xx - cx, yy - cy);
        if (dist < r - thick || dist > r) continue;
        let a = Math.atan2(yy - cy, xx - cx);
        if (a < 0) a += Math.PI * 2;
        if ((a - from + Math.PI * 2) % (Math.PI * 2) > to) continue;
        const i = (yy * w + xx) * 4;
        buf[i] = col[0]; buf[i + 1] = col[1]; buf[i + 2] = col[2]; buf[i + 3] = 255;
      }
  };
  return { buf, rect, backdrop, ring };
};

/** Smartwatch face: time, activity rings and two complication bars. */
const watchUI = (w = 256, h = 288) => {
  const { buf, rect, backdrop, ring } = canvas(w, h);
  backdrop(hex('#04070c'), hex('#0a1119'));
  ring(128, 144, 96, 12, -Math.PI / 2, Math.PI * 1.45, hex('#25e39a'));
  ring(128, 144, 78, 8, -Math.PI / 2, Math.PI * 0.9, hex('#ff8a3d'));
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2 - Math.PI / 2;
    rect(128 + Math.cos(a) * 66 - 2, 144 + Math.sin(a) * 66 - 2, 4, 4, hex('#5b6675'));
  }
  // '10:09' is 4 digits (33 px each) plus a colon (21 px) → centre at 55.
  drawNumber(rect, '10:09', 55, 118, 26, 54, 7, 7, [245, 247, 250]);
  rect(78, 186, 100, 6, hex('#1c2530'));
  rect(78, 186, 66, 6, hex('#3aa7ff'));
  rect(78, 206, 86, 5, hex('#1c2530'));
  rect(78, 206, 52, 5, hex('#25e39a'));
  return pngRGBA(w, h, buf);
};

/** Appliance control strip — 3:1, matching the washer/AC/microwave windows. */
const panelUI = (w = 768, h = 256) => {
  const { buf, rect, backdrop } = canvas(w, h);
  backdrop(hex('#04070b'), hex('#080d13'));
  const cyan = hex('#5fe8ff'), amber = hex('#ffb347'), dim = hex('#13202b');
  drawNumber(rect, '1:24', 54, 72, 56, 112, 13, 14, cyan);
  rect(254, 74, 4, 108, hex('#0e1a24'));
  rect(294, 74, 430, 24, dim);
  rect(294, 74, 286, 24, cyan);
  rect(294, 118, 430, 24, dim);
  rect(294, 118, 158, 24, amber);
  rect(294, 162, 430, 24, dim);
  rect(294, 162, 354, 24, hex('#25e39a'));
  rect(736, 206, 12, 12, amber);
  return pngRGBA(w, h, buf);
};

/** Circular air-fryer dial — square map, because the cap UV maps radially. */
const dialUI = (w = 256, h = 256) => {
  const { buf, rect, backdrop, ring } = canvas(w, h);
  backdrop(hex('#04070b'), hex('#070c11'));
  ring(128, 128, 108, 10, 0, Math.PI * 2, hex('#16232e'));
  ring(128, 128, 108, 10, -Math.PI / 2, Math.PI * 1.4, hex('#5fe8ff'));
  drawNumber(rect, '200', 50, 92, 44, 80, 11, 12, [245, 247, 250]);
  ring(196, 84, 8, 4, 0, Math.PI * 2, hex('#ffb347'));
  rect(76, 194, 104, 8, hex('#13202b'));
  rect(76, 194, 68, 8, hex('#5fe8ff'));
  rect(76, 212, 84, 7, hex('#13202b'));
  rect(76, 212, 40, 7, hex('#ffb347'));
  return pngRGBA(w, h, buf);
};

export function buildTextures() {
  const content = tvContent();
  return new Map([
    ['brushed', { baseColor: brushedBase(), mr: brushed() }],
    ['mesh', { baseColor: meshBase(), mr: meshMR() }],
    ['leather', { mr: leatherMR() }],
    ['tvContent', { emissive: content }],
    ['watchUI', { emissive: watchUI() }],
    ['panelUI', { emissive: panelUI() }],
    ['dialUI', { emissive: dialUI() }],
  ]);
}
