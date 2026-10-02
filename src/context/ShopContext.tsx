import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { demoProducts } from '@/data/products';
import type { Product, ProductVariant } from '@/types';

/**
 * Client-side bag + wishlist state.
 *
 * Everything is in-memory: no accounts, no cart API, no persistence. It exists so
 * the storefront behaves like a real shop — "Add to Cart" fills the bag counter in
 * the header, the heart on a product card saves a piece — while every price and
 * product still comes from the single static product file.
 */

export interface CartLine {
  productId: string;
  variantId: string | null;
  qty: number;
}

export interface CartLineView {
  key: string;
  product: Product;
  variant: ProductVariant | null;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

interface ShopValue {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  wishlistCount: number;
  lines: CartLineView[];
  saved: Product[];
  subtotal: number;
  drawer: 'cart' | 'wishlist' | null;
  addToCart: (productId: string, qty?: number, variantId?: string | null) => void;
  setLineQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  openCart: () => void;
  openWishlist: () => void;
  closeDrawer: () => void;
}

const ShopContext = createContext<ShopValue | null>(null);

const MAX_QTY = 10;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<'cart' | 'wishlist' | null>(null);

  const addToCart = useCallback((productId: string, qty = 1, variantId: string | null = null) => {
    setCart((prev) => {
      const index = prev.findIndex((l) => l.productId === productId && l.variantId === variantId);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], qty: Math.min(MAX_QTY, next[index].qty + qty) };
        return next;
      }
      return [...prev, { productId, variantId, qty: Math.min(MAX_QTY, qty) }];
    });
  }, []);

  const setLineQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          `${line.productId}:${line.variantId ?? 'base'}` === key
            ? { ...line, qty: Math.max(1, Math.min(MAX_QTY, qty)) }
            : line,
        )
        .filter((line) => line.qty > 0),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => `${l.productId}:${l.variantId ?? 'base'}` !== key));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const value = useMemo<ShopValue>(() => {
    const lines = cart.reduce<CartLineView[]>((acc, line) => {
      const product = demoProducts.find((p) => p.id === line.productId);
      if (!product) return acc;
      const variant = line.variantId
        ? (product.variants.find((v) => v.id === line.variantId) ?? null)
        : null;
      const unitPrice = product.price + (variant?.priceModifier ?? 0);
      acc.push({
        key: `${line.productId}:${line.variantId ?? 'base'}`,
        product,
        variant,
        qty: line.qty,
        unitPrice,
        lineTotal: unitPrice * line.qty,
      });
      return acc;
    }, []);

    const saved = wishlist
      .map((id) => demoProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    return {
      cart,
      wishlist,
      cartCount: cart.reduce((sum, line) => sum + line.qty, 0),
      wishlistCount: wishlist.length,
      lines,
      saved,
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      drawer,
      addToCart,
      setLineQty,
      removeLine,
      toggleWishlist,
      isWishlisted: (productId: string) => wishlist.includes(productId),
      openCart: () => setDrawer('cart'),
      openWishlist: () => setDrawer('wishlist'),
      closeDrawer: () => setDrawer(null),
    };
  }, [cart, wishlist, drawer, addToCart, setLineQty, removeLine, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
