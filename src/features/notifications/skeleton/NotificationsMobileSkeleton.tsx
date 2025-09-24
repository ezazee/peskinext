"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { FilterChipsSkeleton } from "../components/FilterChipsSkeleton";
import { NotificationCardSkeleton } from "../components/NotificationCardSkeleton";

export default function NotificationsMobileSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton.Circle size={28} />
          <Skeleton.Block width={110} height={16} className="rounded" />
        </div>
        <div className="px-4 pb-3">
          <FilterChipsSkeleton />
        </div>
      </div>

      {/* Banner status */}
      <div className="px-4 pt-3">
        <div className="mb-3 flex gap-2">
          <Skeleton.Block width={160} height={22} radius={9999} />
          <Skeleton.Block width={200} height={22} radius={9999} />
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pb-6">
        {Array.from({ length: 2 }).map((_, s) => (
          <section key={s} className="mb-6">
            <Skeleton.Block width={90} height={12} className="mb-2 rounded" />
            <Skeleton.List
              count={3}
              renderItem={(i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <NotificationCardSkeleton />
                </div>
              )}
              gap={12}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
