import { getCurrentUser } from "@features/auth/action";
import CartPageWrapper from "@features/cart/CartPageWrapper";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();

  return <CartPageWrapper isLoggedIn={!!user} />;
}
