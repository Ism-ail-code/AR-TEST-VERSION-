# Rapidify — Deep System Analysis

> **Generated:** 2026-10-01
> **Repo:** `https://github.com/Ism-ail-code/AR-TEST-VERSION-.git` (origin)
> **Local path:** `C:\Users\hp\Documents\STARTUP\UNDER WORK PROJECTS\Rapidify_test`
> **Commits:** 57 (linear history, page-by-page build-up) · **Working tree:** clean

---

## 1. What this system is

**Rapidify** is an **AR-commerce prototype** — a single-page web app that demonstrates a furniture
storefront where every product can be viewed in **3D** and placed in the customer's room with
**augmented reality**, paired with a **merchant back-office** that manages the catalog, generates
printable **QR codes** for in-store posters, and shows simulated analytics.

It is a **front-end-only prototype**: there is no backend, no database, no auth, and no network
calls for data. Everything (products, reviews, QR scans, analytics events) comes from a single
static module, `src/data/demo.ts`. The UI is explicitly labelled "Demo Mode — all data is simulated"
in the merchant portal.

Two experiences live in one bundle:

| Experience | Entry | Purpose |
|---|---|---|
| **Customer / Storefront** | `/` | Browse, search, 3D/AR preview, reviews |
| **Merchant portal** | `/merchant` | Dashboard, catalog management, QR posters, analytics |

A floating **ExperienceSwitcher** pill (`src/components/ExperienceSwitcher.tsx`) is rendered on every
route except `/ar/*` and lets you jump between the two modes.

---

## 2. Technology stack

### Runtime dependencies
| Package | Version | Role |
|---|---|---|
| `react` / `react-dom` | ^18.3.1 | UI runtime (StrictMode) |
| `react-router-dom` | ^6.28.0 | Client-side routing (`BrowserRouter`) |
| `@google/model-viewer` | ^4.3.1 | Web component for 3D **and** AR sessions (WebXR / Scene Viewer / Quick Look) |
| `three` | ^0.186.0 | 3D engine used by the second viewer |
| `@react-three/fiber` | ^9.7.0 | React renderer for three.js (inline 3D viewer) |
| `@react-three/drei` | ^10.7.8 | `OrbitControls`, `Environment`, `ContactShadows`, `useGLTF`, `Html`, `useProgress` |
| `qrcode.react` | ^4.2.0 | QR code SVG/Canvas rendering |
| `lucide-react` | ^0.460.0 | Icon set (used throughout) |

> ⚠️ `@types/three` is listed under **`dependencies`** instead of `devDependencies`.

