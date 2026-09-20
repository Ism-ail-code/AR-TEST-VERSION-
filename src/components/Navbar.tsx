import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { demoStore, demoProducts } from '@/data/demo';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-brand-200/40">
      {/* Top announcement bar */}
      <div className="bg-brand-900 text-white text-center py-2 px-4 text-2xs sm:text-xs font-medium tracking-wide">
        Free shipping on orders over $500 &mdash; AR preview available on all products
      </div>

      <div className="container-page">
        <div className="flex items-center justify-between h-16 lg:h-16">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive
                    ? 'text-brand-900 bg-brand-100/60'
                    : 'text-brand-600 hover:text-brand-900 hover:bg-brand-50'
                }`
              }
            >
              All Products
            </NavLink>
            <NavLink
              to="/products?category=Seating"
              className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-colors"
            >
              Seating
            </NavLink>
            <NavLink
              to="/products?category=Tables"
              className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-colors"
            >
              Tables
            </NavLink>
            <NavLink
              to="/products?category=Lighting"
              className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-colors"
            >
              Lighting
            </NavLink>
          </nav>

          {/* Center logo */}
          <Link to="/" className="flex items-center gap-3 group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <div className="w-9 h-9 rounded-xl bg-brand-900 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm tracking-tight">{demoStore.name.split(' ').map(w => w[0]).join('')}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-brand-900 tracking-tight block leading-none">{demoStore.name}</span>
              <span className="text-2xs text-brand-400 tracking-wider uppercase">Furniture &amp; Design</span>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button className="hidden sm:flex p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button className="relative p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors" aria-label="Shopping cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-2xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Merchant link */}
            <NavLink
              to="/merchant"
              className="hidden lg:flex ml-2 px-3.5 py-2 text-sm font-medium text-brand-500 hover:text-brand-900 hover:bg-brand-100 rounded-xl transition-colors"
            >
              Merchant
            </NavLink>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-slide-down">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                placeholder="Search furniture, materials, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Search products"
                className="w-full pl-11 pr-4 py-3 bg-surface-100 border border-brand-200 rounded-xl text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery.length > 1 && (
              <div className="mt-2 bg-white rounded-xl border border-brand-200 shadow-elevated overflow-hidden" role="listbox">
                {demoProducts
                  .filter((p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 4)
                  .map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors"
                      role="option"
                    >
                      <img src={product.images[0]?.url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-900 truncate">{product.name}</p>
                        <p className="text-xs text-brand-500">{product.category} &middot; ${product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-brand-200/60 bg-white animate-slide-down">
          <div className="container-page py-4 space-y-1">
            <NavLink
              to="/products"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-900 bg-brand-100/60' : 'text-brand-600 hover:bg-brand-50'
                }`
              }
            >
              All Products
            </NavLink>
            <NavLink
              to="/products?category=Seating"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Seating
            </NavLink>
            <NavLink
              to="/products?category=Tables"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Tables
            </NavLink>
            <NavLink
              to="/products?category=Lighting"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Lighting
            </NavLink>
            <div className="border-t border-brand-200/60 pt-2 mt-2">
              <NavLink
                to="/merchant"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-brand-500 hover:bg-brand-50 transition-colors"
              >
                Merchant Dashboard
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
