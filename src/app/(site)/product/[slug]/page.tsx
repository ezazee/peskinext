// src/app/(site)/product/[slug]/page.tsx
import DesktopDetailContainer from "@features/product/components/desktop/DesktopDetailContainer";
import MobileDetailContainer from "@features/product/components/mobile/MobileDetailContainer";

type RouteParams = { slug: string };

export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params; 

  return (
    <>
      <DesktopDetailContainer slug={slug} />
      <MobileDetailContainer slug={slug} />
    </>
  );
}