### Toolchain
- **Vite 6** (`vite.config.ts`) — dev server on port 5173, `@` → `./src` path alias.
- **TypeScript ~5.6** — `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, project-reference build (`tsc -b`).
- **Tailwind CSS 3.4** + PostCSS (`tailwindcss`, `autoprefixer`) with a large custom design-token config.
- **ESLint 9** is declared in `devDependencies` and wired to `npm run lint`, **but no `eslint.config.js` exists** — see §8.
- Google Fonts (`Inter`, `JetBrains Mono`) imported via `@import url(...)` in `src/index.css`.

### Scripts
```json
"dev":    "vite"
"build":  "tsc -b && vite build"
"lint":   "eslint ."
"preview":"vite preview"
```

---

## 3. Codebase at a glance

| Metric | Value |
|---|---|
| Source files (`src/**/*.{ts,tsx,css}`) | 45 |
| Source lines of code | **5,381** |
| React components | ~45 |
| Route definitions | 13 + 404 |
| Git commits | 57 |
| Build output (`dist/`) | 15 files, **3.78 MB** |
| Test files | **0** |
| README | **none** |
| Backend / API layer | **none** |

### Directory structure
```
src/
├── main.tsx                     # ReactDOM root, StrictMode
├── App.tsx                      # ToastProvider → BrowserRouter → Routes + ExperienceSwitcher
├── index.css                    # Tailwind layers, base styles, container-page utilities
├── types/index.ts               # 9 domain interfaces (Product, Store, Review, QRCode, …)
├── data/demo.ts                 # 619 lines — ALL application data + helper selectors
├── services/ar.ts               # AR capability detection (WebXR / Scene Viewer / Quick Look)
├── layouts/
│   ├── StorefrontLayout.tsx     # Navbar + Outlet + Footer
│   └── MerchantLayout.tsx       # Sidebar + topbar + Outlet (responsive drawer)
├── pages/
│   ├── storefront/  Home, ProductCatalog, ProductDetail
│   ├── merchant/    Dashboard, MerchantProducts, MerchantProductDetail,
│   │                QRCodePage, CustomerPreview, MerchantAnalytics,
│   │                MerchantStore, MerchantSettings
│   └── ar/          ARExperience (full-screen)
├── components/
│   ├── Navbar.tsx, Footer.tsx, ExperienceSwitcher.tsx
│   ├── ar/         ARViewer, ARControls, ARUnsupported
│   └── ui/         14 primitives (Button, Badge, Modal, Drawer, Tabs, Toast, …)
└── model-viewer.d.ts            # JSX intrinsic-element declaration for <model-viewer>
```

---

## 4. Routing map

Defined in `src/App.tsx`. `ProductDetail` and `ARExperience` are `React.lazy`-loaded; everything
else is eagerly imported.

### Storefront (`StorefrontLayout`: Navbar + Footer)
| Path | Page | Notes |
|---|---|---|
| `/` | `Home` | Hero, trust bar, featured, "How AR works", categories, all products, testimonials, CTA |
| `/products` | `ProductCatalog` | Search, category pills, sort, grid/list toggle, URL-synced `?search=` & `?category=` |
| `/product/:productId` | `ProductDetail` | Matches **slug or id**; gallery ↔ 3D toggle, variants, specs, reviews, related |

### Merchant (`MerchantLayout`: sidebar + topbar)
| Path | Page | Notes |
|---|---|---|
| `/merchant` | `MerchantDashboard` | Stat cards, event-breakdown bars, recent activity, engagement table, top products, QR performance |
| `/merchant/products` | `MerchantProducts` | Card grid with 3D/AR/QR readiness indicators |
| `/merchant/products/:productId` | `MerchantProductDetail` | Edit forms (`defaultValue`, non-persisting), AR config panel, specs |
| `/merchant/products/:productId/qr` | `QRCodePage` | Print-ready poster, SVG/PNG download, `window.print()` |
| `/merchant/products/:productId/preview` | `CustomerPreview` | Renders the real `ProductDetail` under a preview toolbar |
| `/merchant/analytics` | `MerchantAnalytics` | Event breakdown + top products (simulated) |
| `/merchant/store` | `MerchantStore` | Read-only store profile card |
| `/merchant/settings` | `MerchantSettings` | Three static setting rows |

### AR & fallbacks
| Path | Page |
|---|---|
| `/ar/:productId` | `ARExperience` (full-screen, no layout, switcher hidden) |
| `*` | `NotFound` (404) |

**Route-level UX details:** a `PageSpinner` Suspense fallback wraps all routes; `ExperienceSwitcher`
is mounted *outside* `<Routes>` so it persists across navigation.

---

## 5. Data layer

### Domain model (`src/types/index.ts`)
```
Product
 ├─ ProductImage[]        (url, alt, isPrimary, sortOrder)
 ├─ ProductVariant[]      (type: color|size|material|finish, priceModifier, inStock)
 ├─ ProductSpecification[] (label, value, group)
 ├─ dimensions {w,h,d,unit}  weight {value,unit}
 ├─ ARConfiguration
 │    ├─ modelUrl, modelFormat (glb|gltf|usdz)
 │    ├─ scale, position{x,y,z}, rotation{x,y,z}
 │    ├─ lightingPreset (studio|natural|dramatic)
 │    ├─ environmentPreset (apartment|city|dawn|forest|lobby|night|park|studio|sunset|warehouse)
 │    └─ backgroundBlur, placementGuide
 ├─ arModelUrl | null, inStock, stockCount, rating, reviewCount
 └─ relatedProductIds[], qrUrl, createdAt, updatedAt

