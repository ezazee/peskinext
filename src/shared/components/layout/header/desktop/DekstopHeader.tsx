// File: src/app/components/Header/DekstopHeader.tsx
"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  BellIcon,
  CartIcon,
  ChevronDownIcon,
  LocationIcon,
  SearchIcon,
  TagIcon,
} from "@shared/components/icons";
import { AuthModal } from "@features/auth/components/AuthModal";
import { AddressModal } from "@shared/components/ui/AddressModal";
import { AuthAction } from "@features/auth/AuthAction";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";
import type { AddressListEntry } from "@data/index";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import {
  startAddressSwitch,
  useAddressSwitching,
} from "@features/address/addressSwitchBus";

type OptionForModal = AddressListEntry & {
  recipient?: string;
  phone?: string;
  pinpointed?: boolean;
};

export const DesktopHeader = () => {
  const switching = useAddressSwitching();
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoggedIn] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "register">(
    "login"
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Sumber tunggal data
  const { primary, addresses, selectPrimary, addAddress } =
    useAddressBookLocal();

  // Label header: samakan dengan AddressCard (Label • Penerima)
  const label = useMemo(() => {
    if (!hydrated || !primary) return "Pilih alamat";
    const who = primary.recipient ? ` • ${primary.recipient}` : "";
    return `${primary.label}${who}`;
  }, [hydrated, primary]);

  // Opsi untuk modal (urutkan primary di atas)
  const options = useMemo<ReadonlyArray<OptionForModal>>(() => {
    const list = addresses.map<OptionForModal>((a) => ({
      id: a.id,
      label: a.label,
      address: `${a.line1}, ${a.city}, ${a.province} ${a.postalCode}`,
      isPrimary: primary ? a.id === primary.id : a.isPrimary,
      recipient: a.recipient,
      phone: a.phone,
      pinpointed: true,
    }));
    return [...list].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  }, [addresses, primary]);

  // tutup overlay search saat klik luar
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        options={hydrated ? options : []}
        selectedId={hydrated ? primary?.id ?? null : null}
        onConfirm={(id) => {
          // tampilkan skeleton beberapa ratus ms (simulasi hitung ongkir/promo)
          startAddressSwitch(700);
          selectPrimary(id);
          setIsAddressModalOpen(false);
        }}
        onMakePrimary={(id) => {
          startAddressSwitch(700);
          selectPrimary(id);
          setIsAddressModalOpen(false);
        }}
        onAddNew={() => {
          alert("Tambah alamat belum diimplementasi pada mock ini.");
        }}
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

            {/* Search */}
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

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <AuthAction
                as="button"
                className="relative cursor-pointer"
                isLoggedIn={isLoggedIn}
                onRequireAuth={() => setIsAuthModalOpen(true)}
                href="/cart"
              >
                <CartIcon withBadge />
              </AuthAction>

              <AuthAction
                as="button"
                className="cursor-pointer"
                isLoggedIn={isLoggedIn}
                onRequireAuth={() => setIsAuthModalOpen(true)}
                href="/notification"
              >
                <BellIcon />
              </AuthAction>

              <div className="border-l h-8 mx-2" />

              {isLoggedIn ? (
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
              ) : (
                <>
                  <button
                    onClick={() => router.push("/register")}
                    className="border border-border-color font-semibold text-primary px-6 py-2 rounded-lg hover:bg-tertiary transition-colors"
                  >
                    Daftar
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-primary font-semibold text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bar alamat saat LOGIN */}
        {isLoggedIn && (
          <>
            <div className="border-b border-gray-200" />
            <div className="max-w-screen-xl mx-auto px-8">
              <div className="flex justify-end items-center py-2">
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
                >
                  <LocationIcon className="h-4 w-4" />
                  {switching ? (
                    <Skeleton width={160} height={16} className="rounded" />
                  ) : (
                    <span className="text-secondary">
                      Dikirim ke{" "}
                      <span
                        className="font-bold text-gray-800"
                        suppressHydrationWarning
                      >
                        {label}
                      </span>
                    </span>
                  )}
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
