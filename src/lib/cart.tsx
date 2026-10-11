"use client";

import * as React from "react";

export type CartLineItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  stockQuantity: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartLineItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  loaded: boolean;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ik-electronics-cart";

function readStoredCart(): CartLineItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is CartLineItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartLineItem).id === "string" &&
        typeof (item as CartLineItem).name === "string" &&
        typeof (item as CartLineItem).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartLineItem[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setItems(readStoredCart());
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode, quota). Cart stays in memory.
    }
  }, [items, loaded]);

  const addItem = React.useCallback((item: Omit<CartLineItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (!existing) {
        return [...current, { ...item, quantity: Math.max(1, Math.min(quantity, item.stockQuantity)) }];
      }

      const nextQuantity = Math.min(existing.quantity + quantity, item.stockQuantity);
      return current.map((line) => (line.id === item.id ? { ...line, quantity: nextQuantity } : line));
    });
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.map((line) => {
        if (line.id !== id) {
          return line;
        }

        return {
          ...line,
          quantity: Math.max(1, Math.min(quantity, Math.max(line.stockQuantity, 1))),
        };
      }),
    );
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((current) => current.filter((line) => line.id !== id));
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((total, line) => total + line.quantity, 0);
  const subtotal = items.reduce((total, line) => total + line.price * line.quantity, 0);

  const value = React.useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear, loaded }),
    [items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear, loaded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}