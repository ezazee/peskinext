"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AccountMobileSkeleton() {
  return (
    <div className="pb-20">
      {/* Card header akun */}
      <div className="mx-4 mt-4 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Skeleton.Circle size={48} />
          <div className="flex-1 min-w-0">
            <Skeleton.Text lines={1} widths={["60%"]} lineHeight={16} />
            <Skeleton.Text
              className="mt-2"
              lines={1}
              widths={["40%"]}
              lineHeight={12}
            />
          </div>
        </div>
      </div>

      {/* Section: Kotak Masuk */}
      <SectionSkeleton titleWidth="32%" rows={3} className="mt-4 mx-4" />
      {/* Section: Pembelian */}
      <SectionSkeleton titleWidth="28%" rows={2} className="mt-4 mx-4" />
      {/* Section: Profil Saya */}
      <SectionSkeleton titleWidth="30%" rows={3} className="mt-4 mx-4" />
    </div>
  );
}

function SectionSkeleton({
  titleWidth,
  rows,
  className,
}: {
  titleWidth: string;
  rows: number;
  className?: string;
}) {
  return (
    <section className={className}>
      <Skeleton width={titleWidth} height={16} radius={6} />
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-2">
        <Skeleton.List
          count={rows}
          renderItem={() => (
            <div className="flex items-center gap-3 px-4 py-3">
              <Skeleton width="40%" height={14} radius={6} />
              <div className="ml-auto flex items-center gap-2">
                <Skeleton width={24} height={16} radius={6} />
                <Skeleton width={10} height={14} radius={4} />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
