"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function TransactionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-sky-50 to-white border rounded-2xl p-6 shadow-sm">
        <Skeleton width="20%" height={14} radius={6} />
        <Skeleton className="mt-2" width="30%" height={22} radius={8} />
        <Skeleton className="mt-2" width="40%" height={14} radius={6} />
        <Skeleton className="mt-4" width="60%" height={8} radius={6} />
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <Skeleton width="25%" height={16} radius={6} />
        <div className="mt-3 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 items-center border rounded-xl p-3"
            >
              <Skeleton width={72} height={72} radius={10} />
              <div className="flex-1 min-w-0">
                <Skeleton width="60%" height={14} radius={6} />
                <Skeleton className="mt-2" width="40%" height={12} radius={6} />
                <Skeleton className="mt-2" width="30%" height={12} radius={6} />
              </div>
              <Skeleton width={90} height={16} radius={6} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <Skeleton width="15%" height={14} radius={6} />
          <Skeleton width="20%" height={18} radius={6} />
        </div>
      </div>
    </div>
  );
}
