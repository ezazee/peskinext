"use client";

import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { AddressItem } from "@shared/types/types";
import AddressEditDesktopSkeleton from "./skeleton/AddressEditDesktopSkeleton";
import AddressEditMobileSkeleton from "./skeleton/AddressEditMobileSkeleton";
import AddressEditDesktop from "./desktop/AddressEditDesktop";
import AddressEditMobile from "./mobile/AddressEditMobile";
import { getAddresses, updateAddress } from "./action";
import { useToast } from "@shared/components/ui/Toaster";
import { useRouter } from "next/navigation";

type Props = { id: string };

export default function AddressEditClient({ id }: Props): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const toast = useToast();
  const router = useRouter();

  const [hydrated, setHydrated] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [form, setForm] = React.useState<AddressItem | undefined>(undefined);
  const [saving, setSaving] = React.useState<boolean>(false);

  React.useEffect(() => setHydrated(true), []);

  // Fetch address data
  React.useEffect(() => {
    async function fetchAddress() {
      const result = await getAddresses();
      if (result.success && result.data) {
        const current = result.data.find((a) => a.id === id);
        setForm(current);
      }
      setLoading(false);
    }
    fetchAddress();
  }, [id]);

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

    const result = await updateAddress(form.id, form);

    setSaving(false);

    if (result.success) {
      toast.success("Alamat berhasil diperbarui");
      // Notify other components
      window.dispatchEvent(new Event('addressUpdated'));

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/account/address");
      }
      router.refresh();
    } else {
      toast.error(result.error || "Gagal memperbarui alamat");
    }
  }

  const onCancel = (): void => history.back();

  // SKELETON
  if (!hydrated || loading) {
    return isDesktop ? (
      <AddressEditDesktopSkeleton />
    ) : (
      <AddressEditMobileSkeleton />
    );
  }

  // Not found state
  if (!form) {
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
