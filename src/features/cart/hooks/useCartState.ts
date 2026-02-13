// File: src/features/cart/hooks/useCartState.ts
"use client";

import { useMemo, useState, useEffect } from "react";
import type { CartData, CartItem } from "@shared/types/types";
import { saveCart } from "@features/cart/cartService";
import { resolveProductPricing } from "@shared/helpers/product";

import { calculateCartAction } from "@server/cart";

export function useCartState(initial?: CartData) {
  // ← seed aman walau initial undefined
  const seed = initial?.items ?? [];
  const [items, setItems] = useState<CartItem[]>(seed);
  const [isInitialized, setIsInitialized] = useState(false);

  // Totals now state, not derived
  const [totals, setTotals] = useState({
    subtotal: 0,
    compare: 0,
    savings: 0,
  });

  // Track which items are currently "updating" (simulate fetch)
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});

  // Save to localStorage whenever items change (except on initial mount)
  useEffect(() => {
    if (isInitialized) {
      saveCart({ items });
    } else {
      setIsInitialized(true);
    }
  }, [items, isInitialized]);

  // Server-side calculation effect
  useEffect(() => {
    let canceled = false;

    async function calc() {
      try {
        const res = await calculateCartAction(items);
        if (!canceled) {
          setTotals(res);
        }
      } catch (error) {
        console.error("Calc error:", error);
      }
    }

    calc();

    return () => {
      canceled = true;
    };
  }, [items]);


  const counts = useMemo(() => {
    const itemCount = items.length;
    const selectedCount = items.filter((i) => i.selected).length;
    const allSelected = itemCount > 0 && selectedCount === itemCount;
    return { itemCount, selectedCount, allSelected };
  }, [items]);

  function toggleSelectAll(checked: boolean) {
    setItems((prev) => prev.map((i) => ({ ...i, selected: checked })));
  }
  function toggleItem(lineId: string, checked: boolean) {
    setItems((prev) =>
      prev.map((i) => (i.id === lineId ? { ...i, selected: checked } : i))
    );
  }
  function removeItem(lineId: string) {
    setItems((prev) => prev.filter((i) => i.id !== lineId));
  }

  function setQty(lineId: string, qty: number) {
    // 1. Mark as updating
    setUpdatingItems((prev) => ({ ...prev, [lineId]: true }));

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== lineId) return i;
        const variant = i.product.variants.find((v) => v.id === i.variantId);
        const { stock } = resolveProductPricing(i.product, variant);
        const safe = Math.max(1, Math.min(stock, Math.floor(Number(qty) || 1)));
        return { ...i, qty: safe };
      })
    );

    // Clear updating state after a short delay (server action will resolve totals in background)
    // We keep the skeleton for a bit to show "processing" 
    // Since calculateCartAction has 500ms delay, we can adhere to that.

    // Specifically, we want the loader to persist until the server action returns? 
    // But the server action is in a separate useEffect.
    // To synchronize, we could move the calc call here, but that removes the "reactive" nature.

    // For now, I'll keep the manual timeout to clear the spinner, forcing the UI to wait at least 500ms.
    setTimeout(() => {
      setUpdatingItems((prev) => {
        const next = { ...prev };
        delete next[lineId];
        return next;
      });
    }, 600);
  }

  function changeVariant(lineId: string, newVariantId: number) {
    // 1. Mark as updating
    setUpdatingItems((prev) => ({ ...prev, [lineId]: true }));

    // Optimistic Logic
    setItems((prev) => {
      const currentItem = prev.find((i) => i.id === lineId);
      if (!currentItem) return prev; // Should not happen

      const product = currentItem.product;
      // ... (find variant logic) ... 
      const targetVariant = product.variants.find((v) => v.id === newVariantId);
      if (!targetVariant) return prev;

      // Check for duplicate
      const duplicateIndex = prev.findIndex(
        (i) =>
          i.id !== lineId &&
          i.product.id === product.id &&
          i.variantId === newVariantId
      );

      if (duplicateIndex >= 0) {
        // Merge logic
        const next = [...prev];
        const existing = next[duplicateIndex];
        const totalQty = existing.qty + currentItem.qty;
        const safeQty = Math.min(totalQty, targetVariant.stock);

        next[duplicateIndex] = { ...existing, qty: safeQty };
        return next.filter((i) => i.id !== lineId);
      }

      return prev.map((i) =>
        i.id === lineId ? { ...i, variantId: newVariantId } : i
      );
    });

    setTimeout(() => {
      setUpdatingItems((prev) => {
        const next = { ...prev };
        delete next[lineId];
        return next;
      });
    }, 600);
  }

  return {
    items,
    counts,
    totals,
    updatingItems,
    actions: { toggleSelectAll, toggleItem, removeItem, setQty, changeVariant },
  };
}
