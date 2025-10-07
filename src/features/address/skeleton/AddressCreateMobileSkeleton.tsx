import React, { type JSX } from "react";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AddressCreateMobileSkeleton(): JSX.Element {
  return (
    <div className="w-full">
      <Skeleton width="40%" height={18} radius={6} />
      <div className="grid gap-3 mt-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="grid gap-1">
            <Skeleton width="36%" height={12} radius={6} />
            <Skeleton width="100%" height={44} radius={10} />
          </div>
        ))}
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <Skeleton width="100%" height={44} radius={10} />
          <Skeleton width={96} height={44} radius={10} />
        </div>
      </div>
    </div>
  );
}
