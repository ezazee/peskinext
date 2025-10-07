"use client";

import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { AddressItem } from "@shared/types/types";
import AddressCreateDesktopSkeleton from "./skeleton/AddressCreateDesktopSkeleton";
import AddressCreateMobileSkeleton from "./skeleton/AddressCreateMobileSkeleton";
import AddressCreateDesktop from "./desktop/AddressCreateDesktop";
import AddressCreateMobile from "./mobile/AddressCreateMobile";

export default function AddressCreateClient(): JSX.Element {
  const router = useRouter();
  const { addAddress, selectPrimary } = useAddressBookLocal();

  // breakpoint md (>=768px) = desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [hydrated, setHydrated] = React.useState<boolean>(false);
  React.useEffect(() => setHydrated(true), []);

  const [saving, setSaving] = React.useState<boolean>(false);
  const [form, setForm] = React.useState<AddressItem>({
    id: "",
    label: "",
    recipient: "",
    phone: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    isPrimary: false,
  });

  function onChange<K extends keyof AddressItem>(
    k: K,
    v: AddressItem[K]
  ): void {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSaving(true);

    const newId = `addr_${nanoid(8)}`;
    const payload: AddressItem = { ...form, id: newId };

    // simulasi I/O
    await new Promise((r) => setTimeout(r, 450));
    addAddress(payload);
    if (payload.isPrimary) selectPrimary(newId);

    setSaving(false);
    router.push("/account/address");
  }

  const onCancel = (): void => router.back();

  // Skeleton saat pre-hydration
  if (!hydrated) {
    return isDesktop ? (
      <AddressCreateDesktopSkeleton />
    ) : (
      <AddressCreateMobileSkeleton />
    );
  }

  // Bungkus animasi ringan
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      {isDesktop ? (
        <AddressCreateDesktop
          form={form}
          saving={saving}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : (
        <AddressCreateMobile
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
