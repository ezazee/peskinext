// File: src/features/shared/components/product/ProductCard.tsx
import type { Product } from "@shared/types/types";
import Image from "next/image";
import Link from "next/link";

export const ProductCard = ({ product }: { product: Product }) => (
  // PERUBAHAN DI SINI: href sekarang dinamis
  <Link href={`/product/${product.slug}`} className="no-underline h-full">
    <div className="bg-white rounded-lg md:shadow-lg shadow-md overflow-hidden h-full flex flex-col group">
      <div className="relative w-full h-32 md:h-40 overflow-hidden">
        {/* Gambar Utama */}
        <Image
          src={product.img}
          alt={product.name}
          width={200}
          height={200}
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Gambar Hover */}
        {product.imgHover && (
          <Image
            src={product.imgHover}
            alt={`${product.name} (hover)`}
            width={200}
            height={200}
            className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-normal text-gray-800 line-clamp-2 flex-grow">
          {product.name}
        </h3>
        <p className="text-base font-bold mt-2">{product.price}</p>
        {product.oldPrice && (
          <div className="flex items-center gap-2 mt-1">
            {product.discount && (
              <span className="text-xs font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-md">
                {product.discount}
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
