"use client";

import * as React from "react";
import type { Product } from "@shared/types/types";
import type { ProductTypeFilter, SortKey } from "./SidebarFilters";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onReset: () => void;

  items: ReadonlyArray<Product>;

  selectedCategories: ReadonlyArray<string>;
  onToggleCategory: (cat: string) => void;

  productType: ProductTypeFilter;
  onChangeType: (t: ProductTypeFilter) => void;

  sortKey: SortKey;
  onChangeSort: (k: SortKey) => void;

  flashSaleOnly: boolean;
  onToggleFlashSale: () => void;
};

export default function MobileFilters({
  open,
  onClose,
  onReset,
  items,
  selectedCategories,
  onToggleCategory,
  productType,
  onChangeType,
  sortKey,
  onChangeSort,
  flashSaleOnly,
  onToggleFlashSale,
}: Props) {
  const categories = React.useMemo<ReadonlyArray<string>>(() => {
    const set = new Set<string>();
    items.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [items]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const FilterPill = ({
    label,
    active,
    onClick
  }: {
    label: string,
    active: boolean,
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${active
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[100] md:hidden transition-opacity ${open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
        }`}
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-0" : "translate-y-full"
          }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-5 backdrop-blur-md">
          <button
            onClick={onReset}
            className="text-xs font-semibold text-rose-500 active:opacity-50 transition-opacity"
          >
            Reset
          </button>
          <h3 className="text-base font-bold text-slate-900">Filter Produk</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8 pb-12">
          {/* Categories */}
          <section>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Kategori
            </div>
            {categories.length === 0 ? (
              <p className="text-xs text-slate-500">Belum ada kategori</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <FilterPill
                    key={cat}
                    label={cat}
                    active={selectedCategories.includes(cat)}
                    onClick={() => onToggleCategory(cat)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Product Type */}
          <section>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Tipe Produk
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "single", "bundle"] as const).map((t) => (
                <FilterPill
                  key={t}
                  label={t === "all" ? "Semua" : t === "single" ? "Eceran" : "Paket"}
                  active={productType === t}
                  onClick={() => onChangeType(t)}
                />
              ))}
            </div>
          </section>

          {/* Sort */}
          <section>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Urutkan Berdasarkan
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { k: "featured", label: "Terbaru" },
                  { k: "price-asc", label: "Harga: Rendah ke Tinggi" },
                  { k: "price-desc", label: "Harga: Tinggi ke Rendah" },
                  { k: "discount-desc", label: "Diskon Terbesar" },
                ] as const
              ).map((o) => (
                <FilterPill
                  key={o.k}
                  label={o.label}
                  active={sortKey === o.k}
                  onClick={() => onChangeSort(o.k)}
                />
              ))}
            </div>
          </section>

          {/* Promo */}
          <section>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Penawaran Khusus
            </div>
            <button
              onClick={onToggleFlashSale}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${flashSaleOnly
                  ? "border-rose-200 bg-rose-50 text-rose-700 shadow-sm"
                  : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${flashSaleOnly ? "bg-rose-500 animate-pulse" : "bg-slate-300"}`} />
                <span className="text-sm font-semibold text-rose-600">Hanya Flash Sale</span>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${flashSaleOnly ? "border-rose-500 bg-rose-500" : "border-slate-300 bg-white"}`}>
                {flashSaleOnly && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          </section>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 z-10 border-t border-slate-50 bg-white/90 px-6 py-4 backdrop-blur-md">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg active:scale-95 transition-transform"
          >
            Tampilkan Produk
          </button>
        </div>
      </div>
    </div>
  );
}
