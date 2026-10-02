/**
 * Rapidify — domain model.
 *
 * A single `Product` object drives EVERY surface of the prototype:
 * storefront, product detail, QR poster, merchant dashboard,
 * merchant product management, customer preview and the AR experience.
 *
 * There is no backend: all data is static and lives in `src/data/products.ts`.
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'material' | 'finish';
  value: string;
  priceModifier: number;
  inStock: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
  group?: string;
}

/** Per-product AR settings. Displayed (non-persisting) in the merchant UI. */
export interface ARConfiguration {
  modelUrl: string;
  modelFormat: 'glb' | 'usdz';
  scale: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  lightingPreset: 'studio' | 'natural' | 'dramatic';
  environmentPreset: 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';
  backgroundBlur: boolean;
  placementGuide: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;

  category: string;
  subcategory: string;
  /** Store departments used by the storefront navigation (static). */
  rooms: string[];
  tags: string[];

  shortDescription: string;
  description: string;

  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  dimensions: { width: number; height: number; depth: number; unit: 'cm' | 'in' };
  weight: { value: number; unit: 'kg' | 'lbs' };
  material: string;
  color: string;

  /** Availability */
  inStock: boolean;
  stockCount: number;

  /** Social proof (static demo data) */
  rating: number;
  reviewCount: number;
  relatedProductIds: string[];

  /** 3D / AR — `modelUrl` is a locally bundled asset in `public/models/`. */
  modelUrl: string | null;
  modelFile: string | null;
  arConfiguration: ARConfiguration | null;

  /** Rapidify activation state. Drives the merchant status columns. */
  arReady: boolean;
  qrReady: boolean;

  /** Book-keeping shown in the merchant product table */
  lastUpdated: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoInitials: string;
  location: { address: string; city: string; state: string; country: string; postalCode: string };
  contact: { email: string; phone: string; website: string };
  socialMedia: { instagram?: string; facebook?: string; pinterest?: string };
  themeColor: string;
  currency: string;
  timezone: string;
  connectedSince: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

/**
 * Static, internally-consistent demo metrics.
 * Per-product values always sum to the dashboard totals — there is exactly
 * one source of truth so numbers can never contradict each other.
 */
export interface ProductStats {
  productId: string;
  productViews: number;
  arViews: number;
  qrScans: number;
  purchases: number;
}
