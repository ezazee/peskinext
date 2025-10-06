"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AccountDesktopSkeleton() {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-6">
      {/* Sidebar kiri */}
      <aside className="bg-white rounded-xl p-4 shadow-sm">
        {/* Header user */}
        <div className="flex items-center gap-3">
          <Skeleton.Circle size={48} />
          <div className="flex-1 min-w-0">
            <Skeleton.Text lines={1} widths={["60%"]} lineHeight={14} />
            <Skeleton.Text
              className="mt-2"
              lines={1}
              widths={["40%"]}
              lineHeight={12}
            />
          </div>
        </div>

        {/* Balances */}
        <div className="mt-4 space-y-2">
          <BalanceItemSkeleton />
          <BalanceItemSkeleton />
        </div>

        {/* Sections */}
        <div className="mt-6 space-y-5">
          <SectionListSkeleton titleWidth="50%" rows={3} />
          <SectionListSkeleton titleWidth="46%" rows={2} />
          <SectionListSkeleton titleWidth="44%" rows={3} />
        </div>
      </aside>

      {/* Panel kanan */}
      <main className="bg-white border rounded-xl p-6 shadow-sm">
        <Skeleton width="30%" height={18} radius={6} />
        <div className="grid grid-cols-[220px_1fr] gap-6 mt-4">
          {/* Foto + aksi */}
          <div>
            <Skeleton.Block width={220} height={220} radius={12} />
            <Skeleton.Block
              className="mt-3"
              width="100%"
              height={36}
              radius={8}
            />
            <Skeleton.Text
              className="mt-2"
              lines={2}
              lineHeight={12}
              widths={["80%", "60%"]}
            />
            <div className="mt-3 space-y-2">
              <Skeleton.Block width="100%" height={36} radius={8} />
              <Skeleton.Block width="100%" height={36} radius={8} />
              <Skeleton.Block width="100%" height={36} radius={8} />
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FieldRowSkeleton key={i} />
            ))}
            {/* Safe mode toggle */}
            <div className="mt-2">
              <Skeleton width="18%" height={14} radius={6} />
              <Skeleton.Text
                className="mt-2"
                lines={2}
                lineHeight={12}
                widths={["90%", "70%"]}
              />
              <div className="mt-2 flex items-center gap-2">
                <Skeleton width={18} height={18} radius={4} />
                <Skeleton width="12%" height={12} radius={6} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function BalanceItemSkeleton() {
  return (
    <div className="border rounded-lg p-3 flex items-center justify-between">
      <Skeleton width="25%" height={12} radius={6} />
      <Skeleton width="40%" height={14} radius={6} />
    </div>
  );
}

function SectionListSkeleton({
  titleWidth,
  rows,
}: {
  titleWidth: string;
  rows: number;
}) {
  return (
    <div>
      <Skeleton width={titleWidth} height={12} radius={6} />
      <div className="mt-2 space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-2 rounded">
            <Skeleton width={16} height={16} radius={4} />
            <Skeleton width="60%" height={12} radius={6} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldRowSkeleton() {
  return (
    <div className="grid grid-cols-[180px_1fr_auto] items-center gap-3 py-2 border-b">
      <Skeleton width="60%" height={12} radius={6} />
      <Skeleton width="40%" height={12} radius={6} />
      <Skeleton width={64} height={28} radius={8} />
    </div>
  );
}
