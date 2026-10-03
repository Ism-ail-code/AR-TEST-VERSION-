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
| 1 | `/` | Casa Living storefront: hero, **shop by department**, featured picks, reviews — no tech pitch |
| 2 | `/products` | Catalogue — department + room + category filters, search, sort, grid/list toggle |
| 3 | `/product/oslo-lounge-chair` | Product page: **Photos / 3D** toggle, variants, **See it in your space**, the product's own QR code |
| 4 | `/ar/prod-001` | Full-screen, phone-first AR: **Place in Room · Rotate · Move · Scale · Reset** |
| 5 | `/merchant` | *"Casa Living / Connected Store"* dashboard — 21 synced, 20 AR-ready, 20 QR-ready, product table |
| 6 | `/merchant/products/prod-001` | Product management: 3D model, AR status, and the AR configuration panel (scale / position / rotation / lighting / environment) |
| 7 | `/merchant/products/prod-001/qr` | Printable **"SCAN TO SEE IT IN YOUR SPACE"** poster, SVG/PNG export |
| 8 | `/merchant/products/prod-001/preview` | Customer preview — literally the same `<ProductDetail>` component the storefront uses |

Use the floating **Customer ⇄ Merchant** pill (bottom-right, hidden on AR pages) to jump between
the two experiences.

**Where the Rapidify story lives.** The customer side is a store — Casa Living sells furniture,
electronics, home appliances and kitchen appliances. It carries Casa Living's logo, department
navigation, bag and wishlist, and AR presented as an ordinary shopping feature ("View in AR").
Rapidify only appears as the small *AR by Rapidify* credit on the product page, the AR screen and
the footer. The merchant dashboard is where the 3D/AR/QR pipeline is explained.

### The four headline numbers

They are *derived* by summing the per-product stats, so they can never contradict each other:

| Metric | Value |
|---|---|
| Products synced | **21** |
| AR Ready / QR Ready | **20 / 20** |
| AR views | **12,463** |
| QR scans | **16,177** |

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

- **Single source of truth.** `src/data/products.ts` exports the 21 products, the six store
  departments, the store, the reviews, the per-product stats and derived selectors. Storefront,
  PDP, dashboard, management page, preview, QR and AR all read from it.
- **Departments are a view, not a copy.** The navbar, the homepage tiles and the footer's six
  departments all filter the same objects on `Product.rooms` via `?dept=`. A product can sit in
  more than one department (the smart TV is both *Electronics* and *Smart Home*); furniture
  additionally keeps its `Living Room` / `Bedroom` / `Dining` rooms so `?room=` still works.
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

Twenty-one products, one dataset. Everything except Forma is AR- and QR-ready.

| Product | Price | Category | Department |
|---|---|---|---|
| Oslo Lounge Chair | $849 | Seating | Furniture |
| Haven Velvet Sofa | $2,199 | Seating | Furniture |
| Forma Coffee Table | $1,299 | Tables | Furniture — ⬜ no model |
| Luma Globe Lamp | $349 | Lighting | Furniture |
| Mono Silk Pouf | $379 | Seating | Furniture |
| Aurora French-Door Refrigerator | $1,899 | Home Appliances | Appliances |
| Verve Front-Load Washing Machine | $949 | Home Appliances | Appliances |
| Breeze Inverter Air Conditioner | $629 | Home Appliances | Appliances · Smart Home |
| Nova Countertop Microwave Oven | $279 | Home Appliances | Appliances · Kitchen |
| Halo Cordless Stick Vacuum | $429 | Home Appliances | Appliances |
| Zephyr Tower Standing Fan | $149 | Home Appliances | Appliances |
| Citrus Slow Juicer | $179 | Kitchen Appliances | Kitchen |
| Velocity High-Speed Blender | $219 | Kitchen Appliances | Kitchen |
| Crisp Digital Air Fryer | $189 | Kitchen Appliances | Kitchen |
| Brew Drip Coffee Maker | $159 | Kitchen Appliances | Kitchen |
| Halo Variable-Temperature Kettle | $99 | Kitchen Appliances | Kitchen |
| Slice 2-Slice Toaster | $89 | Kitchen Appliances | Kitchen |
| Vista 55" QLED Smart TV | $1,099 | Televisions | Electronics · Smart Home |
| Pulse Portable Bluetooth Speaker | $129 | Audio | Electronics · Audio |
| Aura Wireless Headphones | $249 | Audio | Electronics · Audio |
| Pulse Smartwatch | $299 | Wearables | Electronics · Smart Home |

The three headline demos all work end to end: **Home → Appliances → Refrigerator → View in AR**,
**Home → Kitchen → Juicer → View in AR**, **Home → Electronics → TV → View in AR**.

---

## Assets & credits

- **3D models** — all local to `public/models/` so the demo works offline:
  - the four original furniture pieces are
    [`Khronos glTF-Sample-Assets`](https://github.com/KhronosGroup/glTF-Sample-Assets)
    (SheenChair, GlamVelvetSofa, IridescenceLamp, SpecularSilkPouf). Per-asset licences apply —
    see the upstream repository.
  - the sixteen appliances, electronics and audio products are parametric models generated
    in-repo (nothing downloaded, no third-party licence). They are authored in metres and
    grounded at `y = 0`, which is what makes `ar-scale="auto"` place them at true size.
- **Product photography** — the four furniture images are CC-licensed photographs sourced
  through the [Openverse](https://openverse.org) API. The sixteen new product images are
  rendered from each product's **own** GLB, so the card photo, the 3D view and the AR placement
  can never disagree with each other.
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
