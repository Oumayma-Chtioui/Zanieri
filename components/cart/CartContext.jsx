"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "zanieri_cart_v1";

function lineKey(item) {
  return `${item.id}__${item.size || "unique"}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount (browser only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (err) {
      console.warn("Could not read saved cart:", err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Could not persist cart:", err);
    }
  }, [items, hydrated]);

  function addItem(product, { size = null, quantity = 1 } = {}) {
    setItems((prev) => {
      const key = lineKey({ id: product.id, size });
      const existing = prev.find((line) => lineKey(line) === key);
      if (existing) {
        return prev.map((line) =>
          lineKey(line) === key
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          size,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  }

  function updateQuantity(id, size, quantity) {
    setItems((prev) =>
      prev
        .map((line) =>
          lineKey(line) === lineKey({ id, size })
            ? { ...line, quantity: Math.max(1, quantity) }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  function removeItem(id, size) {
    setItems((prev) => prev.filter((line) => lineKey(line) !== lineKey({ id, size })));
  }

  function clearCart() {
    setItems([]);
  }

  const totals = useMemo(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = items.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0
    );
    return { count, subtotal };
  }, [items]);

  const value = {
    items,
    isOpen,
    setIsOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
