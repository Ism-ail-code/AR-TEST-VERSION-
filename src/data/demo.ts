import type {
  Product,
  Store,
  Review,
  QRCode,
  AnalyticsEvent,
  DashboardStats,
} from '@/types';

// ─────────────────────────────────────────────
// STORE DATA
// ─────────────────────────────────────────────

export const demoStore: Store = {
  id: 'store-001',
  name: 'Casa Living',
  slug: 'casa-living',
  logo: 'https://placehold.co/120x120/1a1a2e/ffffff?text=CL',
  bannerImage: 'https://placehold.co/1400x400/1a1a2e/ffffff?text=Casa+Living',
  description:
    'Casa Living crafts modern, minimalist furniture designed for the way you live. Each piece blends timeless aesthetics with everyday comfort, built from sustainably sourced materials and made to last.',
  shortDescription: 'Modern minimalist furniture for everyday living.',
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
  themeColor: '#1a1a2e',
  currency: 'USD',
  timezone: 'America/Chicago',
  createdAt: '2024-06-15T08:00:00Z',
};

// ─────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────

export const demoProducts: Product[] = [
  // ── 1. Modern Lounge Chair ──
  {
    id: 'prod-001',
    name: 'Oslo Lounge Chair',
    slug: 'oslo-lounge-chair',
    shortDescription:
      'Sculpted ergonomic lounge chair with solid oak frame and premium woven upholstery.',
    fullDescription:
      'The Oslo Lounge Chair draws from Scandinavian design principles to deliver a seat that is as beautiful as it is comfortable. Its gently curved backrest follows the natural line of the spine, while the solid oak frame provides a warm, grounded presence. Upholstered in a textured polyester-linen blend, the Oslo is built for long evenings of reading, conversation, or quiet reflection. The legs are crafted from FSC-certified white oak with a natural matte finish.',
    price: 849.0,
    currency: 'USD',
    category: 'Seating',
    subcategory: 'Lounge Chairs',
    tags: ['scandinavian', 'ergonomic', 'oak', 'upholstered'],
    images: [
      { id: 'img-001a', url: 'https://placehold.co/800x800/d4c5a9/1a1a2e?text=Oslo+Chair+Front', alt: 'Oslo Lounge Chair front view', isPrimary: true, sortOrder: 0 },
      { id: 'img-001b', url: 'https://placehold.co/800x800/c4b599/1a1a2e?text=Oslo+Chair+Side', alt: 'Oslo Lounge Chair side view', isPrimary: false, sortOrder: 1 },
      { id: 'img-001c', url: 'https://placehold.co/800x800/b4a589/1a1a2e?text=Oslo+Chair+Detail', alt: 'Oslo Lounge Chair fabric detail', isPrimary: false, sortOrder: 2 },
      { id: 'img-001d', url: 'https://placehold.co/800x800/a49579/1a1a2e?text=Oslo+Chair+Room', alt: 'Oslo Lounge Chair in living room setting', isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { id: 'var-001a', name: 'Warm Sand', type: 'color', value: '#d4c5a9', priceModifier: 0, inStock: true },
      { id: 'var-001b', name: 'Charcoal', type: 'color', value: '#4a4a4a', priceModifier: 0, inStock: true },
      { id: 'var-001c', name: 'Forest Green', type: 'color', value: '#2d5a3d', priceModifier: 50, inStock: true },
      { id: 'var-001d', name: 'Oatmeal', type: 'color', value: '#e8dcc8', priceModifier: 0, inStock: false },
    ],
    specifications: [
      { label: 'Frame', value: 'Solid white oak', group: 'Materials' },
      { label: 'Upholstery', value: 'Polyester-linen blend (80/20)', group: 'Materials' },
      { label: 'Cushion Fill', value: 'High-density foam with duck down wrap', group: 'Comfort' },
      { label: 'Leg Finish', value: 'Natural matte', group: 'Finish' },
      { label: 'Assembly', value: 'Legs attach with included hex key', group: 'Assembly' },
      { label: 'Country of Origin', value: 'Vietnam', group: 'Details' },
    ],
    dimensions: { width: 76, height: 84, depth: 82, unit: 'cm' },
    weight: { value: 18.5, unit: 'kg' },
    material: 'White oak, polyester-linen blend',
    color: 'Warm Sand',
    merchantId: 'merchant-001',
    arModelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    arConfiguration: {
      productId: 'prod-001',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      modelFormat: 'glb',
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -30, z: 0 },
      lightingPreset: 'natural',
      backgroundBlur: false,
      placementGuide: true,
      environmentPreset: 'apartment',
    },
    inStock: true,
    stockCount: 24,
    rating: 4.7,
    reviewCount: 128,
    relatedProductIds: ['prod-002', 'prod-005'],
    qrUrl: 'https://rapidify.app/product/oslo-lounge-chair',
    createdAt: '2025-03-10T09:00:00Z',
    updatedAt: '2026-09-15T11:30:00Z',
  },

  // ── 2. Three-Seater Sofa ──
  {
    id: 'prod-002',
    name: 'Haven Three-Seater Sofa',
    slug: 'haven-three-seater-sofa',
    shortDescription:
      'Generous three-seater with deep seats, removable covers, and a solid walnut base rail.',
    fullDescription:
      'The Haven Sofa redefines what a three-seater can be. Deep 60 cm seats invite you to sink in, while the firm supportive base keeps posture comfortable for hours. Built on a kiln-dried hardwood frame with a solid walnut base rail, the Haven is designed to be the centerpiece of any living space. The covers are fully removable and machine-washable, available in a curated range of performance fabrics that resist stains and fading. Brass-finished steel legs add a subtle touch of warmth.',
    price: 2199.0,
    currency: 'USD',
    category: 'Seating',
    subcategory: 'Sofas',
    tags: ['modular', 'performance-fabric', 'walnut', 'family-friendly'],
    images: [
      { id: 'img-002a', url: 'https://placehold.co/800x800/6b7b8d/ffffff?text=Haven+Sofa+Front', alt: 'Haven Three-Seater Sofa front view', isPrimary: true, sortOrder: 0 },
      { id: 'img-002b', url: 'https://placehold.co/800x800/5b6b7d/ffffff?text=Haven+Sofa+Angle', alt: 'Haven Three-Seater Sofa angled view', isPrimary: false, sortOrder: 1 },
      { id: 'img-002c', url: 'https://placehold.co/800x800/4b5b6d/ffffff?text=Haven+Sofa+Detail', alt: 'Haven sofa walnut base detail', isPrimary: false, sortOrder: 2 },
      { id: 'img-002d', url: 'https://placehold.co/800x800/3b4b5d/ffffff?text=Haven+Sofa+Room', alt: 'Haven sofa in open-plan living space', isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { id: 'var-002a', name: 'Stone Grey', type: 'color', value: '#8a8f96', priceModifier: 0, inStock: true },
      { id: 'var-002b', name: 'Midnight Blue', type: 'color', value: '#2c3e6b', priceModifier: 0, inStock: true },
      { id: 'var-002c', name: 'Ivory', type: 'color', value: '#f0ead6', priceModifier: 100, inStock: true },
      { id: 'var-002d', name: 'Terracotta', type: 'color', value: '#c75b39', priceModifier: 0, inStock: true },
    ],
    specifications: [
      { label: 'Frame', value: 'Kiln-dried hardwood', group: 'Materials' },
      { label: 'Base Rail', value: 'Solid American walnut', group: 'Materials' },
      { label: 'Upholstery', value: 'Performance polyester (removable)', group: 'Materials' },
      { label: 'Cushion Fill', value: 'Dual-layer foam with fiber wrap', group: 'Comfort' },
      { label: 'Legs', value: 'Powder-coated steel, brass finish', group: 'Finish' },
      { label: 'Seat Depth', value: '60 cm', group: 'Dimensions' },
      { label: 'Care', value: 'Removable covers, machine washable', group: 'Maintenance' },
    ],
    dimensions: { width: 220, height: 82, depth: 95, unit: 'cm' },
    weight: { value: 54.0, unit: 'kg' },
    material: 'Hardwood, walnut, performance polyester',
    color: 'Stone Grey',
    merchantId: 'merchant-001',
    arModelUrl: 'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb',
    arConfiguration: {
      productId: 'prod-002',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb',
      modelFormat: 'glb',
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: -15, z: 0 },
      lightingPreset: 'studio',
      backgroundBlur: true,
      placementGuide: true,
      environmentPreset: 'apartment',
    },
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewCount: 203,
    relatedProductIds: ['prod-001', 'prod-003'],
    qrUrl: 'https://rapidify.app/product/haven-three-seater-sofa',
    createdAt: '2025-04-22T10:15:00Z',
    updatedAt: '2026-09-18T14:00:00Z',
  },

  // ── 3. Minimal Coffee Table ──
  {
    id: 'prod-003',
    name: 'Forma Coffee Table',
    slug: 'forma-coffee-table',
    shortDescription:
      'Low-profile coffee table with a solid marble top and slender black steel frame.',
    fullDescription:
      'The Forma Coffee Table brings architectural precision to your living room. Its 12 mm Carrara marble slab sits atop a welded blackened steel frame with a matte powder-coated finish. The low 35 cm profile keeps sightlines open, making it ideal for modern open-plan spaces. Each marble top is unique, featuring natural grey veining that adds character and depth. The underside includes a hidden steel shelf for books, remotes, or decorative objects.',
    price: 1299.0,
    currency: 'USD',
    category: 'Tables',
    subcategory: 'Coffee Tables',
    tags: ['marble', 'steel', 'minimalist', 'architectural'],
    images: [
      { id: 'img-003a', url: 'https://placehold.co/800x800/e8e4de/1a1a2e?text=Forma+Table+Front', alt: 'Forma Coffee Table top view', isPrimary: true, sortOrder: 0 },
      { id: 'img-003b', url: 'https://placehold.co/800x800/d8d4ce/1a1a2e?text=Forma+Table+Side', alt: 'Forma Coffee Table side view', isPrimary: false, sortOrder: 1 },
      { id: 'img-003c', url: 'https://placehold.co/800x800/c8c4be/1a1a2e?text=Forma+Table+Marble', alt: 'Forma Coffee Table marble detail', isPrimary: false, sortOrder: 2 },
      { id: 'img-003d', url: 'https://placehold.co/800x800/b8b4ae/1a1a2e?text=Forma+Table+Room', alt: 'Forma Coffee Table in minimalist room', isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { id: 'var-003a', name: 'Carrara White / Black Steel', type: 'color', value: '#e8e4de', priceModifier: 0, inStock: true },
      { id: 'var-003b', name: 'Nero Marquina / Black Steel', type: 'color', value: '#2a2a2a', priceModifier: 200, inStock: true },
      { id: 'var-003c', name: 'Carrara White / Brass Steel', type: 'finish', value: '#c9a84c', priceModifier: 150, inStock: true },
    ],
    specifications: [
      { label: 'Top', value: '12 mm Carrara marble slab', group: 'Materials' },
      { label: 'Frame', value: 'Welded blackened steel', group: 'Materials' },
      { label: 'Finish', value: 'Matte powder coat', group: 'Finish' },
      { label: 'Shelf', value: 'Hidden steel undershelf', group: 'Features' },
      { label: 'Weight Capacity', value: '40 kg', group: 'Details' },
      { label: 'Care', value: 'Wipe with damp cloth, seal marble annually', group: 'Maintenance' },
    ],
    dimensions: { width: 120, height: 35, depth: 65, unit: 'cm' },
    weight: { value: 32.0, unit: 'kg' },
    material: 'Carrara marble, blackened steel',
    color: 'Carrara White',
    merchantId: 'merchant-001',
    arModelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    arConfiguration: {
      productId: 'prod-003',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
      modelFormat: 'glb',
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      lightingPreset: 'natural',
      backgroundBlur: false,
      placementGuide: true,
      environmentPreset: 'lobby',
    },
    inStock: true,
    stockCount: 18,
    rating: 4.6,
    reviewCount: 87,
    relatedProductIds: ['prod-002', 'prod-004'],
    qrUrl: 'https://rapidify.app/product/forma-coffee-table',
    createdAt: '2025-06-01T08:30:00Z',
    updatedAt: '2026-09-12T09:45:00Z',
  },

  // ── 4. Floor Lamp ──
  {
    id: 'prod-004',
    name: 'Luma Arc Floor Lamp',
    slug: 'luma-arc-floor-lamp',
    shortDescription:
      'Adjustable arc floor lamp with linen shade and weighted marble base.',
    fullDescription:
      'The Luma Arc Floor Lamp brings soft, diffused light to any corner of your home. Its sweeping steel arc extends 45 cm from the base, allowing you to position the light exactly where you need it. The natural linen shade filters light gently, creating a warm, inviting glow. A weighted Carrara marble base keeps the lamp stable without looking bulky. The integrated LED module offers three brightness levels controlled by a discreet foot pedal switch.',
    price: 459.0,
    currency: 'USD',
    category: 'Lighting',
    subcategory: 'Floor Lamps',
    tags: ['arc', 'linen', 'marble', 'led', 'adjustable'],
    images: [
      { id: 'img-004a', url: 'https://placehold.co/800x800/f5e6c8/1a1a2e?text=Luma+Lamp+Front', alt: 'Luma Arc Floor Lamp front view', isPrimary: true, sortOrder: 0 },
      { id: 'img-004b', url: 'https://placehold.co/800x800/e5d6b8/1a1a2e?text=Luma+Lamp+Lit', alt: 'Luma Arc Floor Lamp lit', isPrimary: false, sortOrder: 1 },
      { id: 'img-004c', url: 'https://placehold.co/800x800/d5c6a8/1a1a2e?text=Luma+Lamp+Base', alt: 'Luma Arc Floor Lamp marble base detail', isPrimary: false, sortOrder: 2 },
      { id: 'img-004d', url: 'https://placehold.co/800x800/c5b698/1a1a2e?text=Luma+Lamp+Room', alt: 'Luma Arc Floor Lamp in bedroom setting', isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { id: 'var-004a', name: 'Natural Linen / Brass', type: 'material', value: '#e8dcc8', priceModifier: 0, inStock: true },
      { id: 'var-004b', name: 'Black Linen / Matte Black', type: 'material', value: '#2a2a2a', priceModifier: 30, inStock: true },
      { id: 'var-004c', name: 'Grey Linen / Chrome', type: 'material', value: '#8a8a8a', priceModifier: 30, inStock: true },
    ],
    specifications: [
      { label: 'Shade', value: 'Natural linen, 35 cm diameter', group: 'Materials' },
      { label: 'Arc', value: 'Steel with brass/matte finish', group: 'Materials' },
      { label: 'Base', value: 'Weighted Carrara marble', group: 'Materials' },
      { label: 'Light Source', value: 'Integrated LED, 12W', group: 'Lighting' },
      { label: 'Brightness', value: '3 levels (300 / 600 / 900 lumens)', group: 'Lighting' },
      { label: 'Color Temperature', value: '2700K (warm white)', group: 'Lighting' },
      { label: 'Switch', value: 'Foot pedal, 3-stage', group: 'Features' },
      { label: 'Cord Length', value: '250 cm', group: 'Details' },
    ],
    dimensions: { width: 45, height: 175, depth: 45, unit: 'cm' },
    weight: { value: 9.2, unit: 'kg' },
    material: 'Steel, linen, Carrara marble',
    color: 'Natural Linen',
    merchantId: 'merchant-001',
    arModelUrl: 'https://modelviewer.dev/shared-assets/models/RocketShip.glb',
    arConfiguration: {
      productId: 'prod-004',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/RocketShip.glb',
      modelFormat: 'glb',
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 20, z: 0 },
      lightingPreset: 'dramatic',
      backgroundBlur: false,
      placementGuide: true,
      environmentPreset: 'apartment',
    },
    inStock: true,
    stockCount: 32,
    rating: 4.5,
    reviewCount: 64,
    relatedProductIds: ['prod-003', 'prod-005'],
    qrUrl: 'https://rapidify.app/product/luma-arc-floor-lamp',
    createdAt: '2025-07-18T11:00:00Z',
    updatedAt: '2026-09-10T16:20:00Z',
  },

  // ── 5. Wooden Side Table ──
  {
    id: 'prod-005',
    name: 'Mono Side Table',
    slug: 'mono-side-table',
    shortDescription:
      'Solid walnut side table with a clean geometric silhouette and soft-close drawer.',
    fullDescription:
      'The Mono Side Table is a study in restraint. Carved from a single block of American black walnut, its continuous form flows from top to leg without visible joints. A single soft-close drawer with a recessed pull keeps essentials organized and out of sight. The natural walnut grain is finished with a hand-rubbed Danish oil that deepens with age. Compact enough for a bedside or armchair companion, the Mono makes a quiet statement in any room.',
    price: 379.0,
    currency: 'USD',
    category: 'Tables',
    subcategory: 'Side Tables',
    tags: ['walnut', 'solid-wood', 'minimal', 'drawer'],
    images: [
      { id: 'img-005a', url: 'https://placehold.co/800x800/5c4033/ffffff?text=Mono+Table+Front', alt: 'Mono Side Table front view', isPrimary: true, sortOrder: 0 },
      { id: 'img-005b', url: 'https://placehold.co/800x800/4c3023/ffffff?text=Mono+Table+Angle', alt: 'Mono Side Table angled view', isPrimary: false, sortOrder: 1 },
      { id: 'img-005c', url: 'https://placehold.co/800x800/3c2013/ffffff?text=Mono+Table+Drawer', alt: 'Mono Side Table drawer detail', isPrimary: false, sortOrder: 2 },
      { id: 'img-005d', url: 'https://placehold.co/800x800/2c1003/ffffff?text=Mono+Table+Room', alt: 'Mono Side Table next to sofa', isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { id: 'var-005a', name: 'Natural Walnut', type: 'finish', value: '#5c4033', priceModifier: 0, inStock: true },
      { id: 'var-005b', name: 'Black Stained', type: 'finish', value: '#1a1a1a', priceModifier: 40, inStock: true },
    ],
    specifications: [
      { label: 'Wood', value: 'Solid American black walnut', group: 'Materials' },
      { label: 'Finish', value: 'Hand-rubbed Danish oil', group: 'Finish' },
      { label: 'Drawer', value: 'Soft-close, recessed pull', group: 'Features' },
      { label: 'Joinery', value: 'Mortise and tenon', group: 'Construction' },
      { label: 'Care', value: 'Dust with soft cloth, oil every 6 months', group: 'Maintenance' },
    ],
    dimensions: { width: 45, height: 55, depth: 40, unit: 'cm' },
    weight: { value: 12.8, unit: 'kg' },
    material: 'American black walnut',
    color: 'Natural Walnut',
    merchantId: 'merchant-001',
    arModelUrl: 'https://modelviewer.dev/shared-assets/models/Horse.glb',
    arConfiguration: {
      productId: 'prod-005',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Horse.glb',
      modelFormat: 'glb',
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 45, z: 0 },
      lightingPreset: 'natural',
      backgroundBlur: false,
      placementGuide: true,
      environmentPreset: 'apartment',
    },
    inStock: true,
    stockCount: 41,
    rating: 4.9,
    reviewCount: 156,
    relatedProductIds: ['prod-001', 'prod-003'],
    qrUrl: 'https://rapidify.app/product/mono-side-table',
    createdAt: '2025-08-05T07:45:00Z',
    updatedAt: '2026-09-20T08:00:00Z',
  },
];

// ─────────────────────────────────────────────
// QR CODES
// ─────────────────────────────────────────────

export const demoQRCodes: QRCode[] = [
  {
    id: 'qr-001',
    productId: 'prod-001',
    url: 'https://rapidify.app/product/oslo-lounge-chair',
    format: 'svg',
    size: 'medium',
    style: 'branded',
    scanCount: 842,
    createdAt: '2025-04-01T10:00:00Z',
  },
  {
    id: 'qr-002',
    productId: 'prod-002',
    url: 'https://rapidify.app/product/haven-three-seater-sofa',
    format: 'svg',
    size: 'large',
    style: 'branded',
    scanCount: 1376,
    createdAt: '2025-05-15T09:30:00Z',
  },
  {
    id: 'qr-003',
    productId: 'prod-003',
    url: 'https://rapidify.app/product/forma-coffee-table',
    format: 'svg',
    size: 'medium',
    style: 'standard',
    scanCount: 634,
    createdAt: '2025-07-10T08:15:00Z',
  },
  {
    id: 'qr-004',
    productId: 'prod-004',
    url: 'https://rapidify.app/product/luma-arc-floor-lamp',
    format: 'png',
    size: 'small',
    style: 'branded',
    scanCount: 491,
    createdAt: '2025-08-20T11:00:00Z',
  },
  {
    id: 'qr-005',
    productId: 'prod-005',
    url: 'https://rapidify.app/product/mono-side-table',
    format: 'svg',
    size: 'medium',
    style: 'branded',
    scanCount: 958,
    createdAt: '2025-09-05T07:45:00Z',
  },
];

// ─────────────────────────────────────────────
// REVIEWS  (DEMO DATA — simulated for prototype)
// ─────────────────────────────────────────────

export const demoReviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    authorName: 'Emily R.',
    rating: 5,
    title: 'Stunning chair, worth every penny',
    body: 'The Oslo is even more beautiful in person. The oak frame has a gorgeous grain and the upholstery feels premium. Assembly took about 15 minutes. AR preview was spot-on for sizing.',
    verified: true,
    helpfulCount: 24,
    createdAt: '2026-08-12T14:30:00Z',
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    authorName: 'James T.',
    rating: 4,
    title: 'Great comfort, slightly firm at first',
    body: 'Took about a week to break in, but now it is my favorite seat in the house. The Warm Sand color is neutral enough to match anything. Would love a matching ottoman.',
    verified: true,
    helpfulCount: 18,
    createdAt: '2026-07-28T09:15:00Z',
  },
  {
    id: 'rev-003',
    productId: 'prod-002',
    authorName: 'Priya M.',
    rating: 5,
    title: 'Best sofa we have ever owned',
    body: 'We went with Stone Grey and it is perfect for our family room. The removable covers are a lifesaver with kids. Deep seats are incredibly comfortable for movie nights.',
    verified: true,
    helpfulCount: 41,
    createdAt: '2026-09-02T16:45:00Z',
  },
  {
    id: 'rev-004',
    productId: 'prod-002',
    authorName: 'Daniel K.',
    rating: 5,
    title: 'Delivery was seamless, quality is exceptional',
    body: 'The walnut base rail is a beautiful detail. Fabric feels durable yet soft. We used the AR feature to confirm it would fit in our space — saved us from a sizing mistake.',
    verified: true,
    helpfulCount: 33,
    createdAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'rev-005',
    productId: 'prod-002',
    authorName: 'Sarah L.',
    rating: 4,
    title: 'Beautiful but wish it came in more sizes',
    body: 'Quality is outstanding and the Ivory color is luminous. Only reason for 4 stars is I wish there was a two-seater option for smaller spaces.',
    verified: false,
    helpfulCount: 12,
    createdAt: '2026-07-15T13:20:00Z',
  },
  {
    id: 'rev-006',
    productId: 'prod-003',
    authorName: 'Alex W.',
    rating: 5,
    title: 'Architectural perfection',
    body: 'The marble veining on our table is like a piece of art. The hidden shelf is genius — we keep coffee table books and remotes down there. Solid and heavy, feels built to last.',
    verified: true,
    helpfulCount: 29,
    createdAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'rev-007',
    productId: 'prod-003',
    authorName: 'Nina C.',
    rating: 4,
    title: 'Gorgeous, but requires care',
    body: 'Stunning table. Just be aware that marble can stain if you leave wet glasses on it without coasters. We got marble coasters to match and it is perfect.',
    verified: true,
    helpfulCount: 15,
    createdAt: '2026-08-10T15:30:00Z',
  },
  {
    id: 'rev-008',
    productId: 'prod-004',
    authorName: 'Chris H.',
    rating: 5,
    title: 'Perfect reading light',
    body: 'The arc design lets me position it exactly over my reading chair. The three brightness levels are well calibrated — the lowest setting is perfect for evening ambiance.',
    verified: true,
    helpfulCount: 22,
    createdAt: '2026-09-08T08:45:00Z',
  },
  {
    id: 'rev-009',
    productId: 'prod-004',
    authorName: 'Laura B.',
    rating: 4,
    title: 'Elegant and functional',
    body: 'Looks great in our bedroom. The marble base is surprisingly heavy which makes it very stable. Only minor issue is the cord could be a bit longer.',
    verified: true,
    helpfulCount: 10,
    createdAt: '2026-08-25T12:10:00Z',
  },
  {
    id: 'rev-010',
    productId: 'prod-005',
    authorName: 'Marcus J.',
    rating: 5,
    title: 'Craftsmanship you can feel',
    body: 'The walnut grain is gorgeous and the Danish oil finish gives it such a warm feel. The soft-close drawer is a nice touch. Compact but sturdy — exactly what we needed.',
    verified: true,
    helpfulCount: 37,
    createdAt: '2026-09-15T09:30:00Z',
  },
  {
    id: 'rev-011',
    productId: 'prod-005',
    authorName: 'Olivia P.',
    rating: 5,
    title: 'Purchased two, one was not enough',
    body: 'Bought one for the bedroom and liked it so much we got a second for the living room. The black stained version is equally beautiful. Worth every cent.',
    verified: true,
    helpfulCount: 28,
    createdAt: '2026-09-01T14:00:00Z',
  },
  {
    id: 'rev-012',
    productId: 'prod-005',
    authorName: 'Tom R.',
    rating: 5,
    title: 'The AR preview sealed the deal',
    body: 'Used the AR feature to check the height against our bed and it fit perfectly. The mortise-and-tenon joinery is beautifully done. A heirloom-quality piece.',
    verified: false,
    helpfulCount: 19,
    createdAt: '2026-08-18T10:45:00Z',
  },
];

