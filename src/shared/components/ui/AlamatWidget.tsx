// File: src/app/components/ui/LocationWidget.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LocationIcon,
  ChevronDownIcon,
  WalletIcon,
  CouponIcon,
} from "../icons";
import { AddressModal } from "./AddressModal";
import { AuthModal } from "@features/auth/components/AuthModal";

interface LocationWidgetProps {
  variant: "mobile" | "desktop";
}

export const LocationWidget = ({ variant }: LocationWidgetProps) => {
  // --- Simulasi Status Login ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ubah ke `true` untuk tes

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Fungsi ini akan membuka modal alamat jika sudah login, atau modal login jika belum
  const handleWidgetClick = () => {
    if (isLoggedIn) {
      setIsAddressModalOpen(true);
    } else {
      if (variant === "desktop") {
        setIsAddressModalOpen(true); // Di desktop, langsung buka modal alamat
      } else {
        setIsAuthModalOpen(true); // Di mobile, buka modal login
      }
    }
  };

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

      {variant === "desktop" ? (
        // --- TAMPILAN DESKTOP ---
        <div
          onClick={() => setIsAddressModalOpen(true)} // Di desktop, selalu buka modal alamat
          className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
        >
          <LocationIcon className="h-4 w-4" />
          <span>
            Dikirim ke{" "}
            <span className="font-bold text-gray-800">
              {isLoggedIn ? "Rumah Garut Reza" : "Pilih Alamat"}
            </span>
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      ) : (
        // --- TAMPILAN MOBILE ---
        <div className="pt-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-primary">
                <WalletIcon />
                <span>Rp0</span>
              </button>
              <button className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text">
                <CouponIcon />
                <span>Kupon Saya</span>
              </button>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
              >
                <LocationIcon className="h-4 w-4 text-green-500" />
                <span>Rumah Garut Reza</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
            >
              <LocationIcon className="h-4 w-4 text-primary" />
              <span>Label Alamat Pembeli</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
