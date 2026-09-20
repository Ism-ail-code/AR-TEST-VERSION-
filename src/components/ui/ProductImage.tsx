import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackAlt?: string;
}

export function ProductImage({ src, alt, className = '', fallbackAlt, ...props }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-brand-100 flex items-center justify-center ${className}`}>
        <Package className="w-8 h-8 text-brand-300" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || fallbackAlt || ''}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}