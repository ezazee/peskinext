// File: src/features/checkout/desktop/CheckoutSkeletons.tsx
"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export function AddressCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-4">
        <Skeleton width={160} height={20} className="rounded" />
        <Skeleton width={64} height={16} className="rounded" />
      </div>
      <div className="px-6 py-5">
        <Skeleton.Text lines={1} lineHeight={18} widths={["40%"]} />
        <Skeleton.Text
          className="mt-2"
          lines={1}
          lineHeight={16}
          widths={["30%"]}
        />
        <Skeleton.Text className="mt-2" lines={2} lineHeight={14} />
      </div>
    </div>
  );
}

export function SellerCartCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <Skeleton width={120} height={18} className="rounded" />
      <div className="mt-4 space-y-3">
        <Skeleton.List
          count={3}
          renderItem={() => (
            <div className="flex gap-3">
              <Skeleton.Block width={72} height={72} radius={8} />
              <div className="flex-1">
                <Skeleton.Text lines={2} />
                <Skeleton.Text className="mt-2" lines={1} widths={["30%"]} />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export function VoucherCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <Skeleton width={140} height={18} className="rounded" />
      <Skeleton.Text className="mt-2" lines={2} />
      <Skeleton width={"100%"} height={36} className="mt-3 rounded-lg" />
    </div>
  );
}

export function PaymentMethodsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <Skeleton width={160} height={18} className="rounded" />
      <Skeleton.List
        className="mt-3"
        count={4}
        renderItem={() => (
          <Skeleton.Block height={40} radius={12} className="w-full" />
        )}
      />
    </div>
  );
}

export function OrderSummarySkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <Skeleton width={150} height={18} className="rounded" />
      <Skeleton.Text className="mt-3" lines={3} />
      <div className="mt-3 h-px bg-gray-200" />
      <Skeleton.Text className="mt-3" lines={2} widths={["40%", "60%"]} />
      <Skeleton.Block className="mt-4" height={44} radius={10} />
    </div>
  );
}
