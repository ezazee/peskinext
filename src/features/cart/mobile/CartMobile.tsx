// File: src/features/cart/MobileCart.tsx
"use client";

import { useEffect, useState } from "react";
import type { CartData } from "@shared/types/types";
import { useCartState } from "@features/cart/hooks/useCartState";
import MobileCartItem from "./MobileCartItem";
import MobileBottomBar from "./MobileBottomBar";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import type { Product } from "@shared/types/types";
import { getRecommendations } from "@features/product/services/productService";

/* =========================================================================
 * Utilities
 * ========================================================================= */
function InfoBanner() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3 flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center shrink-0">
        🚚
      </div>
      <div className="text-[13px] text-gray-700">
        Voucher dan promo tersedia di halaman checkout. Pilih produk Anda sekarang.
      </div>
    </div>
  );
}

/* =========================================================================
 * Component
 * ========================================================================= */
export function CartMobile({ initial, isLoggedIn = false }: { initial: CartData; isLoggedIn?: boolean }) {
  const { items, counts, totals, actions, updatingItems } = useCartState(initial);

  const hasSelection = counts.selectedCount > 0;
  const canCheckout = totals.subtotal > 0 && hasSelection;

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  useEffect(() => {
    getRecommendations(6).then(setRecommendations);
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <div className="pb-36 px-4 pt-3 space-y-3">
      <InfoBanner />

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="mb-3 border-b border-gray-200">
          <nav className="flex gap-6">
            <div className="py-3 border-b-2 border-primary font-semibold text-primary">
              Belanja ({counts.itemCount})
            </div>
          </nav>
        </div>

        <div className="space-y-3">
          {items.map((line) => (
            <MobileCartItem
              key={line.id}
              line={line}
              onToggle={(checked) => actions.toggleItem(line.id, checked)}
              onQty={(q) => actions.setQty(line.id, q)}
              onRemove={() => actions.removeItem(line.id)}
              onChangeVariant={(vid) => actions.changeVariant?.(line.id, vid)}
              loading={!!updatingItems?.[line.id]}
            />
          ))}
        </div>
      </div>

      <ProductGrid products={recommendations} limit={6} />

      {/* Bottom bar */}
      <MobileBottomBar
        total={totals.subtotal}
        hasSelection={hasSelection}
        allSelected={counts.allSelected}
        onToggleAll={(checked) => actions.toggleSelectAll(checked)}
        canCheckout={canCheckout}
        isLoggedIn={isLoggedIn}
        cartItems={items}
        loading={Object.keys(updatingItems ?? {}).length > 0}
      />
    </div>
  );
}
