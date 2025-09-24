"use client";

import type { NavItem } from "@data/index";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileFooter = ({ navItems }: { navItems: NavItem[] }) => {
  const pathname = usePathname();

  return (
    <>
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-1 z-[10]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-tertiary"
            >
              <item.icon active={isActive} />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-primary font-semibold" : "text-secondary"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </footer>
      <div className="h-36 md:hidden" />
    </>
  );
};
