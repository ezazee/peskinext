// src/features/checkout/CheckoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import DesktopCheckout from "./desktop/DesktopCheckout";
import MobileCheckout from "./mobile/MobileCheckout";
import type { CartData, CheckoutSession } from "@shared/types/types";
import CheckoutSkeletonShell from "./desktop/skeleton/CheckoutSkeletonShell";
import { getCart } from "@features/cart/cartService";

export default function CheckoutClient({
  checkoutSession
}: {
  checkoutSession: CheckoutSession | null;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<CartData>({ items: [] });

  useEffect(() => {
    // If we have a checkout session, use it
    // Otherwise, load cart from localStorage
    if (!checkoutSession) {
      const loadedCart = getCart();
      setCart(loadedCart);
    }
    setMounted(true);
  }, [checkoutSession]);

  if (!mounted) return <CheckoutSkeletonShell />;

  return isMobile
    ? <MobileCheckout initialCart={cart} checkoutSession={checkoutSession} />
    : <DesktopCheckout initialCart={cart} checkoutSession={checkoutSession} />;
}
