"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AddressListSkeletonDesktop() {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6">
      {/* Sidebar skeleton */}
      <aside className="bg-white border rounded-xl p-4 h-fit">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton.Circle size={48} />
          <div className="flex-1">
            <Skeleton width="60%" height={12} radius={6} />
            <Skeleton className="mt-2" width="80%" height={10} radius={6} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton width="80%" height={36} radius={8} />
          <Skeleton width="80%" height={36} radius={8} />
          <Skeleton width="80%" height={36} radius={8} />
        </div>
      </aside>

      {/* Panel kanan skeleton */}
      <main className="bg-white rounded-xl border p-6">
        <Skeleton width="20%" height={18} radius={6} />
        <div className="grid gap-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-4">
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
      </main>
    </div>
  );
}
