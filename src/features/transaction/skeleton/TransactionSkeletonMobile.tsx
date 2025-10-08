"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function TransactionSkeletonMobile() {
  return (
    <div>
      <Skeleton width="40%" height={18} radius={6} />
      <div className="mt-3 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton width="40%" height={14} radius={6} />
              <Skeleton width="25%" height={14} radius={6} />
            </div>
            <Skeleton width="60%" height={12} radius={6} />
            <div className="space-y-1">
              <Skeleton width="90%" height={12} radius={6} />
              <Skeleton width="70%" height={12} radius={6} />
              <Skeleton width="80%" height={12} radius={6} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton width="40%" height={14} radius={6} />
              <Skeleton width="60px" height={32} radius={8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
