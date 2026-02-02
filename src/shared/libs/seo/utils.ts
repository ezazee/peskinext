import type { Product, Variant } from "@shared/types/types";

/** Buat judul fallback dari slug */
export function titleFromSlug(slug: string) {
  const words = slug
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return words.replace(/\b\w/g, (m) => m.toUpperCase());
}

/** pastikan path absolute (untuk canonical, og, dsb) */
export function absolute(pathname: string) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/** ringkas deskripsi panjang */
export function shortDesc(str?: string, fallback = "") {
  const s = (str ?? fallback).trim();
  return s.length > 155 ? s.slice(0, 152) + "…" : s;
}

/** ambil gambar OG/Twitter */
export function takeOgImages(p: Product | null, alt: string) {
  const list: string[] = [
    ...(p?.img ? [p.img] : []),
    ...(Array.isArray(p?.galleryImages) ? p.galleryImages : []),
  ];
  const uniq = Array.from(new Set(list.filter(Boolean)));
  const final = uniq.length ? uniq : ["/web-app.png"];
  return final.map((url) => ({ url, width: 1200, height: 630, alt }));
}

/** buat Offer schema.org dari varian */
export function computeOffer(p: Product | null, url: string) {
  if (!p?.variants?.length) return undefined;
  const sorted = [...p.variants].sort(
    (a: Variant, b: Variant) => a.price - b.price
  );
  const price = sorted[0]?.price ?? null;
  const inStock = p.variants.some((v) => (v?.stock ?? 0) > 0);

  if (price == null) return undefined;
  return {
    "@type": "Offer",
    priceCurrency: "IDR",
    price,
    availability: `https://schema.org/${inStock ? "InStock" : "OutOfStock"}`,
    url,
  };
}
