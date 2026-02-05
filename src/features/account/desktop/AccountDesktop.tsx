"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AccountData } from "@shared/types/types";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { Avatar } from "@shared/components/ui/Avatar";
import {
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Settings,
  MapPin,
  ChevronRight
} from "lucide-react";

export default function AccountDesktop({ data }: { data: AccountData }) {
  const { profile } = data;

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          {hydrated ? (
            <Avatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              size="xl"
              className="ring-4 ring-gray-50 h-20 w-20 text-3xl"
            />
          ) : (
            <Skeleton.Block width={80} height={80} radius={40} />
          )}

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Halo, {profile.name}
            </h1>
            <p className="text-gray-500">Member sejak 2024</p>
          </div>
        </div>

        <Link
          href={`/account/edit/${profile.id}`}
          className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          Edit Profil
        </Link>
      </div>

      {/* 2. Order Status Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Pesanan Saya</h2>
            <Link href="/account/transaction" className="text-sm font-semibold text-primary hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <StatusIcon
              icon={<CreditCard size={24} />}
              label="Menunggu"
              href="/account/transaction?status=pending"
            />
            <StatusIcon
              icon={<Package size={24} />}
              label="Diproses"
              href="/account/transaction?status=packed"
            />
            <StatusIcon
              icon={<Truck size={24} />}
              label="Dikirim"
              href="/account/transaction?status=shipped"
            />
            <StatusIcon
              icon={<CheckCircle size={24} />}
              label="Selesai"
              href="/account/transaction?status=completed"
            />
          </div>
        </div>

        {/* 3. Quick Actions / Info */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h2 className="font-bold text-lg mb-4">Informasi Akun</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Settings size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium">Email Terdaftar</div>
                <div className="text-sm font-semibold text-gray-900">{profile.email}</div>
              </div>
            </div>

            <Link href="/account/address" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group hover:border-primary/30 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                <MapPin size={20} className="text-gray-600 group-hover:text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium group-hover:text-primary transition-colors">Alamat Tersimpan</div>
                <div className="text-sm font-bold text-gray-900">Kelola Alamat</div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
          {icon}
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-600 text-center group-hover:text-primary transition-colors">
        {label}
      </span>
    </Link>
  )
}
