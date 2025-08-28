// shared/lazy/index.ts
import type { PromoShowcaseProps, Product } from "@shared/types/types";
import { lazyOnView, lazyOnViewNamed } from "./LazyOnView";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

/* ===== Skeleton kecil per section ===== */
const BannerSkeleton = <Skeleton.Block height={140} radius={12} />;
const EventPromoSkeleton = <Skeleton.Block height={220} radius={12} />;
const FlashSaleSkeleton = <Skeleton.Block height={320} radius={12} />;
const BundleSkeleton = <Skeleton.Block height={260} radius={12} />;
const PromoShowcaseSkeleton = <Skeleton.Block height={300} radius={12} />;

/* ===== Product Grid Skeleton (responsive) ===== */
function ProductGridSkeleton() {
  // kartu produk minimal: gambar + dua baris text
  const Card = () => (
    <div className="space-y-2">
      <Skeleton.Block height={180} radius={12} />
      <Skeleton.Text lines={2} widths={["90%", "70%"]} />
    </div>
  );
  return (
    <div className="mt-0 md:mt-8 p-4 md:p-0">
      <Skeleton.Text lines={1} widths={["40%"]} className="mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} />
        ))}
      </div>
    </div>
  );
}

// --- TANPA PROPS (named export) ---
export const PromoBanner = lazyOnViewNamed<
  Record<string, never>,
  "PromoBanner"
>(() => import("@shared/components/ui/PromoBanner"), "PromoBanner", {
  minHeight: 140,
  fallback: BannerSkeleton,
});

export const EventPromo = lazyOnViewNamed<Record<string, never>, "EventPromo">(
  () => import("@shared/components/sections/EventPromo"),
  "EventPromo",
  {
    minHeight: 220,
    fallback: EventPromoSkeleton,
  }
);

export const FlashSaleDiscount = lazyOnViewNamed<
  Record<string, never>,
  "FlashSaleDiscount"
>(
  () => import("@shared/components/sections/FlashSaleDiscount"),
  "FlashSaleDiscount",
  {
    minHeight: 320,
    fallback: FlashSaleSkeleton,
  }
);

export const BundleSection = lazyOnViewNamed<
  Record<string, never>,
  "BundleSection"
>(() => import("@shared/components/sections/BundleSection"), "BundleSection", {
  minHeight: 260,
  fallback: BundleSkeleton,
});

// --- DENGAN PROPS ---
// PromoShowcase kamu default export → pakai lazyOnView biasa
export const PromoShowcase = lazyOnView<PromoShowcaseProps>(
  () =>
    import("@shared/components/sections/PromoShowcase").then((m) => m.default),
  { minHeight: 300, fallback: PromoShowcaseSkeleton }
);

// ProductGrid kamu named export `export const ProductGrid = ...`
export type ProductGridProps = { products: Product[] };
export const ProductGrid = lazyOnViewNamed<ProductGridProps, "ProductGrid">(
  () => import("@shared/components/layout/header/mobile/product/ProductGrid"),
  "ProductGrid",
  { minHeight: 600, fallback: <ProductGridSkeleton /> }
);
