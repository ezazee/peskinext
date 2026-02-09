"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export function NotificationCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-start gap-4">
        {/* Icon Box */}
        <Skeleton.Block width={40} height={40} radius={9999} className="shrink-0" />

        {/* Konten */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton.Block width={60} height={14} className="rounded" />
            <Skeleton.Circle size={4} />
            <Skeleton.Block width={40} height={12} className="rounded" />
          </div>

          <Skeleton.Block width="60%" height={16} className="rounded mb-2" />
          <Skeleton.Text
            lines={2}
            lineHeight={14}
            widths={["95%", "70%"]}
          />

          {/* Action link */}
          <Skeleton.Block width={80} height={14} className="mt-3 rounded" />
        </div>
      </div>
    </div>
  );
}
