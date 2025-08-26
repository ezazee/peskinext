"use client";
import { useMemo } from "react";
import type { Product, Variant } from "@shared/types/types";
import { useDefaultDestination } from "@features/profile/hooks/useDefaultDestination";

// Terima Product/Variant biasa saja; field shipping opsional
type ProductMaybeShipping = Product & Partial<{ originCode: string; origin: string; weight: number }>;
type VariantMaybeWeight   = Variant & Partial<{ weight: number }>;

const DEFAULT_ORIGIN = "JKT";
const DEFAULT_WEIGHT_PER_UNIT = 250;

export function useShippingParamsForProduct(
  product: ProductMaybeShipping,
  variant: VariantMaybeWeight,
  qty: number
) {
  const { destination, loading: destLoading, updateDestination } = useDefaultDestination();

  const origin =
    product.originCode ||
    product.origin ||
    DEFAULT_ORIGIN;

  const unitWeight =
    variant.weight ??
    product.weight ??
    DEFAULT_WEIGHT_PER_UNIT;

  const safeQty = Math.max(1, Math.floor(qty || 1));
  const weightGram = Math.max(1, Math.round(unitWeight * safeQty));

  // ⬅️ perbaikan utama: gunakan weightGram (bukan weightGr)
  const params = useMemo(() => {
    if (!destination?.cityCode) return null;
    return {
      origin,
      destination: destination.cityCode,
      weightGram,
    };
  }, [origin, destination?.cityCode, weightGram]);

  return { params, origin, destination, destLoading, updateDestination, weightGram };
}
