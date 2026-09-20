import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  'bg-brand-100 text-brand-700',
  success:  'bg-success-light text-success-dark',
  warning:  'bg-warning-light text-warning-dark',
  error:    'bg-error-light text-error-dark',
  info:     'bg-info-light text-info-dark',
  accent:   'bg-accent-100 text-accent-700',
};

const dotColor: Record<BadgeVariant, string> = {
  default:  'bg-brand-400',
  success:  'bg-success',
  warning:  'bg-warning',
  error:    'bg-error',
  info:     'bg-info',
  accent:   'bg-accent-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  icon,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
