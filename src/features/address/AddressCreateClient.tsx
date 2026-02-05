"use client";

import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { AddressItem } from "@shared/types/types";
import AddressCreateDesktopSkeleton from "./skeleton/AddressCreateDesktopSkeleton";
import AddressCreateMobileSkeleton from "./skeleton/AddressCreateMobileSkeleton";
import AddressCreateDesktop from "./desktop/AddressCreateDesktop";
import AddressCreateMobile from "./mobile/AddressCreateMobile";
import { createAddress } from "./action";
import { useToast } from "@shared/components/ui/Toaster";

export default function AddressCreateClient(): JSX.Element {
  const router = useRouter();
  const toast = useToast();

  // breakpoint md (>=768px) = desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [hydrated, setHydrated] = React.useState<boolean>(false);
  React.useEffect(() => setHydrated(true), []);

  const [saving, setSaving] = React.useState<boolean>(false);
  const [form, setForm] = React.useState<Omit<AddressItem, "id">>({
    label: "",
    recipient: "",
    phone: "",
    line1: "",
    province: "",
    district: "",
    city: "",
    postalCode: "",
    isPrimary: false,
  });

  function onChange<K extends keyof Omit<AddressItem, "id">>(
    k: K,
    v: Omit<AddressItem, "id">[K]
  ): void {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSaving(true);

    const result = await createAddress(form);

    setSaving(false);

    if (result.success) {
      toast.success("Alamat berhasil ditambahkan");
      // Notify other components
      window.dispatchEvent(new Event('addressUpdated'));
      router.push("/account/address");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal menambahkan alamat");
    }
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
          form={form as AddressItem}
          saving={saving}
          onChange={onChange as <K extends keyof AddressItem>(k: K, v: AddressItem[K]) => void}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : (
        <AddressCreateMobile
          form={form as AddressItem}
          saving={saving}
          onChange={onChange as <K extends keyof AddressItem>(k: K, v: AddressItem[K]) => void}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </motion.div>
  );
}
