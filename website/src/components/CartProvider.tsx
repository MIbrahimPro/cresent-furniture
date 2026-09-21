"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  ready: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, options: Record<string, string>) => void;
  setQty: (productId: string, options: Record<string, string>, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "crescent-cart-v1";

function sameOption(a: Record<string, string>, b: Record<string, string>) {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.length !== kb.length) return false;
  return ka.every((k) => a[k] === b[k]);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted storage — start fresh
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    function mutate(fn: (items: CartItem[]) => CartItem[]) {
      setItems((prev) => fn(prev));
    }
    return {
      items,
      ready,
      addItem: (item) =>
        mutate((prev) => {
          const idx = prev.findIndex(
            (i) => i.productId === item.productId && sameOption(i.options, item.options),
          );
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
            return next;
          }
          return [...prev, item];
        }),
      removeItem: (productId, options) =>
        mutate((prev) => prev.filter((i) => !(i.productId === productId && sameOption(i.options, options)))),
      setQty: (productId, options, qty) =>
        mutate((prev) => {
          if (qty <= 0) {
            return prev.filter((i) => !(i.productId === productId && sameOption(i.options, options)));
          }
          return prev.map((i) =>
            i.productId === productId && sameOption(i.options, options) ? { ...i, qty } : i,
          );
        }),
      clear: () => mutate(() => []),
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
