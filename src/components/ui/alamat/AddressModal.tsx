// File: src/app/components/AddressModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@/components/icons";
import Link from "next/link";

const addresses = [
  {
    id: 1,
    label: "Rumah",
    address: "Jl. Jend. Sudirman No. 123, Garut",
    isPrimary: true,
  },
  {
    id: 2,
    label: "Kantor",
    address: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
    isPrimary: false,
  },
];

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal = ({ isOpen, onClose }: AddressModalProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedAddressId(null);
      }, 300);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // 1. z-index dinaikkan menjadi z-[60] agar berada di atas footer mobile (yang biasanya z-50)
          className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            className="w-full bg-white rounded-t-2xl md:rounded-lg md:max-w-md flex flex-col max-h-[90vh]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal (Fixed) */}
            <div className="flex items-center justify-between p-4 border-b border-border-color shrink-0">
              <h2 className="text-lg font-bold text-base-text">
                Pilih Alamat Pengiriman
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-800 cursor-pointer transition-colors"
              >
                <XMarkIcon />
              </button>
            </div>

            {/* Konten Modal yang bisa di-scroll */}
            <div className="p-4 overflow-y-auto">
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-primary bg-tertiary ring-2 ring-primary"
                        : "border-border-color hover:bg-tertiary"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-base-text">{addr.label}</p>
                        <p className="text-sm text-subtle-text">
                          {addr.address}
                        </p>
                      </div>
                      {addr.isPrimary && (
                        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                          Utama
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {/* Tombol "Tambah Alamat Baru" yang SELALU ADA di dalam area scroll */}
                <Link href="#" className="block">
                  <button className="cursor-pointer w-full text-left p-3 border-2 border-dashed border-border-color rounded-lg text-primary font-semibold hover:bg-tertiary">
                    + Tambah Alamat Baru
                  </button>
                </Link>
              </div>
            </div>

            {/* Footer Modal (Fixed) dengan Tombol Aksi yang muncul secara kondisional */}
            <div className="shrink-0">
              <AnimatePresence>
                {selectedAddressId && (
                  <motion.div
                    className="p-4 border-t border-border-color"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button className="cursor-pointer w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                      Pilih Alamat & Lanjut
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
