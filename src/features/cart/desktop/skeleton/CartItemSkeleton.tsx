"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function CartItemCardSkeleton() {
  return (
    <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-4 flex items-start gap-4">
      <Skeleton.Block width={88} height={88} radius={12} />
      <div className="flex-1 min-w-0">
        <Skeleton.Text lines={1} widths={["70%"]} />
        <Skeleton.Text className="mt-2" lines={1} lineHeight={14} widths={["35%"]} />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton.Block width={64} height={16} radius={6} />
          <Skeleton.Block width={36} height={16} radius={6} />
        </div>
        <Skeleton.Block className="mt-2" width={120} height={18} radius={6} />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Skeleton.Circle size={20} />
        <div className="grid grid-cols-3 items-center gap-2">
          <Skeleton.Block width={32} height={32} radius={10} />
          <Skeleton.Block width={42} height={32} radius={10} />
          <Skeleton.Block width={32} height={32} radius={10} />
        </div>
      </div>
    </div>
  );
}
