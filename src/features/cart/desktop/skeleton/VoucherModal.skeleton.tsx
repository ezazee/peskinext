"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";


export default function VoucherModalSkeleton() {
  return (
    <>
      {/* kode promo */}
      <div className="px-5 pt-4">
        <div className="flex items-stretch gap-2">
          <Skeleton.Block height={40} radius={10} className="flex-1" />
          <Skeleton.Block height={40} radius={10} width={80} />
        </div>
      </div>

      {/* tabs */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton.Block height={20} radius={8} />
          <Skeleton.Block height={20} radius={8} />
        </div>
        <Skeleton.Block className="mt-2" height={2} radius={2} />
      </div>

      {/* list items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <Skeleton.Text lines={1} lineHeight={16} widths={["30%"]} />
        <div className="mt-2 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border p-3">
              <div className="flex items-start gap-3">
                <Skeleton.Block width={16} height={16} radius={4} />
                <div className="flex-1">
                  <Skeleton.Text
                    lines={2}
                    lineHeight={14}
                    widths={["60%", "40%"]}
                  />
                  <Skeleton.Block
                    className="mt-2"
                    width={120}
                    height={18}
                    radius={6}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Skeleton.Text
          className="mt-4"
          lines={1}
          lineHeight={16}
          widths={["35%"]}
        />
        <div className="mt-2 space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border p-3">
              <div className="flex items-start gap-3">
                <Skeleton.Block width={16} height={16} radius={4} />
                <div className="flex-1">
                  <Skeleton.Text
                    lines={2}
                    lineHeight={14}
                    widths={["65%", "50%"]}
                  />
                  <Skeleton.Block
                    className="mt-2"
                    width={120}
                    height={18}
                    radius={6}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="px-5 py-4 border-t flex items-center">
        <Skeleton.Block width={160} height={14} />
        <Skeleton.Block
          className="ml-auto"
          width={100}
          height={40}
          radius={999}
        />
      </div>
    </>
  );
}
