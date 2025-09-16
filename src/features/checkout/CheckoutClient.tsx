// src/features/checkout/CheckoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import DesktopCheckout from "./desktop/DesktopCheckout";
import MobileCheckout from "./mobile/MobileCheckout";
import type { CartData } from "@shared/types/types";
import CheckoutSkeletonShell from "./desktop/skeleton/CheckoutSkeletonShell";

export default function CheckoutClient({ initialCart }: { initialCart: CartData }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <CheckoutSkeletonShell />;

  return isMobile
    ? <MobileCheckout initialCart={initialCart} />
    : <DesktopCheckout initialCart={initialCart} />;
}
