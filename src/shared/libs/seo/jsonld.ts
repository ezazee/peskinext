import type { Product } from "@data/index";
import { takeOgImages, computeOffer } from "./utils";

/** JSON-LD untuk product */
export function buildProductJsonLd(p: Product | null, slug: string) {
  const name = p?.name ?? slug;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: p?.description ?? `Beli ${name} asli di PE Skin Pro.`,
    image: takeOgImages(p, name).map((i) => i.url),
    sku: p?.sku,
    brand: { "@type": "Brand", name: "PE Skin Pro" },
    ...(computeOffer(p, `https://peskinpro.id/product/${slug}`) && {
      offers: computeOffer(p, `https://peskinpro.id/product/${slug}`),
    }),
  };
}

/** JSON-LD breadcrumbs (bisa dipakai di semua page) */
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
