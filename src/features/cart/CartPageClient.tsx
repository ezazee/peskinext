"use client";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { CartDesktop } from "./desktop/DesktopCart";
import { CartMobile } from "./mobile/MobileCart";
import type { CartData } from "@data/index";

export default function CartPageClient({ initial }: { initial: CartData }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return isDesktop ? (
    <CartDesktop initial={initial} />
  ) : (
    <CartMobile initial={initial} />
  );
}
