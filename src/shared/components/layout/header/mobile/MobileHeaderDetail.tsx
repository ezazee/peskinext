"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchOverlay from "../SearchOverlay";
import {
  CartIcon,
  ChevronLeftIcon,
  SearchIcon,
} from "@shared/components/icons";
import { AuthAction } from "@features/auth/AuthAction";
import { getCurrentUser } from "@features/auth/action";
import { getCartItemCount } from "@features/cart/cartService";

export default function MobileHeaderDetail() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authModalView, setAuthModalView] = useState<"login" | "register">(
    "login"
  );

  // Check login status dynamically
  const checkAuth = async () => {
    const user = await getCurrentUser();
    setIsLoggedIn(!!user);
  };

  const updateCartCount = () => {
    setCartCount(getCartItemCount());
  };

  useEffect(() => {
    checkAuth();
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // const openAuthModal = (view: "login" | "register") => {
  //   setAuthModalView(view);
  //   setIsAuthModalOpen(true);
  // };

  return (
    <>
      {/* overlay full-screen */}
      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={() => {
          setIsSearchOpen(false);
        }}
      />

      <div className="md:hidden sticky top-0 z-[70] bg-white border-b px-4 pt-[calc(0.5rem+env(safe-area-inset-top))] pb-3">
        <div className="flex items-center justify-between">
          <button
            aria-label="Kembali"
            onClick={() => router.back()}
            className="p-1 cursor-pointer -ml-1"
          >
            <ChevronLeftIcon />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Cari"
              className="cursor-pointer"
            >
              <SearchIcon />
            </button>
            <div className="cursor-pointer">
              <AuthAction
                as="button"
                className="relative cursor-pointer"
                isLoggedIn={isLoggedIn}
                onRequireAuth={() => setIsAuthModalOpen(true)}
                href="/cart"
              >
                <CartIcon withBadge count={cartCount} />
              </AuthAction>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
