/* Renders each new catalog product's photo directly from its GLB, so the
   product image, the 3D model and the AR experience can never disagree. */

import { createServer } from 'node:http';
import { readFile, mkdirSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

/** tools/ → repository root, so the script runs from any working directory. */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/* Headless Chromium driver. This is a build tool, not part of the app, so it is
   deliberately not a dependency of the package — product images are already
   committed. Install it only when you need to re-render them. */
let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.error(
    'render-models.mjs needs a Chromium driver to re-render product photos:\n'
      + '  npm i -D playwright-core\n'
      + '(the images in public/images/ are already committed and up to date)',
  );
  process.exit(1);
}
const MODELS = join(ROOT, 'public/models');
const IMAGES = join(ROOT, 'public/images');
const TEXTURES = join(ROOT, 'public/textures');
const MV_JS = join(ROOT, 'node_modules/@google/model-viewer/dist/model-viewer.min.js');
mkdirSync(IMAGES, { recursive: true });

const W = 1000, H = 1250;

/* name → [azimuth, elevation, radius%] — framing tuned per silhouette */
const SHOTS = [
  ['refrigerator',      'refrigerator',      28, 74, 108],
  ['washing-machine',   'washing-machine',   24, 74, 110],
  ['air-conditioner',   'air-conditioner',   34, 76, 104],
  ['microwave-oven',    'microwave-oven',    30, 74, 112],
  ['vacuum-cleaner',    'vacuum-cleaner',    26, 76, 106],
  ['standing-fan',      'standing-fan',      22, 78, 104],
  ['juicer',            'juicer',            32, 74, 112],
  ['blender',           'blender',           30, 74, 112],
  ['air-fryer',         'air-fryer',         28, 73, 114],
  ['coffee-maker',      'coffee-maker',      34, 74, 112],
  ['electric-kettle',   'electric-kettle',   60, 76, 116],
  ['toaster',           'toaster',           30, 73, 114],
  ['smart-tv',          'smart-tv',          20, 78, 108],
  ['bluetooth-speaker', 'bluetooth-speaker', 26, 72, 116],
  ['wireless-headphones', 'wireless-headphones', 34, 74, 118],
  ['smartwatch',        'smartwatch',        34, 76, 112],
];

const HTML = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;overflow:hidden}
  body{background:
    radial-gradient(120% 80% at 50% 8%, #fbfaf8 0%, #f2efeb 55%, #e8e4de 100%)}
  model-viewer{width:${W}px;height:${H}px;display:block;background:transparent}
</style></head><body>
<model-viewer id="v" camera-controls disable-zoom interaction-prompt="none"
  reveal="auto" exposure="1.0" tone-mapping="auto"
  environment-image="/studio-env.png"
  shadow-intensity="1" shadow-softness="0.85" loading="eager"></model-viewer>
<script type="module">
  import '/mv.js';
  const q = new URLSearchParams(location.search);
  const v = document.getElementById('v');
  v.src = '/' + q.get('m') + '.glb';
  v.setAttribute('camera-orbit', q.get('orbit'));
  v.setAttribute('camera-target', 'auto auto auto');
  v.setAttribute('field-of-view', '30deg');
  window.__ready = false;
  v.addEventListener('load', () => { window.__ready = true; });
  v.addEventListener('error', () => { window.__error = true; });
</script>
</body></html>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const serve = (file, type) =>
    readFile(file, (err, buf) => {
      if (err) { console.log('  404', url.pathname, '<-', file); res.writeHead(404); res.end('nope'); return; }
      res.writeHead(200, { 'content-type': type });
      res.end(buf);
    });
  if (url.pathname === '/render.html') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(HTML);
    return;
  }
  if (url.pathname === '/mv.js') return serve(MV_JS, 'text/javascript');
  if (url.pathname === '/studio-env.png')
    return serve(join(TEXTURES, 'studio-env.png'), 'image/png');
  if (extname(url.pathname) === '.glb') {
    return serve(join(MODELS, normalize(url.pathname).replace(/^[/\\]+/, '')), 'model/gltf-binary');
  }
  res.writeHead(404); res.end();
  console.log('  404', url.pathname, '(unhandled)');
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;
console.log('render server on', base);

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const problems = [];
page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));

/* Headless Chrome can lose the WebGL context on the very first use and
   model-viewer then recovers on its own — so only `load` counts as done. */
async function shoot(orbitUrl) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto(orbitUrl, { waitUntil: 'load' });
    try {
      await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
      return true;
    } catch { /* retry with a fresh page */ }
  }
  return false;
}

const only = process.argv[2];
let done = 0;
for (const [file, slug, az, el, radius] of SHOTS) {
  if (only && slug !== only) continue;
  const orbit = `${az}deg ${el}deg ${radius}%`;
  const url = `${base}/render.html?m=${file}&orbit=${encodeURIComponent(orbit)}`;
  const ok = await shoot(url);
  if (!ok) problems.push(`${file}: model never fired load`);
  const dims = await page.evaluate(() => {
    const v = document.getElementById('v');
    const d = v && v.getDimensions ? v.getDimensions() : null;
    return d ? `${d.x.toFixed(2)}x${d.y.toFixed(2)}x${d.z.toFixed(2)}` : 'n/a';
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: join(IMAGES, `${slug}-1.jpg`), type: 'jpeg', quality: 88 });
  done++;
  console.log(`  [${done}/${SHOTS.length}] ${slug.padEnd(20)} model ${dims}  ${ok ? '' : '  <-- FAILED'}`);
}

await browser.close();
server.close();
console.log(problems.length ? `\nPROBLEMS:\n${problems.join('\n')}` : '\nAll renders OK');
