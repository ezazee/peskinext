"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { FilterChipsSkeleton } from "../components/FilterChipsSkeleton";
import { NotificationCardSkeleton } from "../components/NotificationCardSkeleton";

export default function NotificationsMobileSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-2">
        <Skeleton.Block width={120} height={28} className="rounded" />
      </div>

      <div className="sticky top-0 z-10 border-b border-gray-200/50 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">
        <div className="px-4 pb-3 pt-1">
          <FilterChipsSkeleton />
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pb-24 pt-4">
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
