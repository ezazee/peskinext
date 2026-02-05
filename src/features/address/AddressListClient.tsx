"use client";

import React from "react";
import type { AddressItem } from "@shared/types/types";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import AddressListSkeletonDesktop from "./skeleton/AddressListSkeletonDesktop";
import AddressListMobile from "./mobile/AddressListMobile";
import AddressListDesktop from "./desktop/AddressListDesktop";
import { getAddresses, deleteAddress, setDefaultAddress } from "./action";
import { useToast } from "@shared/components/ui/Toaster";


export default function AddressListClient() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const toast = useToast();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [addresses, setAddresses] = React.useState<AddressItem[]>([]);
  const [primaryId, setPrimaryId] = React.useState<string | null>(null);

  // Fetch addresses on mount
  React.useEffect(() => {
    async function fetchAddresses() {
      const result = await getAddresses();
      if (result.success && result.data) {
        setAddresses(result.data);
        const primary = result.data.find(a => a.isPrimary);
        setPrimaryId(primary?.id || result.data[0]?.id || null);
      }
      setLoading(false);
    }
    fetchAddresses();
  }, []);

  const items = React.useMemo<ReadonlyArray<AddressItem>>(
    () =>
      [...addresses].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
    [addresses]
  );

  const handleSetPrimary = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result.success) {
      // Update local state
      setAddresses(prev => prev.map(a => ({
        ...a,
        isPrimary: a.id === id
      })));
      setPrimaryId(id);
      toast.success("Alamat utama berhasil diubah");
      // Notify other components
      window.dispatchEvent(new Event('addressUpdated'));
    } else {
      toast.error(result.error || "Gagal mengubah alamat utama");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;

    const result = await deleteAddress(id);
    if (result.success) {
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (primaryId === id) {
        const remaining = addresses.filter(a => a.id !== id);
        setPrimaryId(remaining[0]?.id || null);
      }
      toast.success("Alamat berhasil dihapus");
    } else {
      toast.error(result.error || "Gagal menghapus alamat");
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        {isMobile ? (
          <AddressListSkeletonMobile />
        ) : (
          <AddressListSkeletonDesktop />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {isMobile ? (
        <>
          <AddressListMobile
            items={items}
            primaryId={primaryId}
            onSetPrimary={handleSetPrimary}
            onRemove={handleRemove}
          />
        </>
      ) : (
        <AddressListDesktop
          items={items}
          primaryId={primaryId}
          onSetPrimary={handleSetPrimary}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}

/* ================= Skeleton: Mobile ================= */
function AddressListSkeletonMobile() {
  return (
    <div>
      <Skeleton width="40%" height={18} radius={6} />
      <div className="grid gap-3 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
          >
            <Skeleton width="30%" height={14} radius={6} />
            <Skeleton className="mt-2" width="50%" height={12} radius={6} />
            <Skeleton className="mt-1" width="80%" height={12} radius={6} />
            <div className="mt-3 flex gap-2">
              <Skeleton width={130} height={36} radius={8} />
              <Skeleton width={80} height={36} radius={8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
