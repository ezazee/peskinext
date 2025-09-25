import type { Product } from "@shared/types/types";

/** Narrow type: hanya bundle, tanpa mendefinisikan tipe baru di shared */
export type BundleOnly = Product & { type: "bundle" };

export function isBundle(p: Product): p is BundleOnly {
  return p.type === "bundle";
}

export function parseIDR(idr: string | number): number {
  if (typeof idr === "number") return idr;
  const digits = idr.replace(/[^\d]/g, "");
  return Number(digits || 0);
}

export function toIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function getDiscountPercent(oldPrice?: string, price?: string): number {
  const o = oldPrice ? parseIDR(oldPrice) : 0;
  const p = price ? parseIDR(price) : 0;
  if (!o || !p || p >= o) return 0;
  return Math.round(((o - p) / o) * 100);
}

export function sortBundlesFeatured(
  list: ReadonlyArray<BundleOnly>
): BundleOnly[] {
  return [...list].sort((a, b) => {
    const af = (a.isFlashSale ? 2 : 0) + (a.isEvent ? 1 : 0);
    const bf = (b.isFlashSale ? 2 : 0) + (b.isEvent ? 1 : 0);
    if (bf !== af) return bf - af;
    const ad = getDiscountPercent(a.oldPrice, a.price);
    const bd = getDiscountPercent(b.oldPrice, b.price);
    return bd - ad;
  });
}
