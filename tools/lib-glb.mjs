/* Minimal glTF 2.0 binary writer + parametric geometry primitives.
   Units: metres. Every model is grounded so its bounding box sits on y = 0. */

import { writeFileSync } from 'node:fs';

/* ───────────── vec / mat ───────────── */
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/* Row-major 4x4. v' = M · v. Compose left-to-right: f(R, T) rotates then moves. */
const mul = (A, B) => {
  const C = new Array(16).fill(0);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += A[r * 4 + k] * B[k * 4 + c];
      C[r * 4 + c] = s;
    }
  return C;
};
export const I4 = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
export const T = (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
export const RX = (a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1];
};
export const RY = (a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1];
};
export const RZ = (a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};
export const compose = (...ms) => ms.reduce(mul);

/* ───────────── geometry container ───────────── */
/* `t` holds TEXCOORD_0. glTF samples v=0 at the FIRST row of the image, so
   every primitive below puts the top of the object at v = 0. */
export const geo = () => ({ p: [], n: [], t: [], i: [] });

const vert = (g, v, n, uv) => {
  g.p.push(v[0], v[1], v[2]);
  g.n.push(n[0], n[1], n[2]);
  g.t.push(uv ? uv[0] : 0, uv ? uv[1] : 0);
  return g.p.length / 3 - 1;
};
const tri = (g, a, b, c) => g.i.push(a, b, c);

/** Quad with guaranteed outward winding, driven by a reference normal. */
const quad = (g, a, b, c, d, ref) => {
  const p = g.p;
  const va = [p[a * 3], p[a * 3 + 1], p[a * 3 + 2]];
  const vb = [p[b * 3], p[b * 3 + 1], p[b * 3 + 2]];
  const vc = [p[c * 3], p[c * 3 + 1], p[c * 3 + 2]];
  if (dot(cross(sub(vb, va), sub(vc, va)), ref) < 0) {
    tri(g, a, c, b);
    tri(g, a, d, c);
  } else {
    tri(g, a, b, c);
    tri(g, a, c, d);
  }
};

/* ───────────── primitives ───────────── */

/** Axis-aligned box centred on the origin, flat shaded. */
export function box(w, h, d) {
  const g = geo();
  const x = w / 2, y = h / 2, z = d / 2;
  const faces = [
    { n: [1, 0, 0],  v: [[x, -y, -z], [x, -y, z], [x, y, z], [x, y, -z]],
      uv: [[0, 1], [1, 1], [1, 0], [0, 0]] },
    { n: [-1, 0, 0], v: [[-x, -y, z], [-x, -y, -z], [-x, y, -z], [-x, y, z]],
      uv: [[0, 1], [1, 1], [1, 0], [0, 0]] },
    { n: [0, 1, 0],  v: [[-x, y, -z], [-x, y, z], [x, y, z], [x, y, -z]],
      uv: [[0, 0], [1, 0], [1, 1], [0, 1]] },
    { n: [0, -1, 0], v: [[-x, -y, z], [-x, -y, -z], [x, -y, -z], [x, -y, z]],
      uv: [[0, 0], [1, 0], [1, 1], [0, 1]] },
    { n: [0, 0, 1],  v: [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]],
      uv: [[0, 1], [1, 1], [1, 0], [0, 0]] },
    { n: [0, 0, -1], v: [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]],
      uv: [[1, 1], [0, 1], [0, 0], [1, 0]] },
  ];
  for (const f of faces) {
    const ids = f.v.map((v, i) => vert(g, v, f.n, f.uv[i]));
    quad(g, ids[0], ids[1], ids[2], ids[3], f.n);
  }
  return g;
}

/**
 * Truncated cone / cylinder along Y. `rBot` at −h/2, `rTop` at +h/2.
 * opts: { top, bottom } cap switches (default true).
 */
