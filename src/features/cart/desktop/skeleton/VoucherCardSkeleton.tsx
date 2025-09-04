"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export type VoucherCardSkeletonProps = {
  /** "disabled" | "enabled-empty" | "applied" */
  state?: "disabled" | "enabled-empty" | "applied";
};

export default function VoucherCardSkeleton({
  state = "disabled",
}: VoucherCardSkeletonProps) {
  const showInfo = state !== "applied";

  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-200 overflow-hidden">
      {/* INFO / BANNER */}
      <div className="p-4">
        {showInfo ? (
          <div className="flex items-start gap-3">
            <Skeleton.Circle size={32} />
            <Skeleton.Text lines={2} widths={["80%", "60%"]} />
          </div>
        ) : (
          <div className="rounded-xl px-4 py-3 flex items-start gap-3 bg-emerald-50">
            <Skeleton.Circle size={28} />
            <Skeleton.Text lines={2} widths={["70%", "50%"]} />
            <Skeleton.Circle size={28} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200" />

      {/* TITLE */}
      <div className="px-4 pt-3 pb-2">
        <Skeleton.Block width="35%" height={16} radius={6} inline />
      </div>

      {/* PILL */}
      <div className="px-4 pb-4">
        <div
          className={`h-11 w-full rounded-xl px-3 grid grid-cols-[auto_1fr_auto] items-center ${
            state === "disabled" ? "bg-gray-100" : "ring-1 ring-gray-200"
          }`}
        >
          <Skeleton.Block width={18} height={18} radius={4} inline />
          <Skeleton.Block
            width={state === "enabled-empty" ? "60%" : "40%"}
            height={12}
            radius={4}
            className="mx-2"
            inline
          />
          <Skeleton.Circle size={18} />
        </div>
      </div>
    </div>
  );
}
