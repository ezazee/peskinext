"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar } from "react-icons/io5";
import type { Review } from "@data/index";
import ReviewsModalMobile from "./ReviewsModalMobile";
import ReviewsModalMobileSkeleton from "./ReviewsModalMobileSkeleton";
import { useQuery } from "@tanstack/react-query";

type Props = {
  reviews?: Review[];
  seeAllHref?: string;
  slug?: string;
  sku?: string;
};

type ReviewsListResponse = {
  items: Review[];
  total: number;
  average: number;
  count: number;
  page: number;
  pageSize: number;
};

const nfID = (n: number) => n.toLocaleString("id-ID");

async function fetchAllReviewsFromApi(params: {
  slug?: string;
  sku?: string;
}): Promise<Review[]> {
  const sp = new URLSearchParams();
  if (params.slug) sp.set("slug", params.slug);
  if (params.sku) sp.set("sku", params.sku);
  sp.set("page", "1");
  sp.set("pageSize", "1000");

  const res = await fetch(`/api/reviews?${sp.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  const json = (await res.json()) as ReviewsListResponse;
  return json.items;
}

export default function MobileReviews({
  reviews = [],
  seeAllHref,
  slug,
  sku,
}: Props) {
  // urutkan dummy agar enak dilihat
  const safe = useMemo(
    () =>
      (Array.isArray(reviews) ? [...reviews] : []).sort(
        (a, b) => b.rating - a.rating
      ),
    [reviews]
  );

  // ====== modal state ======
  const [openModal, setOpenModal] = useState(false);

  // Query untuk isi modal: hanya aktif saat modal dibuka
  const { data: modalReviews, isLoading: modalLoading } = useQuery<Review[]>({
    queryKey: ["reviews", "mobile-modal", slug ?? null, sku ?? null],
    queryFn: async () =>
      slug || sku
        ? fetchAllReviewsFromApi({ slug, sku })
        : Promise.resolve(safe),
    enabled: openModal, // ⬅️ fetch hanya ketika modal dibuka
    staleTime: Infinity, // ⬅️ anggap selalu fresh → tidak refetch otomatis
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const top3 = useMemo(() => safe.slice(0, 3), [safe]);

  // avg summary
  const avg = useMemo(() => {
    if (!safe.length) return 0;
    return safe.reduce((s, r) => s + r.rating, 0) / safe.length;
  }, [safe]);

  // slider kecil
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIdx(Math.min(Math.max(0, i), Math.max(0, top3.length - 1)));
  };

  return (
    <motion.section
      id="ulasan"
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
          <Link
            href={seeAllHref}
            className="text-sm text-primary font-semibold"
            onClick={(e) => {
              e.preventDefault();
              setOpenModal(true);
            }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {/* Summary (avg + count) */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
        <Stars value={avg} />
        <span>
          {avg.toFixed(1)} • {nfID(safe.length)} ulasan
        </span>
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
                <motion.article
                  key={r.id}
                  whileTap={{ scale: 0.98 }}
                  className="snap-start min-w-full px-4"
                >
                  <div className="rounded-xl bg-white shadow-sm p-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold">{r.user}</p>
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

                    {r.images && r.images.length > 0 && (
                      <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                        {r.images.map((img, i) => (
                          <div
                            key={`${r.id}-${i}`}
                            className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0"
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
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* dots */}
          <div className="mt-2 flex justify-center gap-2">
            {top3.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  idx === i ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-gray-500">Belum ada ulasan.</p>
      )}

      {/* ===== Modal & Skeleton (fetch saat modal buka) ===== */}
      {openModal && modalLoading && (
        <ReviewsModalMobileSkeleton
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {openModal && !modalLoading && (
        <ReviewsModalMobile
          open={openModal}
          reviews={modalReviews ?? safe}
          onClose={() => setOpenModal(false)}
        />
      )}
    </motion.section>
  );
}

/* ---- Small components ---- */
function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const count = Math.round(value); // 0..5
  const cls = size === "sm" ? "text-yellow-400 text-[14px]" : "text-yellow-400";
  const clsEmpty =
    size === "sm" ? "text-gray-300 text-[14px]" : "text-gray-300";
  return (
    <span className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <IoStar key={i} className={i < count ? cls : clsEmpty} />
      ))}
    </span>
  );
}

function ExpandableText({
  text,
  wordLimit = 40,
}: {
  text: string;
  wordLimit?: number;
}) {
  const [open, setOpen] = useState(false);

  const content = (text ?? "").trim() || "-";
  const words = content.split(/\s+/);
  const isTruncated = words.length > wordLimit;
  const shortText = isTruncated
    ? words.slice(0, wordLimit).join(" ") + "…"
    : content;

  return (
    <div className="mt-2 text-sm leading-relaxed text-gray-800">
      <AnimatePresence initial={false}>
        <motion.div
          key={open ? "open" : "closed"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {open || !isTruncated ? content : shortText}
        </motion.div>
      </AnimatePresence>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="mt-1 text-sm font-semibold text-primary"
        >
          {open ? "Tutup" : "Selengkapnya"}
        </button>
      )}
    </div>
  );
}
