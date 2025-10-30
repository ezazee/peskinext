"use client";

import { useEffect, useState } from "react";
import { getCart } from "@features/cart/cartService";
import CartPageClient from "@features/cart/CartPageClient";
import type { CartData } from "@shared/types/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const loadedCart = getCart();
    setCart(loadedCart);
    setLoading(false);

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCart(getCart());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return <CartPageClient initial={cart} loading={loading} />;
}