export function cyl(rBot, rTop, h, seg = 28, opts = {}) {
  const { top = true, bottom = true } = opts;
  const g = geo();
  const slope = (rTop - rBot) / h;
  const yB = -h / 2, yT = h / 2;
  const ringB = [], ringT = [];
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    const ct = Math.cos(t), st = Math.sin(t);
    const nrm = norm([ct, -slope, st]);
    // side: u wraps the circumference, v runs bottom(1) → top(0)
    ringB.push(vert(g, [ct * rBot, yB, st * rBot], nrm, [i / seg, 1]));
    ringT.push(vert(g, [ct * rTop, yT, st * rTop], nrm, [i / seg, 0]));
  }
  for (let i = 0; i < seg; i++) {
    const ref = norm([
      Math.cos(((i + 0.5) / seg) * Math.PI * 2),
      -slope,
      Math.sin(((i + 0.5) / seg) * Math.PI * 2),
    ]);
    quad(g, ringB[i], ringB[i + 1], ringT[i + 1], ringT[i], ref);
  }
  /* Caps get their own vertices: the side's wrap-around UV would smear across
     the disc, so the cap maps radially into the centre of the texture. */
  const cap = (radius, y, nrm, flip) => {
    const c = vert(g, [0, y, 0], nrm, [0.5, 0.5]);
    const rim = [];
    for (let i = 0; i <= seg; i++) {
      const t = (i / seg) * Math.PI * 2;
      const ct = Math.cos(t), st = Math.sin(t);
      rim.push(vert(g, [ct * radius, y, st * radius], nrm,
        [0.5 + 0.5 * ct, 0.5 - 0.5 * st]));
    }
    for (let i = 0; i < seg; i++) {
      if (flip) tri(g, c, rim[i], rim[i + 1]);
      else tri(g, c, rim[i + 1], rim[i]);
    }
  };
  if (bottom) cap(rBot, yB, [0, -1, 0], false);
  if (top) cap(rTop, yT, [0, 1, 0], true);
  return g;
}

/** UV sphere centred on the origin. */
export function sphere(r, segU = 18, segV = 12) {
  const g = geo();
  const rows = [], nrmRows = [];
  for (let j = 0; j <= segV; j++) {
    const phi = (j / segV) * Math.PI;
    const row = [], nrow = [];
    for (let i = 0; i <= segU; i++) {
      const th = (i / segU) * Math.PI * 2;
      const n = [Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)];
      nrow.push(n);
      row.push(vert(g, [n[0] * r, n[1] * r, n[2] * r], n, [i / segU, j / segV]));
    }
    rows.push(row);
    nrmRows.push(nrow);
  }
  for (let j = 0; j < segV; j++)
    for (let i = 0; i < segU; i++)
      quad(g, rows[j][i], rows[j][i + 1], rows[j + 1][i + 1], rows[j + 1][i],
        avg4(nrmRows[j][i], nrmRows[j][i + 1], nrmRows[j + 1][i + 1], nrmRows[j + 1][i]));
  return g;
}

const avg4 = (a, b, c, d) => norm([
  (a[0] + b[0] + c[0] + d[0]) / 4,
  (a[1] + b[1] + c[1] + d[1]) / 4,
  (a[2] + b[2] + c[2] + d[2]) / 4,
]);

/** Torus lying in the XY plane (ring faces ±Z). Optional arc for headbands. */
export function torus(R, r, segU = 32, segV = 10, arcStart = 0, arcEnd = Math.PI * 2) {
  const g = geo();
  const rows = [], nrmRows = [];
  for (let i = 0; i <= segU; i++) {
    const th = arcStart + (i / segU) * (arcEnd - arcStart);
    const ct = Math.cos(th), st = Math.sin(th);
    const row = [], nrow = [];
    for (let j = 0; j <= segV; j++) {
      const ph = (j / segV) * Math.PI * 2;
      const cp = Math.cos(ph), sp = Math.sin(ph);
      const rad = R + r * cp;
      const n = [cp * ct, cp * st, sp];
      nrow.push(n);
      row.push(vert(g, [rad * ct, rad * st, r * sp], n, [i / segU, j / segV]));
    }
    rows.push(row);
    nrmRows.push(nrow);
  }
  for (let i = 0; i < segU; i++)
    for (let j = 0; j < segV; j++)
      quad(g, rows[i][j], rows[i + 1][j], rows[i + 1][j + 1], rows[i][j + 1],
        avg4(nrmRows[i][j], nrmRows[i + 1][j], nrmRows[i + 1][j + 1], nrmRows[i][j + 1]));
  return g;
}

