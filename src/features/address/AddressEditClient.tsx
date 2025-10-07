"use client";

import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";
import type { AddressItem } from "@shared/types/types";
import AddressEditDesktopSkeleton from "./skeleton/AddressEditDesktopSkeleton";
import AddressEditMobileSkeleton from "./skeleton/AddressEditMobileSkeleton";
import AddressEditDesktop from "./desktop/AddressEditDesktop";
import AddressEditMobile from "./mobile/AddressEditMobile";



type Props = { id: string };

export default function AddressEditClient({ id }: Props): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { addresses, updateAddress, selectPrimary } = useAddressBookLocal();

  const [hydrated, setHydrated] = React.useState<boolean>(false);
  React.useEffect(() => setHydrated(true), []);

  const current = React.useMemo<AddressItem | undefined>(
    () => addresses.find((a) => a.id === id),
    [addresses, id]
  );

  // local form state diisi dari current
  const [form, setForm] = React.useState<AddressItem | undefined>(undefined);
  React.useEffect(() => {
    if (current && !form) setForm(current);
  }, [current, form]);

  const [saving, setSaving] = React.useState<boolean>(false);

  function onChange<K extends keyof AddressItem>(
    k: K,
    v: AddressItem[K]
  ): void {
    setForm((p) => (p ? { ...p, [k]: v } : p));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!form) return;
    setSaving(true);

    // simulasi I/O
    await new Promise((r) => setTimeout(r, 400));

    updateAddress(form.id, form); // asumsi hook punya ini
    if (form.isPrimary) selectPrimary(form.id);

    setSaving(false);
    history.back();
  }

  const onCancel = (): void => history.back();

  // SKELETON
  if (!hydrated) {
    return isDesktop ? (
      <AddressEditDesktopSkeleton />
    ) : (
      <AddressEditMobileSkeleton />
    );
  }

  // Not found state (misal id tidak ada di local store)
  if (!current || !form) {
    return (
      <div className="w-full rounded-lg border p-4 text-sm">
        Alamat tidak ditemukan.{" "}
        <button className="underline" onClick={() => history.back()}>
          Kembali
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      {isDesktop ? (
        <AddressEditDesktop
          form={form}
          saving={saving}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : (
        <AddressEditMobile
          form={form}
          saving={saving}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </motion.div>
  );
}
