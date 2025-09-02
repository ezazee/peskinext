"use client";

import { useState } from "react";
import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import type { CartData, VoucherSelection } from "@shared/types/types";
import { useCartState } from "@features/cart/hooks/useCartState";
import SummaryCard from "./desktop/SummaryCard";
import CartItemCard from "./desktop/CartItemCard";
import VoucherCard from "./desktop/VoucherCard";
import VoucherModal from "./desktop/VoucherModal";
import { promoVouchers, shippingVouchers } from "@data/voucher";

export function CartDesktop({ initial }: { initial: CartData }) {
  const { items, counts, totals, actions } = useCartState(initial);
  const hasSelection = counts.selectedCount > 0;
  const canCheckout = totals.subtotal > 0 && hasSelection;

  // voucher state
  const [openVoucher, setOpenVoucher] = useState(false);
  const [voucherLoading] = useState(false); // ganti true saat fetch data voucher
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherSelection>({
    shippingId: null,
    promoId: null,
  });

  const summaryText =
    (selectedVoucher.code ? "Kode dipakai" : "") ||
    (selectedVoucher.shippingId || selectedVoucher.promoId
      ? "Promo terpilih"
      : "");

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-8">
          <div className="mb-3 border-b border-gray-200">
            <nav className="flex gap-6">
              <div className="py-3 border-b-2 border-primary font-semibold text-primary">
                Belanja ({counts.itemCount})
              </div>
            </nav>
          </div>

          <label className="flex items-center gap-3 mb-3">
            <BrandCheckbox
              checked={counts.allSelected}
              onChange={(checked) => actions.toggleSelectAll(checked)}
              ariaLabel="Pilih semua produk"
              size={16}
            />
            <span className="text-sm">Pilih semua produk</span>
          </label>

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
        <aside className="col-span-4">
          <div className="sticky top-20 space-y-4">
            <VoucherCard
              selectable={hasSelection}
              onOpen={() => setOpenVoucher(true)}
              loading={voucherLoading}
              summaryText={summaryText || undefined}
            />
            <SummaryCard total={totals.subtotal} canCheckout={canCheckout} />
          </div>
        </aside>
      </div>

      {/* MODAL */}
      <VoucherModal
        open={openVoucher}
        onClose={() => setOpenVoucher(false)}
        loading={voucherLoading}
        shipping={shippingVouchers}
        promos={promoVouchers}
        initialSelected={selectedVoucher}
        onApply={(payload) => {
          setSelectedVoucher(payload);
          setOpenVoucher(false);
          // TODO: terapkan diskon pada totals (next step)
        }}
      />
    </>
  );
}
