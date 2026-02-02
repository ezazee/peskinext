"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { CartData } from "@shared/types/types";
import CartDesktopSkeleton from "./desktop/skeleton/CartDesktop.skeleton";
import { CartDesktop } from "./desktop/CartDesktop";
import { CartMobile } from "./mobile/CartMobile";
import CartMobileSkeleton from "./mobile/skeleton/CartMobile.skeleton";

type Props = {
  initial: CartData;
  loading?: boolean;
  isLoggedIn?: boolean;
};

export default function CartPageClient({ initial, loading = false, isLoggedIn = false }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
    <CartDesktop initial={initial} isLoggedIn={isLoggedIn} />
  ) : (
    <CartMobile initial={initial} isLoggedIn={isLoggedIn} />
  );
}
