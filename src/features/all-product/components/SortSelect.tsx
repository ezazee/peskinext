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
      className="w-44 md:w-44 rounded-md border border-slate-200 bg-white px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm outline-none focus:border-sky-500 focus:ring-0"
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      aria-label="Sort By"
    >
      <option value="featured">Unggulan</option>
      <option value="price-asc">Harga: Terendah</option>
      <option value="price-desc">Harga: Tertinggi</option>
      <option value="discount-desc">Diskon Terbesar</option>
    </select>
  );
}
