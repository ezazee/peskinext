"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export function HomePageSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <main className="p-0 md:px-8 md:py-6">
        {/* PromoBanner */}
        <div className="px-0 md:px-0">
          <div className="relative w-full overflow-hidden rounded-none md:rounded-xl">
            <Skeleton.Block width="100%" height="220px" />
          </div>
        </div>

        {/* EventPromo */}
        <section className="mt-6 px-4 md:px-0">
          <Skeleton.Block width="30%" height={18} />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <Skeleton.Block width="100%" height="120px" />
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="mt-6 px-4 md:px-0">
          <Skeleton.Block width="25%" height={18} />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </section>

        {/* PromoShowcase (carousel + tiles) */}
        <section className="mt-6 px-0 md:px-0">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8">
              <div className="relative w-full rounded-xl overflow-hidden">
                <Skeleton.Block width="100%" height="260px" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-4">
              <Skeleton.Block width="100%" height="120px" />
              <Skeleton.Block width="100%" height="120px" />
            </div>
          </div>
        </section>

        {/* Bundle Section */}
        <section className="mt-6 px-4 md:px-0">
          <Skeleton.Block width="28%" height={18} />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg p-3">
                <div className="relative w-full aspect-square overflow-hidden rounded-md">
                  <Skeleton.Block width="100%" height="100%" />
                </div>
                <div className="mt-2">
                  <Skeleton.Text lines={2} widths={["85%", "60%"]} />
                </div>
                <Skeleton.Block
                  width={120}
                  height={28}
                  radius={8}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="mt-6 px-4 md:px-0">
          <Skeleton.Block width="22%" height={18} />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
        </section>
      </main>
    </div>
  );
}
