"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { CartData } from "@data/index";
import CartDesktopSkeleton from "./desktop/skeleton/CartDesktop.skeleton";
import { CartDesktop } from "./DesktopCart";
import { CartMobile } from "./MobileCart";
import CartMobileSkeleton from "./mobile/skeleton/CartMobile.skeleton";

type Props = {
  initial: CartData;
  /** true saat data cart masih di-fetch */
  loading?: boolean;
};

export default function CartPageClient({ initial, loading = false }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Saat belum mounted atau masih loading → tampilkan skeleton versi responsif
  if (!mounted || loading) {
    return (
      <>
        <div className="hidden md:block">
          <CartDesktopSkeleton />
        </div>
        <div className="md:hidden">
          <CartMobileSkeleton />
        </div>
      </>
    );
  }

  // Data siap
  return isDesktop ? (
    <CartDesktop initial={initial} />
  ) : (
    <CartMobile initial={initial} />
  );
}
