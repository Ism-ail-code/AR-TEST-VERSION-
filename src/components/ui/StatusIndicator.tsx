import type { ReactNode } from 'react';

type StatusVariant = 'active' | 'inactive' | 'pending' | 'error';

interface StatusIndicatorProps {
  variant?: StatusVariant;
  label: string;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  active:   'text-success',
  inactive: 'text-brand-400',
  pending:  'text-warning',
  error:    'text-error',
};

const dotColor: Record<StatusVariant, string> = {
  active:   'bg-success',
  inactive: 'bg-brand-300',
  pending:  'bg-warning',
  error:    'bg-error',
};

export function StatusIndicator({
  variant = 'active',
  label,
  dot = true,
  icon,
  className = '',
}: StatusIndicatorProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${variantStyles[variant]} ${className}`}>
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColor[variant]} ${variant === 'active' ? 'animate-pulse' : ''}`} />
      )}
      {icon}
      {label}
    </span>
  );
}
