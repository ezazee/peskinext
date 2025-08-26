"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export function DesktopDetailSkeleton() {
  return (
    <div className="hidden md:block container mx-auto">
      <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-6">
        {/* Gallery */}
        <section className="col-span-4 row-start-1">
          <div className="sticky top-36">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Skeleton.Block
                width="100%"
                height="100%"
                className="absolute inset-0"
              />
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton.Block
                  key={i}
                  width="100%"
                  height="100%"
                  className="aspect-square rounded-md"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="col-span-5 row-start-1">
          <Skeleton.Text lines={2} widths={["80%", "60%"]} />
          <div className="mt-3 flex items-center gap-3">
            <Skeleton.Block width={120} height={18} />
            <Skeleton.Block width={60} height={18} />
            <Skeleton.Block width={100} height={18} />
          </div>
          <div className="mt-4 flex items-end gap-3">
            <Skeleton.Block width={180} height={36} />
            <Skeleton.Block width={120} height={20} />
            <Skeleton.Block width={42} height={20} />
          </div>
          <div className="mt-6">
            <Skeleton.Text lines={3} widths={["40%", "35%", "50%"]} />
            <div className="flex flex-wrap gap-2 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton.Block key={i} width={96} height={32} radius={9999} />
              ))}
            </div>
          </div>
          <div className="mt-8">
            <div className="flex gap-3 mb-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton.Block key={i} width={110} height={32} radius={8} />
              ))}
            </div>
            <Skeleton.Text lines={4} widths={["100%", "100%", "95%", "60%"]} />
          </div>
        </section>

        {/* Aside */}
        <aside className="col-start-10 col-span-3 row-span-2">
          <div className="sticky top-36 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton.Block width={56} height={56} radius={8} />
              <Skeleton.Text lines={2} widths={["80%", "60%"]} />
            </div>
            <Skeleton.Text lines={3} widths={["60%", "80%", "50%"]} />
            <div className="mt-4 space-y-2">
              <Skeleton.Block width="100%" height={44} radius={10} />
              <Skeleton.Block width="100%" height={44} radius={10} />
            </div>
          </div>
        </aside>

        {/* Review (ringkas) */}
        <section className="col-start-1 col-span-9 row-start-2">
          <div className="rounded-lg p-4">
            <Skeleton.Text lines={1} widths={["30%"]} />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="pb-4">
                  <Skeleton.Text lines={2} widths={["40%", "30%"]} />
                  <div className="mt-3">
                    <Skeleton.Text lines={2} widths={["90%", "60%"]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