/**
 * Superellipsoid — a box with soft, rounded corners. Semi-axes a/b/c.
 * `n` controls boxiness: 2 = ellipsoid, 4 = soft box, 8 = crisp box.
 */
export function softBox(a, b, c, n = 5, su = 22, sv = 24) {
  const e = 2 / n;
  const sg = (t, m) => Math.sign(t || 0) * Math.pow(Math.abs(t || 0), m);
  const P = (u, v) => [
    a * sg(Math.cos(u), e) * sg(Math.cos(v), e),
    b * sg(Math.sin(u), e),
    c * sg(Math.cos(u), e) * sg(Math.sin(v), e),
  ];
  const g = geo();
  const eps = 1e-3;
  const grid = [];
  for (let j = 0; j <= sv; j++) {
    const v = -Math.PI + (j / sv) * Math.PI * 2;
    const row = [];
    for (let i = 0; i <= su; i++) {
      const u = -Math.PI / 2 + (i / su) * Math.PI;
      const p = P(u, v);
      const du = sub(P(u + eps, v), P(u - eps, v));
      const dv = sub(P(u, v + eps), P(u, v - eps));
      let nrm = cross(du, dv);
      if (Math.hypot(...nrm) < 1e-9) nrm = p;
      nrm = norm(nrm);
      if (dot(nrm, p) < 0) nrm = [-nrm[0], -nrm[1], -nrm[2]];
      row.push(vert(g, p, nrm, [i / su, j / sv]));
    }
    grid.push(row);
  }
  for (let j = 0; j < sv; j++)
    for (let i = 0; i < su; i++) {
      const ref = norm([
        (grid[j][i][0] + grid[j + 1][i][0] + grid[j + 1][i + 1][0] + grid[j][i + 1][0]) / 4,
        (grid[j][i][1] + grid[j + 1][i][1] + grid[j + 1][i + 1][1] + grid[j][i + 1][1]) / 4,
        (grid[j][i][2] + grid[j + 1][i][2] + grid[j + 1][i + 1][2] + grid[j][i + 1][2]) / 4,
      ]);
      quad(g, grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i], ref);
    }
  return g;
}

/** Bake one or more transforms into a copy of the geometry. */
export function xf(g, ...mats) {
  const M = compose(...mats);
  const out = geo();
  out.p = g.p.slice();
  out.n = g.n.slice();
  out.t = g.t.slice();
  out.i = g.i.slice();
  for (let k = 0; k < out.p.length; k += 3) {
    const x = g.p[k], y = g.p[k + 1], z = g.p[k + 2];
    out.p[k]     = M[0] * x + M[1] * y + M[2] * z + M[3];
    out.p[k + 1] = M[4] * x + M[5] * y + M[6] * z + M[7];
    out.p[k + 2] = M[8] * x + M[9] * y + M[10] * z + M[11];
    const nx = g.n[k], ny = g.n[k + 1], nz = g.n[k + 2];
    out.n[k]     = M[0] * nx + M[1] * ny + M[2] * nz;
    out.n[k + 1] = M[4] * nx + M[5] * ny + M[6] * nz;
    out.n[k + 2] = M[8] * nx + M[9] * ny + M[10] * nz;
  }
  return out;
}

