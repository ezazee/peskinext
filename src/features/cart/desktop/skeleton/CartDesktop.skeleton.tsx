"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import CartItemSkeleton from "./CartItemSkeleton";
import VoucherCardSkeleton from "./VoucherCardSkeleton";
import SummaryCardSkeleton from "./SummaryCardSkeleton";



export default function CartDesktopSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="col-span-8">
        {/* Tabs */}
        <div className="mb-3 border-b border-gray-200">
          <div className="py-3">
            <Skeleton.Block width={140} height={18} radius={6} />
          </div>
        </div>

        {/* Select all */}
        <div className="flex items-center gap-3 mb-3">
          <Skeleton.Block width={16} height={16} radius={4} />
          <Skeleton.Block width={140} height={14} />
        </div>

        {/* List items */}
        <Skeleton.List
          count={3}
          gap={16}
          renderItem={() => <CartItemSkeleton />}
        />
      </div>

      {/* RIGHT */}
      <aside className="col-span-4">
        <div className="sticky top-20 space-y-4">
          <VoucherCardSkeleton />
          <SummaryCardSkeleton />
        </div>
      </aside>
    </div>
  );
}
