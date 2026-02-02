"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { IconByName } from "@features/account/IconMap";
import { Avatar } from "@shared/components/ui/Avatar";

export type AccountSidebarActive = "account" | "address" | "transaction" | "logout";

export type AccountSidebarProps = {
  profile: { name: string; email: string; avatarUrl: string };
  active?: AccountSidebarActive;
  onLogout?: () => void;
};

export default function AccountSidebar({ profile, active, onLogout }: AccountSidebarProps) {
  const segments = useSelectedLayoutSegments();
  const second = segments.at(1);

  const autoActive: AccountSidebarActive = (() => {
    if (second === "address") return "address";
    if (second === "transaction") return "transaction";
    return "account";
  })();

  const current: AccountSidebarActive = active ?? autoActive;

  return (
    <aside className="bg-white border rounded-xl p-4 h-fit">
      <Link href="/account" className="block">
        <div className="flex items-center gap-3 mb-6">
          <Avatar
            key={profile.avatarUrl}
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{profile.name}</div>
            <div className="text-xs text-gray-500 truncate">{profile.email}</div>
          </div>
        </div>
      </Link>

      <nav className="space-y-1">
        <SideRow
          label="Akun"
          href="/account"
          icon={<IconByName name="user" />}
          active={current === "account"}
        />
        <SideRow
          label="List Alamat"
          href="/account/address"
          icon={<IconByName name="address" />}
          active={current === "address"}
        />
        <SideRow
          label="Transaksi"
          href="/account/transaction"         // ← perbaiki ejaan path
          icon={<IconByName name="orderHistory" />}
          active={current === "transaction"}
        />
        <SideRow
          label="Logout"
          href="#"
          icon={<IconByName name="logout" />}
          danger
          onClick={onLogout}
        />
      </nav>
    </aside>
  );
}

function SideRow({
  label,
  href,
  icon,
  active = false,
  danger = false,
  onClick,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) {
  const base = "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors";
  const normalColor = "text-gray-700 hover:bg-gray-50";
  const activeColor = "bg-primary text-white hover:bg-primary/90 shadow-sm";
  const dangerColor = "text-red-600 hover:bg-red-50";
  const colorClass = danger ? dangerColor : active ? activeColor : normalColor;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${colorClass} w-full text-left`}
        aria-current={active ? "page" : undefined}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href} className={`${base} ${colorClass}`} aria-current={active ? "page" : undefined}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
