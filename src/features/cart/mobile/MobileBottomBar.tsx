"use client";

import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/libs/format";
import { useRouter } from "next/navigation";

export default function MobileBottomBar({
  total,
  hasSelection,
  allSelected,
  onToggleAll,
  canCheckout,
}: {
  total: number;
  hasSelection: boolean;
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  canCheckout: boolean;
}) {
  const router = useRouter();
  const disabledVoucher = !hasSelection;
  const disabledCheckout = !canCheckout;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
      {/* Voucher field */}
      <div className="px-4 pt-3">
        <button
          type="button"
          aria-disabled={disabledVoucher}
          disabled={disabledVoucher}
          className={`w-full h-11 rounded-xl border px-3 text-left text-[13px]
            ${
              disabledVoucher
                ? "bg-gray-100 text-gray-400 pointer-events-none"
                : "bg-white text-gray-600"
            }`}
        >
          {disabledVoucher
            ? "Pilih produk sebelum pakai promo"
            : "Pilih voucher / masukkan kode"}
        </button>
      </div>

      {/* Row: select all + total + checkout */}
      <div className="px-4 py-3 flex items-center gap-3">
        <label className="flex items-center gap-2">
          <BrandCheckbox
            checked={allSelected}
            onChange={onToggleAll}
            ariaLabel="Pilih semua"
            size={16}
          />
          <span className="text-[13px] text-gray-700">Semua</span>
        </label>

        <div className="ml-auto text-right">
          <div className="text-xs text-gray-500 leading-tight">Total</div>
          <div className="text-[15px] font-bold text-gray-900 leading-tight">
            {formatRupiah(total)}
          </div>
        </div>

        <button
          type="button"
          aria-disabled={disabledCheckout}
          disabled={disabledCheckout}
          onClick={() => {
            if (!disabledCheckout) router.push("/checkout");
          }}
          className={`h-11 px-4 rounded-full cursor-pointer text-white font-semibold
            ${
              disabledCheckout
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-secondary"
            }`}
        >
          Checkout
        </button>
      </div>

      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
