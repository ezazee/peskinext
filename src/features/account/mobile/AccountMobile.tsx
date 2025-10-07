"use client";

import type { AccountData } from "@shared/types/types";
import Image from "next/image";
import Link from "next/link";
import { IconByName } from "@features/account/IconMap";

export default function AccountMobile({ data }: { data: AccountData }) {
  const { profile } = data;

  return (
    <div className="pb-20">
      {/* Header akun */}
      <Link
        href={`/account/edit/${profile.id}`}
        className="block px-4 pt-4 pb-3 bg-white shadow-sm active:bg-gray-50 rounded-lg mx-4 mt-4"
        aria-label="Buka halaman akun"
      >
        <div className="flex items-center gap-3">
          <Image
            width={48}
            height={48}
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{profile.name}</div>
            <div className="text-xs text-gray-600 truncate">
              {profile.email}
              {profile.phone ? ` · ${profile.phone}` : ""}
            </div>
          </div>
        </div>
      </Link>

      {/* Menu ringkas */}
      <section className="mx-1 mt-3">
        <div className="bg-white rounded-lg overflow-hidden divide-y divide-gray-100/80">
          <Row href="/account" label="Akun" icon={<IconByName name="user" />} />
          <Row
            href="/account/address"
            label="List Alamat"
            icon={<IconByName name="address" />}
          />
          <Row
            href="/account/transaction"
            label="Transaksi"
            icon={<IconByName name="orderHistory" />}
          />
          <Row
            href="#"
            label="Logout"
            icon={<IconByName name="logout" />}
            danger
            onClick={() => alert("Logout mock")}
          />
        </div>
      </section>
    </div>
  );
}

/* ---- UI row ---- */
function Row({
  href,
  label,
  icon,
  danger = false,
  onClick,
}: {
  href?: string;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  const base =
    "flex items-center gap-3 px-4 py-3 active:bg-gray-50 first:rounded-t-lg last:rounded-b-lg";
  const color = danger ? "text-red-600" : "text-gray-900";

  const content = (
    <>
      <span className="w-5 h-5 flex items-center justify-center text-gray-500">
        {icon}
      </span>
      <span className={`flex-1 text-sm ${color}`}>{label}</span>
      <span className={danger ? "text-red-300" : "text-gray-300"} aria-hidden>
        ›
      </span>
    </>
  );

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={`${base} w-full text-left`}
    >
      {content}
    </button>
  ) : (
    <Link href={href ?? "#"} className={base} role="button" aria-label={label}>
      {content}
    </Link>
  );
}
