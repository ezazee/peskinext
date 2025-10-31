"use client";

import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/libs/format";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createCheckoutFromCart } from "@features/checkout/action";
import { useRef } from "react";

type Props = {
  total: number;
  hasSelection: boolean;
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  canCheckout: boolean;

  /** kontrol voucher */
  onOpenVoucher: () => void;
  voucherAppliedCount?: number;
  voucherSavingText?: string;
  voucherLoading?: boolean;
  isLoggedIn?: boolean;
  cartItems?: unknown[]; // For checkout
};

export default function MobileBottomBar({
  total,
  hasSelection,
  allSelected,
  onToggleAll,
  canCheckout,
  onOpenVoucher,
  voucherAppliedCount = 0,
  voucherSavingText,
  voucherLoading = false,
  isLoggedIn = false,
  cartItems = [],
}: Props) {
  const router = useRouter();
  const checkoutFormRef = useRef<HTMLFormElement>(null);
  const disabledVoucher = !hasSelection || voucherLoading;
  const disabledCheckout = !canCheckout;

  const hasApplied = voucherAppliedCount > 0;

  return (
    <>
      {/* Hidden form for checkout */}
      <form ref={checkoutFormRef} action={createCheckoutFromCart} className="hidden">
        <input
          type="hidden"
          name="cartItems"
          value={JSON.stringify(cartItems)}
        />
      </form>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
      {/* Voucher field */}
      <div className="px-4 pt-3">
        <motion.button
          type="button"
          aria-disabled={disabledVoucher}
          disabled={disabledVoucher}
          onClick={!disabledVoucher ? onOpenVoucher : undefined}
          whileTap={!disabledVoucher ? { scale: 0.98 } : undefined}
          className={`w-full h-11 cursor-pointer rounded-xl px-3 text-left text-[13px] grid grid-cols-[1fr_auto] items-center
            ${
              disabledVoucher
                ? "bg-gray-100 text-gray-400 pointer-events-none"
                : "bg-white text-gray-700 ring-1 ring-gray-200"
            }`}
        >
          <span className="truncate">
            {hasApplied
              ? `${voucherAppliedCount} voucher terpakai`
              : disabledVoucher
              ? "Pilih produk sebelum pakai promo"
              : "Pilih voucher / masukkan kode"}
          </span>
          {hasApplied && !!voucherSavingText && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
              {voucherSavingText}
            </span>
          )}
        </motion.button>
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
            if (!disabledCheckout) {
              if (isLoggedIn) {
                checkoutFormRef.current?.requestSubmit();
              } else {
                router.push("/login?callbackUrl=/cart");
              }
            }
          }}
          className={`h-11 px-4 rounded-full cursor-pointer text-white font-semibold
            ${
              disabledCheckout
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-secondary"
            }`}
        >
          {isLoggedIn ? "Checkout" : "Login"}
        </button>
      </div>

      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
    </>
  );
}
