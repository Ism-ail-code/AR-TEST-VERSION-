# Rapidify — AR commerce demo

> A static, offline-capable prototype that shows how a merchant's product catalogue becomes a
> 3D / augmented-reality shopping experience — with one unique QR code per product.

**Two experiences, one dataset.** Nothing in this repo talks to a network for data: every
product, price, image, 3D model, QR code and analytics number comes from
[`src/data/products.ts`](src/data/products.ts).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  →  dist/
npm run lint     # eslint .
npm run preview  # serve the production build
```

Both `npm run build` and `npm run lint` pass with zero errors and zero warnings.

---

## Demo walkthrough

| # | Where | What to look at |
|---|-------|-----------------|
| 1 | `/` | Casa Living storefront: hero, shop-by-room, featured furniture, reviews — no tech pitch |
| 2 | `/products` | Catalogue — room + category filters, search, sort, grid/list toggle |
| 3 | `/product/oslo-lounge-chair` | Product page: **Photos / 3D** toggle, variants, **See it in your space**, the product's own QR code |
| 4 | `/ar/prod-001` | Full-screen, phone-first AR: **Place in Room · Rotate · Move · Scale · Reset** |
| 5 | `/merchant` | *"Casa Living / Connected Store"* dashboard — 5 synced, 4 AR-ready, 4 QR-ready, product table |
| 6 | `/merchant/products/prod-001` | Product management: 3D model, AR status, and the AR configuration panel (scale / position / rotation / lighting / environment) |
| 7 | `/merchant/products/prod-001/qr` | Printable **"SCAN TO SEE IT IN YOUR SPACE"** poster, SVG/PNG export |
| 8 | `/merchant/products/prod-001/preview` | Customer preview — literally the same `<ProductDetail>` component the storefront uses |

Use the floating **Customer ⇄ Merchant** pill (bottom-right, hidden on AR pages) to jump between
the two experiences.

**Where the Rapidify story lives.** The customer side is a furniture store: Casa Living's logo,
shop-by-room navigation, bag and wishlist, and AR presented as an ordinary shopping feature
("View in AR"). Rapidify only appears as the small *AR by Rapidify* credit on the product page,
the AR screen and the footer. The merchant dashboard is where the 3D/AR/QR pipeline is explained.

### The four demo figures

They are *derived* by summing the per-product stats, so they can never contradict each other:

| Metric | Value |
|---|---|
| Products synced | **5** |
| AR Ready / QR Ready | **4 / 4** |
| AR views | **2,847** |
| QR scans | **4,301** |

---

## Routes

```
/                                          Storefront home
/products                                  Catalogue
/product/:productId                        Product detail (id or slug)
/ar/:productId                             Full-screen AR experience
/merchant                                  Dashboard
/merchant/products                         Catalogue management
/merchant/products/:productId              Product + AR configuration
/merchant/products/:productId/qr           Printable QR poster
/merchant/products/:productId/preview      Customer preview (outside the merchant shell)
/merchant/analytics · /store · /settings   Supporting merchant pages
```

---

## How the AR works

Everything renders through **one** `<model-viewer>` pipeline — the PDP's inline 3D viewer and the
full-screen AR page load the same GLB with the same camera, lighting and environment presets, so
what the customer inspects on the product page is exactly what they place in their room.

Capability detection lives in [`src/services/ar.ts`](src/services/ar.ts) and picks the best hand-off:

| Device | Hand-off |
|---|---|
| Android (Chrome) | Google **Scene Viewer** via an `intent://` link |
| iOS (Safari) | **Quick Look** — `<model-viewer>` converts the GLB to USDZ on-device |
| WebXR-capable browser | **WebXR** immersive-ar session |
| Anything else | Polished real-time **3D preview** + an explanation (`ARUnsupported`) — never a dead end |

Products without a 3D model (`Forma Coffee Table`) render a deliberate *"not activated"*
screen instead of an empty viewer.

> **True scale:** `ar-scale="auto"` means the model is placed at the real-world dimensions
> encoded in the GLB and the customer can still pinch to fine-tune it.

---

## Static-data notes

- **Single source of truth.** `src/data/products.ts` exports the 5 products, the store, the
  reviews, the per-product stats and derived selectors. Storefront, PDP, dashboard, management
  page, preview, QR and AR all read from it.
- **QR codes are generated, not hardcoded.** Each code encodes that product's real URL via
  `getProductUrl()`.
- **Base URL.** `getBaseUrl()` reads `VITE_BASE_URL` and falls back to `window.location.origin`.
  For a demo where printed QR codes must open on a phone, build with:

  ```bash
  VITE_BASE_URL=https://your-demo-domain.com npm run build
  ```

  Without it, codes encode `localhost`, which is unreachable from a phone.
- **Forms do not persist.** Every edit control on the merchant side is display-only and says so.

---

## Product lineup

| Product | Price | Category | 3D / AR / QR |
|---|---|---|---|
| Oslo Lounge Chair | $849 | Seating | ✅ (hero) |
| Haven Velvet Sofa | $2,199 | Seating | ✅ |
| Forma Coffee Table | $1,299 | Tables | ⬜ not activated |
| Luma Globe Lamp | $349 | Lighting | ✅ |
| Mono Silk Pouf | $379 | Seating | ✅ |

---

## Assets & credits

- **3D models** — [`Khronos glTF-Sample-Assets`](https://github.com/KhronosGroup/glTF-Sample-Assets)
  (SheenChair, GlamVelvetSofa, IridescenceLamp, SpecularSilkPouf), downloaded to
  `public/models/` so the demo works offline. Per-asset licences apply — see the upstream
  repository.
- **Product photography** — CC-licensed photographs sourced through the
  [Openverse](https://openverse.org) API, stored in `public/images/`.
- **Icons** — [Lucide](https://lucide.dev).
- **Fonts** — Inter and JetBrains Mono (Google Fonts, loaded from `index.css`).

---

## Stack

React 18 · TypeScript · React Router 6 · Vite 6 · Tailwind CSS 3 · `@google/model-viewer` ·
`qrcode.react` · Lucide.

### What is intentionally *not* here

No backend, no database, no auth, no Shopify/WooCommerce integration, no payments, no real
analytics, no cart persistence, no external product fetching. Adding any of them would work
against the point of this prototype: show the end-to-end AR commerce loop with zero
infrastructure.