// ─────────────────────────────────────────────
// ANALYTICS  (DEMO DATA — simulated for prototype)
// ─────────────────────────────────────────────

export const demoAnalytics: AnalyticsEvent[] = [
  // Oslo Lounge Chair
  { id: 'evt-001', productId: 'prod-001', eventType: 'view', timestamp: '2026-09-18T09:00:00Z', source: 'web' },
  { id: 'evt-002', productId: 'prod-001', eventType: 'qr_scan', timestamp: '2026-09-18T09:12:00Z', source: 'qr' },
  { id: 'evt-003', productId: 'prod-001', eventType: 'ar_open', timestamp: '2026-09-18T09:14:00Z', source: 'ar' },
  { id: 'evt-004', productId: 'prod-001', eventType: 'ar_capture', timestamp: '2026-09-18T09:17:00Z', source: 'ar' },
  { id: 'evt-005', productId: 'prod-001', eventType: 'add_to_cart', timestamp: '2026-09-18T09:22:00Z', source: 'web' },
  { id: 'evt-006', productId: 'prod-001', eventType: 'view', timestamp: '2026-09-19T14:30:00Z', source: 'web' },
  { id: 'evt-007', productId: 'prod-001', eventType: 'ar_open', timestamp: '2026-09-19T14:35:00Z', source: 'qr' },
  // Haven Sofa
  { id: 'evt-008', productId: 'prod-002', eventType: 'view', timestamp: '2026-09-17T10:00:00Z', source: 'web' },
  { id: 'evt-009', productId: 'prod-002', eventType: 'view', timestamp: '2026-09-17T15:00:00Z', source: 'web' },
  { id: 'evt-010', productId: 'prod-002', eventType: 'qr_scan', timestamp: '2026-09-18T11:00:00Z', source: 'qr' },
  { id: 'evt-011', productId: 'prod-002', eventType: 'ar_open', timestamp: '2026-09-18T11:03:00Z', source: 'ar' },
  { id: 'evt-012', productId: 'prod-002', eventType: 'ar_capture', timestamp: '2026-09-18T11:08:00Z', source: 'ar' },
  { id: 'evt-013', productId: 'prod-002', eventType: 'add_to_cart', timestamp: '2026-09-18T11:15:00Z', source: 'ar' },
  { id: 'evt-014', productId: 'prod-002', eventType: 'purchase', timestamp: '2026-09-19T09:00:00Z', source: 'web' },
  { id: 'evt-015', productId: 'prod-002', eventType: 'view', timestamp: '2026-09-20T08:30:00Z', source: 'web' },
  // Forma Coffee Table
  { id: 'evt-016', productId: 'prod-003', eventType: 'view', timestamp: '2026-09-19T10:00:00Z', source: 'web' },
  { id: 'evt-017', productId: 'prod-003', eventType: 'qr_scan', timestamp: '2026-09-19T10:15:00Z', source: 'qr' },
  { id: 'evt-018', productId: 'prod-003', eventType: 'ar_open', timestamp: '2026-09-19T10:18:00Z', source: 'ar' },
  { id: 'evt-019', productId: 'prod-003', eventType: 'add_to_cart', timestamp: '2026-09-19T10:30:00Z', source: 'web' },
  // Luma Arc Floor Lamp
  { id: 'evt-020', productId: 'prod-004', eventType: 'view', timestamp: '2026-09-20T09:00:00Z', source: 'web' },
  { id: 'evt-021', productId: 'prod-004', eventType: 'ar_open', timestamp: '2026-09-20T09:05:00Z', source: 'qr' },
  { id: 'evt-022', productId: 'prod-004', eventType: 'ar_capture', timestamp: '2026-09-20T09:08:00Z', source: 'ar' },
  // Mono Side Table
  { id: 'evt-023', productId: 'prod-005', eventType: 'view', timestamp: '2026-09-18T16:00:00Z', source: 'web' },
  { id: 'evt-024', productId: 'prod-005', eventType: 'view', timestamp: '2026-09-19T12:00:00Z', source: 'web' },
  { id: 'evt-025', productId: 'prod-005', eventType: 'qr_scan', timestamp: '2026-09-20T10:00:00Z', source: 'qr' },
  { id: 'evt-026', productId: 'prod-005', eventType: 'ar_open', timestamp: '2026-09-20T10:02:00Z', source: 'ar' },
  { id: 'evt-027', productId: 'prod-005', eventType: 'ar_capture', timestamp: '2026-09-20T10:05:00Z', source: 'ar' },
  { id: 'evt-028', productId: 'prod-005', eventType: 'add_to_cart', timestamp: '2026-09-20T10:10:00Z', source: 'ar' },
  { id: 'evt-029', productId: 'prod-005', eventType: 'purchase', timestamp: '2026-09-20T11:00:00Z', source: 'web' },
];

