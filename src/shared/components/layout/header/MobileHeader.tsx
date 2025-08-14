"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  BellIcon,
  CartIcon,
  LocationIcon,
  SearchIcon,
} from "@shared/components/icons";
import { AuthModal } from "../../../../features/auth/components/AuthModal";
import { AddressModal } from "../../ui/AddressModal";

const AuthAction = ({
  isLoggedIn,
  openAuthModal,
  children,
  href,
}: {
  isLoggedIn: boolean;
  openAuthModal: () => void;
  children: ReactNode;
  href?: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
    } else if (href) {
      router.push(href);
    } else {
      // Jika anak dari komponen ini adalah tombol, event kliknya akan tetap berfungsi
      console.log("Aksi untuk pengguna yang sudah login tanpa navigasi");
    }
  };

  // 1. Dikembalikan menjadi <div>. Ini adalah elemen yang benar untuk membungkus tombol lain.
  // Kelas cursor-pointer akan berfungsi karena div ini memiliki konten (children).
  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export const MobileHeader = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const shouldLockScroll =
      isSearchFocused || isAuthModalOpen || isAddressModalOpen;
    if (shouldLockScroll) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSearchFocused, isAuthModalOpen, isAddressModalOpen]);

  const openAuthModal = () => setIsAuthModalOpen(true);

  const FullScreenSearchUI = () => (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex flex-col"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
    >
      <div className="flex items-center gap-2 p-2 border-b border-border-color">
        <button
          onClick={() => setIsSearchFocused(false)}
          className="p-2 text-subtle-text cursor-pointer"
        >
          <ArrowLeftIcon />
        </button>
        <div className="flex-grow relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-subtle-text">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Cari di PE Skinpro"
            className="w-full border border-border-color rounded-lg py-2 pl-10 pr-4 bg-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </div>
        <button className="font-semibold text-primary px-3 cursor-pointer">
          Cari
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center p-3 border border-border-color rounded-lg hover:bg-tertiary cursor-pointer">
          <div className="flex items-center gap-3">
            <LocationIcon className="h-5 w-5 text-subtle-text" />
            <span className="text-sm text-subtle-text">
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
      </div>
    </motion.div>
  );

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <AnimatePresence>
        {isSearchFocused && <FullScreenSearchUI />}
      </AnimatePresence>

      <header className="md:hidden bg-white sticky top-0 z-40 p-4 shadow-sm">
        <div className="flex items-center gap-1">
          <div
            className="flex-grow flex items-center relative cursor-pointer"
            onClick={() => setIsSearchFocused(true)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-subtle-text">
              <SearchIcon />
            </div>
            <div className="w-full text-left border border-border-color rounded-lg py-2 pl-10 pr-4 bg-tertiary text-subtle-text">
              Cari Produk PE
            </div>
          </div>
          <AuthAction
            isLoggedIn={isLoggedIn}
            openAuthModal={openAuthModal}
            href="/notification"
          >
            <BellIcon />
          </AuthAction>
          <AuthAction
            isLoggedIn={isLoggedIn}
            openAuthModal={openAuthModal}
            href="/cart"
          >
            <CartIcon withBadge />
          </AuthAction>
        </div>

        <div className="pt-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
              >
                <LocationIcon className="h-4 w-4 text-green-500" />
                <span>Rumah Garut Reza</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-bold text-base-text">
                    Hai, Selamat Datang!
                  </p>
                  <p className="text-xs text-subtle-text">
                    Login Untuk Melakukan Transaksi
                  </p>
                </div>
              </div>
              <button
                onClick={openAuthModal}
                className="bg-primary cursor-pointer text-white font-bold px-6 py-2 rounded-lg text-sm"
              >
                Masuk
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
