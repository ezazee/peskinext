"use client";

import React from "react";
import type { AccountData } from "@shared/types/types";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import AccountMobile from "./mobile/AccountMobile";
import AccountMobileSkeleton from "./skeleton/AccountMobileSkeleton";
import AccountDesktopSkeleton from "./skeleton/AccountDesktopSkeleton";
import AccountDesktop from "./desktop/AccountDesktop";

export default function AccountClient({ data }: { data: AccountData }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Ganti dengan kondisi loading nyata (fetch/useQuery). Ini simulasi.
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full">
      {isMobile ? (
        loading ? (
          <AccountMobileSkeleton />
        ) : (
          <AccountMobile data={data} />
        )
      ) : loading ? (
        <AccountDesktopSkeleton />
      ) : (
        <AccountDesktop data={data} />
      )}
    </div>
  );
}
