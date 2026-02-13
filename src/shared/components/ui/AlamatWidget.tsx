"use client";

import { useState } from "react";
import {
  LocationIcon,
  ChevronDownIcon,
  WalletIcon,
  CouponIcon,
} from "../icons";
import { AddressModal } from "@shared/components/ui/AddressModal";
import { AuthModal } from "@features/auth/components/AuthModal";
import { useAddressBook } from "@features/address/useAddressBook";

interface LocationWidgetProps {
  variant: "mobile" | "desktop";
}

export const LocationWidget = ({ variant }: LocationWidgetProps) => {
  // Simulasi login (ganti sesuai auth kamu)
  const [isLoggedIn] = useState<boolean>(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Alamat real (API)
  const { primary, listEntries, selectPrimary } = useAddressBook();

  const label = primary ? `${primary.label} ${primary.city}` : "Pilih Alamat";

  const openAddress = () => setIsAddressModalOpen(true);
  const openAuth = () => setIsAuthModalOpen(true);

  // Satu pintu handler klik widget
  const handleWidgetClick = () => {
    if (variant === "desktop") {
      openAddress();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isLoggedIn ? openAddress() : openAuth();
    }
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        options={listEntries}
        selectedId={primary?.id ?? null}
        onConfirm={(id) => {
          selectPrimary(id);
          setIsAddressModalOpen(false);
        }}
        onAddNew={() => { }}
      />

      {variant === "desktop" ? (
        // --- DESKTOP ---
        <button
          type="button"
          onClick={handleWidgetClick}
          className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
        >
          <LocationIcon className="h-4 w-4" />
          <span>
            Dikirim ke <span className="font-bold text-gray-800">{label}</span>
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      ) : (
        // --- MOBILE ---
        <div className="pt-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-primary"
              >
                <WalletIcon />
                <span>Rp0</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
              >
                <CouponIcon />
                <span>Kupon Saya</span>
              </button>
              <button
                type="button"
                onClick={handleWidgetClick}
                className="flex items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
              >
                <LocationIcon className="h-4 w-4 text-green-500" />
                <span>{label}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleWidgetClick}
              className="flex cursor-pointer items-center gap-2 bg-tertiary px-3 py-1.5 rounded-full text-sm font-semibold text-base-text"
            >
              <LocationIcon className="h-4 w-4 text-primary" />
              <span>Pilih Alamat</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
