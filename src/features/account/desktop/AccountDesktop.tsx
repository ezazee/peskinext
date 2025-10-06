"use client";

import type { AccountData } from "@shared/types/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconByName } from "../IconMap";

export default function AccountDesktop({ data }: { data: AccountData }) {
  const { profile } = data;
  const router = useRouter();

  return (
    <div className="grid grid-cols-[260px_1fr] gap-6">
      {/* Sidebar kiri */}
      <aside className="bg-white border rounded-xl p-4">
        {/* Header user */}
        <button onClick={() => router.push(`/account`)} className="w-full text-left cursor-pointer">
          <div className="flex items-center gap-3 mb-6">
            <Image
              width={48}
              height={48}
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-sm">{profile.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {profile.email}
              </div>
            </div>
          </div>
        </button>

        {/* Menu singkat */}
        <nav className="space-y-1">
          <SideRow
            label="List Alamat"
            href="/account/address"
            icon={<IconByName name="address" />}
          />
          <SideRow
            label="Transaksi"
            href="/transaction"
            icon={<IconByName name="orderHistory" />}
          />
          <SideRow
            label="Logout"
            href="#"
            icon={<IconByName name="logout" />}
            danger
            onClick={() => {
              alert("Logout belum diimplementasi (mock).");
            }}
          />
        </nav>
      </aside>

      {/* Panel kanan */}
      <main className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Biodata Diri</h2>
        <div className="grid grid-cols-[220px_1fr] gap-6">
          {/* Foto */}
          <div>
            <Image
              width={220}
              height={220}
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-[220px] h-[220px] object-cover rounded-lg"
            />
            <button
              className="w-full mt-3 border rounded-md py-2 font-medium hover:bg-gray-50"
              onClick={() => router.push(`/account/edit/${profile.id}`)}
            >
              Pilih Foto
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Besar file maksimum 10MB. Format: JPG, JPEG, PNG.
            </p>
          </div>

          {/* Informasi */}
          <div className="space-y-4">
            <Field label="Nama" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Nomor HP" value={profile.phone ?? "-"} />

            <div className="pt-4">
              <button
                className="rounded-lg cursor-pointer w-full bg-sky-200 hover:bg-sky-300 transition-colors"
                onClick={() => router.push(`/account/edit/${profile.id}`)}
              >
                <div className="p-3 flex items-center justify-center">
                  <span className="font-semibold text-sm">Edit Profile</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SideRow({
  label,
  href,
  icon,
  danger = false,
  onClick,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  const baseClass =
    "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm cursor-pointer hover:bg-gray-50 transition-colors";
  const colorClass = danger ? "text-red-600 hover:bg-red-50" : "text-gray-700";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClass} ${colorClass} w-full text-left`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href} className={`${baseClass} ${colorClass}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Field(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <div className="grid grid-cols-[180px_1fr_auto] items-center gap-3 py-2 border-b border-gray-100">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
