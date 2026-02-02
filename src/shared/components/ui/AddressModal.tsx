// File: src/app/components/AddressModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CheckIcon,
  MapPinIcon,
  TrashIcon,
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

            {/* List alamat */}
            <div className="p-5 overflow-y-auto">
              <div className="space-y-4">
                {filtered.map((addr) => {
                  const active = selected === addr.id; // ❗ hanya aktif jika dipilih via tombol
                  return (
                    <div
                      key={addr.id}
                      className={`rounded-xl border p-4 transition ${active ? "bg-sky-50 border-sky-500" : "bg-white"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          {/* Label + badge Utama */}
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{addr.label}</span>
                            {addr.isPrimary && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-200 text-gray-600">
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
                          <div className="mt-1 text-sm text-gray-600">
                            {addr.address}
                          </div>

                          {/* Pinpoint */}
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <MapPinIcon className="h-4 w-4 text-primary" />
                            <span className="text-primary">
                              {addr.pinpointed === false
                                ? "Belum Pinpoint"
                                : "Sudah Pinpoint"}
                            </span>
                          </div>

                          {/* Actions kiri */}
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <button
                              type="button"
                              onClick={() => onEdit?.(addr.id)}
                              className="text-primary cursor-pointer hover:underline"
                            >
                              {" "}
                              Ubah Alamat
                            </button>

                            {!addr.isPrimary && (
                              <>
                                <span className="text-gray-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected(addr.id); // aktifkan via aksi tombol
                                    onMakePrimary?.(addr.id); // jadikan utama (opsional)
                                    onConfirm(addr.id); // konfirmasi pemakaian
                                  }}
                                  className="text-primary cursor-primary font-semibold hover:underline"
                                >
                                  Jadikan Alamat Utama & Pilih
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => onDelete?.(addr.id)}
                                  className="text-red-600 hover:underline"
                                >
                                  <span className="inline-flex items-center gap-1">
                                    <TrashIcon className="h-4 w-4" /> Hapus
                                  </span>
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

            <div className="mb-3 px-5 py-3">
              <button
                onClick={onAddNew}
                className="w-full rounded-lg border border-primary text-primary font-semibold py-2 hover:bg-primary/5 cursor-pointer"
              >
                Tambah Alamat Baru
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
