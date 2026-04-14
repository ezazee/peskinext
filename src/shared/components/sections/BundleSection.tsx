"use client";

import React, { useRef } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { ProductCard } from "@shared/components/layout/header/mobile/product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@shared/components/icons";
import { normalizeImageUrl } from "@shared/utils/imageUrl";
import type { Product, Banner } from "@shared/types/types";

export const BundleSection = ({ products, banner }: { products: ReadonlyArray<Product>, banner?: Banner }) => {
  // Filter data untuk hanya menampilkan produk bundle
  const bundleProducts = products.filter(
    (product) => product.type === "bundle"
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (bundleProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto my-8 px-4 md:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-base-text">
          Product Bundle PE Skinpro
        </h2>
        <Link
          href="/all-product"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      {/* biar kedua kolom sama tinggi */}
      <div className="flex items-stretch gap-4">
        {/* Banner Promo Kiri (ikut tinggi slider, TANPA aspect/tinggi fixed) */}
        <div className="relative hidden w-1/5 overflow-hidden rounded-lg md:block md:self-stretch">
          <a href="#" className="block h-full w-full">
            <div className="relative h-full w-full">
              <NextImage
                src={normalizeImageUrl(banner?.src) || "https://placehold.co/300x500/FBBF24/FFFFFF?text=Promo+Spesial"}
                alt={banner?.alt || "Penawaran Spesial"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 767px) 0px, 20vw"
                priority={false}
              />
            </div>
          </a>
        </div>

        {/* Slider Produk (tinggi alami dari kartu; banner mengikuti) */}
        <div className="relative w-full md:w-4/5">
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex items-stretch gap-3 overflow-x-auto pb-4"
          >
            {bundleProducts.map((product, index) => (
              <div key={index} className="w-40 flex-shrink-0 md:w-48">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Tombol panah kiri dan kanan */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110 hover:bg-gray-100 md:block"
            aria-label="Scroll kiri"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110 hover:bg-gray-100 md:block"
            aria-label="Scroll kanan"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
};