/* ───────────── materials ───────────── */
export const PALETTE = {
  /* ── metals ──
     `brushed` supplies both a base-colour grain and a metallicRoughness map,
     and glTF MULTIPLIES maps by the scalar factors — a map can only ever
     darken. So the factors below are ceilings.
     Colours are physical F0 for each alloy (stainless ≈ 0.56, aluminium ≈
     0.60); the earlier 0.78–0.87 values were far too high, which is what made
     the appliances read as white plastic with clipped highlights. */
  chrome:      { color: [0.86, 0.87, 0.88], metal: 1.0,  rough: 0.06 },
  steel:       { color: [0.60, 0.61, 0.62], metal: 0.98, rough: 0.42, tex: 'brushed' },
  steelLight:  { color: [0.70, 0.71, 0.72], metal: 0.98, rough: 0.36, tex: 'brushed' },
  steelDark:   { color: [0.35, 0.36, 0.39], metal: 0.95, rough: 0.50, tex: 'brushed' },
  polished:    { color: [0.64, 0.65, 0.66], metal: 1.0,  rough: 0.14 },
  aluminium:   { color: [0.62, 0.63, 0.64], metal: 0.95, rough: 0.48, tex: 'brushed' },
  titanium:    { color: [0.56, 0.55, 0.53], metal: 0.7,  rough: 0.42 },
  copper:      { color: [0.73, 0.46, 0.28], metal: 1.0,  rough: 0.28 },

  /* ── plastics & paints ── */
  white:       { color: [0.93, 0.935, 0.94], metal: 0.0, rough: 0.22 },  // glossy ABS
  offWhite:    { color: [0.89, 0.895, 0.90], metal: 0.0, rough: 0.38 },
  matteWhite:  { color: [0.90, 0.905, 0.91], metal: 0.0, rough: 0.62 },
  black:       { color: [0.055, 0.058, 0.065], metal: 0.05, rough: 0.42 },
  matteBlack:  { color: [0.045, 0.046, 0.050], metal: 0.0, rough: 0.66 },
  glossBlack:  { color: [0.030, 0.031, 0.036], metal: 0.15, rough: 0.13 },
  blackSoft:   { color: [0.13, 0.135, 0.145], metal: 0.0, rough: 0.78 },
  graphite:    { color: [0.20, 0.21, 0.23],  metal: 0.45, rough: 0.40 },
  midnight:    { color: [0.055, 0.065, 0.095], metal: 0.2, rough: 0.46 },
  charcoal:    { color: [0.155, 0.16, 0.17],  metal: 0.1, rough: 0.55 },
  navy:        { color: [0.08, 0.13, 0.28],   metal: 0.0, rough: 0.40 },

  /* ── glass ── */
  glass:       { color: [0.88, 0.93, 0.95], metal: 0.0,  rough: 0.03 },
  darkGlass:   { color: [0.045, 0.055, 0.07], metal: 0.2, rough: 0.05 },

  /* ── lit surfaces ── */
  screenOff:   { color: [0.035, 0.04, 0.05], metal: 0.0, rough: 0.12 },
  screen:      { color: [0.04, 0.05, 0.07],  metal: 0.0, rough: 0.10, emissive: [0.16, 0.26, 0.42] },
  screenBright:{ color: [0.05, 0.07, 0.10],  metal: 0.0, rough: 0.10, emissive: [0.30, 0.48, 0.72] },
  led:         { color: [0.05, 0.08, 0.05],  metal: 0.0, rough: 0.3,  emissive: [0.15, 0.75, 0.35] },
  ledAmber:    { color: [0.10, 0.06, 0.03],  metal: 0.0, rough: 0.3,  emissive: [0.95, 0.45, 0.10] },
  ledRed:      { color: [0.09, 0.03, 0.03],  metal: 0.0, rough: 0.3,  emissive: [0.90, 0.18, 0.14] },

  /* ── surfaces that need a map ── */
  rubber:      { color: [0.055, 0.055, 0.06], metal: 0.0, rough: 0.92 },
  meshBlack:   { color: [0.10, 0.10, 0.11],   metal: 0.1, rough: 0.72, tex: 'mesh' },
  meshMidnight:{ color: [0.06, 0.07, 0.10],   metal: 0.1, rough: 0.72, tex: 'mesh' },
  leather:     { color: [0.085, 0.085, 0.09], metal: 0.0, rough: 0.68, tex: 'leather' },
  blade:       { color: [0.74, 0.76, 0.79],   metal: 0.2, rough: 0.44 },
  accent:      { color: [0.76, 0.33, 0.23],   metal: 0.1, rough: 0.5 },

  /* ── screens with real content ── */
  tvScreen:    { color: [0.02, 0.02, 0.03], metal: 0.0, rough: 0.06,
                 emissive: [1, 1, 1], tex: 'tvContent' },
  watchFace:   { color: [0.02, 0.02, 0.03], metal: 0.0, rough: 0.08,
                 emissive: [1, 1, 1], tex: 'watchUI' },
  panelUI:     { color: [0.03, 0.035, 0.04], metal: 0.0, rough: 0.12,
                 emissive: [1, 1, 1], tex: 'panelUI' },
  dialUI:      { color: [0.03, 0.035, 0.04], metal: 0.0, rough: 0.12,
                 emissive: [1, 1, 1], tex: 'dialUI' },
};

