"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";


export function FilterChipsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton.Block
          key={i}
          width={90}
          height={32}
          radius={9999}
          ariaLabel="Memuat filter"
        />
      ))}
    </div>
  );
}
