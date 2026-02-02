// File: src/features/checkout/desktop/AddressCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AddressModal } from "@shared/components/ui/AddressModal";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";
import type { AddressListEntry } from "@shared/types/types";
import {
  useAddressSwitching,
  startAddressSwitch,
} from "@features/address/addressSwitchBus";
import { AddressCardSkeleton } from "./skeleton/CheckoutSkeletons";

type OptionForModal = AddressListEntry & {
  recipient?: string;
  phone?: string;
  pinpointed?: boolean;
};

export default function AddressCard() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const { primary, addresses, selectPrimary } = useAddressBookLocal();
  const switching = useAddressSwitching();

  const current = primary ?? null;

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

  // tampilkan skeleton bila belum hydrate atau sedang switching
  if (!hydrated || switching) return <AddressCardSkeleton />;

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-4">
        <h2 className="text-lg font-semibold">Alamat pengiriman</h2>
        <button
          className="text-sm font-medium cursor-pointer text-primary hover:underline"
          onClick={() => setOpen(true)}
        >
          {current ? "Ubah" : "Tambah"}
        </button>
      </div>

      <div className="px-6 py-5 text-sm">
        {current ? (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">
                {current.label} • {current.recipient}
              </span>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-primary font-medium">
                Utama
              </span>
            </div>
            <div className="text-gray-700">{current.phone}</div>
            <div className="text-gray-600 leading-relaxed">
              {current.line1}, {current.city}, {current.province}{" "}
              {current.postalCode}
            </div>
          </div>
        ) : (
          <div className="text-primary font-medium">
            Belum ada alamat. Tambahkan alamat pengiriman terlebih dahulu.
          </div>
        )}
      </div>

      <AddressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        options={options}
        selectedId={primary?.id ?? null}
        onConfirm={(id) => {
          startAddressSwitch(700);
          selectPrimary(id);
          setOpen(false);
        }}
        onMakePrimary={(id) => {
          startAddressSwitch(700);
          selectPrimary(id);
          setOpen(false);
        }}
        onAddNew={() =>
          alert("Tambah alamat belum diimplementasi pada mock ini.")
        }
      />
    </div>
  );
}
