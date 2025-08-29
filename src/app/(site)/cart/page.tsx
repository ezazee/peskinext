import { cartMock } from "@data/cart";
import CartPageClient from "@features/cart/CartPageClient";

export default function CartPage() {
  return <CartPageClient initial={cartMock} />;
}
