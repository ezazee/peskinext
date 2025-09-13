// src/app/checkout/page.tsx  ← SERVER COMPONENT
import { cartMock } from "@data/cart";
import CheckoutClient from "@features/checkout/CheckoutClient";

export default function Page() {
  return <CheckoutClient initialCart={cartMock} />;
}
