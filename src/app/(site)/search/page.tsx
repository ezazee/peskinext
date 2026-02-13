"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition, Suspense, useEffect } from "react";
import { searchProducts } from "@/features/search/searchService";
import type { Product, SearchResult } from "@shared/types/types";
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
  const [isInitialFetching, setIsInitialFetching] = useState(true);

  // Search products state
  const [searchResult, setSearchResult] = useState<SearchResult>({ products: [], total: 0 });
  // Parse price helper
  const parseIDR = (s?: string) => (s ? Number(s.replace(/[^\d]/g, "")) : 0);

  useEffect(() => {
    if (!query) {
      setIsInitialFetching(false);
      return;
    }

    setIsInitialFetching(true);
    searchProducts(query).then((res) => {
      setSearchResult(res);
      setIsInitialFetching(false);
    }).catch(() => {
      setIsInitialFetching(false);
    });
  }, [query]);

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
    } else {
      // Priority: singles first
      list.sort((a, b) => {
        if (a.type === "single" && b.type !== "single") return -1;
        if (a.type !== "single" && b.type === "single") return 1;
        return 0;
      });
    }
    return list;
  }, [searchResult.products, sortKey]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safeCurrent = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrent - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);

  const singles = pageItems.filter(p => p.type === "single");
  const bundles = pageItems.filter(p => p.type === "bundle" || !p.type);

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
    <main className="mx-auto max-w-7xl min-h-[60vh]">
      {/* Desktop Header */}
      <div className="hidden md:block px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <nav className="text-xs text-secondary/60 mb-2 font-medium tracking-wide uppercase">
                Pencarian Produk
              </nav>
              <h1 className="text-3xl font-bold text-base-text tracking-tight">
                {query ? (
                  <>
                    Hasil untuk &quot;<span className="text-primary">{query}</span>&quot;
                  </>
                ) : (
                  "Semua Produk"
                )}
              </h1>
              <p className="text-sm text-subtle-text mt-2 font-medium">
                Menampilkan <span className="text-primary">{searchResult.total}</span> hasil pilihan
              </p>
            </div>

            {/* Sort Options Desktop */}
            <div className="flex items-center gap-3 bg-tertiary px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Urutkan</span>
              <SortSelect value={sortKey} onChange={changeSort} />
            </div>
          </div>
        </div>

        {/* Initial Fetch Skeleton Desktop */}
        {isInitialFetching ? (
          <div className="space-y-12">
            <section>
              <div className="h-6 w-48 bg-gray-100 rounded-lg mb-6 animate-pulse" />
              <div className="grid grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            </section>
          </div>
        ) : searchResult.total === 0 && query ? (
          /* No Results Desktop */
          <div className="mt-16 text-center py-20 bg-tertiary rounded-[32px] border border-dashed border-gray-200">
            <div className="text-7xl mb-6 grayscale opacity-40">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ops! Produk tidak ditemukan
            </h2>
            <p className="text-secondary max-w-md mx-auto mb-8 leading-relaxed">
              Kami tidak dapat menemukan produk &quot;{query}&quot;. Coba gunakan kata kunci yang lebih umum.
            </p>
            <a
              href="/all-product"
              className="inline-flex items-center justify-center bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Eksplor Semua Produk
            </a>
          </div>
        ) : (
          /* Results Grid Desktop */
          <div className="space-y-12">
            {singles.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary bg-secondary/5 px-3 py-1.5 rounded-md">
                    Produk Satuan
                  </h2>
                  <div className="h-px bg-gray-100 flex-grow" />
                </div>
                <BundleDesktop
                  products={singles}
                  loading={loading}
                  animKey={`${animKey}-singles`}
                />
              </section>
            )}

            {bundles.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary bg-secondary/5 px-3 py-1.5 rounded-md">
                    Paket Bundling
                  </h2>
                  <div className="h-px bg-gray-100 flex-grow" />
                </div>
                <BundleDesktop
                  products={bundles}
                  loading={loading}
                  animKey={`${animKey}-bundles`}
                />
              </section>
            )}

            {/* Pagination Desktop */}
            <div className="pt-8 border-t border-gray-50">
              <Pagination
                current={safeCurrent}
                total={totalPages}
                onPageChange={goToPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden pb-10">
        {/* Mobile Header - Sticky */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 min-w-0 pr-4">
              <nav className="text-[10px] text-secondary/60 font-bold uppercase tracking-widest mb-0.5">HASIL CARI</nav>
              <h1 className="text-xl font-bold text-base-text truncate leading-tight">
                {query ? `"${query}"` : "Semua Produk"}
              </h1>
            </div>

            {/* Mobile Sort Dropdown */}
            <div className="shrink-0 scale-90 origin-right">
              <SortSelect value={sortKey} onChange={changeSort} />
            </div>
          </div>
          <div className="text-[11px] text-secondary/70 font-medium">
            Ditemukan <span className="text-primary font-bold">{searchResult.total}</span> item
          </div>
        </div>

        {/* Initial Fetch Skeleton Mobile */}
        {isInitialFetching ? (
          <div className="p-4 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[3/4.5] bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : searchResult.total === 0 && query ? (
          /* No Results Mobile */
          <div className="px-6 py-20 text-center">
            <div className="text-6xl mb-6 opacity-30">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Tidak Ditemukan
            </h2>
            <p className="text-sm text-secondary mb-8 leading-relaxed">
              Maaf, kami tidak menemukan hasil untuk &quot;{query}&quot;.
            </p>
            <a
              href="/all-product"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20"
            >
              Lihat Katalog Produk
            </a>
          </div>
        ) : (
          /* Results Grid Mobile */
          <div className="px-4 py-6 space-y-10">
            {singles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary">
                    Produk Satuan
                  </h2>
                  <div className="h-px bg-gray-50 flex-grow" />
                </div>
                <BundleMobile
                  products={singles}
                  loading={loading}
                  animKey={`${animKey}-singles-m`}
                />
              </section>
            )}

            {bundles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary">
                    Paket Bundling
                  </h2>
                  <div className="h-px bg-gray-50 flex-grow" />
                </div>
                <BundleMobile
                  products={bundles}
                  loading={loading}
                  animKey={`${animKey}-bundles-m`}
                />
              </section>
            )}

            {/* Pagination Mobile */}
            <div className="mt-12 pt-6 border-t border-gray-50">
              <Pagination
                current={safeCurrent}
                total={totalPages}
                onPageChange={goToPage}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-secondary font-medium anim-pulse">Menyiapkan hasil pencarian...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
