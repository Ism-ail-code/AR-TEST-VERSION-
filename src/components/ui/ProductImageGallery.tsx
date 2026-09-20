import { useState } from 'react';
import { Expand, Eye } from 'lucide-react';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  arModelUrl?: string | null;
  onARClick?: () => void;
  className?: string;
}

export function ProductImageGallery({
  images,
  productName,
  arModelUrl,
  onARClick,
  className = '',
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const selected = images[selectedIndex] ?? images[0];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square bg-brand-100 rounded-xl overflow-hidden group">
        <img
          src={selected?.url}
          alt={selected?.alt ?? productName}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        {/* Top controls */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
            className="w-9 h-9 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-brand-600 hover:bg-white transition-colors"
          >
            <Expand className="w-4 h-4" />
          </button>
          {arModelUrl && onARClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onARClick(); }}
              className="h-9 px-3 rounded-lg bg-accent-500/90 backdrop-blur-sm text-white flex items-center gap-1.5 text-xs font-medium hover:bg-accent-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> AR
            </button>
          )}
        </div>
        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-brand-900/60 backdrop-blur-sm text-white text-2xs px-2 py-1 rounded-md">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => { setSelectedIndex(idx); setIsZoomed(false); }}
            className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200
              ${selectedIndex === idx
                ? 'border-brand-900 shadow-sm'
                : 'border-transparent hover:border-brand-300 opacity-60 hover:opacity-100'
              }
            `}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
