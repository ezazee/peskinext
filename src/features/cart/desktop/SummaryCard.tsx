"use client";

import { useRouter } from "next/navigation";
import { formatRupiah } from "@shared/libs/format";

type Props = { total: number; canCheckout: boolean };

export default function SummaryCard({ total, canCheckout }: Props) {
  const disabled = !canCheckout;
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Detail pesanan</h3>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Total</span>
        <span className="font-semibold text-gray-900">
          {formatRupiah(total)}
        </span>
      </div>

      <button
        type="button"
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => {
          if (!disabled) router.push("/checkout");
        }}
        className={`mt-3 w-full h-11 rounded-lg transition text-white
          ${
            disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
              : "bg-primary hover:bg-red-500 cursor-pointer"
          }`}
      >
        Checkout
      </button>

      <p className="mt-3 text-center text-xs text-gray-500">
        Pembayaranmu aman di PESkinPro.
      </p>
    </div>
  );
}
