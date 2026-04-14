import type { Metadata } from "next";
import ResponsiveDetailContainer from "@features/product/components/ResponsiveDetailContainer";
import {
  absolute,
  shortDesc,
  takeOgImages,
  titleFromSlug,
} from "@shared/libs/seo/utils";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
} from "@shared/libs/seo/jsonld";
import type { Product } from "@shared/types/types";

type RouteParams = { slug: string };

export const revalidate = 60;

import {
  getProductBySlug,
  getProducts,
} from "@features/product/services/productService";

/* ===== Metadata ===== */
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug } = await params;
  const p = await getProductBySlug(slug);

  const name = p?.name ?? titleFromSlug(slug);
  const description = shortDesc(
    p?.description,
    `Beli ${name} asli di PE Skin Pro. Produk skincare alami berkualitas, aman dan efektif.`
  );
  const canonicalPath = absolute(`/product/${slug}`);
  const ogImages = takeOgImages(p, name);

  return {
    title: `${name} | PE Skin Pro`,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title: `${name} | PE Skin Pro`,
      description,
      url: canonicalPath,
      siteName: "PE Skin Pro",
      images: ogImages,
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | PE Skin Pro`,
      description,
      images: ogImages.map((i) => i.url),
    },
    robots: { index: true, follow: true },
  };
}

/* ===== Static params ===== */
export async function generateStaticParams(): Promise<RouteParams[]> {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.warn("Failed to fetch products for static generation:", error);
    return [];
  }
}

/* ===== Page ===== */
export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params; // ✅ wajib await di Next 15

  const p = await getProductBySlug(slug);
  const name = p?.name ?? titleFromSlug(slug);

  const productJsonLd = buildProductJsonLd(p, slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Beranda", url: "https://peskinpro.id" },
    { name: "Produk", url: "https://peskinpro.id/products" },
    { name, url: `https://peskinpro.id/product/${slug}` },
  ]);

  return (
    <>
      <ResponsiveDetailContainer slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
