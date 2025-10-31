import { getCurrentUser } from "@features/auth/action";
import CartPageWrapper from "@features/cart/CartPageWrapper";

export default async function CartPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  return <CartPageWrapper isLoggedIn={!!user} />;
}
