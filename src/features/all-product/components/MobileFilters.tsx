"use client";

import * as React from "react";
import type { Product } from "@shared/types/types";
import type { ProductTypeFilter, SortKey } from "./SidebarFilters";

type Props = {
  open: boolean;
  onClose: () => void;

  items: ReadonlyArray<Product>;

  selectedCategories: ReadonlyArray<string>;
  onToggleCategory: (cat: string) => void;

  productType: ProductTypeFilter;
  onChangeType: (t: ProductTypeFilter) => void;

  sortKey: SortKey;
  onChangeSort: (k: SortKey) => void;

  flashSaleOnly: boolean;
  onToggleFlashSale: () => void;
  eventOnly: boolean;
  onToggleEvent: () => void;
};

export default function MobileFilters({
  open,
  onClose,
  items,
  selectedCategories,
  onToggleCategory,
  productType,
  onChangeType,
  sortKey,
  onChangeSort,
  flashSaleOnly,
  onToggleFlashSale,
  eventOnly,
  onToggleEvent,
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

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] md:hidden transition-opacity ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <h3 className="text-sm font-semibold">Filters</h3>
          <button
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs"
            onClick={onClose}
          >
            Done
          </button>
        </div>

        <div className="px-4 py-3">
          {/* Product Type */}
          <div className="border-b border-slate-200 py-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Product Type
            </div>
            {(["all", "single", "bundle"] as const).map((t) => (
              <label
                key={t}
                className="mb-2 flex items-center gap-2 text-sm text-slate-800"
              >
                <input
                  type="radio"
                  name="ptype-mobile"
                  className="accent-sky-600"
                  checked={productType === t}
                  onChange={() => onChangeType(t)}
                />
                <span className="capitalize">{t}</span>
              </label>
            ))}
          </div>

          {/* Categories */}
          <div className="border-b border-slate-200 py-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Categories
            </div>
            {categories.length === 0 && (
              <p className="text-xs text-slate-500">No categories</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const checked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-sm text-slate-800"
                  >
                    <input
                      type="checkbox"
                      className="accent-sky-600"
                      checked={checked}
                      onChange={() => onToggleCategory(cat)}
                    />
                    <span className="truncate">{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sort */}
          <div className="border-b border-slate-200 py-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sort
            </div>
            {(
              [
                { k: "featured", label: "Featured" },
                { k: "price-asc", label: "Price: Low → High" },
                { k: "price-desc", label: "Price: High → Low" },
                { k: "discount-desc", label: "Discount: High → Low" },
              ] as const
            ).map((o) => (
              <label
                key={o.k}
                className="mb-2 flex items-center gap-2 text-sm text-slate-800"
              >
                <input
                  type="radio"
                  name="sortKey-mobile"
                  className="accent-sky-600"
                  checked={sortKey === o.k}
                  onChange={() => onChangeSort(o.k)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>

          {/* Flags */}
          <div className="py-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Promo & Event
            </div>
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                className="accent-sky-600"
                checked={flashSaleOnly}
                onChange={onToggleFlashSale}
              />
              <span>Flash Sale only</span>
            </label>
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                className="accent-sky-600"
                checked={eventOnly}
                onChange={onToggleEvent}
              />
              <span>Event only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
