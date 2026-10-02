import { Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/components/ui';

/**
 * Slide-in bag / wishlist drawer.
 *
 * Opens from the header icons. Prices are derived from the static product file,
 * so the drawer never disagrees with the product page.
 */
export function ShopDrawer() {
  const {
    drawer,
    closeDrawer,
    lines,
    saved,
    subtotal,
    cartCount,
    wishlistCount,
    setLineQty,
    removeLine,
    toggleWishlist,
    addToCart,
    openCart,
  } = useShop();
  const { toast } = useToast();

  if (!drawer) return null;

  const isCart = drawer === 'cart';
  const title = isCart ? 'Your bag' : 'Wishlist';

  const close = () => closeDrawer();

  const handleCheckout = () => {
    close();
    toast('info', 'Checkout is not enabled in this prototype');
  };

  return (
    <>
      {/* Backdrop */}
      <button
        aria-label="Close panel"
        onClick={close}
        className="fixed inset-0 z-[100] bg-brand-950/40 backdrop-blur-[2px] animate-fade-in"
      />

      {/* Panel */}
      <aside
        className="fixed inset-y-0 right-0 z-[101] w-full sm:w-[26rem] bg-white shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-200/70 shrink-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-bold text-brand-900">{title}</h2>
            <span className="text-xs text-brand-400">
              {isCart
                ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                : `${wishlistCount} saved`}
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-400 hover:text-brand-800 hover:bg-brand-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isCart ? (
            lines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8">
                <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-brand-400" />
                </div>
                <p className="text-sm font-semibold text-brand-900">Your bag is empty</p>
                <p className="text-xs text-brand-500 mt-1.5 leading-relaxed">
                  Pieces you add will show up here.
                </p>
                <Link
                  to="/products"
                  onClick={close}
                  className="mt-5 h-10 px-5 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors inline-flex items-center gap-2"
                >
                  Browse furniture <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-brand-200/60">
                {lines.map((line) => (
                  <li key={line.key} className="flex gap-3.5 p-4">
                    <Link
                      to={`/product/${line.product.slug}`}
                      onClick={close}
                      className="w-20 h-24 rounded-xl overflow-hidden bg-surface-100 shrink-0"
                    >
                      <img
                        src={line.product.images[0]?.url}
                        alt={line.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${line.product.slug}`}
                            onClick={close}
                            className="text-sm font-semibold text-brand-900 hover:text-accent-600 transition-colors truncate block"
                          >
                            {line.product.name}
                          </Link>
                          <p className="text-2xs text-brand-400 mt-0.5">
                            {line.variant ? line.variant.name : line.product.material}
                          </p>
                        </div>
                        <button
                          onClick={() => removeLine(line.key)}
                          aria-label={`Remove ${line.product.name}`}
                          className="p-1.5 rounded-lg text-brand-300 hover:text-error hover:bg-error-light transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="flex items-center bg-surface-100 rounded-lg border border-brand-200/70">
                          <button
                            onClick={() => setLineQty(line.key, line.qty - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-brand-500 hover:text-brand-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-brand-900">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => setLineQty(line.key, line.qty + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-brand-500 hover:text-brand-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-brand-900">
                          ${line.lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : saved.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-brand-900">Nothing saved yet</p>
              <p className="text-xs text-brand-500 mt-1.5 leading-relaxed">
                Tap the heart on any piece to keep it here.
              </p>
              <Link
                to="/products"
                onClick={close}
                className="mt-5 h-10 px-5 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors inline-flex items-center gap-2"
              >
                Browse furniture <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-brand-200/60">
              {saved.map((product) => (
                <li key={product.id} className="flex gap-3.5 p-4">
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={close}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-surface-100 shrink-0"
                  >
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={close}
                          className="text-sm font-semibold text-brand-900 hover:text-accent-600 transition-colors truncate block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs font-bold text-brand-900 mt-1">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="p-1.5 rounded-lg text-accent-500 hover:bg-accent-50 transition-colors shrink-0"
                      >
                        <Heart className="w-3.5 h-3.5 fill-accent-500" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product.id, 1, null);
                        close();
                        openCart();
                        toast('success', `${product.name} added to your bag`);
                      }}
                      className="mt-auto h-8 rounded-lg bg-surface-100 border border-brand-200/70 text-xs font-semibold text-brand-800 hover:bg-brand-100 transition-colors"
                    >
                      Move to bag
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {isCart && lines.length > 0 && (
          <div className="border-t border-brand-200/70 px-5 py-4 space-y-3 shrink-0 bg-surface-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-600">Subtotal</span>
              <span className="text-base font-bold text-brand-900">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-2xs text-brand-400">
              Free shipping over $500 &middot; 30-day returns
            </p>
            <button
              onClick={handleCheckout}
              className="w-full h-11 bg-brand-900 text-white rounded-xl text-sm font-semibold hover:bg-brand-800 transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={close}
              className="w-full h-9 text-xs font-medium text-brand-500 hover:text-brand-800 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
