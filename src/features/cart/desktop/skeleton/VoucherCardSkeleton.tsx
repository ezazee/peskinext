"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function VoucherCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <Skeleton.Text lines={1} lineHeight={16} widths={["35%"]} />
      <Skeleton.Block className="mt-3" height={44} radius={10} />
    </div>
  );
}