Store, Review, QRCode, AnalyticsEvent, DashboardStats
```

`AnalyticsEvent.eventType` ∈ `view | ar_open | ar_capture | qr_scan | add_to_cart | purchase`,
`source` ∈ `web | ar | qr`.

### Demo data (`src/data/demo.ts`, 619 lines)
- **1 store:** *Casa Living* (Austin, TX — minimalist furniture brand).
- **5 products:** Oslo Lounge Chair ($849), Haven Sofa ($2,199), Forma Coffee Table ($1,299),
  Luma Arc Floor Lamp ($459), Mono Side Table ($379) — each with 3–4 images, 2–4 variants,
  grouped specifications, and a full `arConfiguration`.
- **12 reviews**, **5 QR codes** (4,301 total scans), **29 analytics events**, **dashboard stats**
  (5 products, 4,301 scans, 2,847 AR views, 8.6% conversion).
- **Selectors:** `getProductBySlug`, `getProductById`, `getReviewsForProduct`,
  `getQRCodesForProduct`, `getRelatedProducts`, `getProductPageUrl`, `getARPageUrl`.
- `APP_BASE_URL = 'https://rapidify.app'` — the single constant you must change when deploying.

> All product images are `placehold.co` placeholders and all 3D models are public sample GLBs
> (`Astronaut`, `DamagedHelmet`, `NeilArmstrong`, `RocketShip`, `Horse`) — i.e. **none of the
> models actually match the furniture**.

---

## 6. The 3D / AR subsystem (core differentiator)

The app ships **two independent 3D pipelines**, which is the most important architectural fact
about this codebase.

### Pipeline A — `<model-viewer>` (AR path)
`src/components/ar/ARViewer.tsx`, lazy-loaded by `ARExperience`.
- Registers `@google/model-viewer` web component and drives it with `camera-orbit`,
  `environment-image`, `ar`, `ar-modes`, `ar-scale`, `shadow-intensity`, `touch-action`.
- Maps `ARConfiguration.lightingPreset` → `environment-image` (`studio`→`studio`,
  `dramatic`→`dawn`, else `environmentPreset`).
- Listens to `progress`, `load`, `error`, `ar-status` events and reports a status
  (`idle | loading | ar-started | ar-ended | error`) up to the page.
- `ARControls` mutates the element **via `document.querySelector('model-viewer')`** — imperative
  DOM access rather than a ref — for move/rotate/scale/reset/share.

### Pipeline B — React Three Fiber (inline 3D path)
`src/components/ui/ModelViewer.tsx`, lazy-loaded by `ProductDetail` ("3D View" toggle).
- `Canvas` + `useGLTF` + `OrbitControls` (auto-rotate, zoom, pan, polar clamp) +
  `ContactShadows` + `Environment preset="apartment"` + two directional lights + ambient.
- Hover-revealed control bar: auto-rotate, zoom hints, reset, fullscreen.
- Placeholder state when `modelUrl` is missing/`placehold.co`, and a `ViewerErrorState` on failure.

### Capability detection (`src/services/ar.ts`)
`detectARCapabilities()` returns `{ webXRSupported, sceneViewerSupported, quickLookSupported,
iOS, android, mobile, arCapable, reason }`; `getPreferredARMode()` prioritises
`webxr → scene-viewer → quick-look → none`.

`ARExperience` then branches:
1. `capabilities === null` → "Detecting AR capabilities…" spinner.
2. `!arCapable` → `ARUnsupportedPage` — full-screen 3D viewer as fallback + a bottom sheet
   (`ARUnsupported`) explaining Android/iOS/desktop support.
3. capable → full-screen `ARViewer` with top bar (mode badge) and `ARControls`.

---

## 7. Design system

`tailwind.config.js` defines a complete token set:

- **`brand`** — warm near-black neutrals (`900: #1a1a18`, `950: #0d0d0c`) for primary actions.
- **`accent`** — copper/terracotta (`500: #dd6a2f`) for AR/CTA highlights.
- **`surface`** — layered greys for page/card backgrounds.
- **Semantic** — `success`, `warning`, `error`, `info` (+ `light`/`dark` variants).
- Custom `fontSize` scale (adds `2xs: 0.6875rem`), extended `spacing`, `boxShadow`
  (`card`, `card-hover`, `elevated`), `transitionTimingFunction.out-expo`, `screens.xs: 480px`,
  and keyframes `fade-in / slide-up / slide-down / scale-in / spinner / shimmer`.

