"use client";

import { useMemo, useState } from "react";
import type { CartData, CartItem, Product, Variant } from "@shared/types/types";

/* util: ubah "Rp1.469.000" -> 1469000 */
function parsePriceString(s?: string): number | undefined {
  if (!s) return undefined;
  const digits = s.replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

/** hitung harga, oldPrice, stok berdasar varian (jika ada) */
function resolvePricing(p: Product, v?: Variant) {
  const unit =
    typeof v?.price === "number" ? v.price : parsePriceString(p.price) ?? 0;
  const old = v?.oldPrice ?? parsePriceString(p.oldPrice);
  const stock = typeof v?.stock === "number" ? v.stock : 999;
  return { unit, old, stock };
}

export function useCartState(initial: CartData) {
  const [items, setItems] = useState<CartItem[]>(initial.items);

  const counts = useMemo(() => {
    const itemCount = items.length;
    const selectedCount = items.filter((i) => i.selected).length;
    const allSelected = itemCount > 0 && selectedCount === itemCount;
    return { itemCount, selectedCount, allSelected };
  }, [items]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let compare = 0;

    for (const line of items) {
      if (!line.selected) continue;
      const variant = line.product.variants.find(
        (v) => v.id === line.variantId
      );
      const { unit, old } = resolvePricing(line.product, variant);
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
        const { stock } = resolvePricing(i.product, variant);
        const safe = Math.max(1, Math.min(stock, Math.floor(Number(qty) || 1)));
        return { ...i, qty: safe };
      })
    );
  }

  return {
    items,
    counts,
    totals,
    actions: { toggleSelectAll, toggleItem, removeItem, setQty },
  };
}
