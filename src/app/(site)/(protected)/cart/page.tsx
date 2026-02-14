import { getCurrentUser } from "@features/auth/action";
import CartPageWrapper from "@features/cart/CartPageWrapper";
import { FeatureErrorBoundary } from "@shared/components/errors/FeatureErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keranjang Belanja | PE Skin Pro",
  description: "Lihat produk skincare pilihan Anda. Checkout mudah dengan berbagai metode pembayaran dan gratis ongkir.",
  robots: { index: false, follow: true }, // Don't index user cart pages
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();

  return (
    <FeatureErrorBoundary featureName="Keranjang Belanja">
      <CartPageWrapper isLoggedIn={!!user} />
    </FeatureErrorBoundary>
  );
}
