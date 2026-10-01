import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, ArrowRight, X, Sparkles } from 'lucide-react';

type Mode = 'customer' | 'merchant';

function detectMode(pathname: string): Mode {
  if (pathname.startsWith('/merchant')) return 'merchant';
  return 'customer';
}

const customerLinks = [
  { label: 'Browse Store', href: '/products', desc: 'View all products' },
  { label: 'Featured Product', href: '/product/oslo-lounge-chair', desc: 'Oslo Lounge Chair' },
  { label: 'AR Experience', href: '/ar/prod-001', desc: 'Place furniture in your room' },
];

const merchantLinks = [
  { label: 'Dashboard', href: '/merchant', desc: 'Overview & analytics' },
  { label: 'Products', href: '/merchant/products', desc: 'Manage catalog' },
  { label: 'Product Setup', href: '/merchant/products/prod-001', desc: 'Oslo Lounge Chair' },
  { label: 'QR Codes', href: '/merchant/products/prod-001/qr', desc: 'Print posters' },
  { label: 'Customer Preview', href: '/merchant/products/prod-001/preview', desc: 'See what customers see' },
];

export function ExperienceSwitcher() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentMode = detectMode(location.pathname);

  /** Card is clickable, but any real link inside it keeps priority. */
  const cardNavigate = (href: string) => (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    setOpen(false);
    navigate(href);
  };

  // Hide on AR pages (full-screen experience)
  if (location.pathname.startsWith('/ar/')) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-brand-950/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed z-[95] transition-all duration-300 ease-out ${
          open
            ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-80'
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
        }`}
      >
        {open ? (
          <div className="bg-white rounded-2xl shadow-2xl shadow-brand-900/15 border border-brand-200/60 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-200/60 bg-surface-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-semibold text-brand-900">Switch Experience</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-6 h-6 rounded-md flex items-center justify-center text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mode cards */}
            <div className="p-3 space-y-2">
              {/* Customer mode */}
              <div
                onClick={cardNavigate('/products')}
                className={`block rounded-xl p-3 cursor-pointer transition-all ${
                  currentMode === 'customer'
                    ? 'bg-accent-50 border-2 border-accent-400 shadow-sm'
                    : 'border-2 border-transparent hover:bg-surface-50 hover:border-brand-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentMode === 'customer' ? 'bg-accent-500' : 'bg-brand-100'
                  }`}>
                    <ShoppingBag className={`w-5 h-5 ${currentMode === 'customer' ? 'text-white' : 'text-brand-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-900">Customer Experience</p>
                    <p className="text-2xs text-brand-400">Browse, view 3D, scan QR</p>
                  </div>
                  {currentMode === 'customer' && (
                    <span className="text-2xs font-bold text-accent-600 bg-accent-100 px-2 py-0.5 rounded-full">ACTIVE</span>
                  )}
                </div>
                {currentMode === 'customer' && (
                  <div className="mt-2.5 space-y-1 pl-[52px]">
                    {customerLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-1.5 text-xs text-brand-600 hover:text-accent-600 transition-colors group"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Merchant mode */}
              <div
                onClick={cardNavigate('/merchant')}
                className={`block rounded-xl p-3 cursor-pointer transition-all ${
                  currentMode === 'merchant'
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'border-2 border-transparent hover:bg-surface-50 hover:border-brand-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentMode === 'merchant' ? 'bg-white/20' : 'bg-brand-100'
                  }`}>
                    <Store className={`w-5 h-5 ${currentMode === 'merchant' ? 'text-white' : 'text-brand-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${currentMode === 'merchant' ? 'text-white' : 'text-brand-900'}`}>Merchant Experience</p>
                    <p className={`text-2xs ${currentMode === 'merchant' ? 'text-white/50' : 'text-brand-400'}`}>Dashboard, products, AR config</p>
                  </div>
                  {currentMode === 'merchant' && (
                    <span className="text-2xs font-bold text-accent-400 bg-white/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                  )}
                </div>
                {currentMode === 'merchant' && (
                  <div className="mt-2.5 space-y-1 pl-[52px]">
                    {merchantLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-1.5 text-xs text-brand-300 hover:text-white transition-colors group"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-brand-200/60 bg-surface-50">
              <p className="text-2xs text-brand-400 text-center">
                Same product data across both experiences
              </p>
            </div>
          </div>
        ) : (
          /* Collapsed pill */
          <button
            onClick={() => setOpen(true)}
            aria-label="Switch experience mode"
            className="group flex items-center gap-2.5 h-12 pl-3 pr-4 bg-brand-900 text-white rounded-2xl shadow-lg shadow-brand-900/25 hover:bg-brand-800 hover:shadow-xl hover:shadow-brand-900/30 transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              {currentMode === 'customer' ? (
                <ShoppingBag className="w-4 h-4" />
              ) : (
                <Store className="w-4 h-4" />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-tight">
                {currentMode === 'customer' ? 'Customer' : 'Merchant'}
              </p>
              <p className="text-2xs text-brand-400 leading-tight">Switch</p>
            </div>
          </button>
        )}
      </div>
    </>
  );
}
