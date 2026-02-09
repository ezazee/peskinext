"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AddressListSkeletonDesktop() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <Skeleton width="20%" height={18} radius={6} />
      <div className="grid gap-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg shadow-sm bg-gray-50/50 p-4">
            <Skeleton width="22%" height={14} radius={6} />
            <Skeleton className="mt-2" width="40%" height={12} radius={6} />
            <Skeleton className="mt-1" width="70%" height={12} radius={6} />
            <div className="mt-3 flex gap-2">
              <Skeleton width={120} height={36} radius={8} />
              <Skeleton width={80} height={36} radius={8} />
              <Skeleton width={80} height={36} radius={8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
