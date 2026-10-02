import type {
  Product,
  Store,
  Review,
  ProductStats,
} from '@/types';

// ─────────────────────────────────────────────
//  BASE URL
//  Set `VITE_BASE_URL` at build time (e.g. https://rapidify.app) so printed
//  QR codes resolve to the deployed demo. Falls back to the current origin.
// ─────────────────────────────────────────────

export function getBaseUrl(): string {
  const fromEnv = (import.meta.env.VITE_BASE_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return 'https://rapidify.app';
}

/** Canonical storefront URL for a product — this is what the QR code encodes. */
export function getProductUrl(product: Product): string {
  return `${getBaseUrl()}/product/${product.slug}`;
}

/** Canonical full-screen AR URL for a product. */
export function getARUrl(product: Product): string {
  return `${getBaseUrl()}/ar/${product.id}`;
}

/** Print-ready QR poster URL for a product. */
export function getQRPosterUrl(product: Product): string {
  return `${getBaseUrl()}/merchant/products/${product.id}/qr`;
}

// ─────────────────────────────────────────────
//  STORE — Casa Living (the demo merchant)
// ─────────────────────────────────────────────

export const demoStore: Store = {
  id: 'store-001',
  name: 'Casa Living',
  slug: 'casa-living',
  logoInitials: 'CL',
  tagline: 'Modern furniture for everyday living',
  description:
    'Casa Living designs modern, minimalist furniture built from sustainably sourced materials. Every piece is made to last, hand-finished in small batches, and delivered free across the continental US.',
  location: {
    address: '247 Design District Blvd',
    city: 'Austin',
    state: 'TX',
    country: 'US',
    postalCode: '78701',
  },
  contact: {
    email: 'hello@casaliving-demo.com',
    phone: '+1 (512) 555-0198',
    website: 'https://casaliving-demo.com',
  },
  socialMedia: {
    instagram: 'https://instagram.com/casaliving',
    pinterest: 'https://pinterest.com/casaliving',
    facebook: 'https://facebook.com/casaliving',
  },
  themeColor: '#1a1a18',
  currency: 'USD',
  timezone: 'America/Chicago',
  connectedSince: '2026-03-14',
};

// ─────────────────────────────────────────────
//  PRODUCTS — one static source of truth.
//  5 products · 4 AR-ready · 4 QR-ready
// ─────────────────────────────────────────────

export const demoProducts: Product[] = [
  {
    id: 'prod-001',
    slug: 'oslo-lounge-chair',
    name: 'Oslo Lounge Chair',
    price: 849,
    currency: 'USD',
    category: 'Seating',
    subcategory: 'Lounge Chairs',
    rooms: ['Living Room', 'Bedroom'],
    tags: ['scandinavian', 'accent-chair', 'velvet', 'oak'],
    shortDescription:
      'Sculpted mid-century lounge chair with a deep velvet seat and solid oak legs.',
    description:
      'The Oslo Lounge Chair draws from Scandinavian design principles to deliver a seat that is as beautiful as it is comfortable. Its gently curved backrest follows the natural line of the spine while the low, wide seat invites you to settle in. Upholstered in a high-pile velvet with a soft sheen and set on tapered solid-oak legs, the Oslo works equally hard in a living room, a bedroom corner, or a reading nook. Every seam is hand-finished and the cushion is wrapped in a down-alternative fill that keeps its shape for years.',
    images: [
      { id: 'img-001a', url: '/images/oslo-lounge-chair-1.jpg', alt: 'Oslo Lounge Chair in rust velvet', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-001a', name: 'Rust Velvet', type: 'color', value: '#c4553a', priceModifier: 0, inStock: true },
      { id: 'var-001b', name: 'Peacock Velvet', type: 'color', value: '#1f6b64', priceModifier: 0, inStock: true },
      { id: 'var-001c', name: 'Charcoal Velvet', type: 'color', value: '#3a3a3c', priceModifier: 40, inStock: true },
    ],
    specifications: [
      { label: 'Frame', value: 'Kiln-dried hardwood + solid oak legs', group: 'Materials' },
      { label: 'Upholstery', value: '100% polyester velvet (40,000 Martindale)', group: 'Materials' },
      { label: 'Cushion Fill', value: 'High-resilience foam with down-alternative wrap', group: 'Comfort' },
      { label: 'Leg Finish', value: 'Natural matte oil', group: 'Finish' },
      { label: 'Assembly', value: 'Legs attach with included hex key (~10 min)', group: 'Assembly' },
      { label: 'Certification', value: 'FSC® wood, GREENGUARD Gold', group: 'Details' },
      { label: 'Country of Origin', value: 'Vietnam', group: 'Details' },
    ],
    dimensions: { width: 76, height: 84, depth: 82, unit: 'cm' },
    weight: { value: 18.5, unit: 'kg' },
    material: 'Oak, velvet',
    color: 'Rust Velvet',
    inStock: true,
    stockCount: 24,
    rating: 4.8,
    reviewCount: 128,
    relatedProductIds: ['prod-002', 'prod-005'],
    modelUrl: '/models/oslo-lounge-chair.glb',
    modelFile: 'oslo-lounge-chair.glb',
    arConfiguration: {
      modelUrl: '/models/oslo-lounge-chair.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -25, z: 0 },
      lightingPreset: 'natural',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-28',
    createdAt: '2026-03-18',
  },

  {
    id: 'prod-002',
    slug: 'haven-velvet-sofa',
    name: 'Haven Velvet Sofa',
    price: 2199,
    currency: 'USD',
    category: 'Seating',
    subcategory: 'Sofas',
    rooms: ['Living Room'],
    tags: ['curved', 'velvet', 'statement', 'modular-look'],
    shortDescription:
      'A curved three-seater in plush velvet with slender cast-metal legs.',
    description:
      'The Haven redefines what a three-seater can be. A single sweeping curve runs from armrest to armrest, softening the silhouette and making conversation easier across the seat. The bench cushion is wrapped in dense, high-resilience foam so it never sags, while the loose back pillows can be plumped or flattened to suit you. Slim cast-metal legs with a polished glide lift the sofa clear of the floor, which makes small rooms breathe. Performance velvet resists stains and fading, and the covers are professionally cleanable.',
    images: [
      { id: 'img-002a', url: '/images/haven-velvet-sofa-1.jpg', alt: 'Haven Velvet Sofa in cobalt blue velvet', isPrimary: true, sortOrder: 0 },
      { id: 'img-002b', url: '/images/haven-velvet-sofa-2.jpg', alt: 'Haven Velvet Sofa available in six velvet colourways', isPrimary: false, sortOrder: 1 },
      { id: 'img-002c', url: '/images/haven-velvet-sofa-3.jpg', alt: 'Haven Velvet Sofa studio lighting detail', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-002a', name: 'Cobalt', type: 'color', value: '#1f3f8f', priceModifier: 0, inStock: true },
      { id: 'var-002b', name: 'Charcoal', type: 'color', value: '#33353a', priceModifier: 0, inStock: true },
      { id: 'var-002c', name: 'Oat', type: 'color', value: '#c9b8a4', priceModifier: 0, inStock: true },
      { id: 'var-002d', name: 'Ivory', type: 'color', value: '#e6e4e0', priceModifier: 80, inStock: true },
      { id: 'var-002e', name: 'Blush', type: 'color', value: '#f2ccd2', priceModifier: 80, inStock: false },
    ],
    specifications: [
      { label: 'Frame', value: 'Kiln-dried hardwood, corner-blocked', group: 'Materials' },
      { label: 'Upholstery', value: 'Performance velvet (removable back covers)', group: 'Materials' },
      { label: 'Cushion', value: 'High-resilience foam core, fibre wrap', group: 'Comfort' },
      { label: 'Legs', value: 'Cast aluminium, polished nickel glide', group: 'Finish' },
      { label: 'Seat Depth', value: '58 cm', group: 'Dimensions' },
      { label: 'Care', value: 'Professional clean, avoid direct sunlight', group: 'Maintenance' },
    ],
    dimensions: { width: 232, height: 78, depth: 96, unit: 'cm' },
    weight: { value: 54, unit: 'kg' },
    material: 'Velvet, aluminium',
    color: 'Cobalt',
    inStock: true,
    stockCount: 11,
    rating: 4.7,
    reviewCount: 203,
    relatedProductIds: ['prod-001', 'prod-004'],
    modelUrl: '/models/haven-velvet-sofa.glb',
    modelFile: 'haven-velvet-sofa.glb',
    arConfiguration: {
      modelUrl: '/models/haven-velvet-sofa.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -35, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: true,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-26',
    createdAt: '2026-04-02',
  },

  {
    id: 'prod-003',
    slug: 'forma-coffee-table',
    name: 'Forma Coffee Table',
    price: 1299,
    currency: 'USD',
    category: 'Tables',
    subcategory: 'Coffee Tables',
    rooms: ['Living Room', 'Dining'],
    tags: ['glass', 'minimal', 'architectural'],
    shortDescription:
      'Floating smoked-glass top on a single continuous polished-steel base.',
    description:
      'The Forma Coffee Table brings architectural precision to the living room. A smoked tempered-glass top appears to float above a single continuous band of polished steel, folded into a low cantilever that keeps sightlines completely open. The lower shelf is cut from the same glass and holds books, trays and remotes without visual weight. Each piece is hand-polished, and the concealed levelling feet keep the table dead-flat on uneven floors.',
    images: [
      { id: 'img-003a', url: '/images/forma-coffee-table-1.jpg', alt: 'Forma Coffee Table with smoked glass top and polished steel base', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-003a', name: 'Smoked / Polished Steel', type: 'finish', value: '#3c4348', priceModifier: 0, inStock: true },
      { id: 'var-003b', name: 'Clear / Polished Steel', type: 'finish', value: '#dfe6e8', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Top', value: '12 mm tempered smoked glass', group: 'Materials' },
      { label: 'Base', value: 'Continuous folded polished steel', group: 'Materials' },
      { label: 'Shelf', value: 'Matching tempered glass lower shelf', group: 'Features' },
      { label: 'Weight Capacity', value: '40 kg distributed', group: 'Details' },
      { label: 'Feet', value: 'Concealed adjustable levellers', group: 'Details' },
      { label: 'Care', value: 'Glass cleaner, microfibre cloth', group: 'Maintenance' },
    ],
    dimensions: { width: 120, height: 35, depth: 65, unit: 'cm' },
    weight: { value: 32, unit: 'kg' },
    material: 'Tempered glass, steel',
    color: 'Smoked Glass',
    inStock: true,
    stockCount: 18,
    rating: 4.6,
    reviewCount: 87,
    relatedProductIds: ['prod-002', 'prod-005'],
    modelUrl: null,
    modelFile: null,
    arConfiguration: null,
    arReady: false,
    qrReady: false,
    lastUpdated: '2026-09-12',
    createdAt: '2026-05-21',
  },

  {
    id: 'prod-004',
    slug: 'luma-globe-lamp',
    name: 'Luma Globe Lamp',
    price: 349,
    currency: 'USD',
    category: 'Lighting',
    subcategory: 'Table Lamps',
    rooms: ['Living Room', 'Bedroom', 'Dining'],
    tags: ['globe', 'iridescent', 'ambient', 'designer'],
    shortDescription:
      'Iridescent glass globe under a deep black drum shade.',
    description:
      'The Luma Globe Lamp pairs an iridescent hand-blown glass globe with a deep black drum shade, so the light spills down over the glass and glows through it at the same time. The result is a warm, low-glare pool of light that is equally at home on a sideboard or a bedside table. A fabric-wrapped cable and a discreet inline dimmer let you move from working light to evening ambience without leaving the chair.',
    images: [
      { id: 'img-004a', url: '/images/luma-globe-lamp-1.jpg', alt: 'Luma Globe Lamp with iridescent glass base and black drum shade', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-004a', name: 'Iridescent / Black', type: 'color', value: '#8f8f96', priceModifier: 0, inStock: true },
      { id: 'var-004b', name: 'Smoke / Black', type: 'color', value: '#4a4a52', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Shade', value: 'Black cotton-blend drum, 34 cm ⌀', group: 'Materials' },
      { label: 'Base', value: 'Hand-blown iridescent glass', group: 'Materials' },
      { label: 'Fitting', value: 'E27, max 60 W (LED recommended)', group: 'Lighting' },
      { label: 'Dimmer', value: 'Inline 3-stage, fabric-wrapped cable', group: 'Features' },
      { label: 'Cable Length', value: '220 cm', group: 'Details' },
      { label: 'Bulb', value: 'Not included', group: 'Details' },
    ],
    dimensions: { width: 34, height: 56, depth: 34, unit: 'cm' },
    weight: { value: 4.6, unit: 'kg' },
    material: 'Glass, steel, cotton',
    color: 'Iridescent / Black',
    inStock: true,
    stockCount: 32,
    rating: 4.5,
    reviewCount: 64,
    relatedProductIds: ['prod-005', 'prod-003'],
    modelUrl: '/models/luma-globe-lamp.glb',
    modelFile: 'luma-globe-lamp.glb',
    arConfiguration: {
      modelUrl: '/models/luma-globe-lamp.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 15, z: 0 },
      lightingPreset: 'dramatic',
      environmentPreset: 'dawn',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-20',
    createdAt: '2026-06-09',
  },

  {
    id: 'prod-005',
    slug: 'mono-silk-pouf',
    name: 'Mono Silk Pouf',
    price: 379,
    currency: 'USD',
    category: 'Seating',
    subcategory: 'Ottomans & Poufs',
    rooms: ['Living Room', 'Bedroom'],
    tags: ['pouf', 'silk', 'hand-finished', 'accent'],
    shortDescription:
      'Hand-gathered silk pouf with a dense, supportive fill.',
    description:
      'The Mono Silk Pouf is a study in restraint and craft. Panels of lustrous silk are hand-gathered toward a single covered button at the centre, creating the deep radial folds that give the piece its character. Inside, a high-density foam core wrapped in fibre keeps the pouf supportive rather than squashy — comfortable as extra seating, a footrest, or a low perch beside the sofa.',
    images: [
      { id: 'img-005a', url: '/images/mono-silk-pouf-1.jpg', alt: 'Mono Silk Pouf in mulberry silk', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-005a', name: 'Mulberry', type: 'color', value: '#b44a6a', priceModifier: 0, inStock: true },
      { id: 'var-005b', name: 'Ink', type: 'color', value: '#2c2f3a', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Cover', value: '100% mulberry silk, hand-gathered', group: 'Materials' },
      { label: 'Fill', value: 'High-density foam core, fibre wrap', group: 'Comfort' },
      { label: 'Detail', value: 'Covered centre button', group: 'Finish' },
      { label: 'Seams', value: 'Reinforced double-stitched', group: 'Construction' },
      { label: 'Care', value: 'Spot clean only, dry clean cover', group: 'Maintenance' },
    ],
    dimensions: { width: 60, height: 36, depth: 60, unit: 'cm' },
    weight: { value: 7.4, unit: 'kg' },
    material: 'Silk, foam',
    color: 'Mulberry',
    inStock: true,
    stockCount: 41,
    rating: 4.9,
    reviewCount: 156,
    relatedProductIds: ['prod-001', 'prod-002'],
    modelUrl: '/models/mono-velvet-pouf.glb',
    modelFile: 'mono-velvet-pouf.glb',
    arConfiguration: {
      modelUrl: '/models/mono-velvet-pouf.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 40, z: 0 },
      lightingPreset: 'natural',
      environmentPreset: 'lobby',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-30',
    createdAt: '2026-07-02',
  },
];

// ─────────────────────────────────────────────
//  STATIC DEMO METRICS
//  One dataset → every number on the dashboard is derived from it.
// ─────────────────────────────────────────────

export const demoProductStats: ProductStats[] = [
  { productId: 'prod-001', productViews: 4120, arViews: 982, qrScans: 1376, purchases: 384 },
  { productId: 'prod-002', productViews: 3180, arViews: 741, qrScans: 1104, purchases: 301 },
  { productId: 'prod-003', productViews: 1490, arViews: 0, qrScans: 0, purchases: 50 },
  { productId: 'prod-004', productViews: 2210, arViews: 566, qrScans: 842, purchases: 198 },
  { productId: 'prod-005', productViews: 2640, arViews: 558, qrScans: 979, purchases: 240 },
];

/** Aggregate demo metrics — always derived, never hard-coded twice. */
export const demoStats = {
  productsSynced: demoProducts.length,
  arReady: demoProducts.filter((p) => p.arReady).length,
  qrReady: demoProducts.filter((p) => p.qrReady).length,
  totalProductViews: demoProductStats.reduce((s, e) => s + e.productViews, 0),
  totalArViews: demoProductStats.reduce((s, e) => s + e.arViews, 0),
  totalQrScans: demoProductStats.reduce((s, e) => s + e.qrScans, 0),
  totalPurchases: demoProductStats.reduce((s, e) => s + e.purchases, 0),
  conversionRate: 0,
};

demoStats.conversionRate = Number(
  ((demoStats.totalPurchases / demoStats.totalProductViews) * 100).toFixed(1),
);

/** Recent activity — an explicitly illustrative sample, not a live feed. */
export const demoActivity: { id: string; productId: string; type: 'qr_scan' | 'ar_view' | 'product_view'; label: string; when: string }[] = [
  { id: 'act-1', productId: 'prod-001', type: 'qr_scan', label: 'QR scanned', when: '2 min ago' },
  { id: 'act-2', productId: 'prod-001', type: 'ar_view', label: 'AR opened', when: '4 min ago' },
  { id: 'act-3', productId: 'prod-005', type: 'ar_view', label: 'AR opened', when: '11 min ago' },
  { id: 'act-4', productId: 'prod-002', type: 'qr_scan', label: 'QR scanned', when: '26 min ago' },
  { id: 'act-5', productId: 'prod-004', type: 'product_view', label: 'Product viewed', when: '41 min ago' },
];

export function getProductStats(productId: string): ProductStats {
  return (
    demoProductStats.find((s) => s.productId === productId) ?? {
      productId,
      productViews: 0,
      arViews: 0,
      qrScans: 0,
      purchases: 0,
    }
  );
}

// ─────────────────────────────────────────────
//  REVIEWS — static demo content
// ─────────────────────────────────────────────

export const demoReviews: Review[] = [
  { id: 'rev-001', productId: 'prod-001', authorName: 'Emily R.', rating: 5, title: 'Stunning chair, worth every penny', body: 'The Oslo is even more beautiful in person. The velvet has a gorgeous sheen and the oak legs are flawlessly finished. Assembly took about 10 minutes. The AR preview was spot-on for sizing — it fit exactly where I planned to put it.', verified: true, helpfulCount: 24, createdAt: '2026-08-12' },
  { id: 'rev-002', productId: 'prod-001', authorName: 'James T.', rating: 4, title: 'Great comfort, slightly firm at first', body: 'Took about a week to break in, but now it is my favourite seat in the house. The rust colour is warm without being loud. Would love a matching ottoman.', verified: true, helpfulCount: 18, createdAt: '2026-07-28' },
  { id: 'rev-003', productId: 'prod-001', authorName: 'Nadia K.', rating: 5, title: 'The AR preview sealed it', body: 'I scanned the QR code in-store, dropped the chair into my living room, and ordered on the spot. Never done that before.', verified: true, helpfulCount: 31, createdAt: '2026-09-04' },
  { id: 'rev-004', productId: 'prod-002', authorName: 'Priya M.', rating: 5, title: 'Best sofa we have ever owned', body: 'We went with cobalt and it is perfect for our front room. The curve makes the whole space feel designed rather than assembled.', verified: true, helpfulCount: 41, createdAt: '2026-09-02' },
  { id: 'rev-005', productId: 'prod-002', authorName: 'Daniel K.', rating: 5, title: 'Seamless delivery, exceptional quality', body: 'We used AR to confirm it would fit through the bay — it saved us from a sizing mistake. Velvet feels durable yet soft.', verified: true, helpfulCount: 33, createdAt: '2026-08-20' },
  { id: 'rev-006', productId: 'prod-002', authorName: 'Sarah L.', rating: 4, title: 'Beautiful, wish it came in more sizes', body: 'Quality is outstanding. Only reason for four stars is that I wish there was a two-seater option for smaller spaces.', verified: false, helpfulCount: 12, createdAt: '2026-07-15' },
  { id: 'rev-007', productId: 'prod-003', authorName: 'Alex W.', rating: 5, title: 'Architectural perfection', body: 'The cantilever base is like a piece of sculpture. Solid and heavy, feels built to last, and the glass edge is perfectly polished.', verified: true, helpfulCount: 29, createdAt: '2026-08-30' },
  { id: 'rev-008', productId: 'prod-003', authorName: 'Nina C.', rating: 4, title: 'Gorgeous, but requires care', body: 'Stunning table. Smoked glass hides fingerprints well, but keep coasters handy. Looks great with the Haven sofa.', verified: true, helpfulCount: 15, createdAt: '2026-08-10' },
  { id: 'rev-009', productId: 'prod-004', authorName: 'Chris H.', rating: 5, title: 'Perfect evening light', body: 'The iridescent globe throws the loveliest reflections across the ceiling on the lowest dimmer setting.', verified: true, helpfulCount: 22, createdAt: '2026-09-08' },
  { id: 'rev-010', productId: 'prod-004', authorName: 'Laura B.', rating: 4, title: 'Elegant and functional', body: 'Looks great on our sideboard. Shade is deeper than it appears in photos, which I actually prefer.', verified: true, helpfulCount: 10, createdAt: '2026-08-25' },
  { id: 'rev-011', productId: 'prod-005', authorName: 'Marcus J.', rating: 5, title: 'Craftsmanship you can feel', body: 'The hand-gathered folds are beautiful and the fill is firm enough to sit on. Bought one, immediately ordered a second.', verified: true, helpfulCount: 37, createdAt: '2026-09-15' },
  { id: 'rev-012', productId: 'prod-005', authorName: 'Olivia P.', rating: 5, title: 'AR preview confirmed the height', body: 'Checked it against the height of our sofa arm in AR before ordering. Perfect match.', verified: false, helpfulCount: 19, createdAt: '2026-09-01' },
];

// ─────────────────────────────────────────────
//  SELECTORS
// ─────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return demoProducts.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return demoProducts.find((p) => p.slug === slug);
}

/** Matches by id OR slug so `/ar/prod-001` and `/ar/oslo-lounge-chair` both work. */
export function findProduct(key: string | undefined): Product | undefined {
  if (!key) return undefined;
  return demoProducts.find((p) => p.id === key || p.slug === key);
}

export function getReviewsForProduct(productId: string): Review[] {
  return demoReviews.filter((r) => r.productId === productId);
}

export function getRelatedProducts(product: Product): Product[] {
  return demoProducts.filter((p) => product.relatedProductIds.includes(p.id));
}

export function getARProducts(): Product[] {
  return demoProducts.filter((p) => p.arReady);
}

export const categories = [
  { name: 'Seating', slug: 'Seating' },
  { name: 'Tables', slug: 'Tables' },
  { name: 'Lighting', slug: 'Lighting' },
];
