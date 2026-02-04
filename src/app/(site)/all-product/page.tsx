"use client";

import * as React from "react";
import { useTransition } from "react";
import type { Product } from "@shared/types/types";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useProducts } from "@features/product/hooks/useProducts";
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

const PAGE_SIZE = 8;

export default function BundleProductPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { data: fetchedProducts, isLoading: isQueryLoading } = useProducts();
  const allProducts = React.useMemo(() => (fetchedProducts || []) as ReadonlyArray<Product>, [fetchedProducts]);

  // filters
  const [selectedCats, setSelectedCats] = React.useState<ReadonlyArray<string>>(
    []
  );
  const [productType, setProductType] =
    React.useState<ProductTypeFilter>("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("featured");
  const [flashSaleOnly, setFlashSaleOnly] = React.useState<boolean>(false);
  const [eventOnly, setEventOnly] = React.useState<boolean>(false);
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
      if (eventOnly && !p.isEvent) return false;
      return true;
    });
  }, [allProducts, productType, selectedCats, flashSaleOnly, eventOnly]);

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
  )}-f${flashSaleOnly}-e${eventOnly}`;

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

  const toggleEvent = () =>
    startTransition(() => {
      setEventOnly((v) => !v);
      setCurrentPage(1);
    });

  const goToPage = (page: number) =>
    startTransition(() => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <PromoBanner banners={[]} />

      {/* Mobile topbar dengan tombol Filter */}
      {!isDesktop && (
        <div className="sticky top-16 z-30 mt-5 -mx-4 mb-3 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-primary">
                Manjakan Kulitmu dengan PE Skinpro
              </h2>
              <p className="text-[11px] text-slate-500">
                Rawat kulitmu, hemat dompetmu. Saatnya merawat diri dengan harga
                terbaik!
              </p>
            </div>
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium"
              onClick={() => setOpenFilter(true)}
            >
              Filter
            </button>
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
            eventOnly={eventOnly}
            onToggleEvent={toggleEvent}
            stickyTopPx={96}
          />
        )}

        {/* List per device (hanya tampilkan 8 item) */}
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
        eventOnly={eventOnly}
        onToggleEvent={toggleEvent}
      />
    </main>
  );
}