`src/index.css` adds `.container-page` (max-w-7xl), `.container-narrow`, `.focus-ring`,
`.glass`, `.overlay`, `.separator`, `.img-loading`, custom scrollbars, and `line-clamp-2/3`.

### UI kit (`src/components/ui/`, barrel-exported from `index.ts`)
`Button, Badge, Breadcrumbs, Modal, Drawer, Tabs(+TabList/TabTrigger/TabContent),
Toast(ToastProvider/useToast), Spinner/LoadingPage/LoadingCard/LoadingTable, EmptyState,
StatusIndicator, ProductCard, ProductImageGallery, ProductQRCode, ProductImage`

**Only `Breadcrumbs`, `Badge`, `ProductCard` and `ToastProvider` are actually imported anywhere** —
the other 10 components are currently dead code.

### Accessibility & responsiveness
- Good: `aria-label` on icon buttons, `aria-expanded`/`aria-pressed`, `role="listbox"/"option"`
  on search results, visible focus rings, semantic landmarks, keyboard-friendly nav.
- Layouts are mobile-first: merchant sidebar collapses to an off-canvas drawer under `lg`,
  storefront navbar has a hamburger menu, grids scale `1 → 2 → 3 → 4` columns.

---

## 8. Build & quality status (verified by running the tools)

### ❌ `npm run build` FAILS — 23 TypeScript errors
`dist/` exists from an **earlier** successful build; current sources no longer compile.

```
src/components/ui/Breadcrumbs.tsx(1,25)      TS6133 'ReactNode' declared but never read
src/components/ui/ModelViewer.tsx(2,28)      TS6133 'useThree' declared but never read
src/components/ui/ModelViewer.tsx(15,3)      TS6133 'Loader2' declared but never read
src/components/ui/ProductQRCode.tsx(28,9)    TS6133 'canvasRef' declared but never read
src/components/ui/ProductQRCode.tsx(40,77)   TS2448 'url' used before its declaration   ← real bug
src/components/ui/ProductQRCode.tsx(40,77)   TS2454 'url' used before being assigned
src/pages/merchant/CustomerPreview.tsx(5,35) TS6133 'Eye' unused
src/pages/merchant/Dashboard.tsx(8,3)        TS6133 'getQRCodesForProduct' unused
src/pages/merchant/Dashboard.tsx(23,3)       TS6133 'Users' unused
src/pages/merchant/Dashboard.tsx(61,9)       TS6133 'totalRevenue' unused
src/pages/merchant/Dashboard.tsx(163,21)     TS6133 'Icon' unused
src/pages/merchant/MerchantProducts.tsx(11,3) TS6133 'ArrowUpRight' unused
src/pages/merchant/MerchantProducts.tsx(13,3) TS6133 'Check' unused
src/pages/merchant/MerchantProducts.tsx(50,17) TS6133 'productUrl' unused
src/pages/merchant/MerchantSettings.tsx(1,10) TS6133 'Settings' unused
src/pages/merchant/MerchantStore.tsx(2,10)   TS6133 'Store' unused
src/pages/merchant/QRCodePage.tsx(4,24)      TS6133 'demoStore' unused
src/pages/storefront/Home.tsx(2,24)          TS6133 'demoStore' unused
src/pages/storefront/Home.tsx(12,3)          TS6133 'RotateCcw' unused
src/pages/storefront/ProductDetail.tsx(13,3) TS6133 'ChevronRight' unused
src/pages/storefront/ProductDetail.tsx(24,3) TS6133 'Layers' unused
src/pages/storefront/ProductDetail.tsx(443,62) TS6133 'groupIdx' unused
```

