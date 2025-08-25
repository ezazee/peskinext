"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoHeartOutline, IoStar } from "react-icons/io5";
import type { Review } from "@data/index";

type Props = { reviews?: Review[]; seeAllHref?: string };
const nfID = (n: number) => n.toLocaleString("id-ID");

export default function MobileReviews({ reviews = [], seeAllHref }: Props) {
  const safe = useMemo(
    () =>
      (Array.isArray(reviews) ? [...reviews] : [])
        .sort((a, b) => b.rating - a.rating || b.likes - a.likes),
    [reviews]
  );

  const top3 = useMemo(() => safe.slice(0, 3), [safe]);

  // avg summary
  const avg = useMemo(() => {
    if (!safe.length) return 0;
    return safe.reduce((s, r) => s + r.rating, 0) / safe.length;
  }, [safe]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIdx(Math.min(Math.max(0, i), Math.max(0, top3.length - 1)));
  };

  return (
    <motion.section
      id="ulasan" // anchor untuk link dari bawah Variasi
      className="rounded-xl bg-white shadow-sm p-4"
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Ulasan pembeli</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-sm text-primary font-semibold">
            Lihat Semua
          </Link>
        )}
      </div>

      {/* Summary (avg + count) */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
        <Stars value={avg} />
        <span>{avg.toFixed(1)} • {nfID(safe.length)} ulasan</span>
      </div>

      {/* Slider — 1 kartu per layar */}
      {top3.length > 0 ? (
        <>
          <div className="mt-3 -mx-4">
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory snap-always touch-pan-x overscroll-x-contain scroll-smooth"
            >
              {top3.map((r) => (
                <motion.article key={r.id} whileTap={{ scale: 0.98 }} className="snap-start min-w-full px-4">
                  <div className="rounded-xl bg-white shadow-sm p-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold">{r.user}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <IoHeartOutline className="text-gray-400" />
                        <span>{nfID(r.likes)}</span>
                      </div>
                    </div>

                    {/* rating per review */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <Stars value={r.rating} size="sm" />
                      <span>{r.rating.toFixed(1)}</span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Varian: <span className="text-gray-700">{r.variant}</span>
                    </p>

                    <ExpandableText text={r.comment} />

                    {r.image && (
                      <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                          <Image src={r.image} alt="foto ulasan" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* dots */}
          <div className="mt-2 flex justify-center gap-2">
            {top3.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${idx === i ? "bg-primary" : "bg-gray-300"}`} />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-gray-500">Belum ada ulasan.</p>
      )}
    </motion.section>
  );
}

/* ---- Small components ---- */
function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const count = Math.round(value); // 0..5
  const cls = size === "sm" ? "text-yellow-400 text-[14px]" : "text-yellow-400";
  const clsEmpty = size === "sm" ? "text-gray-300 text-[14px]" : "text-gray-300";
  return (
    <span className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <IoStar key={i} className={i < count ? cls : clsEmpty} />
      ))}
    </span>
  );
}

function ExpandableText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const content = text?.trim() ? text : "-";
  return (
    <div className="mt-2 text-sm leading-relaxed text-gray-800">
      <AnimatePresence initial={false}>
        <motion.div
          key={open ? "open" : "closed"}
          initial={{ height: 64, overflow: "hidden" }}
          animate={{ height: open ? "auto" : 64 }}
          exit={{ height: 64 }}
          transition={{ duration: 0.25 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      <button type="button" onClick={() => setOpen((s) => !s)} className="mt-1 text-sm font-semibold text-primary">
        {open ? "Tutup" : "Selengkapnya"}
      </button>
    </div>
  );
}
