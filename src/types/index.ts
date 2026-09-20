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
  swatchUrl?: string;
  priceModifier: number;
  inStock: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
  group?: string;
}

export interface ARConfiguration {
  productId: string;
  modelUrl: string;
  modelFormat: 'glb' | 'gltf' | 'usdz';
  scale: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  lightingPreset: 'studio' | 'natural' | 'dramatic';
  backgroundBlur: boolean;
  placementGuide: boolean;
  environmentPreset: 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'in';
  };
  weight: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  material: string;
  color: string;
  merchantId: string;
  arModelUrl: string | null;
  arConfiguration: ARConfiguration | null;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  relatedProductIds: string[];
  qrUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string;
  bannerImage: string;
  description: string;
  shortDescription: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    twitter?: string;
  };
  themeColor: string;
  currency: string;
  timezone: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface QRCode {
  id: string;
  productId: string;
  url: string;
  format: 'png' | 'svg';
  size: 'small' | 'medium' | 'large';
  style: 'standard' | 'branded';
  scanCount: number;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  productId: string;
  eventType: 'view' | 'ar_open' | 'ar_capture' | 'qr_scan' | 'add_to_cart' | 'purchase';
  timestamp: string;
  source: 'web' | 'ar' | 'qr';
  metadata?: Record<string, unknown>;
}

export interface DashboardStats {
  totalProducts: number;
  totalScans: number;
  totalARViews: number;
  conversionRate: number;
  recentActivity: AnalyticsEvent[];
}
