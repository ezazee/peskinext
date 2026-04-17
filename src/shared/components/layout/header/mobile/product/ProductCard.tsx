// File: src/features/shared/components/product/ProductCard.tsx
"use client";

import { useProductRating } from "@features/product/hooks/useProductRating";
import type { Product } from "@shared/types/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

/** parse "Rp144.000.00" -> 144000 */
function parseIDR(str?: string): number | null {
  if (!str) return null;
  // Jika range seperti "Rp288.000 - Rp980.000", ambil angka pertama (min)
  let firstPart = str.split("-")[0];
  
  // Buang bagian desimal jika ada (misal .00 di akhir)
  // Tapi hati-hati, di IDR "." biasanya ribuan, dan desimal biasanya ",". 
  // Namun di database/api ini terkadang pakai "." desimal US style.
  // Jika polanya "000.00", kita buang yang setelah titik terakhir
  if (firstPart.includes(".") && firstPart.split(".").pop()?.length === 2) {
    const parts = firstPart.split(".");
    parts.pop();
    firstPart = parts.join(".");
  }

  const digits = firstPart.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

/** hitung persen diskon dari oldPrice & price (dibulatkan) */
function discountPercent(priceStr?: string, oldPriceStr?: string): number {
  const price = parseIDR(priceStr);
  const oldPrice = parseIDR(oldPriceStr);
  if (!price || !oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** format tampilan harga: jika range, ambil min */
function formatPriceDisplay(str?: string): string {
  if (!str) return "";
  if (str.includes("-")) {
    return str.split("-")[0].trim();
  }
  return str;
}

/** ambil hanya harga pertama dari range untuk harga coret */
function getMinPriceStr(str?: string): string {
  if (!str) return "";
  return str.split("-")[0].trim();
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
      <div className="bg-white rounded-lg md:shadow-lg shadow-sm overflow-hidden h-full flex flex-col group">
        <div className="relative w-full h-32 md:h-40 overflow-hidden bg-gray-50 flex items-center justify-center">
          {normalizeImageUrl(product.img) ? (
            <Image
              src={normalizeImageUrl(product.img)!}
              alt={product.name}
              width={200}
              height={200}
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
            />
          ) : (
            <span className="text-[10px] text-gray-300 font-bold uppercase">PE Skin</span>
          )}

          {product.imgHover && normalizeImageUrl(product.imgHover) && (
            <Image
              src={normalizeImageUrl(product.imgHover)!}
              alt={`${product.name} (hover)`}
              width={200}
              height={200}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          {pct > 0 && (
            <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10">
              {pct}% OFF
            </span>
          )}

          {product.isFlashSale && (
            <span className="absolute top-2 right-2 bg-amber-400 text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-0.5 uppercase tracking-tighter">
              ⚡ Flash Sale
            </span>
          )}
        </div>

        <div className="p-2 md:p-3 flex flex-col flex-grow">
          {/* Title - fixed height for 2 lines */}
          <h3 className="text-sm font-normal text-gray-800 line-clamp-2 min-h-[2.5rem] leading-tight mb-1">
            {product.name}
          </h3>

          {/* Rating - standardized offset */}
          <div
            className="flex items-center gap-1 text-[11px] text-gray-500 h-4 mb-2"
            aria-label={`Rating ${average.toFixed(1)} dari 5, 500+ terjual`}
          >
            <Star className="text-yellow-400 fill-yellow-400" size={13} />
            <span className="font-semibold text-gray-700">{average.toFixed(1)}</span>
            <span>• {product.soldCount?.toLocaleString("id-ID") || 0} terjual</span>
          </div>

          {/* Pricing area - pushed to bottom */}
          <div className="mt-auto">
            {/* Price Line */}
            <p className="text-[13px] md:text-[15px] font-bold text-gray-900 leading-tight">
              {formatPriceDisplay(product.price)}
            </p>

            {/* Discount Line */}
            <div className="h-5 mt-1 flex items-center gap-1.5 overflow-hidden">
              {product.oldPrice && (
                <>
                  {pct > 0 && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1 py-0.5 rounded leading-none shrink-0 border border-rose-100">
                      {pct}%
                    </span>
                  )}
                  <p className="text-[11px] text-gray-400 line-through truncate">
                    {getMinPriceStr(product.oldPrice)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
