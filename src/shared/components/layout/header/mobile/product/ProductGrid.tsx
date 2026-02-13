import type { Product } from "@shared/types/types";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

type Props = {
  products: ReadonlyArray<Product>;
  limit?: number;
};

export const ProductGrid = ({ products }: Props) => {
  // Logic: 7 Single Products + the rest are Bundles to fill the grid (total 10 for 2 rows of 5)
  const singleProducts = products.filter(p => p.type === "single").slice(0, 7);
  const bundleProducts = products.filter(p => p.type === "bundle");

  // Combine: 7 singles + enough bundles to reach 10 items
  const combined = [...singleProducts];
  const neededBundles = 10 - combined.length;

  if (neededBundles > 0) {
    combined.push(...bundleProducts.slice(0, neededBundles));
  }

  const list = combined;

  return (
    <section className="container mx-auto my-8 px-4 md:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-base-text">Rekomendasi untuk Anda</h2>
        <Link
          href="/all-product"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 md:gap-4">
        {list.map((prod) => (
          <ProductCard key={prod.slug} product={prod} />
        ))}
      </div>
    </section>
  );
};