- **21 are unused-import warnings** (`noUnusedLocals`) → delete the imports.
- **2 are a genuine defect** in `ProductQRCode.handleDownload`: the local `const url = URL.createObjectURL(blob)`
  shadows the `url` prop that the `querySelector` uses on the same line — rename the local variable.
  (Note: `ProductQRCode` is unused, so this only blocks the build, not runtime.)

### ❌ `npm run lint` FAILS
`eslint .` → *"ESLint couldn't find an eslint.config.(js|mjs|cjs) file."* The ESLint 9 config was
never added, so the lint script is non-functional.

### Bundle size — 3.78 MB in `dist/`
| Asset | Size |
|---|---|
| `decode-*.js` | 748 KB |
| `draco_decoder-*.js` | 703 KB |
| `basis_transcoder-*.wasm` | 515 KB |
| `ARExperience-*.js` (lazy) | 472 KB |
| `index-*.js` (initial) | 348 KB |
| `ModelViewer-*.js` (lazy) | 302 KB |
| 2× draco wasm + wrappers | ~580 KB |
| `index-*.css` | 45 KB |

Root cause: **two full 3D stacks** (`@google/model-viewer` bundles its own three.js; R3F/drei pull
another copy) plus Draco + Basis transcoders shipped twice. Total JS/CSS initial payload ≈ 393 KB
gzip-uncompressed for a 5-product demo.

---

## 9. Issues & risks

### 🔴 Correctness / ship-blockers
1. **Build is broken** (23 TS errors, §8). Anything deployed now is the stale `dist/`.
2. **Lint is broken** (missing `eslint.config.js`).
3. **SPA deep links 404** — `BrowserRouter` with no `vercel.json` / `netlify.toml` / server rewrite
   rules. Scanning a QR code that lands on `/product/oslo-lounge-chair` on a hard refresh will fail
   on most static hosts.
4. **QR codes point at the wrong domain.** `APP_BASE_URL = 'https://rapidify.app'` while the app's
   own route is `/product/:slug` on whatever host you deploy to. As written, every printed QR
   resolves to `rapidify.app`, which is not this build.
5. **`ProductQRCode.tsx`** — `url` shadowing bug (also blocks `tsc`).
6. **`<button>` nested inside `<Link>`** in `ProductDetail` (the "View in AR" CTA) — invalid HTML;
   React will render it but it causes hydration/validity warnings and unpredictable click targets.
7. **`ModelViewer` error handling doesn't work** — `onError` on R3F `<Canvas>` is not a real error
   boundary. If `useGLTF` throws (bad URL, CORS, 404), the error propagates past `<Suspense>` and
   can blank the page instead of showing `ViewerErrorState`.

### 🟠 Architecture
8. **No data layer at all.** Every page imports `@/data/demo` directly. There is no repository/API
   abstraction, so swapping in a backend means touching ~20 files.
9. **No persistence.** Merchant "Save Changes", search box in `MerchantLayout`, cart, wishlist,
   notifications, and account buttons are all visual-only. `defaultValue` forms reset on navigation.
10. **No authentication/authorization.** `/merchant/*` is fully public.
11. **Analytics are fake.** `MerchantDashboard` recomputes counts from a 29-row static array while
    `demoDashboardStats` holds *different* hard-coded totals (4,301 scans vs. 5 scanned events) —
    the two are never reconciled, so numbers on screen contradict each other.
12. **Two 3D pipelines** for the same models — duplicated logic (camera orbit, environment, scale),
    duplicated bundles, and inconsistent visuals between the PDP viewer and the AR viewer.
13. **Imperative DOM coupling** — `document.querySelector('model-viewer')` in `ARExperience` and
    `ARControls` breaks if two viewers ever coexist, and hides state from React.
14. **Dead code:** 10 unused UI components, `demoStore`/`totalRevenue`/`productUrl` unused vars,
    `ARUnsupported` renders a full-screen layout that `ARExperience` embeds *inside* a bottom sheet
    (double `min-h-screen`), `isSceneViewerSupported()` creates an `<a>` it never uses.
15. **`@google/model-viewer` JSX typing** is declared as `any` in `model-viewer.d.ts` — no prop safety.

