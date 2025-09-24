import type { Product } from "@shared/types/types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  limit?: number;
};

export const ProductGrid = ({ products, limit }: Props) => {
  // jika limit tidak diberikan -> tampilkan semua
  const count =
    typeof limit === "number" && Number.isFinite(limit)
      ? Math.max(0, Math.floor(limit))
      : products.length;

  const list = products.slice(0, count);

  return (
    <div className="mt-0 md:mt-8 p-4 md:p-0 bg-white">
      <h2 className="text-lg font-bold mb-4">Rekomendasi untuk Anda</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {list.map((prod) => (
          <ProductCard key={prod.slug} product={prod} />
        ))}
      </div>
    </div>
  );
};
