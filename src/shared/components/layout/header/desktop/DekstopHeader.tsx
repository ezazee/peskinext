// File: src/app/components/Header/DekstopHeader.tsx
"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  BellIcon,
  CartIcon,
  ChevronDownIcon,
  LocationIcon,
  SearchIcon,
  MailIcon,
  TagIcon,
} from "@shared/components/icons";
import { AuthModal } from "@features/auth/components/AuthModal";
import { AddressModal } from "@shared/components/ui/AddressModal";
import Link from "next/link";

export const DesktopHeader = () => {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // --- Simulasi Status Login ---
  // Ubah menjadi `false` untuk melihat tampilan saat belum login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "register">(
    "login"
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const openAuthModal = (view: "login" | "register") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSearchFocused(false)}
          />
        )}
      </AnimatePresence>

      <header className="hidden md:block bg-white sticky top-0 z-50 shadow-sm w-full">
        <div className="bg-tertiary">
          <div className="max-w-screen-xl mx-auto px-8 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 py-1">
              <TagIcon />
              <span className="text-secondary">
                Raih Pemasukan Tambahan dengan{" "}
                <a href="#" className="font-bold text-primary hover:underline">
                  Bergabung Affiliate ›
                </a>
              </span>
            </div>
            <div className="text-secondary flex justify-end gap-6">
              <a href="#" className="hover:text-primary">
                Tentang PE Skinpro
              </a>
              <a href="#" className="hover:text-primary">
                Pusat Edukasi Seller
              </a>
              <a href="#" className="hover:text-primary">
                Promo
              </a>
              <a href="#" className="hover:text-primary">
                PE Skinpro Care
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-8">
          <div className="flex items-center gap-6 py-3">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="PE Skinpro Logo"
                width={60}
                height={40}
                className="shrink-0"
              />
            </Link>

            <div className="flex-grow relative mx-4" ref={searchContainerRef}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Cari Produk PE"
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary relative z-50"
                onFocus={() => setIsSearchFocused(true)}
              />
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-50"
                  >
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <SearchIcon className="h-4 w-4 text-secondary" />
                        <span className="text-sm text-secondary">
                          Tips & Trik Pencarian
                        </span>
                      </div>
                      <a
                        href="#"
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        Pelajari
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isLoggedIn ? (
                // Tampilan jika SUDAH LOGIN
                <>
                  <CartIcon withBadge />
                  <BellIcon />
                  <MailIcon />
                  <div className="border-l h-8 mx-2"></div>
                  <div className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-tertiary">
                    <Image
                      src="https://placehold.co/32x32/81D4FA/FFFFFF?text=Z"
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-sm text-gray-700">
                      zeniwa
                    </span>
                  </div>
                </>
              ) : (
                // Tampilan jika BELUM LOGIN
                <>
                  <button
                    onClick={() => router.push("/register")}
                    className="cursor-pointer border border-border-color font-semibold text-primary px-6 py-2 rounded-lg hover:bg-tertiary transition-colors"
                  >
                    Daftar
                  </button>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="cursor-pointer bg-primary font-semibold text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- KONDISI TAMPILAN BERDASARKAN LOGIN --- */}
        {isLoggedIn && (
          <>
            <div className="border-b border-gray-200"></div>
            <div className="max-w-screen-xl mx-auto px-8">
              <div className="flex justify-end items-center py-2">
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
                >
                  <LocationIcon className="h-4 w-4" />
                  <span>
                    Dikirim ke{" "}
                    <span className="font-bold text-gray-800">
                      Rumah Garut Reza
                    </span>
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};
