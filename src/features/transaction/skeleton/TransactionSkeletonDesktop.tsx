"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function TransactionSkeletonDesktop() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <Skeleton width="30%" height={20} radius={6} />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[120px_140px_1fr_120px_100px_80px] gap-4 items-center border-b pb-3 last:border-0"
          >
            <Skeleton width="100%" height={16} radius={6} />
            <Skeleton width="100%" height={16} radius={6} />
            <Skeleton width="90%" height={16} radius={6} />
            <Skeleton width="100%" height={16} radius={6} />
            <Skeleton width="80%" height={16} radius={6} />
            <Skeleton width="60%" height={30} radius={8} />
          </div>
        ))}
      </div>
    </div>
  );
}
