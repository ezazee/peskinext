"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { FilterChipsSkeleton } from "../components/FilterChipsSkeleton";
import { NotificationCardSkeleton } from "../components/NotificationCardSkeleton";

export default function NotificationsDesktopSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Header + filter */}
      <div className="mb-8">
        <Skeleton.Block width={180} height={32} className="mb-6 rounded" />
        <FilterChipsSkeleton />
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
