"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";


export function FilterChipsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2.5 overflow-x-hidden pb-1">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton.Block
          key={i}
          width={i === 0 ? 80 : 90}
          height={34}
          radius={9999}
          ariaLabel="Memuat filter"
        />
      ))}
    </div>
  );
}
