"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-4">
      <Skeleton.Block width="40%" height={16} radius={6} />
      <div className="mt-3 flex items-center justify-between">
        <Skeleton.Block width={60} height={14} radius={6} />
        <Skeleton.Block width={90} height={18} radius={6} />
      </div>
      <Skeleton.Block className="mt-3" width="100%" height={44} radius={12} />
      <Skeleton.Block className="mt-2" width="60%" height={12} radius={6} />
    </div>
  );
}
