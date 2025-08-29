"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function SummaryCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <Skeleton.Text lines={1} lineHeight={16} widths={["40%"]} />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton.Block width={60} height={14} />
        <Skeleton.Block width={100} height={16} />
      </div>
      <Skeleton.Block className="mt-3" height={44} radius={10} />
      <Skeleton.Text className="mt-3" lines={1} lineHeight={12} widths={["60%"]} />
    </div>
  );
}
