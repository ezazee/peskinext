"use client";

import { usePathname } from "next/navigation";
import { MobileFooter } from "@shared/components/layout/footer/MobileFooter";
import { bottomNavItemsData } from "@data/navigation";

const HIDE_PATTERNS: RegExp[] = [
  /^\/notification(\/|$)/,
];

function shouldHide(pathname: string) {
  return HIDE_PATTERNS.some((re) => re.test(pathname));
}

export default function BottomNavController() {
  const pathname = usePathname();
  if (shouldHide(pathname)) return null;
  return <MobileFooter navItems={bottomNavItemsData} />;
}
