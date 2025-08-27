import type { Metadata } from "next";
import DesktopDetailContainer from "@features/product/components/desktop/DesktopDetailContainer";
import MobileDetailContainer from "@features/product/components/mobile/MobileDetailContainer";
import { productsData, type Product } from "@data/index";
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
type RouteParams = { slug: string };
export const revalidate = 60;

function getProductBySlug(slug: string): Product | null {
  return productsData.find((p) => p.slug === slug) ?? null;
}

/* ===== Metadata ===== */
export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = params;
  const p = getProductBySlug(slug);

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
export async function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

/* ===== Page ===== */
export default async function ProductPage({ params }: { params: RouteParams }) {
  const { slug } = params;
  const p = getProductBySlug(slug);
  const name = p?.name ?? titleFromSlug(slug);

  const productJsonLd = buildProductJsonLd(p, slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Beranda", url: "https://peskinpro.id" },
    { name: "Produk", url: "https://peskinpro.id/products" },
    { name, url: `https://peskinpro.id/product/${slug}` },
  ]);

  return (
    <>
      <DesktopDetailContainer slug={slug} />
      <MobileDetailContainer slug={slug} />

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
