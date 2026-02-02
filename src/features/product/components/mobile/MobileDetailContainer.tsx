// File: src/features/product/components/MobileDetailContainer.tsx
"use client";

import { useProductDetail } from "@features/product/hooks/useProductDetail";
import { MobileDetailSkeleton } from "../skeleton/MobileDetailSkeleton";
import MobileDetail from "./MobileDetail";

function toNum(v: number | string | undefined | null): number {
  if (v === undefined || v === null || v === "") return 0;
  return typeof v === "number" ? v : Number(v) || 0;
}

export default function MobileDetailContainer({ slug }: { slug: string }) {
  const { product, loading, error } = useProductDetail(slug);

  if (loading) return <MobileDetailSkeleton />;
  if (error || !product)
    return (
      <div className="md:hidden p-4 text-red-600">Gagal memuat produk.</div>
    );

  const v0 = product.variants?.[0];
  const priceNumber = toNum(v0?.price ?? product.price);
  const oldPriceNumber = toNum(v0?.oldPrice ?? null);
  const hasDiscount = Boolean(v0?.oldPrice ?? null);

  return (
    <MobileDetail
      product={product}
      hasDiscount={hasDiscount}
      priceNumber={priceNumber}
      oldPriceNumber={oldPriceNumber}
      isLoading={false}
    />
  );
}
