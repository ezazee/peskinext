"use client";

import * as React from "react";
import type { Product } from "@shared/types/types";

export type ProductTypeFilter = "all" | "single" | "bundle";
export type SortKey = "featured" | "price-asc" | "price-desc" | "discount-desc";

type Props = {
  items: ReadonlyArray<Product>;

  // categories
  selectedCategories: ReadonlyArray<string>;
  onToggleCategory: (cat: string) => void;

  // product type
  productType: ProductTypeFilter;
  onChangeType: (t: ProductTypeFilter) => void;

  // sort
  sortKey: SortKey;
  onChangeSort: (k: SortKey) => void;

  // flags
  flashSaleOnly: boolean;
  onToggleFlashSale: () => void;

  // sticky offset in px (default ~ top-24)
  stickyTopPx?: number;
};

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);
  return (
    <div className="border-b border-slate-200 py-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span className="text-xs text-slate-500">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function SidebarFilters({
  items,
  selectedCategories,
  onToggleCategory,
  productType,
  onChangeType,
  sortKey,
  onChangeSort,
  flashSaleOnly,
  onToggleFlashSale,
  stickyTopPx = 96,
}: Props) {
  const categories = React.useMemo<ReadonlyArray<string>>(() => {
    const set = new Set<string>();
    items.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [items]);

  return (
    <aside className="hidden w-64 shrink-0 self-start md:block">
      <div
        className="sticky h-fit rounded-xl border border-slate-200 bg-white p-4"
        style={{ top: stickyTopPx }}
      >
        <h3 className="mb-3 text-sm font-bold text-slate-900">BROWSE</h3>

        <Section title="Product Type">
          {(["all", "single", "bundle"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="radio"
                name="ptype"
                className="accent-sky-600"
                checked={productType === t}
                onChange={() => onChangeType(t)}
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </Section>

        <Section title="Categories">
          {categories.length === 0 && (
            <p className="text-xs text-slate-500">No categories</p>
          )}
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-2 text-sm text-slate-800"
              >
                <input
                  type="checkbox"
                  className="accent-sky-600"
                  checked={checked}
                  onChange={() => onToggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            );
          })}
        </Section>

        <Section title="Sort">
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="radio"
              name="sortKey"
              className="accent-sky-600"
              checked={sortKey === "featured"}
              onChange={() => onChangeSort("featured")}
            />
            <span>Featured</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="radio"
              name="sortKey"
              className="accent-sky-600"
              checked={sortKey === "price-asc"}
              onChange={() => onChangeSort("price-asc")}
            />
            <span>Price: Low → High</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="radio"
              name="sortKey"
              className="accent-sky-600"
              checked={sortKey === "price-desc"}
              onChange={() => onChangeSort("price-desc")}
            />
            <span>Price: High → Low</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="radio"
              name="sortKey"
              className="accent-sky-600"
              checked={sortKey === "discount-desc"}
              onChange={() => onChangeSort("discount-desc")}
            />
            <span>Discount: High → Low</span>
          </label>
        </Section>

        <Section title="Promo" defaultOpen={true}>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              className="accent-sky-600"
              checked={flashSaleOnly}
              onChange={onToggleFlashSale}
            />
            <span>Flash Sale only</span>
          </label>
        </Section>
      </div>
    </aside>
  );
}
