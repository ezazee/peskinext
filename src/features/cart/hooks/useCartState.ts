// File: src/features/cart/hooks/useCartState.ts
"use client";

import { useMemo, useState, useEffect } from "react";
import type { CartData, CartItem } from "@shared/types/types";
import { saveCart } from "@features/cart/cartService";
import { resolveProductPricing } from "@shared/helpers/product";

export function useCartState(initial?: CartData) {
  // ← seed aman walau initial undefined
  const seed = initial?.items ?? [];
  const [items, setItems] = useState<CartItem[]>(seed);
  const [isInitialized, setIsInitialized] = useState(false);

  // Save to localStorage whenever items change (except on initial mount)
  useEffect(() => {
    if (isInitialized) {
      saveCart({ items });
    } else {
      setIsInitialized(true);
    }
  }, [items, isInitialized]);

  const counts = useMemo(() => {
    const itemCount = items.length;
    const selectedCount = items.filter((i) => i.selected).length;
    const allSelected = itemCount > 0 && selectedCount === itemCount;
    return { itemCount, selectedCount, allSelected };
  }, [items]);

  const totals = useMemo(() => {
    let subtotal = 0,
      compare = 0;
    for (const line of items) {
      if (!line.selected) continue;
      const variant = line.product.variants.find(
        (v) => v.id === line.variantId
      );
      const { unit, old } = resolveProductPricing(line.product, variant);
      subtotal += unit * line.qty;
      compare += (old ?? unit) * line.qty;
    }
    const savings = Math.max(0, compare - subtotal);
    return { subtotal, compare, savings };
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
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== lineId) return i;
        const variant = i.product.variants.find((v) => v.id === i.variantId);
        const { stock } = resolveProductPricing(i.product, variant);
        const safe = Math.max(1, Math.min(stock, Math.floor(Number(qty) || 1)));
        return { ...i, qty: safe };
      })
    );
  }

  function changeVariant(lineId: string, newVariantId: number) {
    setItems((prev) => {
      const currentItem = prev.find((i) => i.id === lineId);
      if (!currentItem) return prev;

      const product = currentItem.product;
      const targetVariant = product.variants.find((v) => v.id === newVariantId);
      if (!targetVariant) return prev; // Invalid variant

      // Check for duplicate (same product + same target variant) in other lines
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
        // Cap at stock
        const safeQty = Math.min(totalQty, targetVariant.stock);

        next[duplicateIndex] = { ...existing, qty: safeQty };
        // Remove the current item (since it merged into existing)
        return next.filter((i) => i.id !== lineId);
      }

      // No duplicate, just update variantId
      return prev.map((i) =>
        i.id === lineId ? { ...i, variantId: newVariantId } : i
      );
    });
  }

  return {
    items,
    counts,
    totals,
    actions: { toggleSelectAll, toggleItem, removeItem, setQty, changeVariant },
  };
}
