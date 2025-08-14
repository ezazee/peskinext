// File: src/features/shared/sections/BundleSection.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { productsData } from "@data/products";
import { ProductCard } from "../product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

// Filter data untuk hanya menampilkan produk bundle
const bundleProducts = productsData.filter(
  (product) => product.type === "bundle"
);

export const BundleSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 2. Perbarui fungsi scroll untuk menerima arah
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-base-text">
          Product Bundle PE Skinpro
        </h2>
        <a
          href="#"
          className="text-primary font-semibold hover:underline text-sm"
        >
          Lihat semua
        </a>
      </div>
      <div className="flex gap-4">
        {/* Kartu Promo Kiri (hanya di desktop) - Diperbarui */}
        <div className="hidden md:block w-1/5 relative rounded-lg overflow-hidden group">
          <a href="#" className="block w-full h-full">
            <Image
              src="https://placehold.co/300x500/FBBF24/FFFFFF?text=Promo+Spesial"
              alt="Penawaran Spesial"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        </div>

        {/* Slider Produk */}
        <div className="relative w-full md:w-4/4">
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-4 no-scrollbar"
          >
            {bundleProducts.map((product, index) => (
              <div key={index} className="w-40 md:w-48 flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {/* 3. Tombol panah kiri dan kanan */}
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 -left-3 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 hidden md:block"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 -right-3 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 hidden md:block"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
};