### 🟡 Data / content realism
16. Placeholder images from `placehold.co` (external dependency; offline = broken UI).
17. **AR models don't match products** (astronaut helmet for a sofa). `scale: 1.0` with no real-world
    units means "true scale" claims on the marketing pages are untrue.
18. `qrUrl`, `rating`, `reviewCount`, `stockCount` are decorative strings/numbers.
19. `isSceneViewerSupported()` effectively returns `isAndroid()` — it can't truly detect Scene Viewer.

### 🟢 Performance / SEO / a11y
20. **3.78 MB bundle**, duplicate three.js, Draco/Basis transcoders loaded even for uncompressed models.
21. **No SEO** — single generic `<title>`, no per-route `document.title`, no meta description,
    no Open Graph tags, no JSON-LD (`Product` schema), no `<h1>` discipline guarantees on routes.
    A commerce site with zero product SEO is a real business risk.
22. **No tests, no README, no CI** (`.github/` absent), no `.env` handling, no error monitoring.
23. Images lack `width`/`height` (CLS risk); the Home page renders **all** products twice plus 5
    full-size placeholders above the fold-ish area.
24. Fonts loaded via render-blocking CSS `@import` instead of `<link rel="preconnect">`.
25. `navigator.platform` (deprecated) in `services/ar.ts`; `window.print()` in `QRCodePage` ignores
    `beforeprint` handling and prints the whole document (mitigated by a local `<style>` block).

---

## 10. What's genuinely good

- **Clear domain modelling** — `types/index.ts` is thoughtful and complete (variants, grouped specs,
  AR config with lighting/environment presets, analytics event taxonomy).
- **Two coherent experiences** in one app, cleanly separated by layout routes, with a clever
  `ExperienceSwitcher` for demoing both.
- **Real AR capability UX**: detection → preferred mode → unsupported fallback with a usable 3D
  viewer. Most prototypes skip this entirely.
- **Graceful degradation** everywhere: lazy routes with spinners, placeholder/error states in the
  viewer, 404 pages on every surface, empty states in the catalog.
- **Strong design-token discipline** — one palette, consistent radii/shadows, custom `2xs` type
  scale, `container-page` rhythm; the UI looks like a designed product, not a template.
- **QR poster flow is well thought through** — print CSS, SVG *and* PNG export, scan stats, and a
  "customer preview" route that reuses the real PDP component rather than a mock.
- **Strict TS config** (`strict` + `noUnusedLocals`) — the discipline is right, even though the tree
  currently fails it.

---

## 11. Recommended next steps

**Immediate (unblock the build)**
1. Remove the 21 unused imports; fix the `url` shadowing in `ProductQRCode.tsx`.
2. Add `eslint.config.js` (flat config with `typescript-eslint` + `react-hooks` + `react-refresh`).
3. Replace `<Link><button>` in `ProductDetail` with a single styled `<Link>`.
4. Add an R3F error boundary around `<Model>` so `useGLTF` failures render `ViewerErrorState`.

**Before showing it to users**
5. Set `APP_BASE_URL` from `import.meta.env.VITE_BASE_URL` and add SPA rewrites
   (`vercel.json` / `netlify.toml` / `_redirects`).
6. Add route-level `<title>` + meta description (or `react-helmet-async`) and `Product` JSON-LD.
7. Replace `placehold.co` images and the sample GLBs with real furniture assets (and set real-world
   `scale` in `arConfiguration`).
8. Reconcile `demoDashboardStats` with computed analytics, or drop one of them.

**Structural (prototype → product)**
9. Introduce a `src/api/` repository layer (products, analytics, QR) so a backend can slot in
   without touching components.
10. Collapse to **one** 3D pipeline — keep `<model-viewer>` (it already does 3D *and* AR) and drop
    R3F/drei, or vice-versa. This alone removes ~1.5 MB.
11. Add auth on `/merchant/*`, real mutations for the edit forms, and a cart/checkout flow.
12. Add tests (Vitest + Testing Library for the AR capability matrix and catalog filtering),
    a README, and CI running `lint` + `build`.

---

### Appendix — one-line summary per source file

