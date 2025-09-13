// File: src/features/checkout/CheckoutSkeletonShell.tsx
"use client";

import {
  AddressCardSkeleton,
  SellerCartCardSkeleton,
  VoucherCardSkeleton,
  PaymentMethodsSkeleton,
  OrderSummarySkeleton,
} from "./CheckoutSkeletons";

export default function CheckoutSkeletonShell() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
      {/* LEFT */}
      <section className="col-span-12 lg:col-span-8 space-y-6">
        <AddressCardSkeleton />
        <SellerCartCardSkeleton />
      </section>

      {/* RIGHT */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="space-y-6 lg:sticky lg:top-20">
          <VoucherCardSkeleton />
          <PaymentMethodsSkeleton />
          <OrderSummarySkeleton />

          {/* Payment trust badge skeleton */}
          <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
            <div className="h-[12px] w-28 bg-gray-100 rounded" />
            <div className="mt-2 flex flex-wrap items-center gap-2 opacity-80">
              <span className="inline-block h-6 w-14 rounded bg-gray-100" />
              <span className="inline-block h-6 w-14 rounded bg-gray-100" />
              <span className="inline-block h-6 w-14 rounded bg-gray-100" />
              <span className="inline-block h-6 w-14 rounded bg-gray-100" />
              <span className="inline-block h-6 w-14 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
