"use client";

import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/helpers/pricing";
import { useRouter } from "next/navigation";
import { createCheckoutFromCart } from "@features/checkout/action";
import { useRef } from "react";

import { Skeleton } from "@shared/components/ui/Skeleton";

type Props = {
  total: number;
  hasSelection: boolean;
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  canCheckout: boolean;
  isLoggedIn?: boolean;
  cartItems?: unknown[]; // For checkout
  loading?: boolean;
};

export default function MobileBottomBar({
  total,
  allSelected,
  onToggleAll,
  canCheckout,
  isLoggedIn = false,
  cartItems = [],
  loading = false,
}: Props) {
  const router = useRouter();
  const checkoutFormRef = useRef<HTMLFormElement>(null);
  // Disable checkout if loading
  const disabledCheckout = !canCheckout || loading;

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
        {/* Row: select all + total + checkout */}
        <div className="px-4 py-3 flex items-center gap-3">
          <label className="flex items-center gap-2">
            <BrandCheckbox
              checked={allSelected}
              onChange={onToggleAll}
              ariaLabel="Pilih semua"
              size={16}
              disabled={loading}
            />
            <span className="text-[13px] text-gray-700">Semua</span>
          </label>

          <div className="ml-auto text-right min-w-[100px] flex flex-col items-end">
            <div className="text-xs text-gray-500 leading-tight">Total</div>
            <div className="text-[15px] font-bold text-gray-900 leading-tight h-5">
              {loading ? <Skeleton className="h-4 w-24" /> : formatRupiah(total)}
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
            ${disabledCheckout
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
