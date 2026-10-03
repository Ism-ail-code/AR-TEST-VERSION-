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
  tagline: 'Furniture, appliances and electronics for the modern home',
  description:
    'Casa Living brings modern furniture, kitchen and home appliances and consumer electronics together under one roof. Everything is chosen to last, previewable in your own room in AR before you buy, and delivered free across the continental US.',
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
//  DEPARTMENTS — the storefront navigation.
//  A department is a curated slice of the SAME static catalogue: it matches
//  against `Product.rooms`, so no product object is ever duplicated.
// ─────────────────────────────────────────────

export interface Department {
  label: string;
  /** Value used by the `?dept=` query param and `Product.rooms`. */
  key: string;
  image: string;
  blurb: string;
}

export const departments: Department[] = [
  { label: 'Furniture', key: 'Home', image: '/images/haven-velvet-sofa-1.jpg', blurb: 'Sofas, seating, tables & lighting' },
  { label: 'Electronics', key: 'Electronics', image: '/images/smart-tv-1.jpg', blurb: 'TVs, audio and wearables' },
  { label: 'Appliances', key: 'Appliances', image: '/images/refrigerator-1.jpg', blurb: 'Large and small home machines' },
  { label: 'Kitchen', key: 'Kitchen', image: '/images/air-fryer-1.jpg', blurb: 'Countertop essentials' },
  { label: 'Audio', key: 'Audio', image: '/images/bluetooth-speaker-1.jpg', blurb: 'Speakers and headphones' },
  { label: 'Smart Home', key: 'Smart Home', image: '/images/smartwatch-1.jpg', blurb: 'Connected devices' },
];

/** Departments are stored in `Product.rooms`; these are the room names left over. */
export const departmentKeys: string[] = departments.map((d) => d.key);

