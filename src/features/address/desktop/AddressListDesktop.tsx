"use client";

import React, { type JSX } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { AddressItem } from "@shared/types/types";


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

  // handleLogout removed as it was only used by Sidebar

  return (

    <>
      {/* Panel kanan */}
      <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Alamat Saya</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola alamat pengiriman Anda</p>
          </div>
          <Link
            href="/account/address/new"
            className="h-10 inline-flex items-center justify-center rounded-xl bg-primary px-5 text-white text-sm font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            + Tambah Alamat
          </Link>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {items.map((a) => {
              const isPrimary = a.id === primaryId || a.isPrimary;

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={[
                    "rounded-2xl p-5 transition-colors shadow-sm",
                    isPrimary
                      ? "bg-sky-50/50 ring-1 ring-sky-100" // active
                      : "bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{a.label}</span>
                        {isPrimary && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                            <CheckCircle2 size={13} strokeWidth={2.5} />
                            Utama
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-medium text-gray-900">
                        {a.recipient} <span className="text-gray-400 mx-1">|</span> {a.phone}
                      </div>

                      <div className="text-sm text-gray-600 leading-relaxed max-w-xl">
                        {a.line1}, Kec. {a.district}, {a.city}, {a.province}, {a.postalCode}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/account/address/edit/${a.id}`}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          Ubah
                        </Link>
                        <button
                          onClick={() => onRemove(a.id)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>

                      {!isPrimary && (
                        <button
                          onClick={() => onSetPrimary(a.id)}
                          className="text-xs font-semibold text-primary hover:underline px-4"
                        >
                          Set Utama
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">Belum ada alamat tersimpan.</p>
            </div>
          )}
        </div>
      </div >
    </>
  );
}

/* ================= helpers ================ */


