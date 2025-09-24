"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export function NotificationCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Badge kiri */}
        <Skeleton.Block width={64} height={20} radius={6} className="mt-0.5" />

        {/* Konten */}
        <div className="flex-1">
          <Skeleton.Block width="70%" height={16} className="rounded" />
          <Skeleton.Text
            className="mt-2"
            lines={2}
            lineHeight={14}
            widths={["95%", "60%"]}
          />
          {/* Action link (opsional) */}
          <Skeleton.Block width={96} height={14} className="mt-2 rounded" />
        </div>

        {/* Waktu */}
        <Skeleton.Block width={36} height={12} className="ml-2" />
      </div>
    </div>
  );
}
