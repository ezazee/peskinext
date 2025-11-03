"use client";

import type { NavItem } from "@data/index";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthModal } from "@features/auth/components/AuthModal";
import { useAuth, useProtectedRoute } from "@shared/hooks/useAuth";

export const MobileFooter = ({ navItems }: { navItems: NavItem[] }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, checkAuth } = useAuth();
  const { isProtectedRoute } = useProtectedRoute();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isAuthModalOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isAuthModalOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // Check if route requires authentication
    if (isProtectedRoute(href) && !isLoggedIn) {
      e.preventDefault();
      setPendingRoute(href);
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = async () => {
    // Update auth status
    await checkAuth();

    // Navigate to pending route if exists
    if (pendingRoute) {
      router.push(pendingRoute);
      setPendingRoute(null);
    }
  };

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingRoute(null);
        }}
        initialView="login"
        onLoginSuccess={handleLoginSuccess}
      />

      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-1 z-[10]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
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
