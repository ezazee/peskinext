"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { AddressItem } from "@shared/types/types";
import { accountData } from "@data/account";
import { CheckCircle2 } from "lucide-react";
import AccountSidebar from "@features/account/AccountSidebar";

export default function AddressListDesktop({
  items,
  primaryId,
  onSetPrimary,
  onRemove,
}: {
  items: ReadonlyArray<AddressItem>;
  primaryId: string | null;
  onSetPrimary: (id: string) => void;
  onRemove: (id: string) => void;
}): JSX.Element {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 items-stretch">
      {/* Sidebar kiri */}
      <AccountSidebar
        profile={{
          name: accountData.profile.name,
          email: accountData.profile.email,
          avatarUrl: accountData.profile.avatarUrl,
        }}
        active="address"
        onLogout={() => alert("Logout belum diimplementasi (mock).")}
      />

      {/* Panel kanan */}
      <main className="bg-white rounded-xl border p-6 h-full">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">List Alamat</h1>
          <Link
            href="/account/address/new"
            className="h-10 inline-flex items-center justify-center rounded-lg bg-primary px-4 text-white text-sm font-semibold hover:opacity-90"
          >
            Tambah Alamat
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          <AnimatePresence>
            {items.map((a) => {
              const isPrimary = a.id === primaryId || a.isPrimary;

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={[
                    "rounded-xl border p-4",
                    "grid grid-cols-[1fr_auto] gap-4",
                    isPrimary
                      ? "bg-sky-100/80 border-sky-300 ring-1 ring-sky-200" // << aktif: bg sky
                      : "border-gray-100",
                  ].join(" ")}
                >
                  {/* Kiri: info alamat */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold truncate">{a.label}</div>
                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/80 text-sky-700 ring-1 ring-sky-300">
                          <CheckCircle2 size={12} />
                          Utama
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 mt-0.5">
                      {a.recipient} · {a.phone}
                    </div>

                    <div className="text-sm text-gray-600 truncate">
                      {a.line1}, {a.city}, {a.province} {a.postalCode}
                    </div>
                  </div>

                  {/* Kanan: aksi (presisi tinggi & rata kanan) */}
                  <div
                    className={[
                      "flex gap-2",
                      "justify-self-end", // pastikan nempel ke kanan grid
                      "self-center", // vertikal center per kartu
                      "shrink-0", // cegah menciut
                    ].join(" ")}
                  >
                    {!isPrimary && (
                      <button
                        onClick={() => onSetPrimary(a.id)}
                        className={btnClass("ghost")}
                      >
                        Jadikan Utama
                      </button>
                    )}

                    <Link
                      href={`/account/address/edit/${a.id}`}
                      className={btnClass("ghost")}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => onRemove(a.id)}
                      className={btnClass("danger")}
                    >
                      Hapus
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ================= helpers ================ */

type BtnVariant = "ghost" | "danger";

function btnClass(variant: BtnVariant): string {
  const base =
    // tinggi & layout konsisten (presisi)
    "inline-flex items-center justify-center h-9 px-3 rounded-lg text-sm font-medium leading-none";
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-300";
  const ring = "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]";

  if (variant === "danger") {
    return [
      base,
      focus,
      "border border-red-200 text-red-600 hover:bg-red-50",
      ring,
    ].join(" ");
  }

  // ghost (outlined netral)
  return [base, focus, "border border-gray-200 hover:bg-gray-50", ring].join(
    " "
  );
}
