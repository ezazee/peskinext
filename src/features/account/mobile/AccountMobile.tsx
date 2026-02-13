"use client";

import React from "react";
import type { AccountData } from "@shared/types/types";
import Link from "next/link";
import { Avatar } from "@shared/components/ui/Avatar";
import { logout } from "@features/auth/action";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Settings,
  ShoppingBag,
  CreditCard,
  Heart,
  MapPin,
  LogOut,
  User,
  Gift,
  Clock,
  HelpCircle,
  FileText,
  ShieldCheck
} from "lucide-react";
import ConfirmationModal from "@shared/components/ui/ConfirmationModal";

export default function AccountMobile({ data }: { data: AccountData }) {
  const { profile } = data;
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header / Profile Section - Pure Minimalist */}
      <div className="bg-white px-6 pt-12 pb-10 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-4"
          >
            <div className="p-1 rounded-full bg-gray-50 shadow-inner">
              <Avatar
                key={profile.avatarUrl}
                name={profile.name}
                avatarUrl={profile.avatarUrl}
                size="xl"
                className="border-4 border-white shadow-lg"
              />
            </div>
            <Link
              href={`/account/edit/${profile.id}`}
              className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-primary transition-colors hover:scale-110"
            >
              <Settings size={16} />
            </Link>
          </motion.div>

          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-gray-900"
          >
            {profile.name}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 mt-1"
          >
            {profile.email}
          </motion.p>
        </div>
      </div>

      {/* Quick Stats / Order Status */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 flex justify-between items-center relative z-20">
          <StatusItem icon={<Clock size={22} />} label="Proses" count={0} />
          <div className="w-px h-8 bg-gray-100" />
          <StatusItem icon={<ShoppingBag size={22} />} label="Dikirim" count={0} />
          <div className="w-px h-8 bg-gray-100" />
          <StatusItem icon={<CreditCard size={22} />} label="Selesai" count={0} />
        </div>

        {/* Centered Riwayat Transaksi Link */}
        <div className="flex justify-center mt-4">
          <Link
            href="/account/transaction"
            className="text-xs font-semibold text-primary/80 hover:text-primary flex items-center gap-1.5 px-4 py-2 bg-primary/5 rounded-full transition-all active:scale-95"
          >
            <span>Riwayat Transaksi</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 mt-8 space-y-6">
        <MenuSection title="Aktifitas Saya">
          <MenuItem
            href="/account/transaction"
            icon={<ShoppingBag size={20} className="text-blue-500" />}
            label="Riwayat Pesanan"
          />
          <MenuItem
            href="/account/wishlist"
            icon={<Heart size={20} className="text-rose-500" />}
            label="Produk Favorit"
            badge="New"
          />
          <MenuItem
            href="/vouchers"
            icon={<Gift size={20} className="text-amber-500" />}
            label="Voucher Saya"
          />
        </MenuSection>

        <MenuSection title="Pengaturan Akun">
          <MenuItem
            href={`/account/edit/${profile.id}`}
            icon={<User size={20} className="text-indigo-500" />}
            label="Ubah Profil"
          />
          <MenuItem
            href="/account/address"
            icon={<MapPin size={20} className="text-emerald-500" />}
            label="Daftar Alamat"
          />
        </MenuSection>

        <MenuSection title="Bantuan & Lainnya">
          <MenuItem
            href="/help"
            icon={<HelpCircle size={20} className="text-gray-500" />}
            label="Pusat Bantuan"
          />
          <MenuItem
            href="/terms"
            icon={<FileText size={20} className="text-gray-500" />}
            label="Syarat & Ketentuan"
          />
          <MenuItem
            href="/privacy"
            icon={<ShieldCheck size={20} className="text-gray-500" />}
            label="Kebijakan Privasi"
          />
        </MenuSection>

        <MenuSection>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-500 font-semibold bg-red-50/50 rounded-2xl active:bg-red-100/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <span className="flex-1 text-left">Keluar dari Akun</span>
            <ChevronRight size={18} className="text-red-300" />
          </button>
        </MenuSection>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Keluar Akun"
        description="Harap konfirmasi jika Anda benar-benar ingin keluar dari sesi saat ini."
        confirmLabel="Ya, Keluar"
        variant="warning"
        isLoading={isLoggingOut}
      />
    </div>
  );
}

function StatusItem({ icon, label, count }: { icon: React.ReactNode, label: string, count: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="relative text-gray-700">
        {icon}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function MenuSection({ title, children }: { title?: string, children: React.ReactNode }) {
  return (
    <div>
      {title && <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-3">{title}</h3>}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100/50">
        <div className="divide-y divide-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ href, icon, label, badge, onClick }: { href?: string, icon: React.ReactNode, label: string, badge?: string, onClick?: () => void }) {
  const content = (
    <div className="flex items-center gap-4 px-4 py-4 active:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <span className="flex-1 text-[14px] font-semibold text-gray-700">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight size={18} className="text-gray-300" />
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content}</button>;
  }

  return (
    <Link href={href || "#"} className="block">
      {content}
    </Link>
  );
}
