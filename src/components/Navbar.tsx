import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Menu, X, Search, ShoppingBag } from 'lucide-react';
import { demoProducts } from '@/data/products';
import { useShop } from '@/context/ShopContext';

/** Store departments — each one lands on a real filtered catalogue view. */
const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Living Room', to: '/products?room=Living%20Room', room: 'Living Room' },
  { label: 'Bedroom', to: '/products?room=Bedroom', room: 'Bedroom' },
  { label: 'Dining', to: '/products?room=Dining', room: 'Dining' },
  { label: 'Lighting', to: '/products?category=Lighting', category: 'Lighting' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cartCount, wishlistCount, openCart, openWishlist } = useShop();

  const onCatalog = location.pathname === '/products';

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (!onCatalog) return location.pathname === '/' && item.to === '/';
    if ('room' in item && item.room) return searchParams.get('room') === item.room;
    if ('category' in item && item.category) return searchParams.get('category') === item.category;
    if (item.to === '/products')
      return !searchParams.get('room') && !searchParams.get('category');
    return false;
  };

  const closeAll = () => {
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-brand-200/50">
      {/* Announcement */}
      <div className="bg-brand-900 text-brand-300 text-center py-2 px-4 text-2xs sm:text-xs tracking-wide">
        Free shipping on orders over $500 &nbsp;&middot;&nbsp; 30-day returns
      </div>

      <div className="container-page">
        <div className="h-16 lg:h-[4.5rem] flex items-center justify-between gap-6">
          {/* Logo + primary nav */}
          <div className="flex items-center gap-10 min-w-0">
            <Link to="/" onClick={closeAll} className="shrink-0 group">
              <span className="block text-base sm:text-lg font-bold text-brand-900 tracking-[0.16em] leading-none group-hover:text-accent-700 transition-colors">
                CASA LIVING
              </span>
              <span className="hidden sm:block text-2xs text-brand-400 uppercase tracking-[0.28em] mt-1.5">
                Furniture &amp; Design
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive(item) ? 'page' : undefined}
                  className={`relative text-[0.8125rem] font-medium transition-colors py-1 ${
                    isActive(item)
                      ? 'text-brand-900'
                      : 'text-brand-500 hover:text-brand-900'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px bg-brand-900 transition-all duration-300 ${
                      isActive(item) ? 'w-full' : 'w-0'
                    }`}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors"
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={openWishlist}
              className="relative p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors"
              aria-label={`Wishlist (${wishlistCount})`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-brand-900 text-white text-[0.5625rem] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors"
              aria-label={`Shopping bag (${cartCount})`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span
                className={`absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[0.5625rem] font-bold transition-colors ${
                  cartCount > 0
                    ? 'bg-accent-500 text-white'
                    : 'bg-brand-200 text-brand-600'
                }`}
              >
                {cartCount}
              </span>
            </button>

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
                placeholder="Search chairs, sofas, lighting..."
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
                      onClick={closeAll}
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
          <div className="container-page py-4 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeAll}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'text-brand-900 bg-brand-100/60'
                    : 'text-brand-600 hover:bg-brand-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
