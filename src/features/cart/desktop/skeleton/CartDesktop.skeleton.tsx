"use client";

import CartItemCardSkeleton from "./CartItemSkeleton";
import SummaryCardSkeleton from "./SummaryCardSkeleton";
import VoucherCardSkeleton from "./VoucherCardSkeleton";

type Props = {
  /** varian tampilan voucher saat loading */
  voucherState?: "disabled" | "enabled-empty" | "applied";
  itemCount?: number;
};

export default function CartDesktopSkeleton({
  voucherState = "disabled",
  itemCount = 2,
}: Props) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="col-span-8">
        <div className="mb-3 border-b border-gray-200">
          <div className="flex gap-6">
            <div className="py-3 border-b-2 border-transparent">
              <div className="flex items-center gap-2">
                <div className="font-semibold">Belanja</div>
                <span className="text-gray-400 text-sm">(…)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-[4px] ring-1 ring-gray-300 h-4 w-4" />
          <div className="text-sm text-gray-500">Pilih semua produk</div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: itemCount }).map((_, i) => (
            <CartItemCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <aside className="col-span-4">
        <div className="sticky top-20 space-y-4">
          <VoucherCardSkeleton state={voucherState} />
          <SummaryCardSkeleton />
        </div>
      </aside>
    </div>
  );
}
