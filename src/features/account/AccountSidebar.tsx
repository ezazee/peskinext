"use client";

import Link from "next/link";
import { useSelectedLayoutSegments, useRouter } from "next/navigation";
import { IconByName } from "@features/account/IconMap";
import { Avatar } from "@shared/components/ui/Avatar";
import { logout } from "@features/auth/action";

export type AccountSidebarActive = "account" | "address" | "transaction" | "logout";

export type AccountSidebarProps = {
  profile: { name: string; email: string; avatarUrl: string };
  // active prop is deprecated, use segments auto-detection
};

export default function AccountSidebar({ profile }: AccountSidebarProps) {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const second = segments.at(0); // /account/[second] -> account (dashboard is null or undefined?)
  // Actually segments of /account/address is ['address']
  // /account is [] or null

  const current = second || "account";

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await logout();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <aside className="w-full bg-white rounded-2xl shadow-sm p-5 h-fit sticky top-24">
      <Link href="/account" className="block group">
        <div className="flex items-center gap-4 mb-8 p-3 rounded-xl hover:bg-gray-50 transition-colors">
          <Avatar
            key={profile.avatarUrl}
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            size="lg"
            className="ring-2 ring-offset-2 ring-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
              {profile.name}
            </div>
            <div className="text-xs text-gray-500 truncate font-medium">
              {profile.email}
            </div>
          </div>
        </div>
      </Link>

      <nav className="space-y-1.5">
        <SideRow
          label="Dashboard"
          href="/account"
          icon={<IconByName name="user" />}
          active={current === "account"}
        />
        <SideRow
          label="Alamat Saya"
          href="/account/address"
          icon={<IconByName name="address" />}
          active={current === "address"}
        />
        <SideRow
          label="Riwayat Pesanan"
          href="/account/transaction"
          icon={<IconByName name="orderHistory" />}
          active={current === "transaction"}
        />

        <div className="pt-4 mt-4 border-t border-gray-100">
          <SideRow
            label="Keluar"
            href="#"
            icon={<IconByName name="logout" />}
            danger
            onClick={handleLogout}
          />
        </div>
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
  const base = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";
  const normalColor = "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1";
  const activeColor = "bg-primary text-white shadow-md shadow-primary/20";
  const dangerColor = "text-red-600 hover:bg-red-50 hover:text-red-700";
  const colorClass = danger ? dangerColor : active ? activeColor : normalColor;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${colorClass} w-full text-left`}
        aria-current={active ? "page" : undefined}
      >
        <span className={active ? "text-white" : danger ? "text-red-500" : "text-gray-400 group-hover:text-gray-600"}>
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} ${colorClass} group`}
      aria-current={active ? "page" : undefined}
    >
      <span className={active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
