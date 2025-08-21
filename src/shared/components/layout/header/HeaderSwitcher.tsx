"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import MobileHeaderDetail from "./mobile/MobileHeaderDetail";
import { MobileHeader } from "./mobile/MobileHeader";
import { DesktopHeader } from "./desktop/DekstopHeader";

export default function HeaderSwitcher() {
  const segments = useSelectedLayoutSegments();
  const isHome = segments.length === 0;
  const isProductDetail = segments[0] === "product" && segments.length >= 2;

  return (
    <>
      <div className="hidden md:block bg-white sticky top-0 z-50 shadow-sm w-full">
        <DesktopHeader />
      </div>

      <div className="md:hidden bg-white sticky top-0 z-50 shadow-sm border-none w-full ">
        {isHome ? (
          <MobileHeader />
        ) : isProductDetail ? (
          <MobileHeaderDetail />
        ) : (
          <MobileHeader />
        )}
      </div>
    </>
  );
}
