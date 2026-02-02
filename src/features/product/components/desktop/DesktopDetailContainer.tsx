// File: src/features/product/components/DesktopDetailContainer.tsx
"use client";

import { useProductDetail } from "@features/product/hooks/useProductDetail";
import { DesktopDetailSkeleton } from "../skeleton/DesktopDetailSkeleton";
import DesktopDetail from "./DesktopDetail";

function toNum(v: number | string | undefined | null): number {
  if (v === undefined || v === null || v === "") return 0;
  return typeof v === "number" ? v : Number(v) || 0;
}

export default function DesktopDetailContainer({ slug }: { slug: string }) {
  const { product, loading, error } = useProductDetail(slug);

  if (loading) return <DesktopDetailSkeleton />;
  if (error || !product)
    return (
      <div className="hidden md:block container mx-auto p-4 text-red-600">
        Gagal memuat produk.
      </div>
    );

  const v0 = product.variants?.[0];
  const priceNumber = toNum(v0?.price ?? product.price);
  const oldPriceNumber = toNum(v0?.oldPrice ?? null);
  const hasDiscount = Boolean(v0?.oldPrice ?? null);

  return (
    <DesktopDetail
      product={product}
      isLoading={false}
      hasDiscount={hasDiscount}
      priceNumber={priceNumber}
      oldPriceNumber={oldPriceNumber}
    />
  );
}
