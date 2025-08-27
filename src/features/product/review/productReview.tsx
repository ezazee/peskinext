// File: src/features/product/components/ProductReview.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoStar } from "react-icons/io5";
import type { Review } from "@shared/types/types";
import { reviewsData } from "@data/review";
import { ReviewCard } from "./reviewCard";
import { nfID, StarsClean } from "@shared/helpers/productReview";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { useProductRating } from "../hooks/useProductRating";
import { useProductReviews } from "../hooks/useProductReviews";

// hooks dinamis berbasis API

/* ================= Config ================= */
const DEFAULT_PAGE_SIZE = 6;

/* ================= Skeletons ================= */
function ReviewSummarySkeleton() {
  return (
    <div className="rounded-lg p-4 border">
      <Skeleton.Text lines={1} widths={["35%"]} lineHeight={20} />
      <div className="flex gap-6 mt-4">
        <div className="w-1/3 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton.Block width={120} height={24} />
            <Skeleton.Block width={140} height={28} />
          </div>
          <Skeleton.Block width="60%" height={16} />
          <Skeleton.Block width="70%" height={12} />
        </div>
        <div className="w-2/3 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton.Block width={48} height={18} />
              <div className="w-full">
                <Skeleton.Block width="100%" height={6} />
              </div>
              <Skeleton.Block width={24} height={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="border-b py-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Skeleton.Block width={110} height={20} />
          <Skeleton.Block width={90} height={12} />
        </div>
        <Skeleton.Block width={20} height={12} />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Skeleton.Circle size={32} />
        <div className="flex-1">
          <Skeleton.Block width={120} height={14} />
          <div className="mt-1">
            <Skeleton.Block width={100} height={12} />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Skeleton.Text lines={2} widths={["90%", "60%"]} />
      </div>

      <div className="mt-2">
        <Skeleton.Block width={80} height={80} />
      </div>
    </div>
  );
}

/* ================= Util ================= */
type Star = 1 | 2 | 3 | 4 | 5;
type Counts = Record<Star, number>;
const emptyCounts: Counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

function buildCounts(items: ReadonlyArray<Review>): Counts {
  const c: Counts = { ...emptyCounts };
  for (const r of items) {
    const key = Math.max(1, Math.min(5, Math.round(r.rating))) as Star;
    c[key] += 1;
  }
  return c;
}

/* ================= Component ================= */
export type ProductReviewProps = {
  /** kunci produk; kirim dua-duanya agar sinkron dg mock (slug) & backend (sku) */
  sku: string;
  slug: string;
  /** ukuran halaman daftar ulasan */
  pageSize: number;
};

const ProductReview: React.FC<ProductReviewProps> = ({
  sku,
  slug,
  pageSize = DEFAULT_PAGE_SIZE,
}) => {
  const hasKey = Boolean(sku || slug);

  // 1) Ringkasan rating (avg + total) — API
  const {
    average: avgFromApi,
    count: totalFromApi,
    loading: loadingSummary,
  } = useProductRating({ sku, slug });

  // 2) Daftar ulasan (paginated) — API
  const [page, setPage] = useState(1);
  const {
    items: pageItems,
    total,
    loading: loadingPage,
  } = useProductReviews({ sku, slug }, page, pageSize);

  // 3) Distribusi bintang — ambil semua items (sekali fetch page besar)
  const { items: allItemsForDist, loading: loadingAllForDist } =
    useProductReviews({ sku, slug }, 1, 1000);

  // jaga halaman agar tidak out-of-range bila total berubah
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // ===== Fallback kalau sku/slug tidak diberikan (pakai semua mock) =====
  const fallbackCounts = useMemo(() => buildCounts(reviewsData), []);
  const fallbackAvg = useMemo(() => {
    const n = reviewsData.length || 1;
    return reviewsData.reduce((s, r) => s + (r.rating ?? 0), 0) / n;
  }, []);
  const fallbackTotal = reviewsData.length;

  // angka final ringkasan
  const avg = hasKey ? avgFromApi : fallbackAvg;
  const totalAll = hasKey ? totalFromApi : fallbackTotal;

  // distribusi final
  const counts: Counts = hasKey ? buildCounts(allItemsForDist) : fallbackCounts;

  const satisfiedPct = totalAll
    ? Math.round(((counts[4] + counts[5]) / totalAll) * 100)
    : 0;

  const startIdx = total ? (page - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(page * pageSize, total || 0);

  const row = (stars: Star) => {
    const c = counts[stars];
    const pct = totalAll ? Math.round((c / totalAll) * 100) : 0;
    return (
      <div key={stars} className="flex items-center gap-2 text-sm py-1">
        <span className="flex items-center w-8 shrink-0">
          <IoStar className="text-yellow-400 mr-1" /> {stars}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-subtle-text w-8 text-right shrink-0">{c}</span>
      </div>
    );
  };

  const renderPageNumbers = () => {
    const items: number[] = [];
    const maxShow = 7;
    if (totalPages <= maxShow) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      const left = Math.max(2, page - 1);
      const right = Math.min(totalPages - 1, page + 1);
      items.push(1);
      if (left > 2) items.push(-1);
      for (let i = left; i <= right; i++) items.push(i);
      if (right < totalPages - 1) items.push(-2);
      items.push(totalPages);
    }

    return (
      <div className="flex items-center gap-1">
        {items.map((n, idx) =>
          n > 0 ? (
            <button
              key={`p-${n}-${idx}`}
              onClick={() => setPage(n)}
              className={`px-3 py-1.5 rounded border cursor-pointer ${
                n === page
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-base-text hover:bg-gray-50"
              }`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ) : (
            <span key={`dots-${idx}`} className="px-2 text-subtle-text">
              …
            </span>
          )
        )}
      </div>
    );
  };

  const loadingSummaryBlock = loadingSummary || (hasKey && loadingAllForDist);
  const loadingList = loadingPage;

  return (
    <div className="mt-8 space-y-8">
      {/* Ringkasan Ulasan */}
      {loadingSummaryBlock ? (
        <ReviewSummarySkeleton />
      ) : (
        <div className="rounded-lg p-4 border">
          <h3 className="font-bold text-lg mb-4">Ulasan pembeli</h3>
          <div className="flex gap-6">
            <div className="w-1/3">
              <div className="flex items-center gap-3">
                <StarsClean value={avg} size={24} gap={2} />
                <p className="text-4xl font-bold">
                  {avg.toFixed(1)}{" "}
                  <span className="text-lg text-subtle-text font-normal">
                    / 5.0
                  </span>
                </p>
              </div>
              <p className="text-sm font-bold text-primary mt-1">
                {satisfiedPct}% pembeli merasa puas
              </p>
              <p className="text-xs text-subtle-text">
                {nfID(totalAll)} rating • {nfID(totalAll)} ulasan
              </p>
            </div>
            <div className="w-2/3">
              {[5, 4, 3, 2, 1].map((s) => row(s as Star))}
            </div>
          </div>
        </div>
      )}

      {/* Ulasan Pilihan (paginasi) */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">ULASAN PILIHAN</h3>
            <p className="text-sm text-subtle-text">
              {loadingList
                ? "Memuat ulasan…"
                : `Menampilkan ${nfID(startIdx)}–${nfID(endIdx)} dari ${nfID(
                    total
                  )} ulasan`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loadingList || page === 1}
              className={`px-3 py-1.5 rounded border cursor-pointer ${
                loadingList || page === 1
                  ? "text-subtle-text bg-gray-100 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
              aria-label="Halaman sebelumnya"
            >
              Prev
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={loadingList || page === totalPages}
              className={`px-3 py-1.5 rounded border cursor-pointer ${
                loadingList || page === totalPages
                  ? "text-subtle-text bg-gray-100 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
              aria-label="Halaman berikutnya"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4">
          {loadingList
            ? Array.from({ length: pageSize }).map((_, i) => (
                <ReviewCardSkeleton key={`sk-${i}`} />
              ))
            : pageItems.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