// ─────────────────────────────────────────────
// DASHBOARD STATS  (DEMO DATA — simulated totals)
// ─────────────────────────────────────────────

export const demoDashboardStats: DashboardStats = {
  totalProducts: 5,
  totalScans: 4301,
  totalARViews: 2847,
  conversionRate: 8.6,
  recentActivity: demoAnalytics.slice(-5).reverse(),
};

// ─────────────────────────────────────────────
// BASE URL — change to your deployed domain
// ─────────────────────────────────────────────

export const APP_BASE_URL = 'https://rapidify.app';

export function getProductPageUrl(product: Product): string {
  return `${APP_BASE_URL}/product/${product.slug}`;
}

export function getARPageUrl(product: Product): string {
  return `${APP_BASE_URL}/ar/${product.id}`;
}

// ─────────────────────────────────────────────
// HELPER: find product by slug or id
// ─────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return demoProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return demoProducts.find((p) => p.id === id);
}

export function getReviewsForProduct(productId: string): Review[] {
  return demoReviews.filter((r) => r.productId === productId);
}

export function getQRCodesForProduct(productId: string): QRCode[] {
  return demoQRCodes.filter((q) => q.productId === productId);
}

export function getRelatedProducts(product: Product): Product[] {
  return demoProducts.filter((p) => product.relatedProductIds.includes(p.id));
}
