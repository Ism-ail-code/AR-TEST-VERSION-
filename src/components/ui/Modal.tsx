import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="overlay"
        onClick={onClose}
      />
      <div
        ref={contentRef}
        className={`
          relative bg-white rounded-2xl shadow-2xl w-full
          ${sizeStyles[size]}
          animate-scale-in
        `}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-0">
            {title && (
              <h2 className="text-lg font-semibold text-brand-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-brand-500 mt-1">{description}</p>
            )}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
