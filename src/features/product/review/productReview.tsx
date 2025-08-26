// File: src/features/product/components/ProductReview.tsx
"use client";

import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { reviewsData } from "@data/review";
import { ReviewCard } from "./reviewCard";
import type { Review } from "@data/index";
import {
  nfID,
  StarsClean,
  useRatingSummary,
} from "@shared/helpers/productReview";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

/* ================= Fake API layer (bisa diganti ke fetch nanti) ================= */

const PAGE_SIZE = 6;

/** Simulasi request: sort → slice → delay */
async function fetchReviewsPage(page: number, pageSize: number) {
  const sorted = [...reviewsData].sort((a, b) => b.rating - a.rating);
  const total = sorted.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const items = sorted.slice(start, end);
  // simulasi latency 500ms
  await new Promise((r) => setTimeout(r, 500));
  return { items, total };
}

/** Hook paginasi + loading */
function usePaginatedReviews(page: number, pageSize: number) {
  const [items, setItems] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchReviewsPage(page, pageSize)
      .then(({ items, total }) => {
        if (!alive) return;
        setItems(items);
        setTotal(total);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [page, pageSize]);

  return { items, total, loading };
}

/* ================= Universal Skeletons (pakai Skeleton primitives) ================= */

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

/* ================= Component ================= */

const ProductReview = () => {
  // ringkasan bisa pakai semua data (statik lokal), jadi tidak perlu loading
  const {
    total: totalAll,
    avg,
    counts,
    satisfied,
  } = useRatingSummary(reviewsData);

  // ===== Pagination state =====
  const [page, setPage] = useState(1);
  const {
    items: pageItems,
    total,
    loading,
  } = usePaginatedReviews(page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // jaga page supaya tidak out-of-range jika total berubah
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const startIdx = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIdx = Math.min(page * PAGE_SIZE, total || 0);

  const row = (stars: 1 | 2 | 3 | 4 | 5) => {
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

  return (
    <div className="mt-8 space-y-8">
      {/* Ringkasan Ulasan (pakai skeleton universal) */}
      {loading ? (
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
                {Math.round(satisfied)}% pembeli merasa puas
              </p>
              <p className="text-xs text-subtle-text">
                {nfID(totalAll)} rating • {nfID(totalAll)} ulasan
              </p>
            </div>
            <div className="w-2/3">
              {[5, 4, 3, 2, 1].map((s) => row(s as 1 | 2 | 3 | 4 | 5))}
            </div>
          </div>
        </div>
      )}

      {/* Ulasan Pilihan (paginasi + skeleton universal) */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">ULASAN PILIHAN</h3>
            <p className="text-sm text-subtle-text">
              {loading
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
              disabled={loading || page === 1}
              className={`px-3 py-1.5 rounded border cursor-pointer ${
                loading || page === 1
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
              disabled={loading || page === totalPages}
              className={`px-3 py-1.5 rounded border cursor-pointer ${
                loading || page === totalPages
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
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
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
