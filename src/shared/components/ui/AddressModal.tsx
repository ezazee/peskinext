// File: src/app/components/AddressModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import type { AddressListEntry } from "@shared/types/types";

// data entry yang lebih kaya (opsional)
type Entry = AddressListEntry & {
  recipient?: string;
  phone?: string;
  pinpointed?: boolean;
};

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ReadonlyArray<Entry>;
  selectedId?: string | null; // alamat yang sedang dipakai (dari luar)
  onConfirm: (id: string) => void; // ditekan saat pilih
  onAddNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMakePrimary?: (id: string) => void; // untuk "Jadikan Alamat Utama & Pilih"
}

export const AddressModal = ({
  isOpen,
  onClose,
  options,
  selectedId,
  onConfirm,
  onAddNew,
  onEdit,
  onDelete,
  onMakePrimary,
}: AddressModalProps) => {
  // state internal menyalin selectedId saat modal dibuka
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (isOpen) setSelected(selectedId ?? null);
    if (!isOpen) {
      const t = setTimeout(() => {
        setSelected(null);
        setQ("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen, selectedId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) =>
      [o.label, o.address, o.recipient ?? "", o.phone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [options, q]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            className="w-full bg-white rounded-2xl md:max-w-2xl flex flex-col max-h-[90vh]"
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-xl font-bold">Daftar Alamat</h2>
              <button
                aria-label="Tutup"
                onClick={onClose}
                className="p-1 rounded cursor-pointer hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pt-3 pb-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <MagnifyingGlassIcon className="h-4.5 w-4.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari alamat, nama penerima, atau nomor HP..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-xl py-2.5 pl-10.5 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* List alamat */}
            <div className="px-5 py-3 overflow-y-auto flex-1">
              <div className="space-y-4">
                {filtered.map((addr) => {
                  const active = selected === addr.id; // ❗ hanya aktif jika dipilih via tombol
                  return (
                    <div
                      key={addr.id}
                      className={`relative rounded-xl border-2 transition-all duration-300 p-4 ${active
                        ? "bg-primary/[0.02] border-primary shadow-sm shadow-primary/5"
                        : "bg-white border-gray-50 hover:border-gray-200 hover:shadow-sm"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          {/* Label + badge Utama */}
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 leading-none">{addr.label}</span>
                            {addr.isPrimary && (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-widest ring-1 ring-primary/5">
                                Utama
                              </span>
                            )}
                          </div>

                          {/* Penerima & telp (opsional) */}
                          {(addr.recipient || addr.phone) && (
                            <div className="mt-1 text-sm text-gray-800 font-medium">
                              {addr.recipient}
                              {addr.phone && (
                                <>
                                  {" "}
                                  <span className="font-normal">
                                    · {addr.phone}
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          {/* Detail alamat */}
                          <div className="mt-2 text-sm text-gray-500 leading-relaxed font-medium">
                            {addr.address}
                          </div>

                          {/* Actions kiri style baru */}
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px]">
                            <button
                              type="button"
                              onClick={() => onEdit?.(addr.id)}
                              className="inline-flex items-center gap-1.5 text-gray-400 font-bold hover:text-primary transition-colors cursor-pointer"
                            >
                              <PencilIcon className="h-3 w-3" />
                              Ubah
                            </button>

                            {!addr.isPrimary && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected(addr.id);
                                    onMakePrimary?.(addr.id);
                                    onConfirm(addr.id);
                                  }}
                                  className="text-primary font-bold hover:text-secondary transition-colors cursor-pointer"
                                >
                                  Pilih Alamat Ini
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDelete?.(addr.id)}
                                  className="inline-flex items-center gap-1.5 text-red-300 font-bold hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                  Hapus
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Kanan: hanya cek jika 'active', selain itu tampil tombol Pilih */}
                        <div className="pl-2 shrink-0">
                          {active ? (
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                              <CheckIcon className="h-5 w-5" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelected(addr.id); // ❗aktif hanya lewat tombol
                                onConfirm(addr.id);
                              }}
                              className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer"
                            >
                              Pilih
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-8">
                    Tidak ada alamat yang cocok dengan pencarian.
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-4 border-t bg-white mt-auto">
              <button
                onClick={onAddNew}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-primary/5 text-sm"
              >
                <span className="text-lg">+</span>
                Tambah Alamat Baru
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
