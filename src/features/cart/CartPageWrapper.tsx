"use client";

import { useEffect, useState } from "react";
import { getCart, setCurrentUserId } from "@features/cart/cartService";
import CartPageClient from "@features/cart/CartPageClient";
import type { CartData } from "@shared/types/types";
import { getCurrentUser } from "@features/auth/action";

type Props = {
  isLoggedIn: boolean;
};

export default function CartPageWrapper({ isLoggedIn }: Props) {
  const [cart, setCart] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      // Get current user ID
      const user = await getCurrentUser();
      const currentUserId = user?.id || null;
      setUserId(currentUserId);

      // Set user ID in session storage for cart service
      setCurrentUserId(currentUserId);

      // Load cart from localStorage for this user
      const loadedCart = getCart(currentUserId);
      setCart(loadedCart);
      setLoading(false);
    }

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCart(getCart(userId));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [userId]);

  return <CartPageClient initial={cart} loading={loading} isLoggedIn={isLoggedIn} />;
}
