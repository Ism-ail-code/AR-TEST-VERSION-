import type { ReactNode } from 'react';
import { PackageX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
        {icon ?? <PackageX className="w-6 h-6 text-brand-400" />}
      </div>
      <h3 className="text-base font-semibold text-brand-900">{title}</h3>
      {description && (
        <p className="text-sm text-brand-500 mt-1.5 max-w-sm">{description}</p>
      )}
      {action && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
