// src/shared/components/layout/header/mobile/SearchOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, SearchIcon, LocationIcon } from "@shared/components/icons";

type Props = {
  open: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
};

export default function SearchOverlay({ open, onClose, onSearch }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");

  // kunci scroll saat overlay terbuka
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const handleSearch = () => {
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      onClose();
    }
  };

  // tutup pakai ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        if (onSearch) {
          onSearch(q);
        } else {
          handleSearch();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, q, onClose, onSearch]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-white z-[90] flex flex-col"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 p-2 border-b border-border-color">
            <button onClick={onClose} className="p-2 text-subtle-text cursor-pointer">
              <ArrowLeftIcon />
            </button>
            <div className="flex-grow relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-subtle-text">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Cari di PE Skinpro"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full border border-border-color rounded-lg py-2 pl-10 pr-4 bg-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
            <button
              className="font-semibold text-primary px-3 cursor-pointer"
              onClick={() => (onSearch ? onSearch(q) : handleSearch())}
            >
              Cari
            </button>
          </div>

          {/* Konten bawah (tips / dst) */}
          <div className="p-4">
            <div className="flex justify-between items-center p-3 border border-border-color rounded-lg hover:bg-tertiary cursor-pointer">
              <div className="flex items-center gap-3">
                <LocationIcon className="h-5 w-5 text-subtle-text" />
                <span className="text-sm text-subtle-text">Tips & Trik Pencarian</span>
              </div>
              <a href="#" className="text-sm font-bold text-primary hover:underline">
                Pelajari
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
