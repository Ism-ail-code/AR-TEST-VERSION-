import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  size = 'md',
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="overlay" onClick={onClose} />
      <div
        className={`
          fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'}
          h-full bg-white shadow-2xl
          ${sizeStyles[size]}
          w-full
          ${side === 'right' ? 'animate-slide-up' : 'animate-slide-down'}
        `}
        style={{ animationDuration: '250ms' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-200">
          {title && (
            <h2 className="text-base font-semibold text-brand-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-65px)] p-6">{children}</div>
      </div>
    </div>
  );
}
