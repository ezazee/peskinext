"use client";

import * as React from "react";
import { useTransition } from "react";
import type { Product } from "@shared/types/types";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useProducts } from "@features/product/hooks/useProducts";
import { useBanners } from "@features/home/hooks/useBanners";
// import { productsData as mockProducts } from "@data/products";
import type {
  ProductTypeFilter,
  SortKey,
} from "@features/all-product/components/SidebarFilters";
import { PromoBanner } from "@shared/components/ui/PromoBanner";
import SidebarFilters from "@features/all-product/components/SidebarFilters";
import BundleDesktop from "@features/all-product/desktop/BundleDesktop";
import BundleMobile from "@features/all-product/mobile/BundleMobile";
import Pagination from "@features/all-product/components/Pagination";
import MobileFilters from "@features/all-product/components/MobileFilters";
import { SlidersHorizontal } from "lucide-react";

const PAGE_SIZE = 10;

export default function BundleProductPage() {
  const [mounted, setMounted] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: fetchedProducts, isLoading: isQueryLoading } = useProducts();
  const { data: bannerData } = useBanners();

  const allProducts = React.useMemo(() => (fetchedProducts || []) as ReadonlyArray<Product>, [fetchedProducts]);

  const categories = React.useMemo<ReadonlyArray<string>>(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [allProducts]);

  // filters
  const [selectedCats, setSelectedCats] = React.useState<ReadonlyArray<string>>(
    []
  );
  const [productType, setProductType] =
    React.useState<ProductTypeFilter>("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("featured");
  const [flashSaleOnly, setFlashSaleOnly] = React.useState<boolean>(false);
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);

  // pagination
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // transitions (untuk skeleton)
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!isQueryLoading) {
      setLoading(false);
    }
  }, [isQueryLoading]);

  React.useEffect(() => {
    if (isPending) setLoading(true);
    else {
      const id = setTimeout(() => setLoading(false), 180);
      return () => clearTimeout(id);
    }
  }, [isPending]);

  const parseIDR = (s?: string) => (s ? Number(s.replace(/[^\d]/g, "")) : 0);

  // FILTER
  const filtered = React.useMemo<ReadonlyArray<Product>>(() => {
    return allProducts.filter((p) => {
      if (productType !== "all" && p.type !== productType) return false;
      if (
        selectedCats.length > 0 &&
        (!p.category || !selectedCats.includes(p.category))
      )
        return false;
      if (flashSaleOnly && !p.isFlashSale) return false;
      return true;
    });
  }, [allProducts, productType, selectedCats, flashSaleOnly]);

  // SORT
  const sorted = React.useMemo<ReadonlyArray<Product>>(() => {
    const list = [...filtered];
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
  }, [filtered, sortKey]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safeCurrent = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrent - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);

  // anim key agar transisi antar halaman/filters smooth
  const animKey = `p-${safeCurrent}-t-${productType}-s-${sortKey}-c-${selectedCats.join(
    ","
  )}-f${flashSaleOnly}`;

  // HANDLERS (dibungkus transition + reset page ke 1)
  const toggleCat = (cat: string) =>
    startTransition(() => {
      setSelectedCats((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
      setCurrentPage(1);
    });

  const changeType = (t: ProductTypeFilter) =>
    startTransition(() => {
      setProductType(t);
      setCurrentPage(1);
    });

  const changeSort = (k: SortKey) =>
    startTransition(() => {
      setSortKey(k);
      setCurrentPage(1);
    });

  const toggleFlashSale = () =>
    startTransition(() => {
      setFlashSaleOnly((v) => !v);
      setCurrentPage(1);
    });

  const resetFilters = () =>
    startTransition(() => {
      setSelectedCats([]);
      setProductType("all");
      setSortKey("featured");
      setFlashSaleOnly(false);
      setCurrentPage(1);
    });

  const goToPage = (page: number) =>
    startTransition(() => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
    });

  // Guard hydration mismatch - MUST be after all hooks
  if (!mounted) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="-mx-4 -mt-6 md:m-0">
        <PromoBanner banners={bannerData?.main || []} />
      </div>

      {/* Mobile Sticky Filter Bar */}
      {!isDesktop && (
        <div className="sticky top-16 z-30 -mx-4 mb-4 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setOpenFilter(true)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm active:scale-95 transition-transform shrink-0"
            >
              <SlidersHorizontal size={14} className="text-primary" />
              <span>Filter</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 shrink-0" />

            {/* Horizontal Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedCats([])}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${selectedCats.length === 0
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                Semua
              </button>
              {categories.map((cat) => {
                const isActive = selectedCats.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCat(cat)}
                    className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-6">
        {isDesktop && (
          <SidebarFilters
            items={allProducts}
            selectedCategories={selectedCats}
            onToggleCategory={toggleCat}
            productType={productType}
            onChangeType={changeType}
            sortKey={sortKey}
            onChangeSort={changeSort}
            flashSaleOnly={flashSaleOnly}
            onToggleFlashSale={toggleFlashSale}
            stickyTopPx={96}
          />
        )}

        {/* List per device (hanya tampilkan 8 item) */}
        <BundleDesktop
          products={pageItems}
          loading={loading || isQueryLoading}
          animKey={animKey}
        />
        <BundleMobile
          products={pageItems}
          loading={loading || isQueryLoading}
          animKey={animKey}
        />
      </div>

      {/* Pagination (satu untuk semua) */}
      <Pagination
        current={safeCurrent}
        total={totalPages}
        onPageChange={goToPage}
      />

      {/* Drawer filter (mobile) */}
      <MobileFilters
        open={!isDesktop && openFilter}
        onClose={() => setOpenFilter(false)}
        items={allProducts}
        selectedCategories={selectedCats}
        onToggleCategory={toggleCat}
        productType={productType}
        onChangeType={changeType}
        sortKey={sortKey}
        onChangeSort={changeSort}
        flashSaleOnly={flashSaleOnly}
        onToggleFlashSale={toggleFlashSale}
        onReset={resetFilters}
      />
    </main>
  );
}
