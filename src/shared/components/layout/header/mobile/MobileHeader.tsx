"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BellIcon,
  CartIcon,
  LocationIcon,
  SearchIcon,
} from "@shared/components/icons";
import { AuthAction } from "@features/auth/AuthAction";

import SearchOverlay from "../SearchOverlay";
import { AuthModal } from "@features/auth/components/AuthModal";
import { AddressModal } from "@shared/components/ui/AddressModal";
import type { AddressListEntry } from "@data/index";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";
import { startAddressSwitch } from "@features/address/addressSwitchBus";

type OptionForModal = AddressListEntry & {
  recipient?: string;
  phone?: string;
  pinpointed?: boolean;
};

export const MobileHeader = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // kunci scroll hanya untuk modal auth & address
  useEffect(() => {
    const shouldLock = isAuthModalOpen || isAddressModalOpen;
    document.body.classList.toggle("overflow-hidden", shouldLock);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isAuthModalOpen, isAddressModalOpen]);

  const openAuthModal = () => setIsAuthModalOpen(true);

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Sumber tunggal data
  const { primary, addresses, selectPrimary, addAddress } =
    useAddressBookLocal();

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

      {/* Overlay full-screen terpisah */}
      <SearchOverlay
        open={isSearchFocused}
        onClose={() => setIsSearchFocused(false)}
        onSearch={(q) => {
          console.log("Search:", q);
          setIsSearchFocused(false);
        }}
      />

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
                className="flex cursor-pointer items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
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
