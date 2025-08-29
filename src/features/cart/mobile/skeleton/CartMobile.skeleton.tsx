"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";


function BannerSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3 flex items-start gap-3">
      <Skeleton.Circle size={32} />
      <Skeleton.Text lines={2} lineHeight={12} widths={["80%", "60%"]} />
    </div>
  );
}

function ItemSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3">
      <div className="flex items-start gap-3">
        <Skeleton.Block width={16} height={16} radius={4} className="mt-2" />
        <Skeleton.Block width={64} height={64} radius={8} />
        <div className="flex-1 min-w-0">
          <Skeleton.Text lines={2} lineHeight={12} />
          <Skeleton.Text
            className="mt-2"
            lines={1}
            lineHeight={12}
            widths={["50%"]}
          />
          <Skeleton.Block className="mt-2" width={"40%"} height={16} />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton.Circle size={28} />
            <Skeleton.Block width={100} height={28} radius={6} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomBarSkeleton() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
      <div className="px-4 pt-3">
        <Skeleton.Block height={44} radius={12} />
      </div>
      <div className="px-4 py-3 flex items-center gap-3">
        <Skeleton.Block width={16} height={16} radius={4} />
        <Skeleton.Block width={70} height={14} />
        <div className="ml-auto text-right">
          <Skeleton.Block width={50} height={10} />
          <Skeleton.Block className="mt-1" width={90} height={16} />
        </div>
        <Skeleton.Block width={120} height={44} radius={999} />
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}

export default function CartMobileSkeleton() {
  return (
    <div className="pb-36 px-4 pt-3 space-y-3">
      <BannerSkeleton />
      <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
        {[0, 1, 2].map((i) => (
          <ItemSkeleton key={i} />
        ))}
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
          <Skeleton.Text lines={1} lineHeight={12} widths={["70%"]} />
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <Skeleton.Text lines={1} lineHeight={12} widths={["40%"]} />
        <Skeleton.Text
          className="mt-2"
          lines={1}
          lineHeight={10}
          widths={["60%"]}
        />
      </div>
      <BottomBarSkeleton />
    </div>
  );
}
