import DesktopDetailContainer from "@features/product/components/desktop/DesktopDetailContainer";
import MobileDetailContainer from "@features/product/components/mobile/MobileDetailContainer";

export default async function ProductPage({ params }: { params: { slug: string } }) {
const { slug } = await params;
  return (
    <>
      <DesktopDetailContainer slug={slug} />
      <MobileDetailContainer slug={slug} />
    </>
  );
}
