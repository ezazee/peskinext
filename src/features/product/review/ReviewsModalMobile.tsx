// File: src/features/product/components/review/ReviewsModalMobile.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Review } from "@shared/types/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { XMarkIcon } from "@shared/components/icons";
import { Star } from "lucide-react";
import Lightbox from "@shared/components/ui/Lightbox";

type Props = {
  open: boolean;
  reviews: Review[];
  onClose: () => void;
};

type SortKey = "recent" | "rating";
type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;

const nfID = (n: number) => n.toLocaleString("id-ID");

/* ============ helpers ============ */
function timeAgoId(input?: string | number | Date) {
  if (!input) return "";
  const d = new Date(input);
  const diff = Date.now() - d.getTime();
  const sec = Math.max(0, Math.floor(diff / 1000));
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (sec < 10) return "baru saja";
  if (sec < 60) return `${sec} detik lalu`;
  if (min < 60) return `${min} menit lalu`;
  if (hour < 24) return `${hour} jam lalu`;
  if (day < 30) return `${day} hari lalu`;
  if (month < 12) return `${month} bulan lalu`;
  return `${year} tahun lalu`;
}

function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const count = Math.round(value); // 0..5
  const cls = size === "sm" ? "text-yellow-400 text-[14px]" : "text-yellow-400";
  const clsEmpty =
    size === "sm" ? "text-gray-300 text-[14px]" : "text-gray-300";
  return (
    <span className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={i < count ? cls : clsEmpty} />
      ))}
    </span>
  );
}

/* ============ component ============ */
export default function ReviewsModalMobile({ open, reviews, onClose }: Props) {
  // lock scroll body
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const [lightbox, setLightbox] = useState<{
    open: boolean;
    images: string[];
    index: number;
  }>({
    open: false,
    images: [],
    index: 0,
  });

  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [filter, setFilter] = useState<RatingFilter>(0); // 0 = semua

  const sorted = useMemo(() => {
    const arr = [...(reviews || [])];
    switch (sortBy) {
      case "rating":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      default: // "recent"
        arr.sort((a, b) => {
          const ad = a.date ? +new Date(a.date) : 0;
          const bd = b.date ? +new Date(b.date) : 0;
          return bd - ad || b.rating - a.rating;
        });
    }
    return arr;
  }, [reviews, sortBy]);

  const filtered = useMemo(
    () =>
      filter ? sorted.filter((r) => Math.round(r.rating) === filter) : sorted,
    [sorted, filter]
  );

  const variants = {
    overlay: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    sheet: {
      hidden: { y: "100%" },
      visible: {
        y: 0,
        transition: { type: "spring" as const, stiffness: 280, damping: 28 },
      },
      exit: { y: "100%", transition: { duration: 0.2 } },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 z-[89] bg-black/30 md:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants.overlay}
            onClick={onClose}
            aria-hidden
          />
          {/* bottom sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-2xl md:hidden
                       flex max-h-[85vh] flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Semua Ulasan"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants.sheet}
            onClick={(e) => e.stopPropagation()}
          >
            {/* grabber + header */}
            <div className="pt-2">
              <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-gray-300/80" />
            </div>
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pb-2">
              <div className="flex items-center gap-3 py-2">
                <button
                  aria-label="Tutup"
                  onClick={onClose}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon />
                </button>
                <h3 className="text-base font-semibold">Semua Ulasan</h3>
              </div>

              {/* controls */}
              <div className="mt-1 flex items-center justify-between gap-2">
                {/* filter by star */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  {([0, 5, 4, 3, 2, 1] as RatingFilter[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setFilter(v)}
                      className={`px-2.5 py-1 rounded-full text-xs border shrink-0 ${filter === v
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-white text-gray-700"
                        }`}
                    >
                      {v === 0 ? "Semua" : `${v}★`}
                    </button>
                  ))}
                </div>

                {/* sort */}
                <div className="text-xs text-gray-600">
                  <label className="mr-1">Urut:</label>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                  >
                    <option value="recent">Terbaru</option>
                    <option value="rating">Bintang tertinggi</option>
                  </select>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {nfID(filtered.length)} ulasan ditampilkan
              </p>
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Tidak ada ulasan.
                </div>
              ) : (
                <ul className="space-y-3">
                  {filtered.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold">{r.user}</p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="whitespace-nowrap">
                            {timeAgoId(r.date)}
                          </span>
                          <span>•</span>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                        <Stars value={r.rating} size="sm" />
                        <span>{r.rating.toFixed(1)}</span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        Varian:{" "}
                        <span className="text-gray-700">{r.variant}</span>
                      </p>

                      {/* komentar */}
                      <p className="mt-2 text-sm leading-relaxed text-gray-800">
                        {r.comment}
                      </p>

                      {/* foto */}
                      {r.images && r.images.length > 0 && (
                        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                          {r.images.map((img, i) => (
                            <div
                              key={`${r.id}-${i}`}
                              className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                              onClick={() =>
                                setLightbox({
                                  open: true,
                                  images: r.images,
                                  index: i,
                                })
                              }
                            >
                              <Image
                                src={img}
                                alt={`Foto ulasan ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div className="h-2" />
            </div>
            {/* Lightbox */}
            {lightbox.open && (
              <Lightbox
                images={lightbox.images}
                startIndex={lightbox.index}
                onClose={() =>
                  setLightbox({ open: false, images: [], index: 0 })
                }
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
