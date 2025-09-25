import type { Product } from "@shared/types/types";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

type Props = {
  products: ReadonlyArray<Product>;
  limit?: number;
};

export const ProductGrid = ({ products, limit = 8 }: Props) => {
  const safeLimit = Math.max(0, Math.floor(limit));
  const list = products.slice(0, safeLimit);

  return (
    <section className="mt-0 bg-white p-4 md:mt-8 md:p-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Rekomendasi untuk Anda</h2>
        <Link
          href="/all-product"
          className="text-sm font-medium text-sky-700 hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {list.map((prod) => (
          <ProductCard key={prod.slug} product={prod} />
        ))}
      </div>
    </section>
  );
};
