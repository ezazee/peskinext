"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function CartItemSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
      <div className="flex gap-3">
        {/* checkbox */}
        <Skeleton.Block width={16} height={16} radius={4} className="mt-2" />

        {/* image */}
        <Skeleton.Block width={80} height={80} radius={8} />

        {/* detail */}
        <div className="flex-1 min-w-0">
          <Skeleton.Text lines={2} lineHeight={14} />
          <Skeleton.Text
            className="mt-2"
            lines={1}
            lineHeight={12}
            widths={["40%"]}
          />
          <Skeleton.Block className="mt-2" width={"30%"} height={18} />
        </div>

        {/* actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Skeleton.Circle size={32} />
          <div className="flex items-center gap-1">
            <Skeleton.Block width={36} height={32} radius={6} />
            <Skeleton.Block width={44} height={32} radius={6} />
            <Skeleton.Block width={36} height={32} radius={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
