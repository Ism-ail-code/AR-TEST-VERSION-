import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return <Loader2 className={`animate-spinner text-brand-400 ${sizeStyles[size]} ${className}`} />;
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-sm text-brand-500 mt-3">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl border border-brand-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-brand-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-brand-100 rounded w-1/4" />
        <div className="h-4 bg-brand-100 rounded w-3/4" />
        <div className="h-3 bg-brand-100 rounded w-full" />
        <div className="h-5 bg-brand-100 rounded w-1/3 mt-4" />
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-brand-100 rounded-lg" />
      ))}
    </div>
  );
}
