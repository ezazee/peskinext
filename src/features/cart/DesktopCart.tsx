"use client";

import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import type { CartData } from "@shared/types/types";
import { useCartState } from "@features/cart/hooks/useCartState";
import VoucherCard from "./desktop/VoucherCard";
import SummaryCard from "./desktop/SummaryCard";
import CartItemCard from "./desktop/CartItemCard";

// gunakan path ProductGrid yang sudah kamu pakai
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { productsData } from "@data/products";

export function CartDesktop({ initial }: { initial: CartData }) {
  const { items, counts, totals, actions } = useCartState(initial);

  const hasSelection = counts.selectedCount > 0;
  const canCheckout = totals.subtotal > 0 && hasSelection;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6">
      {/* ====== GRID ATAS: cart (kiri) + summary (kanan) ====== */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 md:col-span-8">
          {/* Tabs */}
          <div className="mb-3 border-b border-gray-200">
            <nav className="flex gap-6">
              <div className="py-3 border-b-2 border-primary font-semibold text-primary">
                Belanja ({counts.itemCount})
              </div>
            </nav>
          </div>

          {/* Select all */}
          <label className="flex items-center gap-3 mb-3">
            <BrandCheckbox
              checked={counts.allSelected}
              onChange={(checked) => actions.toggleSelectAll(checked)}
              ariaLabel="Pilih semua produk"
              size={16}
            />
            <span className="text-sm">Pilih semua produk</span>
          </label>

          {/* List items */}
          <div className="space-y-4">
            {items.map((line) => (
              <CartItemCard
                key={line.id}
                line={line}
                onToggle={(checked) => actions.toggleItem(line.id, checked)}
                onQty={(q) => actions.setQty(line.id, q)}
                onRemove={() => actions.removeItem(line.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <aside className="col-span-12 md:col-span-4">
          <div className="sticky top-20 space-y-4">
            <VoucherCard selectable={hasSelection} />
            <SummaryCard total={totals.subtotal} canCheckout={canCheckout} />
          </div>
        </aside>
      </div>

      {/* ====== REKOMENDASI (full width) ====== */}
      <hr className="my-8 border-gray-200" />
      <ProductGrid products={productsData} />
    </div>
  );
}
