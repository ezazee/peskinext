import type { Variant } from "@shared/types/types";

export function getVariantPricing(variants: Variant[], variantId?: number) {
  const chosen = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = chosen?.price ?? 0;
  const oldPrice = chosen?.oldPrice;
  const stock = chosen?.stock ?? 999;
  const variantName = chosen?.name;
  return { price, oldPrice, stock, variantName };
}
