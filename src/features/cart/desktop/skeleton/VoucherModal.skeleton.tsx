"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function VoucherModalSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* input kode */}
      <div className="px-5 pt-4">
        <div className="flex items-stretch gap-2">
          <Skeleton.Block width="100%" height={44} radius={10} />
          <Skeleton.Block width={90} height={44} radius={10} />
        </div>
      </div>

      {/* tabs */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton.Block height={18} radius={6} />
          <Skeleton.Block height={18} radius={6} />
        </div>
        <Skeleton.Block className="mt-2" width="50%" height={2} radius={2} />
      </div>

      {/* list items */}
      <div className="px-5 py-4">
        <Skeleton.List
          count={5}
          gap={12}
          renderItem={() => (
            <div className="rounded-xl ring-1 ring-gray-200 p-3 flex items-start gap-3">
              <Skeleton.Circle size={16} />
              <div className="flex-1">
                <Skeleton.Text lines={1} widths={["55%"]} />
                <Skeleton.Text
                  className="mt-1"
                  lines={1}
                  lineHeight={12}
                  widths={["40%"]}
                />
                <Skeleton.Block
                  className="mt-2"
                  width={90}
                  height={16}
                  radius={8}
                />
              </div>
            </div>
          )}
        />
      </div>

      {/* footer */}
      <div className="px-5 py-4 border-t bg-white/80 backdrop-blur-sm sticky bottom-0">
        <div className="flex items-center gap-3">
          <Skeleton.Block width={120} height={14} radius={6} />
          <Skeleton.Block
            className="ml-auto"
            width={120}
            height={40}
            radius={999}
          />
        </div>
      </div>
    </div>
  );
}
