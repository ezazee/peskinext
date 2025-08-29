"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import MobileHeaderDetail from "../mobile/MobileHeaderDetail";
import { MobileHeader } from "./MobileHeader";

// Helper deteksi path
const isProductDetail = (p: string) => /^\/product\/[^/]+$/.test(p);
const isCart = (p: string) => p === "/cart";
const isShipping = (p: string) => p.startsWith("/shipping");
const isProfile = (p: string) => p.startsWith("/profile");
const isAuth = (p: string) => p.startsWith("/auth");
const isHome = (p: string) => p === "/" || p === "";

// Resolver: tentukan header apa untuk pathname tertentu
export function useResolveMobileHeader(): ReactNode {
  const pathname = usePathname() || "/";

  const element = useMemo<ReactNode>(() => {
    if (isHome(pathname)) return <MobileHeader />;
    if (isProductDetail(pathname)) return <MobileHeaderDetail />;

    // contoh halaman lain:
    if (isCart(pathname)) return <MobileHeaderDetail />;
    if (isShipping(pathname)) return <MobileHeaderDetail />;
    if (isProfile(pathname)) return <MobileHeaderDetail />;
    if (isAuth(pathname)) return <MobileHeaderDetail />;

    // fallback default: header search/home
    return <MobileHeader />;
  }, [pathname]);

  return element;
}