// ─────────────────────────────────────────────
//  PRODUCTS — one static source of truth.
//  21 products · 20 AR-ready · 20 QR-ready
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
    rooms: ['Home', 'Living Room', 'Bedroom'],
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
    rooms: ['Home', 'Living Room'],
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
    rooms: ['Home', 'Living Room', 'Dining'],
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
    rooms: ['Home', 'Living Room', 'Bedroom', 'Dining'],
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
    rooms: ['Home', 'Living Room', 'Bedroom'],
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

  // ── Home Appliances ──────────────────────
  {
    id: 'prod-006',
    slug: 'refrigerator',
    name: 'Aurora French-Door Refrigerator',
    price: 1899,
    currency: 'USD',
    category: 'Home Appliances',
    subcategory: 'Refrigerators',
    rooms: ['Appliances', 'Smart Home'],
    tags: ['french-door', 'stainless-steel', 'inverter', 'wifi', 'large-appliance'],
    shortDescription:
      'Counter-depth french-door fridge with a through-the-door dispenser and inverter cooling.',
    description:
      'The Aurora is built around a twin inverter compressor that keeps temperatures within a single degree while running quieter than a conversation. Two doors open onto a full-width fridge cavity with spill-proof tempered-glass shelves and humidity-controlled crispers, while a 96-litre freezer drawer sits underneath. The through-the-door dispenser reads filtered water and ice, and the panel can be controlled from the app or from the touch strip on the door. At 178 cm tall it is a full-size family fridge, and the AR preview makes it easy to check the clearance you need before it ships.',
    images: [
      { id: 'img-006a', url: '/images/refrigerator-1.jpg', alt: 'Aurora French-Door Refrigerator in brushed steel', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-006a', name: 'Brushed Steel', type: 'color', value: '#b8bcc0', priceModifier: 0, inStock: true },
      { id: 'var-006b', name: 'Black Stainless', type: 'color', value: '#2f3236', priceModifier: 120, inStock: true },
      { id: 'var-006c', name: 'Matte White', type: 'color', value: '#eceae6', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Capacity', value: '520 L total (424 L fridge / 96 L freezer)', group: 'Capacity' },
      { label: 'Compressor', value: 'Twin inverter, 36 dB', group: 'Performance' },
      { label: 'Finish', value: 'Anti-fingerprint stainless steel', group: 'Materials' },
      { label: 'Shelving', value: 'Spill-proof tempered glass, slide-under', group: 'Features' },
      { label: 'Water', value: 'Filtered dispenser with crushed ice', group: 'Features' },
      { label: 'Connectivity', value: 'Wi-Fi app control and temperature alerts', group: 'Smart' },
      { label: 'Energy', value: '468 kWh/year', group: 'Details' },
    ],
    dimensions: { width: 90, height: 178, depth: 78, unit: 'cm' },
    weight: { value: 112, unit: 'kg' },
    material: 'Stainless steel, tempered glass',
    color: 'Brushed Steel',
    inStock: true,
    stockCount: 14,
    rating: 4.7,
    reviewCount: 96,
    relatedProductIds: ['prod-007', 'prod-009', 'prod-018'],
    modelUrl: '/models/refrigerator.glb',
    modelFile: 'refrigerator.glb',
    arConfiguration: {
      modelUrl: '/models/refrigerator.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -25, z: 0 },
      lightingPreset: 'natural',
      environmentPreset: 'apartment',
      backgroundBlur: true,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-10-01',
    createdAt: '2026-03-05',
  },

  {
    id: 'prod-007',
    slug: 'washing-machine',
    name: 'Verve Front-Load Washing Machine',
    price: 949,
    currency: 'USD',
    category: 'Home Appliances',
    subcategory: 'Washing Machines',
    rooms: ['Appliances'],
    tags: ['front-load', 'inverter', 'steam', 'large-appliance'],
    shortDescription:
      '8 kg front-loader with a steam cycle and a brushless inverter drum.',
    description:
      'The Verve washes with a 1400 rpm brushless inverter motor that cuts both energy use and the vibration you feel through the floor. Thirteen programmes cover everything from a fifteen-minute refresh to a full steam cycle that relaxes fibres and reduces creases, and the automatic dose dispenser releases exactly the right amount of detergent for the load. The stainless drum is patterned to be gentle on knits while still shifting heavy bedding, and the door opens a full 180° for easy loading.',
    images: [
      { id: 'img-007a', url: '/images/washing-machine-1.jpg', alt: 'Verve Front-Load Washing Machine in arctic white', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-007a', name: 'Arctic White', type: 'color', value: '#f2f1ee', priceModifier: 0, inStock: true },
      { id: 'var-007b', name: 'Graphite', type: 'color', value: '#4a4d51', priceModifier: 80, inStock: true },
    ],
    specifications: [
      { label: 'Capacity', value: '8 kg wash / 6 kg dry', group: 'Capacity' },
      { label: 'Motor', value: 'Brushless inverter, 1400 rpm', group: 'Performance' },
      { label: 'Programmes', value: '13 including steam refresh', group: 'Features' },
      { label: 'Dispenser', value: 'Automatic detergent dosing', group: 'Features' },
      { label: 'Noise', value: '47 wash / 72 spin', group: 'Details' },
      { label: 'Energy', value: 'A-rated, 49 kWh/100 cycles', group: 'Details' },
    ],
    dimensions: { width: 60, height: 88, depth: 65, unit: 'cm' },
    weight: { value: 74, unit: 'kg' },
    material: 'Stainless steel, ABS',
    color: 'Arctic White',
    inStock: true,
    stockCount: 21,
    rating: 4.6,
    reviewCount: 78,
    relatedProductIds: ['prod-006', 'prod-010', 'prod-016'],
    modelUrl: '/models/washing-machine.glb',
    modelFile: 'washing-machine.glb',
    arConfiguration: {
      modelUrl: '/models/washing-machine.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -30, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-30',
    createdAt: '2026-03-12',
  },

  {
    id: 'prod-008',
    slug: 'air-conditioner',
    name: 'Breeze Inverter Air Conditioner',
    price: 629,
    currency: 'USD',
    category: 'Home Appliances',
    subcategory: 'Air Conditioners',
    rooms: ['Appliances', 'Smart Home'],
    tags: ['split', 'inverter', 'quiet', 'wifi', 'wall-unit'],
    shortDescription:
      'Wall-mounted split unit that holds a room at one temperature without cycling.',
    description:
      'The Breeze is a 12,000 BTU split system built around a DC inverter compressor, so instead of switching on and off it eases up and down and keeps the room within half a degree of where you set it. The indoor unit is deliberately shallow at 31 cm and finishes flush against the wall, with a wide louver that throws air across the ceiling rather than straight at you. A washable filter, a self-draining dry mode and app control for scheduling and geofencing round it off.',
    images: [
      { id: 'img-008a', url: '/images/air-conditioner-1.jpg', alt: 'Breeze Inverter Air Conditioner wall unit in polar white', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-008a', name: 'Polar White', type: 'color', value: '#f4f3f0', priceModifier: 0, inStock: true },
      { id: 'var-008b', name: 'Silver', type: 'color', value: '#cfd2d4', priceModifier: 40, inStock: true },
    ],
    specifications: [
      { label: 'Cooling', value: '12,000 BTU/h — up to 35 m²', group: 'Performance' },
      { label: 'Compressor', value: 'DC inverter, 19 dB quiet mode', group: 'Performance' },
      { label: 'Refrigerant', value: 'R32, low global-warming potential', group: 'Details' },
      { label: 'Airflow', value: '4-way louver with ceiling throw', group: 'Features' },
      { label: 'Filter', value: 'Washable anti-bacterial mesh', group: 'Maintenance' },
      { label: 'Connectivity', value: 'Wi-Fi scheduling and geofencing', group: 'Smart' },
    ],
    dimensions: { width: 86, height: 31, depth: 34, unit: 'cm' },
    weight: { value: 11.5, unit: 'kg' },
    material: 'ABS, aluminium',
    color: 'Polar White',
    inStock: true,
    stockCount: 27,
    rating: 4.5,
    reviewCount: 63,
    relatedProductIds: ['prod-011', 'prod-006', 'prod-021'],
    modelUrl: '/models/air-conditioner.glb',
    modelFile: 'air-conditioner.glb',
    arConfiguration: {
      modelUrl: '/models/air-conditioner.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 1.8, z: 0 },
      rotation: { x: 0, y: -15, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-27',
    createdAt: '2026-03-24',
  },

  {
    id: 'prod-009',
    slug: 'microwave-oven',
    name: 'Nova Countertop Microwave Oven',
    price: 279,
    currency: 'USD',
    category: 'Home Appliances',
    subcategory: 'Microwave Ovens',
    rooms: ['Appliances', 'Kitchen'],
    tags: ['countertop', 'convection', 'stainless', 'compact'],
    shortDescription:
      '25 L convection microwave with a grill element and a dial-and-touch control strip.',
    description:
      'The Nova combines a 1000 W microwave with a convection fan and a quartz grill, so it browns a pie as easily as it reheats coffee. Ten power levels are selected with the dial and confirmed on the touch strip, and six one-touch programmes handle the everyday jobs — popcorn, defrost by weight, reheating a plate, and a keep-warm setting that holds food at serving temperature for up to an hour. The 25-litre cavity takes a full dinner plate with room to spare, and the stainless finish wipes clean.',
    images: [
      { id: 'img-009a', url: '/images/microwave-oven-1.jpg', alt: 'Nova Countertop Microwave Oven in stainless steel', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-009a', name: 'Stainless Steel', type: 'color', value: '#b9bdc1', priceModifier: 0, inStock: true },
      { id: 'var-009b', name: 'Black', type: 'color', value: '#26282b', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Capacity', value: '25 L', group: 'Capacity' },
      { label: 'Power', value: '1000 W microwave / 1500 W convection', group: 'Performance' },
      { label: 'Modes', value: 'Microwave, grill, convection, combination', group: 'Features' },
      { label: 'Controls', value: 'Rotary dial with capacitive touch strip', group: 'Features' },
      { label: 'Turntable', value: '31 cm rolling-ring glass', group: 'Details' },
      { label: 'Safety', value: 'Child lock, cavity light', group: 'Details' },
    ],
    dimensions: { width: 50, height: 33, depth: 41, unit: 'cm' },
    weight: { value: 13.2, unit: 'kg' },
    material: 'Stainless steel, tempered glass',
    color: 'Stainless Steel',
    inStock: true,
    stockCount: 44,
    rating: 4.6,
    reviewCount: 141,
    relatedProductIds: ['prod-014', 'prod-015', 'prod-017'],
    modelUrl: '/models/microwave-oven.glb',
    modelFile: 'microwave-oven.glb',
    arConfiguration: {
      modelUrl: '/models/microwave-oven.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -28, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-24',
    createdAt: '2026-04-08',
  },

  {
    id: 'prod-010',
    slug: 'vacuum-cleaner',
    name: 'Halo Cordless Stick Vacuum',
    price: 429,
    currency: 'USD',
    category: 'Home Appliances',
    subcategory: 'Vacuum Cleaners',
    rooms: ['Appliances'],
    tags: ['cordless', 'stick', 'hepa', 'lightweight'],
    shortDescription:
      '2.9 kg cordless stick with a hair-tangling brush bar and 60 minutes of runtime.',
    description:
      'The Halo puts its motor and bin at your hand, which is why it only weighs 2.9 kg once lifted. A five-layer HEPA path traps 99.97% of particles down to 0.3 microns and seals them in the bin, so emptying is a one-button job over the bin rather than a cloud of dust. The anti-tangle brush bar is shaped to move hair toward the centre instead of winding it around the roller, and the digital motor gives you three suction levels plus an eco mode that stretches the battery to a full hour.',
    images: [
      { id: 'img-010a', url: '/images/vacuum-cleaner-1.jpg', alt: 'Halo Cordless Stick Vacuum in titanium', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-010a', name: 'Titanium', type: 'color', value: '#6f7377', priceModifier: 0, inStock: true },
      { id: 'var-010b', name: 'Coral', type: 'color', value: '#d1573f', priceModifier: 0, inStock: true },
      { id: 'var-010c', name: 'Mint', type: 'color', value: '#7fb3a3', priceModifier: 0, inStock: false },
    ],
    specifications: [
      { label: 'Runtime', value: '60 min eco / 12 min boost', group: 'Performance' },
      { label: 'Filtration', value: '5-stage sealed HEPA 13', group: 'Performance' },
      { label: 'Bin', value: '0.77 L hygienic point-and-shoot', group: 'Capacity' },
      { label: 'Brush bar', value: 'Anti-tangle soft-fluff roller', group: 'Features' },
      { label: 'Weight', value: '2.9 kg in hand', group: 'Details' },
      { label: 'Charge', value: 'Wall dock, 3.5 h full', group: 'Details' },
    ],
    dimensions: { width: 27, height: 127, depth: 38, unit: 'cm' },
    weight: { value: 2.9, unit: 'kg' },
    material: 'ABS, aluminium, HEPA',
    color: 'Titanium',
    inStock: true,
    stockCount: 62,
    rating: 4.7,
    reviewCount: 212,
    relatedProductIds: ['prod-007', 'prod-011', 'prod-006'],
    modelUrl: '/models/vacuum-cleaner.glb',
    modelFile: 'vacuum-cleaner.glb',
    arConfiguration: {
      modelUrl: '/models/vacuum-cleaner.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -35, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-25',
    createdAt: '2026-04-16',
  },

  {
    id: 'prod-011',
    slug: 'standing-fan',
    name: 'Zephyr Tower Standing Fan',
    price: 149,
    currency: 'USD',
    category: 'Home Appliances',
    subcategory: 'Fans',
    rooms: ['Appliances'],
    tags: ['pedestal', 'oscillating', 'quiet', 'bladeless-look'],
    shortDescription:
      '139 cm pedestal fan with a sealed guard, remote and a 12-hour timer.',
    description:
      'The Zephyr moves air with a wide, slow sweep rather than a narrow blast, which is what makes it comfortable to sit in front of for a whole evening. The three-speed motor runs at 42 dB on the lowest setting, the head oscillates through 90°, and a 12-hour timer lets it shut itself off overnight. The guard is a single sealed piece that lifts off for washing, and the weighted base keeps it upright on hard floors without needing to be bolted down.',
    images: [
      { id: 'img-011a', url: '/images/standing-fan-1.jpg', alt: 'Zephyr Tower Standing Fan in matte white', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-011a', name: 'Matte White', type: 'color', value: '#f0efec', priceModifier: 0, inStock: true },
      { id: 'var-011b', name: 'Charcoal', type: 'color', value: '#35383b', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Height', value: 'Adjustable 112–139 cm', group: 'Dimensions' },
      { label: 'Speeds', value: '3 plus natural and sleep modes', group: 'Performance' },
      { label: 'Noise', value: '42 dB on lowest speed', group: 'Details' },
      { label: 'Oscillation', value: '90° with manual tilt', group: 'Features' },
      { label: 'Controls', value: 'Top panel plus infrared remote', group: 'Features' },
      { label: 'Timer', value: '1–12 hours', group: 'Features' },
    ],
    dimensions: { width: 39, height: 139, depth: 40, unit: 'cm' },
    weight: { value: 4.6, unit: 'kg' },
    material: 'ABS, steel',
    color: 'Matte White',
    inStock: true,
    stockCount: 58,
    rating: 4.4,
    reviewCount: 118,
    relatedProductIds: ['prod-008', 'prod-010', 'prod-016'],
    modelUrl: '/models/standing-fan.glb',
    modelFile: 'standing-fan.glb',
    arConfiguration: {
      modelUrl: '/models/standing-fan.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -20, z: 0 },
      lightingPreset: 'natural',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-21',
    createdAt: '2026-05-02',
  },

  // ── Kitchen Appliances ───────────────────
  {
    id: 'prod-012',
    slug: 'juicer',
    name: 'Citrus Slow Juicer',
    price: 179,
    currency: 'USD',
    category: 'Kitchen Appliances',
    subcategory: 'Juicers',
    rooms: ['Kitchen'],
    tags: ['cold-press', 'citrus', 'quiet', 'countertop'],
    shortDescription:
      'Cold-press juicer that squeezes at 45 rpm to keep heat and foam out of the glass.',
    description:
      'Where a centrifugal juicer tears fruit apart at thousands of revolutions a minute, the Citrus turns at 45 rpm and presses it. Less heat and less air whipped into the juice means it separates more slowly and keeps its colour through the morning. The stainless filter handles soft fruit and leafy greens alike, the 1-litre jug pours from a spout that will not dribble down the side, and every part that touches food lifts out and rinses clean in seconds.',
    images: [
      { id: 'img-012a', url: '/images/juicer-1.jpg', alt: 'Citrus Slow Juicer in brushed steel with glass jug', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-012a', name: 'Brushed Steel', type: 'color', value: '#b4b8bc', priceModifier: 0, inStock: true },
      { id: 'var-012b', name: 'Cream', type: 'color', value: '#e7e1d5', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Speed', value: '45 rpm cold-press auger', group: 'Performance' },
      { label: 'Jug', value: '1 L borosilicate glass with pour spout', group: 'Capacity' },
      { label: 'Filter', value: 'Stainless micro-mesh, two densities', group: 'Materials' },
      { label: 'Noise', value: '62 dB', group: 'Details' },
      { label: 'Cleaning', value: 'Tool-free, dishwasher-safe parts', group: 'Maintenance' },
      { label: 'Motor', value: '200 W induction, overheat cut-out', group: 'Performance' },
    ],
    dimensions: { width: 22, height: 49, depth: 40, unit: 'cm' },
    weight: { value: 5.2, unit: 'kg' },
    material: 'Stainless steel, Tritan',
    color: 'Brushed Steel',
    inStock: true,
    stockCount: 47,
    rating: 4.5,
    reviewCount: 87,
    relatedProductIds: ['prod-013', 'prod-015', 'prod-016'],
    modelUrl: '/models/juicer.glb',
    modelFile: 'juicer.glb',
    arConfiguration: {
      modelUrl: '/models/juicer.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -32, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-29',
    createdAt: '2026-05-09',
  },

  {
    id: 'prod-013',
    slug: 'blender',
    name: 'Velocity High-Speed Blender',
    price: 219,
    currency: 'USD',
    category: 'Kitchen Appliances',
    subcategory: 'Blenders',
    rooms: ['Kitchen'],
    tags: ['high-speed', 'glass-jar', 'smoothie', 'countertop'],
    shortDescription:
      '2.0 peak-horsepower blender with a tapered glass jar and four preset programmes.',
    description:
      'The Velocity spins a six-wing stainless blade at 28,000 rpm inside a tapered glass jar, which is enough to take frozen fruit, ice and greens down to a completely smooth pour without leaving grit at the bottom. Four presets — smoothie, ice crush, hot soup and self-clean — run the motor through a programmed pattern, and a variable speed dial takes over when you want to fold rather than puree. The jar is borosilicate, so it will not craze after a hot soup cycle, and the lid seals under the handle.',
    images: [
      { id: 'img-013a', url: '/images/blender-1.jpg', alt: 'Velocity High-Speed Blender with glass jar', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-013a', name: 'Graphite', type: 'color', value: '#3c4044', priceModifier: 0, inStock: true },
      { id: 'var-013b', name: 'White', type: 'color', value: '#f1efec', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Motor', value: '2.0 peak HP, 28,000 rpm', group: 'Performance' },
      { label: 'Jar', value: '1.8 L borosilicate glass, tapered', group: 'Capacity' },
      { label: 'Blades', value: 'Six-wing hardened stainless', group: 'Materials' },
      { label: 'Programmes', value: 'Smoothie, ice crush, soup, self-clean', group: 'Features' },
      { label: 'Controls', value: 'Variable dial plus pulse', group: 'Features' },
      { label: 'Noise', value: '78 dB at full speed', group: 'Details' },
    ],
    dimensions: { width: 24, height: 46, depth: 21, unit: 'cm' },
    weight: { value: 4.4, unit: 'kg' },
    material: 'Tritan, stainless steel, borosilicate glass',
    color: 'Graphite',
    inStock: true,
    stockCount: 39,
    rating: 4.7,
    reviewCount: 164,
    relatedProductIds: ['prod-012', 'prod-014', 'prod-015'],
    modelUrl: '/models/blender.glb',
    modelFile: 'blender.glb',
    arConfiguration: {
      modelUrl: '/models/blender.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -30, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-28',
    createdAt: '2026-05-14',
  },

  {
    id: 'prod-014',
    slug: 'air-fryer',
    name: 'Crisp Digital Air Fryer',
    price: 189,
    currency: 'USD',
    category: 'Kitchen Appliances',
    subcategory: 'Air Fryers',
    rooms: ['Kitchen'],
    tags: ['air-fryer', 'digital', 'family-size', 'countertop'],
    shortDescription:
      '5.5 L digital air fryer with eight programmes and a dishwasher-safe basket.',
    description:
      'The Crisp circulates air at 200 °C around a 5.5-litre basket, which is enough for four portions of chips or a whole tray of chicken thighs in one go. Eight programmes cover the everyday jobs and hand off to a shake reminder halfway through, so nothing sits against the wall of the basket and goes pale. The basket pulls out on a single handle, the non-stick coating is ceramic rather than PTFE, and both tray and basket are dishwasher-safe. It replaces a deep fryer, and most weeks a full oven too.',
    images: [
      { id: 'img-014a', url: '/images/air-fryer-1.jpg', alt: 'Crisp Digital Air Fryer in matte black', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-014a', name: 'Matte Black', type: 'color', value: '#232527', priceModifier: 0, inStock: true },
      { id: 'var-014b', name: 'Ivory', type: 'color', value: '#eae6df', priceModifier: 20, inStock: true },
    ],
    specifications: [
      { label: 'Capacity', value: '5.5 L basket — 4 portions', group: 'Capacity' },
      { label: 'Power', value: '1700 W, 80–200 °C', group: 'Performance' },
      { label: 'Programmes', value: '8 including dehydrate and reheat', group: 'Features' },
      { label: 'Coating', value: 'Ceramic non-stick, PTFE-free', group: 'Materials' },
      { label: 'Cleaning', value: 'Dishwasher-safe basket and tray', group: 'Maintenance' },
      { label: 'Safety', value: 'Auto-pause on basket removal', group: 'Details' },
    ],
    dimensions: { width: 30, height: 36, depth: 44, unit: 'cm' },
    weight: { value: 6.1, unit: 'kg' },
    material: 'ABS, ceramic-coated steel',
    color: 'Matte Black',
    inStock: true,
    stockCount: 73,
    rating: 4.8,
    reviewCount: 341,
    relatedProductIds: ['prod-017', 'prod-009', 'prod-013'],
    modelUrl: '/models/air-fryer.glb',
    modelFile: 'air-fryer.glb',
    arConfiguration: {
      modelUrl: '/models/air-fryer.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -28, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-10-01',
    createdAt: '2026-05-20',
  },

  {
    id: 'prod-015',
    slug: 'coffee-maker',
    name: 'Brew Drip Coffee Maker',
    price: 159,
    currency: 'USD',
    category: 'Kitchen Appliances',
    subcategory: 'Coffee Makers',
    rooms: ['Kitchen'],
    tags: ['drip', 'carafe', 'programmable', 'countertop'],
    shortDescription:
      'Ten-cup drip machine with a bloom cycle, thermal carafe and a 24-hour timer.',
    description:
      'Brew temperature is the whole argument with drip coffee, and the Brew holds the showerhead at 93 °C from the first pour to the last. It pre-infuses the grounds for thirty seconds so they bloom evenly before the main cycle, then feeds water through at a rate that extracts without channeling. The double-walled thermal carafe keeps coffee at drinking temperature for two hours without a hotplate scorching it, and the timer lets you wake up to a finished pot.',
    images: [
      { id: 'img-015a', url: '/images/coffee-maker-1.jpg', alt: 'Brew Drip Coffee Maker with thermal carafe', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-015a', name: 'Stainless / Black', type: 'color', value: '#b0b4b8', priceModifier: 0, inStock: true },
      { id: 'var-015b', name: 'All Black', type: 'color', value: '#2a2c2f', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Capacity', value: '10 cups (1.4 L)', group: 'Capacity' },
      { label: 'Brew', value: '93 °C, 30-second bloom pre-infusion', group: 'Performance' },
      { label: 'Carafe', value: 'Double-wall thermal, no hotplate', group: 'Materials' },
      { label: 'Timer', value: '24-hour programmable start', group: 'Features' },
      { label: 'Filter', value: 'Permanent stainless mesh, no papers', group: 'Features' },
      { label: 'Cleaning', value: 'Descaling alert, removable reservoir', group: 'Maintenance' },
    ],
    dimensions: { width: 20, height: 44, depth: 33, unit: 'cm' },
    weight: { value: 3.8, unit: 'kg' },
    material: 'Stainless steel, borosilicate glass',
    color: 'Stainless / Black',
    inStock: true,
    stockCount: 51,
    rating: 4.6,
    reviewCount: 176,
    relatedProductIds: ['prod-016', 'prod-013', 'prod-017'],
    modelUrl: '/models/coffee-maker.glb',
    modelFile: 'coffee-maker.glb',
    arConfiguration: {
      modelUrl: '/models/coffee-maker.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -34, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-26',
    createdAt: '2026-06-01',
  },

  {
    id: 'prod-016',
    slug: 'electric-kettle',
    name: 'Halo Variable-Temperature Kettle',
    price: 99,
    currency: 'USD',
    category: 'Kitchen Appliances',
    subcategory: 'Electric Kettles',
    rooms: ['Kitchen'],
    tags: ['variable-temperature', 'glass', 'keep-warm', 'countertop'],
    shortDescription:
      '1.7 L kettle with five temperature presets and a one-hour keep-warm hold.',
    description:
      'Green tea wants 80 °C, French press wants 94 °C, and boiling is only right for one of them. The Halo has five presets on a base that holds temperature for an hour, so you are not waiting for a reboil between brews. The body is a single sheet of stainless steel with a glass water window on the front, the lid opens fully for filling and cleaning, and the interior has no seams or plastic threads where limescale can build up.',
    images: [
      { id: 'img-016a', url: '/images/electric-kettle-1.jpg', alt: 'Halo Variable-Temperature Kettle in polished steel', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-016a', name: 'Polished Steel', type: 'color', value: '#c2c6ca', priceModifier: 0, inStock: true },
      { id: 'var-016b', name: 'Matte Black', type: 'color', value: '#2b2d30', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Capacity', value: '1.7 L', group: 'Capacity' },
      { label: 'Presets', value: '60 / 70 / 80 / 90 / 100 °C', group: 'Features' },
      { label: 'Hold', value: 'Keep-warm for 60 minutes', group: 'Features' },
      { label: 'Power', value: '2200 W, full boil in 4 minutes', group: 'Performance' },
      { label: 'Interior', value: 'Seamless 304 stainless, no plastic', group: 'Materials' },
      { label: 'Safety', value: 'Auto shut-off, boil-dry protection', group: 'Details' },
    ],
    dimensions: { width: 18, height: 29, depth: 28, unit: 'cm' },
    weight: { value: 1.4, unit: 'kg' },
    material: 'Stainless steel, glass',
    color: 'Polished Steel',
    inStock: true,
    stockCount: 88,
    rating: 4.5,
    reviewCount: 203,
    relatedProductIds: ['prod-015', 'prod-012', 'prod-017'],
    modelUrl: '/models/electric-kettle.glb',
    modelFile: 'electric-kettle.glb',
    arConfiguration: {
      modelUrl: '/models/electric-kettle.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -60, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-23',
    createdAt: '2026-06-07',
  },

  {
    id: 'prod-017',
    slug: 'toaster',
    name: 'Slice 2-Slice Toaster',
    price: 89,
    currency: 'USD',
    category: 'Kitchen Appliances',
    subcategory: 'Toasters',
    rooms: ['Kitchen'],
    tags: ['two-slice', 'stainless', 'wide-slot', 'countertop'],
    shortDescription:
      'Wide-slot two-slice toaster with a high-lift carriage and seven browning steps.',
    description:
      'The Slice uses two quartz elements rather than a wire grid, which browns bread evenly from crust to crust instead of striping it. Seven browning steps are set on a single dial, the extra-wide slots take a thick-cut slice or a bagel without crushing it, and the carriage lifts high enough to pick out a smaller piece without fishing for it. A pull-out crumb tray makes the weekly clean a one-handed job.',
    images: [
      { id: 'img-017a', url: '/images/toaster-1.jpg', alt: 'Slice 2-Slice Toaster in stainless steel', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-017a', name: 'Stainless Steel', type: 'color', value: '#bcc0c4', priceModifier: 0, inStock: true },
      { id: 'var-017b', name: 'Cream', type: 'color', value: '#e8e2d6', priceModifier: 0, inStock: true },
      { id: 'var-017c', name: 'Sage', type: 'color', value: '#9fae9b', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Slots', value: '2 extra-wide, 38 mm', group: 'Capacity' },
      { label: 'Elements', value: 'Twin quartz with even-heat control', group: 'Performance' },
      { label: 'Browning', value: '7 steps plus bagel and reheat', group: 'Features' },
      { label: 'Lift', value: 'High-lift carriage for small slices', group: 'Features' },
      { label: 'Cleaning', value: 'Slide-out crumb tray', group: 'Maintenance' },
      { label: 'Cable', value: '0.9 m, rear storage wrap', group: 'Details' },
    ],
    dimensions: { width: 32, height: 22, depth: 20, unit: 'cm' },
    weight: { value: 2.1, unit: 'kg' },
    material: 'Stainless steel, ABS',
    color: 'Stainless Steel',
    inStock: true,
    stockCount: 66,
    rating: 4.4,
    reviewCount: 129,
    relatedProductIds: ['prod-014', 'prod-015', 'prod-016'],
    modelUrl: '/models/toaster.glb',
    modelFile: 'toaster.glb',
    arConfiguration: {
      modelUrl: '/models/toaster.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -30, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-19',
    createdAt: '2026-06-15',
  },

  // ── Consumer Electronics ─────────────────
  {
    id: 'prod-018',
    slug: 'smart-tv',
    name: 'Vista 55" QLED Smart TV',
    price: 1099,
    currency: 'USD',
    category: 'Televisions',
    subcategory: 'Smart TVs',
    rooms: ['Electronics', 'Smart Home'],
    tags: ['4k', 'qled', 'smart-tv', '120hz', 'wall-mount'],
    shortDescription:
      '55-inch 4K QLED panel with a 120 Hz refresh rate and a near-bezel-free aluminium frame.',
    description:
      'The Vista uses a quantum-dot layer over a full-array backlight, so bright scenes hold their colour instead of washing to grey. A 120 Hz panel with game-mode passthrough keeps fast motion readable, and Dolby Vision and HDR10+ are both supported. The chassis is 13 mm deep at its thinnest with a satin aluminium frame, it wall-mounts on a standard VESA bracket, and the smart interface runs streaming apps directly with voice search built into the remote. At 124 cm wide it dominates a wall, and the AR preview is the easiest way to judge that before it arrives.',
    images: [
      { id: 'img-018a', url: '/images/smart-tv-1.jpg', alt: 'Vista 55 inch QLED Smart TV on its pedestal stand', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-018a', name: 'Graphite', type: 'color', value: '#2e3033', priceModifier: 0, inStock: true },
      { id: 'var-018b', name: 'Silver', type: 'color', value: '#c9ccce', priceModifier: 60, inStock: true },
    ],
    specifications: [
      { label: 'Panel', value: '55" 4K UHD quantum-dot LED, 120 Hz', group: 'Display' },
      { label: 'HDR', value: 'Dolby Vision, HDR10+, HLG', group: 'Display' },
      { label: 'Brightness', value: '1000 nits peak, full-array backlight', group: 'Display' },
      { label: 'Audio', value: '2 × 15 W Dolby Atmos speakers', group: 'Audio' },
      { label: 'Inputs', value: '4 × HDMI 2.1 (2 × 4K120), 2 × USB', group: 'Connectivity' },
      { label: 'Mount', value: 'VESA 300 × 300, pedestal included', group: 'Installation' },
    ],
    dimensions: { width: 124, height: 78, depth: 13, unit: 'cm' },
    weight: { value: 16.8, unit: 'kg' },
    material: 'Aluminium, QLED panel',
    color: 'Graphite',
    inStock: true,
    stockCount: 19,
    rating: 4.8,
    reviewCount: 254,
    relatedProductIds: ['prod-019', 'prod-020', 'prod-021'],
    modelUrl: '/models/smart-tv.glb',
    modelFile: 'smart-tv.glb',
    arConfiguration: {
      modelUrl: '/models/smart-tv.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -20, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'apartment',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-10-02',
    createdAt: '2026-06-22',
  },

  {
    id: 'prod-019',
    slug: 'bluetooth-speaker',
    name: 'Pulse Portable Bluetooth Speaker',
    price: 129,
    currency: 'USD',
    category: 'Audio',
    subcategory: 'Bluetooth Speakers',
    rooms: ['Electronics', 'Audio'],
    tags: ['portable', 'bluetooth', 'waterproof', 'bass'],
    shortDescription:
      'Cylindrical 40 cm speaker with passive radiators at both ends and an IP67 shell.',
    description:
      'The Pulse is tuned around two passive radiators — one at each end — which is why a speaker this size can push real low end without a port rattling. Bluetooth 5.3 holds two devices at once and switches between them automatically, the fabric shell is rated IP67 so it survives a poolside drop, and the 18-hour battery charges over USB-C with a quick top-up giving three hours of play. Pair two in stereo for a wider stage.',
    images: [
      { id: 'img-019a', url: '/images/bluetooth-speaker-1.jpg', alt: 'Pulse Portable Bluetooth Speaker in midnight fabric', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-019a', name: 'Midnight', type: 'color', value: '#232629', priceModifier: 0, inStock: true },
      { id: 'var-019b', name: 'Ocean', type: 'color', value: '#2b6f8f', priceModifier: 0, inStock: true },
      { id: 'var-019c', name: 'Sand', type: 'color', value: '#cdbfa6', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Driver', value: '2 × 48 mm full-range + twin passive radiators', group: 'Audio' },
      { label: 'Output', value: '30 W RMS', group: 'Audio' },
      { label: 'Battery', value: '18 hours at 50% volume', group: 'Battery' },
      { label: 'Bluetooth', value: '5.3 with multipoint and LE Audio', group: 'Connectivity' },
      { label: 'Rating', value: 'IP67 dust and water proof', group: 'Details' },
      { label: 'Pairing', value: 'Stereo pairing across two units', group: 'Features' },
    ],
    dimensions: { width: 40, height: 16, depth: 16, unit: 'cm' },
    weight: { value: 0.9, unit: 'kg' },
    material: 'Silicone, acoustic mesh',
    color: 'Midnight',
    inStock: true,
    stockCount: 94,
    rating: 4.7,
    reviewCount: 388,
    relatedProductIds: ['prod-020', 'prod-018', 'prod-021'],
    modelUrl: '/models/bluetooth-speaker.glb',
    modelFile: 'bluetooth-speaker.glb',
    arConfiguration: {
      modelUrl: '/models/bluetooth-speaker.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 0.9, z: 0 },
      rotation: { x: 0, y: -35, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: false,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-30',
    createdAt: '2026-07-08',
  },

  {
    id: 'prod-020',
    slug: 'wireless-headphones',
    name: 'Aura Wireless Headphones',
    price: 249,
    currency: 'USD',
    category: 'Audio',
    subcategory: 'Over-Ear Headphones',
    rooms: ['Electronics', 'Audio'],
    tags: ['over-ear', 'anc', 'noise-cancelling', 'wireless'],
    shortDescription:
      'Aluminium over-ear headphones with adaptive noise cancelling and 40-hour battery.',
    description:
      'The Aura uses eight microphones to read the room and cancel it in real time, with a wind-reduction mode that stops the low rumble on a platform. The drivers are 40 mm bio-cellulose diaphragms tuned warm rather than bass-heavy, memory-foam pads clamp lightly enough for a long flight, and the battery runs 40 hours with cancelling on — or 55 hours off. Multipoint pairing keeps a laptop and a phone connected, and a 10-minute charge returns five hours of playback.',
    images: [
      { id: 'img-020a', url: '/images/wireless-headphones-1.jpg', alt: 'Aura Wireless Headphones in charcoal', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-020a', name: 'Charcoal', type: 'color', value: '#34373a', priceModifier: 0, inStock: true },
      { id: 'var-020b', name: 'Ivory', type: 'color', value: '#e9e6e0', priceModifier: 0, inStock: true },
      { id: 'var-020c', name: 'Blush', type: 'color', value: '#e0b7b7', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Drivers', value: '40 mm bio-cellulose', group: 'Audio' },
      { label: 'Cancellation', value: 'Adaptive ANC, 8-microphone array', group: 'Audio' },
      { label: 'Battery', value: '40 h ANC on / 55 h off', group: 'Battery' },
      { label: 'Bluetooth', value: '5.3 multipoint, LDAC, AAC', group: 'Connectivity' },
      { label: 'Controls', value: 'Right-cup touch, physical power', group: 'Features' },
      { label: 'Weight', value: '268 g', group: 'Details' },
    ],
    dimensions: { width: 26, height: 17, depth: 10, unit: 'cm' },
    weight: { value: 0.28, unit: 'kg' },
    material: 'Aluminium, memory foam',
    color: 'Charcoal',
    inStock: true,
    stockCount: 57,
    rating: 4.8,
    reviewCount: 472,
    relatedProductIds: ['prod-019', 'prod-018', 'prod-021'],
    modelUrl: '/models/wireless-headphones.glb',
    modelFile: 'wireless-headphones.glb',
    arConfiguration: {
      modelUrl: '/models/wireless-headphones.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 1.1, z: 0 },
      rotation: { x: 0, y: -30, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: true,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-09-29',
    createdAt: '2026-07-15',
  },

  {
    id: 'prod-021',
    slug: 'smartwatch',
    name: 'Pulse Smartwatch',
    price: 299,
    currency: 'USD',
    category: 'Wearables',
    subcategory: 'Smartwatches',
    rooms: ['Electronics', 'Smart Home'],
    tags: ['smartwatch', 'fitness', 'amoled', 'gps', 'wearable'],
    shortDescription:
      'AMOLED smartwatch with GPS, sleep tracking and a five-day battery.',
    description:
      'The Pulse packs dual-band GPS, an optical heart sensor and a blood-oxygen reader into an 11 mm aluminium case, and still runs five days between charges. The 1.8-inch AMOLED is bright enough to read outdoors and always-on when you want it, the rotating crown scrolls lists without covering the screen, and the strap loop is sized so it sits flat rather than standing proud of the wrist. Workout detection starts on its own, and the sleep report breaks the night into stages with a recovery score in the morning.',
    images: [
      { id: 'img-021a', url: '/images/smartwatch-1.jpg', alt: 'Pulse Smartwatch in midnight with silicone strap', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 'var-021a', name: 'Midnight', type: 'color', value: '#232629', priceModifier: 0, inStock: true },
      { id: 'var-021b', name: 'Starlight', type: 'color', value: '#e6e1d8', priceModifier: 0, inStock: true },
      { id: 'var-021c', name: 'Rose', type: 'color', value: '#d9a6a6', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Display', value: '1.8" AMOLED, always-on, 1000 nits', group: 'Display' },
      { label: 'Sensors', value: 'Optical HR, SpO₂, accelerometer, altimeter', group: 'Health' },
      { label: 'Positioning', value: 'Dual-band GPS, GLONASS, Galileo', group: 'Connectivity' },
      { label: 'Battery', value: '5 days typical, 18 h GPS', group: 'Battery' },
      { label: 'Water', value: '5 ATM swim-proof', group: 'Details' },
      { label: 'Strap', value: 'Quick-release silicone, 22 mm', group: 'Materials' },
    ],
    dimensions: { width: 8, height: 12, depth: 3, unit: 'cm' },
    weight: { value: 0.06, unit: 'kg' },
    material: 'Aluminium, silicone',
    color: 'Midnight',
    inStock: true,
    stockCount: 71,
    rating: 4.6,
    reviewCount: 298,
    relatedProductIds: ['prod-018', 'prod-020', 'prod-008'],
    modelUrl: '/models/smartwatch.glb',
    modelFile: 'smartwatch.glb',
    arConfiguration: {
      modelUrl: '/models/smartwatch.glb',
      modelFormat: 'glb',
      scale: 1,
      position: { x: 0, y: 1.1, z: 0 },
      rotation: { x: 0, y: -34, z: 0 },
      lightingPreset: 'studio',
      environmentPreset: 'studio',
      backgroundBlur: true,
      placementGuide: true,
    },
    arReady: true,
    qrReady: true,
    lastUpdated: '2026-10-02',
    createdAt: '2026-07-23',
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
  { productId: 'prod-006', productViews: 2870, arViews: 806, qrScans: 918, purchases: 176 },
  { productId: 'prod-007', productViews: 1740, arViews: 452, qrScans: 611, purchases: 132 },
  { productId: 'prod-008', productViews: 1320, arViews: 394, qrScans: 487, purchases: 104 },
  { productId: 'prod-009', productViews: 1960, arViews: 471, qrScans: 663, purchases: 187 },
  { productId: 'prod-010', productViews: 2450, arViews: 618, qrScans: 742, purchases: 265 },
  { productId: 'prod-011', productViews: 1180, arViews: 287, qrScans: 402, purchases: 143 },
  { productId: 'prod-012', productViews: 1560, arViews: 436, qrScans: 524, purchases: 158 },
  { productId: 'prod-013', productViews: 1690, arViews: 449, qrScans: 566, purchases: 171 },
  { productId: 'prod-014', productViews: 3410, arViews: 927, qrScans: 1188, purchases: 396 },
  { productId: 'prod-015', productViews: 1820, arViews: 468, qrScans: 592, purchases: 204 },
  { productId: 'prod-016', productViews: 1440, arViews: 351, qrScans: 468, purchases: 219 },
  { productId: 'prod-017', productViews: 1120, arViews: 268, qrScans: 377, purchases: 156 },
  { productId: 'prod-018', productViews: 4680, arViews: 1364, qrScans: 1402, purchases: 318 },
  { productId: 'prod-019', productViews: 2980, arViews: 714, qrScans: 968, purchases: 341 },
  { productId: 'prod-020', productViews: 3540, arViews: 869, qrScans: 1077, purchases: 402 },
  { productId: 'prod-021', productViews: 2760, arViews: 742, qrScans: 891, purchases: 288 },
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
  { id: 'act-1', productId: 'prod-018', type: 'ar_view', label: 'AR opened', when: '1 min ago' },
  { id: 'act-2', productId: 'prod-006', type: 'qr_scan', label: 'QR scanned', when: '3 min ago' },
  { id: 'act-3', productId: 'prod-014', type: 'ar_view', label: 'AR opened', when: '7 min ago' },
  { id: 'act-4', productId: 'prod-001', type: 'qr_scan', label: 'QR scanned', when: '12 min ago' },
  { id: 'act-5', productId: 'prod-012', type: 'ar_view', label: 'AR opened', when: '19 min ago' },
  { id: 'act-6', productId: 'prod-020', type: 'product_view', label: 'Product viewed', when: '26 min ago' },
  { id: 'act-7', productId: 'prod-002', type: 'qr_scan', label: 'QR scanned', when: '34 min ago' },
  { id: 'act-8', productId: 'prod-016', type: 'product_view', label: 'Product viewed', when: '41 min ago' },
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
  { id: 'rev-013', productId: 'prod-006', authorName: 'Tom H.', rating: 5, title: 'Measured the gap in AR first', body: 'Our kitchen run had a 91 cm opening. I put the fridge in AR on the phone, confirmed the clearance either side, and ordered the same afternoon. It fits with exactly two centimetres to spare.', verified: true, helpfulCount: 52, createdAt: '2026-09-27' },
  { id: 'rev-014', productId: 'prod-006', authorName: 'Rachel D.', rating: 4, title: 'Quiet and genuinely holds temperature', body: 'Replaced a fifteen-year-old fridge and the difference in noise alone is worth it. The twin compressor keeps the freezer rock solid even with the door open a lot.', verified: true, helpfulCount: 28, createdAt: '2026-09-11' },
  { id: 'rev-015', productId: 'prod-007', authorName: 'Michael O.', rating: 5, title: 'The auto-dose dispenser is the killer feature', body: 'No more pouring detergent and guessing. Fourteen months in, no smells, no residue, and it is quiet enough to run overnight.', verified: true, helpfulCount: 21, createdAt: '2026-09-18' },
  { id: 'rev-016', productId: 'prod-008', authorName: 'Sofia L.', rating: 5, title: 'Holds one temperature, no cycling', body: 'Our old unit swung three degrees either side of the set point. This one sits on 22 all evening. The ceiling throw means nobody gets a cold draught at a desk.', verified: true, helpfulCount: 17, createdAt: '2026-09-14' },
  { id: 'rev-017', productId: 'prod-009', authorName: 'Ben R.', rating: 4, title: 'Browns like a real oven', body: 'The convection mode is not a gimmick — it finished a small pie properly. Dial controls are a relief after the touch panels on most microwaves.', verified: true, helpfulCount: 25, createdAt: '2026-09-06' },
  { id: 'rev-018', productId: 'prod-010', authorName: 'Hannah W.', rating: 5, title: 'Finally a stick vac that handles long hair', body: 'Three people with long hair in this house and the brush bar still comes out clean. Empties straight into the bin without a dust cloud.', verified: true, helpfulCount: 63, createdAt: '2026-09-22' },
  { id: 'rev-019', productId: 'prod-011', authorName: 'Greg P.', rating: 4, title: 'Silent on the low setting', body: 'Runs all night in the bedroom on speed one and I sleep right through it. Base is heavier than it looks, which is a good thing with a toddler around.', verified: true, helpfulCount: 14, createdAt: '2026-09-03' },
  { id: 'rev-020', productId: 'prod-012', authorName: 'Aisha N.', rating: 5, title: 'Green juice that does not separate', body: 'The slow press is the whole difference. It stays mixed in the glass for an hour instead of splitting in a minute, and rinses clean under the tap.', verified: true, helpfulCount: 34, createdAt: '2026-09-25' },
  { id: 'rev-021', productId: 'prod-013', authorName: 'Peter S.', rating: 5, title: 'Crushed frozen fruit in one pass', body: 'No grit at the bottom of the jar, no pulsing for two minutes. The glass jar does not hold odours the way my old plastic one did.', verified: true, helpfulCount: 27, createdAt: '2026-09-16' },
  { id: 'rev-022', productId: 'prod-014', authorName: 'Chloe M.', rating: 5, title: 'Replaced the oven for two people', body: 'I was skeptical about air fryers. Three months in we use it four nights a week — chips, roast vegetables, reheating pizza that actually stays crisp.', verified: true, helpfulCount: 71, createdAt: '2026-09-29' },
  { id: 'rev-023', productId: 'prod-014', authorName: 'Derek F.', rating: 5, title: 'The shake reminder makes a difference', body: 'It buzzes halfway through and everything comes out even. Basket and tray go straight in the dishwasher.', verified: true, helpfulCount: 39, createdAt: '2026-09-13' },
  { id: 'rev-024', productId: 'prod-015', authorName: 'Nina V.', rating: 4, title: 'Coffee stays hot without cooking', body: 'The thermal carafe means the last cup at hour two tastes like the first. Timer is easy to set and the permanent filter saves us buying papers.', verified: true, helpfulCount: 22, createdAt: '2026-09-19' },
  { id: 'rev-025', productId: 'prod-016', authorName: 'Owen B.', rating: 5, title: 'Green tea people, buy this', body: '80 °C makes an enormous difference to loose-leaf green tea. Boils fast, holds the temperature, and the inside is all steel — no plastic taste.', verified: true, helpfulCount: 44, createdAt: '2026-09-24' },
  { id: 'rev-026', productId: 'prod-017', authorName: 'Iris K.', rating: 4, title: 'Even colour, no stripes', body: 'Thick-cut bread toasts edge to edge on step four. Crumb tray slides out in one motion, which is more than I can say for the last one.', verified: true, helpfulCount: 16, createdAt: '2026-09-08' },
  { id: 'rev-027', productId: 'prod-018', authorName: 'Luis G.', rating: 5, title: 'Checked the wall width in AR before buying', body: 'Our alcove is 126 cm wide. I dropped the TV into AR at true scale from the sofa and saw exactly how much wall it would take. Confident order, perfect fit.', verified: true, helpfulCount: 88, createdAt: '2026-10-01' },
  { id: 'rev-028', productId: 'prod-018', authorName: 'Emma T.', rating: 5, title: 'Bright without being harsh', body: 'Daylight scenes stay colourful instead of washing out, and the game mode is genuinely low-lag. Frame is thin enough that it reads as a picture on the wall.', verified: true, helpfulCount: 46, createdAt: '2026-09-21' },
  { id: 'rev-029', productId: 'prod-019', authorName: 'Jonah C.', rating: 5, title: 'Punched well above its size', body: 'Took it camping, dropped it in the sand, rinsed it off. Eighteen hours is honest — we got through a weekend on two charges.', verified: true, helpfulCount: 35, createdAt: '2026-09-26' },
  { id: 'rev-030', productId: 'prod-020', authorName: 'Maya F.', rating: 5, title: 'Noise cancelling on a commute is worth it', body: 'The platform rumble disappears completely. Comfortable enough to wear for an eight-hour flight without sore spots.', verified: true, helpfulCount: 57, createdAt: '2026-09-30' },
  { id: 'rev-031', productId: 'prod-021', authorName: 'Sam I.', rating: 4, title: 'Five days is accurate', body: 'Used to charge every night with my old watch. This one genuinely lasts the week with the always-on display on. The crown scroll is a nice touch.', verified: true, helpfulCount: 31, createdAt: '2026-09-20' },
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

/** Fine-grained product categories, in the order they should be offered. */
export const categories = [
  { name: 'Seating', slug: 'Seating' },
  { name: 'Tables', slug: 'Tables' },
  { name: 'Lighting', slug: 'Lighting' },
  { name: 'Home Appliances', slug: 'Home Appliances' },
  { name: 'Kitchen Appliances', slug: 'Kitchen Appliances' },
  { name: 'Televisions', slug: 'Televisions' },
  { name: 'Audio', slug: 'Audio' },
  { name: 'Wearables', slug: 'Wearables' },
];

/** Room names (furniture only) — everything else in `rooms` is a department. */
export const rooms = ['Living Room', 'Bedroom', 'Dining'];
