"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AccountData } from "@shared/types/types";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import AccountSidebar from "../AccountSidebar";
import { Avatar } from "@shared/components/ui/Avatar";
import { logout } from "@features/auth/action";

export default function AccountDesktop({ data }: { data: AccountData }) {
  const router = useRouter();
  const { profile } = data;

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await logout();
      // Force full page reload untuk update header
      window.location.href = "/";
    }
  };

  // skeleton ringan saat hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 items-stretch">
      <AccountSidebar
        profile={{
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
        }}
        onLogout={handleLogout}
      />

      <main className="bg-white border rounded-xl p-6 h-full">
        <h2 className="text-lg font-semibold mb-4">Biodata Diri</h2>

        <div className="grid grid-cols-[220px_1fr] gap-6">
          {/* Foto & aksi */}
          <div>
            {hydrated ? (
              <Avatar
                key={profile.avatarUrl}
                name={profile.name}
                avatarUrl={profile.avatarUrl}
                size="xl"
                className="w-[220px] h-[220px] text-8xl"
              />
            ) : (
              <Skeleton.Block width={220} height={220} radius={12} />
            )}
            <button className="w-full mt-3 border rounded-md py-2 font-medium hover:bg-gray-50">
              Pilih Foto
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Besar file maksimum 10MB. Format: JPG, JPEG, PNG.
            </p>
          </div>

          {/* Info ringkas */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            <Field label="Nama" value={profile.name} loading={!hydrated} />
            <Field label="Email" value={profile.email} loading={!hydrated} />
            <Field label="Nomor HP" value={profile.phone} loading={!hydrated} />

            <div className="pt-2">
              <button
                className="w-full h-11 rounded-lg bg-sky-200/70 hover:bg-sky-200 font-semibold"
                onClick={() => router.push(`/account/edit/${profile.id}`)}
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-[180px_1fr] items-center gap-3 py-2 border-b">
        <Skeleton width={80} height={14} radius={6} />
        <Skeleton width="50%" height={14} radius={6} />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-3 py-2 border-b">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
