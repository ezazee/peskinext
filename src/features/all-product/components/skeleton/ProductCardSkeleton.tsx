"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import * as React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Skeleton.Block height={160} />
      <div className="p-3">
        <Skeleton.Text lines={2} lineHeight={14} />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton.Circle size={14} />
          <Skeleton.Block width={40} height={12} radius={4} />
          <Skeleton.Block width={80} height={12} radius={4} />
        </div>
        <div className="mt-3">
          <Skeleton.Block width={100} height={16} radius={6} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Skeleton.Block width={40} height={14} radius={6} />
          <Skeleton.Block width={64} height={12} radius={6} />
        </div>
      </div>
    </div>
  );
}
