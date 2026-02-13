// File: src/features/checkout/desktop/AddressCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AddressModal } from "@shared/components/ui/AddressModal";
import { useAddressBook } from "@features/address/useAddressBook";
import type { AddressListEntry } from "@shared/types/types";
import {
  useAddressSwitching,
  startAddressSwitch,
} from "@features/address/addressSwitchBus";
import { AddressCardSkeleton } from "./skeleton/CheckoutSkeletons";
import type { AddressItem } from "@shared/types/types";

type OptionForModal = AddressListEntry & {
  recipient?: string;
  phone?: string;
  pinpointed?: boolean;
};

interface AddressCardProps {
  selectedAddress?: AddressItem | null;
  onSelect?: (address: AddressItem) => void;
}

export default function AddressCard({ selectedAddress, onSelect }: AddressCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const { primary, addresses, selectPrimary, loading } = useAddressBook();
  const switching = useAddressSwitching();

  const current = selectedAddress || primary || null;

  const options = useMemo<ReadonlyArray<OptionForModal>>(() => {
    const list = addresses.map<OptionForModal>((a) => ({
      id: a.id,
      label: a.label,
      address: `${a.line1}, ${a.city}, ${a.province} ${a.postalCode}`,
      isPrimary: current ? a.id === current.id : a.isPrimary,
      recipient: a.recipient,
      phone: a.phone,
      pinpointed: true,
    }));
    return [...list].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  }, [addresses, current]);

  // tampilkan skeleton bila belum hydrate atau sedang switching atau loading data
  if (!hydrated || switching || loading) return <AddressCardSkeleton />;

  return (
    <div className="bg-transparent overflow-hidden px-1">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 border-l-4 border-primary pl-4">Alamat Pengiriman</h2>
        <button
          className="text-sm font-bold cursor-pointer text-primary hover:text-secondary transition-colors underline decoration-2 underline-offset-4"
          onClick={() => setOpen(true)}
        >
          {current ? "Ubah Alamat" : "Tambah Alamat"}
        </button>
      </div>

      <div className="px-10 pb-8 text-sm pt-2">
        {current ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-base font-bold text-gray-800">
                {current.recipient}
              </span>
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ring-1 ring-primary/10">
                {current.label} • Utama
              </span>
            </div>
            <div className="text-gray-500 font-medium tracking-wide">{current.phone}</div>
            <div className="text-gray-600 leading-relaxed max-w-lg">
              {current.line1}, {current.city}, {current.province}{" "}
              <span className="font-bold text-gray-800">{current.postalCode}</span>
            </div>
          </div>
        ) : (
          <div className="text-primary font-bold bg-primary/5 p-4 rounded-2xl ring-1 ring-primary/10 flex items-center gap-3">
            <span className="text-xl">📍</span>
            Belum ada alamat. Tambahkan alamat pengiriman terlebih dahulu.
          </div>
        )}
      </div>

      <AddressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        options={options}
        selectedId={current?.id ?? null}
        onConfirm={(id) => {
          startAddressSwitch(700);
          if (onSelect) {
            const found = addresses.find((a) => a.id === id);
            if (found) onSelect(found);
          } else {
            selectPrimary(id);
          }
          setOpen(false);
        }}
        onMakePrimary={(id) => {
          startAddressSwitch(700);
          if (onSelect) {
            const found = addresses.find((a) => a.id === id);
            if (found) onSelect(found);
          } else {
            selectPrimary(id);
          }
          setOpen(false);
        }}
        onAddNew={() => {
          setOpen(false);
          router.push("/account/address/new");
        }}
      />
    </div>
  );
}
