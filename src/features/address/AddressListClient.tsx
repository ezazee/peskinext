"use client";

import React from "react";
import Link from "next/link";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";
import type { AddressItem } from "@shared/types/types";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import AddressListSkeletonDesktop from "./skeleton/AddressListSkeletonDesktop";
import AddressListMobile from "./mobile/AddressListMobile";
import AddressListDesktop from "./desktop/AddressListDesktop";

export default function AddressListClient() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { addresses, primary, selectPrimary } = useAddressBookLocal();

  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const items = React.useMemo<ReadonlyArray<AddressItem>>(
    () =>
      [...addresses].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
    [addresses]
  );

  const handleRemove = (id: string) => {
    alert("Hapus alamat belum diimplementasi pada mock ini.");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-3 md:px-6 py-4">
        {isMobile ? (
          <AddressListSkeletonMobile />
        ) : (
          <AddressListSkeletonDesktop />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-6 py-4">
      {isMobile ? (
        <>
          <AddressListMobile
            items={items}
            primaryId={primary?.id ?? null}
            onSetPrimary={selectPrimary}
            onRemove={handleRemove}
          />
        </>
      ) : (
        // Desktop: header ada di dalam komponen Desktop agar tidak dobel
        <AddressListDesktop
          items={items}
          primaryId={primary?.id ?? null}
          onSetPrimary={selectPrimary}
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
