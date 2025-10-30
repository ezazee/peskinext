"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition, Suspense } from "react";
import { searchProducts } from "@/features/search/searchService";
import type { Product } from "@shared/types/types";
import BundleDesktop from "@features/all-product/desktop/BundleDesktop";
import BundleMobile from "@features/all-product/mobile/BundleMobile";
import Pagination from "@features/all-product/components/Pagination";
import type { SortKey } from "@features/all-product/components/SidebarFilters";
import SortSelect from "@features/all-product/components/SortSelect";

const PAGE_SIZE = 8;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [sortKey, setSortKey] = useState<SortKey>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  // Search products
  const searchResult = useMemo(() => {
    return searchProducts(query);
  }, [query]);

  // Parse price helper
  const parseIDR = (s?: string) => (s ? Number(s.replace(/[^\d]/g, "")) : 0);

  // Sort results
  const sorted = useMemo<ReadonlyArray<Product>>(() => {
    const list = [...searchResult.products];
    if (sortKey === "price-asc") {
      list.sort((a, b) => parseIDR(a.price) - parseIDR(b.price));
    } else if (sortKey === "price-desc") {
      list.sort((a, b) => parseIDR(b.price) - parseIDR(a.price));
    } else if (sortKey === "discount-desc") {
      list.sort((a, b) => {
        const ad = (a.oldPrice ? parseIDR(a.oldPrice) : 0) - parseIDR(a.price);
        const bd = (b.oldPrice ? parseIDR(b.oldPrice) : 0) - parseIDR(b.price);
        return bd - ad;
      });
    }
    return list;
  }, [searchResult.products, sortKey]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safeCurrent = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrent - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);

  const animKey = `search-${query}-p-${safeCurrent}-s-${sortKey}`;

  const changeSort = (k: SortKey) =>
    startTransition(() => {
      setSortKey(k);
      setCurrentPage(1);
      setLoading(true);
      setTimeout(() => setLoading(false), 180);
    });

  const goToPage = (page: number) =>
    startTransition(() => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
      setLoading(true);
      setTimeout(() => setLoading(false), 180);
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-base-text">
              {query ? (
                <>
                  Hasil Pencarian untuk &quot;{query}&quot;
                </>
              ) : (
                "Semua Produk"
              )}
            </h1>
            <p className="text-sm text-subtle-text mt-1">
              Ditemukan {searchResult.total} produk
            </p>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-subtle-text">Urutkan:</span>
            <SortSelect value={sortKey} onChange={changeSort} />
          </div>
        </div>

        {/* No Results */}
        {searchResult.total === 0 && query && (
          <div className="mt-8 text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-base-text mb-2">
              Tidak ada produk ditemukan
            </h2>
            <p className="text-subtle-text mb-4">
              Coba gunakan kata kunci lain atau lihat semua produk
            </p>
            <a
              href="/all-product"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Lihat Semua Produk
            </a>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {searchResult.total > 0 && (
        <>
          <BundleDesktop
            products={pageItems}
            loading={loading}
            animKey={animKey}
          />
          <BundleMobile
            products={pageItems}
            loading={loading}
            animKey={animKey}
          />

          {/* Pagination */}
          <Pagination
            current={safeCurrent}
            total={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
