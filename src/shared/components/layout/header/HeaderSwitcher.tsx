"use client";

import { DesktopHeader } from "./desktop/DekstopHeader";
import { useResolveMobileHeader } from "./mobile/headerRegistry";

export default function HeaderSwitcher() {
  const mobileHeader = useResolveMobileHeader();

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block bg-white sticky top-0 z-50 shadow-sm w-full">
        <DesktopHeader />
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-white sticky top-0 z-50 shadow-sm w-full">
        {mobileHeader}
      </div>
    </>
  );
}