| File | LOC | Role |
|---|---|---|
| `data/demo.ts` | 619 | Entire dataset + selectors + `APP_BASE_URL` |
| `pages/storefront/ProductDetail.tsx` | 491 | PDP: gallery/3D toggle, variants, specs, reviews, related |
| `pages/merchant/Dashboard.tsx` | 298 | Merchant KPIs, event bars, engagement table |
| `pages/storefront/Home.tsx` | 240 | Marketing landing sections |
| `pages/merchant/QRCodePage.tsx` | 220 | Printable QR poster + SVG/PNG export |
| `components/Navbar.tsx` | 211 | Announcement bar, nav, live search, mobile menu |
| `pages/ar/ARExperience.tsx` | 213 | Full-screen AR flow + unsupported fallback |
| `components/ar/ARControls.tsx` | 191 | Collapsible AR control sheet |
| `pages/storefront/ProductCatalog.tsx` | 188 | Filter/search/sort catalog |
| `components/ExperienceSwitcher.tsx` | 175 | Customer ↔ Merchant floating switcher |
| `layouts/MerchantLayout.tsx` | 157 | Sidebar + topbar shell |
| `components/ui/ProductCard.tsx` | 161 | Grid & list product cards |
| `pages/merchant/MerchantProducts.tsx` | 158 | Catalog management grid |
| `types/index.ts` | 139 | Domain interfaces |
| `pages/merchant/MerchantProductDetail.tsx` | 123 | Product edit + AR config forms |
| `components/ar/ARViewer.tsx` | 119 | `<model-viewer>` wrapper + event wiring |
| `pages/merchant/CustomerPreview.tsx` | 108 | Real PDP wrapped in preview toolbar |
| `components/ui/ProductQRCode.tsx` | 99 | Reusable QR w/ download (⚠ contains build bug) |
| `components/Footer.tsx` | 96 | Store footer |
| `services/ar.ts` | 86 | AR capability detection |
| `components/ui/ModelViewer.tsx` | 232 | R3F 3D viewer (lazy, PDP only) |
| `App.tsx` | 78 | Router + providers + 404 |
| `components/ar/ARUnsupported.tsx` | 68 | "AR not available" explainer |
| others (`ui/*`, layouts, configs) | ~600 | Primitives, shell, Tailwind/Vite/TS config |

---

# Appendix B — YC static-demo rebuild (same day)

> **Note:** Sections 1–9 and the appendix above describe the codebase **as analysed, before the
> rebuild.** File names, LOC and behaviours called out there (`src/data/demo.ts`, the R3F
> `ModelViewer`, the `ProductQRCode` build bug, the 23 TS errors) have since changed — see below.

## B.1 What was rebuilt

**Data model — one source of truth.** `src/data/demo.ts` (619 LOC, mixed product/analytics/QR
shape) was deleted and replaced by `src/data/products.ts` + a widened `src/types/index.ts`.
A single `Product` record (id, slug, name, price, category, description, images, specifications,
dimensions, `modelUrl`, `modelFormat`, `arConfiguration`, `qrUrl`, `arReady`, `qrReady`,
`modelFile`, `lastUpdated`) drives the storefront, the PDP, the dashboard, the management page,
the customer preview, the QR poster and the AR experience.

**3D pipeline collapsed to one.** R3F/three/drei were removed from `package.json`; everything now
renders through `<model-viewer>`:
- `components/ui/ModelViewer.tsx` — rewritten as an inline `<model-viewer>` wrapper with
  loading/error/fullscreen/auto-rotate. Loading and error are *overlays*, so the element is never
  unmounted and retry always works.
- `components/ar/ARViewer.tsx` — full-screen viewer with `ar`/`ar-modes`/`ar-scale`, status
  listener, and a matching error overlay.
- The PDP's 3D view and the AR page now load the **same GLB with the same camera, lighting and
  environment**, so they cannot drift apart.

