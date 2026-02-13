"use client";

import React from "react";
import type { AccountData } from "@shared/types/types";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import AccountMobile from "./mobile/AccountMobile";
import AccountMobileSkeleton from "./skeleton/AccountMobileSkeleton";
import AccountDesktopSkeleton from "./skeleton/AccountDesktopSkeleton";
import AccountDesktop from "./desktop/AccountDesktop";

export default function AccountClient({ data }: { data: AccountData }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Consistent empty state for SSR and first Client pass
    return <div className="w-full min-h-screen bg-gray-50" />;
  }

  return <AccountContent data={data} />;
}

/**
 * Sub-component that handles all client-side logic and hooks.
 * This is only rendered after hydration is complete.
 */
function AccountContent({ data }: { data: AccountData }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
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
