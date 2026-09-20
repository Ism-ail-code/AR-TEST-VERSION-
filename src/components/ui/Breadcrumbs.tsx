import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-brand-300" />}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-brand-500 hover:text-brand-800 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-brand-900 font-medium' : 'text-brand-500'} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
