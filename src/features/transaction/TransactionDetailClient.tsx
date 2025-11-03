"use client";

import React from "react";
import { transactionsMock } from "@data/transaction";
import type { UserTransaction } from "@data/index";
import AccountSidebar from "@features/account/AccountSidebar";
import { logout } from "@features/auth/action";
import TransactionDetailMobile from "./mobile/TransactionDetailMobile";
import TransactionDetailDesktop from "./desktop/TransactionDetailDesktop";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export default function TransactionDetailClient({
  id,
  profile
}: {
  id: string;
  profile: ProfileData;
}) {

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await logout();
      // Force full page reload untuk update header
      window.location.href = "/";
    }
  };

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const tx: UserTransaction | undefined = React.useMemo(
    () => transactionsMock.find((t) => t.id === id),
    [id]
  );

  if (!tx) {
    return (
      <div className="container mx-auto px-3 md:px-6 py-6">
        <div className="rounded-xl border bg-white p-10 text-center">
          <div className="text-lg font-semibold">Transaksi tidak ditemukan</div>
          <p className="text-sm text-gray-600 mt-1">
            Pastikan tautan/nomor invoice benar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6 items-start">
        {/* Sidebar hanya di desktop */}
        <div className="hidden md:block">
          <AccountSidebar
            profile={{
              name: profile.name,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
            }}
            active="transaction"
            onLogout={handleLogout}
          />
        </div>

        <main>
          {/* Desktop */}
          <div className="hidden md:block">
            {hydrated ? (
              <TransactionDetailDesktop tx={tx} />
            ) : (
              <DetailSkeletonDesktop />
            )}
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            {hydrated ? (
              <TransactionDetailMobile tx={tx} />
            ) : (
              <DetailSkeletonMobile />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===== skeletons ringkas ===== */

function DetailSkeletonDesktop() {
  return (
    <div className="space-y-4">
      <div className="h-32 rounded-2xl border bg-gray-50 animate-pulse" />
      <div className="h-64 rounded-2xl border bg-gray-50 animate-pulse" />
    </div>
  );
}

function DetailSkeletonMobile() {
  return (
    <div className="space-y-3">
      <div className="h-28 rounded-2xl border bg-gray-50 animate-pulse" />
      <div className="h-56 rounded-2xl border bg-gray-50 animate-pulse" />
    </div>
  );
}
