"use client";

import type { CartData } from "@shared/types/types";
import { useCartState } from "@features/cart/hooks/useCartState";
import MobileCartItem from "./mobile/MobileCartItem";
import MobileBottomBar from "./mobile/MobileBottomBar";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { productsData } from "@data/products";

/** Banner promo sederhana ala screenshot */
function FreeShippingBanner() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3 flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center shrink-0">
        🚚
      </div>
      <div className="text-[13px] text-gray-700">
        Pilih produk dari Bag untuk dapatkan voucher gratis ongkir.
      </div>
    </div>
  );
}

export function CartMobile({ initial }: { initial: CartData }) {
  const { items, counts, totals, actions } = useCartState(initial);

  const hasSelection = counts.selectedCount > 0;
  const canCheckout = totals.subtotal > 0 && hasSelection;

  return (
    <div className="pb-36 px-4 pt-3 space-y-3">
      {/* promo banner */}
      <FreeShippingBanner />

      {/* (opsional) lokasi/gudang bisa ditambahkan di sini */}

      {/* “store section” */}
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
            />
          ))}
        </div>

        {/* promo seller ala “Masih butuh yang lain? Tambah” */}
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-[12px] text-gray-700 flex items-center justify-between">
          <span>
            Masih butuh yang lain? Tambah dari seller ini, mumpung diskon!
          </span>
          <button
            type="button"
            className="text-primary font-semibold text-[12px]"
          >
            Tambah
          </button>
        </div>
      </div>

      <ProductGrid products={productsData} limit={6} />

      {/* bottom bar (sticky) */}
      <MobileBottomBar
        total={totals.subtotal}
        hasSelection={hasSelection}
        allSelected={counts.allSelected}
        onToggleAll={(checked) => actions.toggleSelectAll(checked)}
        canCheckout={canCheckout}
      />
    </div>
  );
}
