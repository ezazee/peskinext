// File: src/features/shared/components/product/ProductCard.tsx
"use client";

import { useProductRating } from "@features/product/hooks/useProductRating";
import type { Product } from "@shared/types/types";
import Image from "next/image";
import Link from "next/link";
import { IoStar } from "react-icons/io5";

/** parse "Rp144.000" -> 144000 */
function parseIDR(str?: string): number | null {
  if (!str) return null;
  const digits = str.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

/** hitung persen diskon dari oldPrice & price (dibulatkan) */
function discountPercent(priceStr?: string, oldPriceStr?: string): number {
  const price = parseIDR(priceStr);
  const oldPrice = parseIDR(oldPriceStr);
  if (!price || !oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export const ProductCard = ({ product }: { product: Product }) => {
  const pct = discountPercent(product.price, product.oldPrice);

  // ⭐ ambil rata-rata rating per produk (sinkron dengan mock & backend nanti)
  const { average } = useProductRating({
    sku: product.sku,
    slug: product.slug,
  });

  return (
    <Link href={`/product/${product.slug}`} className="no-underline h-full">
      <div className="bg-white rounded-lg md:shadow-lg shadow-md overflow-hidden h-full flex flex-col group">
        <div className="relative w-full h-32 md:h-40 overflow-hidden">
          <Image
            src={product.img}
            alt={product.name}
            width={200}
            height={200}
            className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
          />
          {product.imgHover && (
            <Image
              src={product.imgHover}
              alt={`${product.name} (hover)`}
              width={200}
              height={200}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          {pct > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
              {pct}%
            </span>
          )}
        </div>

        <div className="p-2 md:p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-normal text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          {/* ⭐ tampilan ringkas: satu bintang + angka + terjual (statis) */}
          <div
            className="mt-1 flex items-center gap-1.5 text-xs text-gray-600"
            aria-label={`Rating ${average.toFixed(1)} dari 5, 500+ terjual`}
          >
            <IoStar className="text-yellow-400 text-[14px]" />
            <span className="font-medium">{average.toFixed(1)}</span>
            <span className="text-gray-400">• 500+ terjual</span>
          </div>

          <p className="text-base font-bold mt-2">{product.price}</p>

          {product.oldPrice && (
            <div className="flex items-center gap-2 mt-1">
              {pct > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md">
                  {pct}%
                </span>
              )}
              <p className="text-xs text-subtle-text line-through">
                {product.oldPrice}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