/* Every texture name PALETTE can reference. Filled in by `registerTextures()`
   before a build runs; `writeGLB` only emits the ones actually used. */
const TEXTURE_POOL = new Map();
export function registerTextures(map) {
  TEXTURE_POOL.clear();
  for (const [k, v] of map) TEXTURE_POOL.set(k, v);
}

/* ───────────── GLB writer ───────────── */
const pad4 = (n) => (n + 3) & ~3;

export function writeGLB(file, parts, sceneName) {
  // parts: [{ name, geo, material }]
  const usedKeys = [];
  for (const p of parts) if (!usedKeys.includes(p.material)) usedKeys.push(p.material);

  const bin = [];
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  let offset = 0;

  /* `target` is omitted for images — glTF forbids it on image buffer views. */
  const pushRaw = (bytes, target) => {
    const start = pad4(offset);
    if (start > offset) {
      bin.push(new Uint8Array(start - offset));
      offset = start;
    }
    bin.push(bytes);
    const view = { buffer: 0, byteOffset: start, byteLength: bytes.byteLength };
    if (target) view.target = target;
    bufferViews.push(view);
    offset += bytes.byteLength;
    return bufferViews.length - 1;
  };
  const pushBytes = (typed, target) =>
    pushRaw(new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength), target);

  /* ── textures: one image per distinct Buffer, so a screen's base-colour and
        emissive map share a single copy in the binary chunk ── */
  const images = [];
  const textures = [];
  const samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }];
  const texIndexByBuffer = new Map();
  const textureIndex = (buf) => {
    if (!buf) return null;
    let idx = texIndexByBuffer.get(buf);
    if (idx !== undefined) return idx;
    const view = pushRaw(buf);
    images.push({ bufferView: view, mimeType: 'image/png' });
    textures.push({ sampler: 0, source: images.length - 1 });
    texIndexByBuffer.set(buf, textures.length - 1);
    return textures.length - 1;
  };

  const materials = usedKeys.map((k) => {
    const m = PALETTE[k];
    const spec = m.tex ? TEXTURE_POOL.get(m.tex) : null;
    const out = {
      name: k,
      pbrMetallicRoughness: {
        baseColorFactor: [...m.color, 1],
        metallicFactor: m.metal,
        roughnessFactor: m.rough,
      },
    };
    if (m.emissive) out.emissiveFactor = m.emissive;

    /* Maps are modulations centred on 1.0, so each material keeps its own
       colour/roughness/metalness and the texture only adds variation. Emissive
       screens are the exception: their map is the actual content, lit by
       emissiveFactor. */
    const bc = spec ? textureIndex(spec.baseColor) : null;
    if (bc !== null) out.pbrMetallicRoughness.baseColorTexture = { index: bc };
    const mr = spec ? textureIndex(spec.mr) : null;
    if (mr !== null) out.pbrMetallicRoughness.metallicRoughnessTexture = { index: mr };
    const em = spec ? textureIndex(spec.emissive) : null;
    // NB: the field is emissiveFactor — testing `out.emissive` is always false
    // and silently drops the screen content, leaving a pure-white panel.
    if (em !== null && out.emissiveFactor) out.emissiveTexture = { index: em };

    if (k === 'glass' || k === 'darkGlass') out.doubleSided = true;
    return out;
  });

  for (const part of parts) {
    const g = part.geo;
    const count = g.p.length / 3;
    const pos = new Float32Array(g.p);
    const nrm = new Float32Array(g.n);
    const maxIndex = count - 1;
    const use32 = maxIndex > 65535;
    const idx = use32 ? new Uint32Array(g.i) : new Uint16Array(g.i);

    const posView = pushBytes(pos, 34962);
    const nrmView = pushBytes(nrm, 34962);
    const idxView = pushBytes(idx, 34963);

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let k = 0; k < pos.length; k += 3)
      for (let a = 0; a < 3; a++) {
        if (pos[k + a] < min[a]) min[a] = pos[k + a];
        if (pos[k + a] > max[a]) max[a] = pos[k + a];
      }

    const aPos = accessors.push({
      bufferView: posView, componentType: 5126, count, type: 'VEC3', min, max,
    }) - 1;
    const aNrm = accessors.push({
      bufferView: nrmView, componentType: 5126, count, type: 'VEC3',
    }) - 1;
    const aIdx = accessors.push({
      bufferView: idxView, componentType: use32 ? 5125 : 5123, count: g.i.length, type: 'SCALAR',
    }) - 1;

    const attributes = { POSITION: aPos, NORMAL: aNrm };
    const matSpec = PALETTE[part.material].tex
      ? TEXTURE_POOL.get(PALETTE[part.material].tex)
      : null;
    // TEXCOORD_0 is only emitted where a map actually samples it.
    if (matSpec && (matSpec.baseColor || matSpec.mr || matSpec.emissive)
        && g.t.length === count * 2) {
      const uvView = pushBytes(new Float32Array(g.t), 34962);
      const aUv = accessors.push({
        bufferView: uvView, componentType: 5126, count, type: 'VEC2',
      }) - 1;
      attributes.TEXCOORD_0 = aUv;
    }

    const meshIndex = meshes.push({
      name: part.name,
      primitives: [{
        attributes,
        indices: aIdx,
        material: usedKeys.indexOf(part.material),
      }],
    }) - 1;

    nodes.push({ name: part.name, mesh: meshIndex });
  }

  const total = bin.reduce((s, b) => s + b.byteLength, 0);
  const binBytes = new Uint8Array(total);
  {
    let o = 0;
    for (const b of bin) { binBytes.set(b, o); o += b.byteLength; }
  }

  const json = {
    asset: { version: '2.0', generator: 'Rapidify static catalog generator' },
    scene: 0,
    scenes: [{ name: sceneName, nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: total }],
  };
  if (textures.length) {
    json.samplers = samplers;
    json.textures = textures;
    json.images = images;
  }

  let jsonText = JSON.stringify(json);
  while (jsonText.length % 4 !== 0) jsonText += ' ';

  const jsonBytes = new TextEncoder().encode(jsonText);
  const jsonChunkPad = jsonBytes.length % 4 === 0 ? 0 : 4 - (jsonBytes.length % 4);
  const binChunkPad = binBytes.length % 4 === 0 ? 0 : 4 - (binBytes.length % 4);
  const totalLength = 12 + 8 + jsonBytes.length + jsonChunkPad + 8 + binBytes.length + binChunkPad;

  const out = Buffer.alloc(totalLength);
  let o = 0;
  out.writeUInt32LE(0x46546c67, o); o += 4;   // 'glTF'
  out.writeUInt32LE(2, o); o += 4;
  out.writeUInt32LE(totalLength, o); o += 4;

  out.writeUInt32LE(jsonBytes.length + jsonChunkPad, o); o += 4;
  out.writeUInt32LE(0x4e4f534a, o); o += 4;    // 'JSON'
  Buffer.from(jsonBytes).copy(out, o); o += jsonBytes.length;
  out.fill(0x20, o, o + jsonChunkPad); o += jsonChunkPad;

  out.writeUInt32LE(binBytes.length + binChunkPad, o); o += 4;
  out.writeUInt32LE(0x004e4942, o); o += 4;    // 'BIN\0'
  Buffer.from(binBytes).copy(out, o); o += binBytes.length;
  out.fill(0, o, o + binChunkPad);

  writeFileSync(file, out);
  return { bytes: totalLength, tris: parts.reduce((s, p) => s + p.geo.i.length / 3, 0) };
}

/** Translate so the model rests on y = 0 and is centred on X/Z. */
export function groundAndCentre(parts) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const part of parts)
    for (let k = 0; k < part.geo.p.length; k += 3)
      for (let a = 0; a < 3; a++) {
        if (part.geo.p[k + a] < min[a]) min[a] = part.geo.p[k + a];
        if (part.geo.p[k + a] > max[a]) max[a] = part.geo.p[k + a];
      }
  const dx = -(min[0] + max[0]) / 2;
  const dy = -min[1];
  const dz = -(min[2] + max[2]) / 2;
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6 && Math.abs(dz) < 1e-6)
    return { height: max[1] - min[1] };
  for (const part of parts) part.geo = xf(part.geo, T(dx, dy, dz));
  return { height: max[1] - min[1] };
}
