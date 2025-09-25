"use client";

import * as React from "react";
import type { Product } from "@shared/types/types";
import type { SortKey } from "./components/SidebarFilters";
import { ProductCard } from "@shared/components/layout/header/mobile/product/ProductCard";

function parseIDR(str?: string): number {
  if (!str) return 0;
  const digits = str.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

type Props = {
  items: ReadonlyArray<Product>;
  sortKey: SortKey;
};

export default function BundleCatalog({ items, sortKey }: Props) {
  const sorted = React.useMemo<ReadonlyArray<Product>>(() => {
    const list = [...items];
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
  }, [items, sortKey]);

  return (
    <section className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">{sorted.length} Products</p>
        {/* tidak ada Sort select lagi; semua via sidebar */}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
