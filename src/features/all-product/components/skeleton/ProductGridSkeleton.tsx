"use client";

import * as React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

type Props = {
  columns?: 2 | 3 | 4;
  count?: number; // default menyesuaikan columns
  className?: string;
};

export default function ProductGridSkeleton({
  columns = 4,
  count,
  className,
}: Props) {
  const n = count ?? columns * 2; // 2 baris
  return (
    <div
      className={[
        "grid gap-4",
        columns === 2 ? "grid-cols-2" : "",
        columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "",
        columns === 4 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "",
        className ?? "",
      ].join(" ")}
    >
      {Array.from({ length: n }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
