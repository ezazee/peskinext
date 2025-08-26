"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export function MobileDetailSkeleton() {
  return (
    <div className="md:hidden">
      {/* gallery */}
      <div className="relative w-full aspect-square bg-white">
        <Skeleton.Block width="100%" height="100%" />
      </div>

      <div className="p-4 bg-white rounded-t-2xl -mt-4 relative z-10 shadow-sm">
        {/* harga */}
        <div className="flex items-end gap-2">
          <Skeleton.Block width={120} height={28} />
          <Skeleton.Block width={80} height={16} />
          <Skeleton.Block width={40} height={16} />
        </div>

        {/* nama + aksi */}
        <div className="mt-3 flex items-start justify-between gap-3">
          <Skeleton.Text lines={1} widths={["70%"]} />
          <div className="flex gap-3">
            <Skeleton.Block width={24} height={24} radius={6} />
            <Skeleton.Block width={24} height={24} radius={6} />
          </div>
        </div>

        {/* rating & terjual */}
        <div className="mt-2 flex items-center gap-2">
          <Skeleton.Block width={90} height={14} />
          <Skeleton.Block width={8} height={8} radius={9999} />
          <Skeleton.Block width={80} height={14} />
        </div>

        {/* shipping pill */}
        <div className="mt-4">
          <Skeleton.Block width="100%" height={44} radius={12} />
        </div>

        {/* variasi */}
        <div className="mt-4">
          <Skeleton.Block width={140} height={14} />
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton.Block key={i} width={84} height={32} radius={9999} />
            ))}
          </div>
        </div>

        {/* cards */}
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white shadow-sm">
              <div className="px-4 py-3 bg-gray-50 rounded-t-xl">
                <Skeleton.Block width="40%" height={16} />
              </div>
              <div className="px-4 py-3 space-y-2">
                <Skeleton.Text lines={3} widths={["95%", "90%", "70%"]} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* reviews skeleton (opsional) */}
      <div className="mt-4 px-4">
        <Skeleton.Block width="40%" height={18} />
        <div className="mt-2 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg p-3">
              <Skeleton.Text lines={2} widths={["60%", "50%"]} />
              <div className="mt-2">
                <Skeleton.Text lines={2} widths={["90%", "70%"]} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* grid produk (kalau belum reuse dari desktop) */}
      <div className="mt-6 px-4">
        <Skeleton.Block width="30%" height={18} />
        <div className="mt-3 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg p-3">
              <div className="relative w-full aspect-square overflow-hidden rounded-md">
                <Skeleton.Block width="100%" height="100%" />
              </div>
              <div className="mt-2">
                <Skeleton.Text lines={2} widths={["90%", "60%"]} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Skeleton.Block width={90} height={18} />
                <Skeleton.Block width={60} height={18} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* spacer action bar */}
      <div className="h-[116px]" />
    </div>
  );
}
