"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { FilterChipsSkeleton } from "../components/FilterChipsSkeleton";
import { NotificationCardSkeleton } from "../components/NotificationCardSkeleton";

export default function NotificationsDesktopSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      {/* Header + filter */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Skeleton.Block width={140} height={20} className="rounded" />
        <FilterChipsSkeleton />
      </div>

      {/* Banner status */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton.Block width={170} height={24} radius={9999} />
        <Skeleton.Block width={210} height={24} radius={9999} />
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {Array.from({ length: 2 }).map((_, s) => (
          <section key={s}>
            <Skeleton.Block width={120} height={14} className="mb-3 rounded" />
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
