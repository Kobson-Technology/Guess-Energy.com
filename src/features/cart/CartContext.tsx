'use client';
/**
 * Panier client — stockage localStorage (jamais fiable côté serveur).
 * Au checkout, le serveur revalide TOUJOURS produits, prix et stock.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CART_STORAGE_KEY, MAX_CART_QUANTITY } from '@/lib/constants';
import type { CartItemInput } from '@/types';

export interface StoredCartItem {
  productId: number;
  quantity: number;
  /** Snapshot d'affichage (non fiable — revalidé au checkout) */
  name: string;
  slug: string;
  unitPriceTtc: number;
  reference: string | null;
  hasImage: boolean;
  maxStock: number | null;
}

interface CartContextValue {
  items: StoredCartItem[];
  count: number;
  ready: boolean;
  add(item: Omit<StoredCartItem, 'quantity'>, quantity: number): void;
  setQuantity(productId: number, quantity: number): void;
  remove(productId: number): void;
  clear(): void;
  toast: string | null;
  showToast(message: string): void;
}

const CartContext = createContext<CartContextValue | null>(null);

function load(): StoredCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => Number.isInteger(i?.productId) && i.productId > 0 && Number.isInteger(i?.quantity) && i.quantity > 0)
      .map((i) => ({ ...i, quantity: Math.min(i.quantity, MAX_CART_QUANTITY) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback((item: Omit<StoredCartItem, 'quantity'>, quantity: number) => {
    setItems((prev) => {
      const existing = items.find((i) => i.productId === item.productId);
      const cap = item.maxStock ?? MAX_CART_QUANTITY;
      const nextQty = Math.min((existing?.quantity ?? 0) + quantity, Math.min(MAX_CART_QUANTITY, Math.max(1, cap)));
      if (existing) {
        return items.map((i) => (i.productId === item.productId ? { ...i, quantity: nextQty } : i));
      }
      return [...items, { ...item, quantity: Math.min(quantity, Math.max(1, cap)) }];
    });
  }, [items]);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, MAX_CART_QUANTITY)) } : i)),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
      ready,
      add,
      setQuantity,
      remove,
      clear,
      toast,
      showToast,
    }),
    [items, ready, add, setQuantity, remove, clear, toast, showToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}

/** Convertit le panier local en payload API. */
export function toCartPayload(items: StoredCartItem[]): { productId: number; quantity: number }[] {
  return items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
}