**Page rewrites.** `Home` (adds the 6-step flow story + derived stats), `ProductDetail`
(Photos/3D toggle, product-specific QR, reviews, related), `Dashboard` ("Casa Living / Connected
Store" + 5/4/4 + product table), `MerchantProducts` (working search/status filter),
`MerchantProductDetail` (3D/AR/QR status cards + AR configuration panel + Preview / View QR / View
in AR), `QRCodePage` (printable "SCAN TO SEE IT IN YOUR SPACE" poster, SVG/PNG/print),
`CustomerPreview` (lazy-imports the *same* `<ProductDetail>`), `MerchantAnalytics`,
`ARExperience`, `ARControls`, `ARUnsupported`, `ProductCard`, `ProductQRCode`.

**Routing.** `App.tsx` declares `/merchant/products/:productId/preview` *before* the merchant
shell so the preview escapes the sidebar layout and takes over the window; a `ScrollToTop`
component and a real 404 were added. The `ExperienceSwitcher` no longer nests `<a>` inside `<a>`
(card is a `div` that defers to any real link inside it).

**Consistency.** Every headline number is *derived* from `demoProductStats`, so they cannot
contradict: arViews 982+741+0+566+558 = **2,847**; qrScans 1376+1104+0+842+979 = **4,301**;
productViews = 13,640; purchases = 1,173 → conversion **8.6%**. The non-AR product
(Forma Coffee Table) has 0 AR views and 0 scans by construction.

**Robustness added.** `/ar/:productId` for a product with no model renders a deliberate
"not activated" screen instead of an empty viewer; `ModelViewer` and `ARViewer` both have real
error states with retry; `placehold.co` URLs are gone (all imagery is local under
`public/images/`).

## B.2 iOS correction

The original analysis assumed iOS needed a hand-authored USDZ and therefore had to fall back to a
static 3D preview. **That was wrong.** `@google/model-viewer` v4 bundles a `USDZExporter` and
calls `prepareUSDZ()` when `ios-src` is absent (`src/features/ar.ts:407,462`), so Safari converts
the GLB to USDZ on device. iOS therefore gets **real Quick Look AR** with no extra asset. The
`ARUnsupported` panel remains for genuinely incapable devices (desktop, non-AR WebViews).

`ar-scale` is deliberately `auto`, not `fixed`: the model still lands at the real-world size
encoded in the GLB, but the customer can pinch to fine-tune — `fixed` only adds
`resizable=false` / `allowsContentScaling=0` in Scene Viewer and Quick Look.

## B.3 Tooling

- `eslint.config.js` created (ESLint 9 flat config, `typescript-eslint` recommended +
  `react-hooks` + `react-refresh`). **`npm run lint` → 0 errors, 0 warnings.**
- `package.json`: dropped `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`
  (−50 packages).
- `index.html`: real title/description/theme-colour/OG tags, `viewport-fit=cover`,
  `mobile-web-app-capable` (so a QR-launched page behaves like an app), new `public/favicon.svg`.
- `vite.config.ts`: `chunkSizeWarningLimit: 1400` for the code-split `<model-viewer>` bundle.
- `README.md` added: quick start, demo walkthrough, routes, AR hand-off matrix, static-data notes.

## B.4 Verification

```
npm run lint   →  0 problems
npm run build  →  tsc -b clean, vite build clean, no warnings
```

Dev-server smoke test: all 28 route/component/data modules transform without error; static
assets (`/images/*.jpg`, `/models/*.glb`, `/favicon.svg`) and both runtime deps resolve 200.

Bundle (was **3.78 MB**, now **1.42 MB** of JS):

| Chunk | Size |
|---|---|
| `index` (app shell + routes) | 344 kB (gzip 95 kB) |
| `model-viewer` (code-split, loads only when a 3D/AR view opens) | 1,073 kB (gzip 300 kB) |
| `ProductDetail` / `ARExperience` / `ARViewer` / `ModelViewer` | 22.9 / 19.3 / 3.9 / 7.2 kB |

Tailwind tokens verified present in the emitted CSS (`container-page`, `text-2xs`,
`shadow-card-hover`, `w-4.5`, `bg-success-light`, `text-error-dark`, …).

> The duplicate `draco_*` / `basis_transcoder` assets seen in earlier `dist/` output were emitted
> by the removed drei/three dependency chain; they are gone from the build now.
