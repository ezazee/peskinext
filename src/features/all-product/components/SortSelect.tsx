"use client";

import * as React from "react";

export type SortKey = "featured" | "price-asc" | "price-desc" | "discount-desc";

type Props = {
  value: SortKey;
  onChange: (v: SortKey) => void;
};

export default function SortSelect({ value, onChange }: Props) {
  return (
    <select
      className="w-44 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-0 "
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      aria-label="Sort By"
    >
      <option value="featured">Sort By: Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="discount-desc">Discount: High to Low</option>
    </select>
  );
}
