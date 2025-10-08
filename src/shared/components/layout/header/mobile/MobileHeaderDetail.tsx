"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchOverlay from "../SearchOverlay";
import {
  CartIcon,
  ChevronLeftIcon,
  SearchIcon,
} from "@shared/components/icons";
import { AuthAction } from "@features/auth/AuthAction";

export default function MobileHeaderDetail() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authModalView, setAuthModalView] = useState<"login" | "register">(
    "login"
  );

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
        onSearch={(q) => {
          console.log("Search:", q);
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
                <CartIcon withBadge />
              </AuthAction>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
