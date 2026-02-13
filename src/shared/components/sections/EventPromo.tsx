// File: src/features/shared/sections/EventPromo.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
// import { productsData } from "@data/products";
import type { Product } from "@shared/types/types";
const productsData: Product[] = []; // empty
import type { EventPromoProps } from "@shared/types/types";
import { ProductCard } from "../layout/header/mobile/product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { copyText } from "@shared/libs/clipboard";
import { useToast } from "@shared/components/ui/Toaster"; // ⬅️ pakai toaster global

import { useMediaQuery } from "@shared/hooks/useMediaQuery";

const promoProducts = productsData.filter((product) => product.isEvent);

export const EventPromo: React.FC<EventPromoProps> = ({
  voucherCode = "PEMERDEKA17",
  headline = "DISCOUNT 17%",
  subhead = "Rayakan Kemerdekaan dengan PE Skinpro!",
  desktopBanner,
  mobileBanner,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const handleCopyCode = async () => {
    const ok = await copyText(voucherCode);
    if (ok) {
      toast.success("Kode telah disalin");
    } else {
      toast.error("Gagal menyalin kode voucher");
    }
  };

  if (promoProducts.length === 0) return null;

  // Determine background source
  const bgSrc = isDesktop
    ? (desktopBanner?.src || "/images/landing/eventPromo.png")
    : (mobileBanner?.src || "/images/landing/eventPromo.png");

  return (
    <section className="container mx-auto my-8 px-4 md:px-0">
      <div className="relative rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center overflow-hidden">
        <Image
          src={bgSrc}
          alt="Promo background"
          fill
          className="absolute inset-0 z-0 object-cover"
          quality={100}
          priority
        />

        {/* Kiri */}
        <div className="relative z-10 w-full md:w-1/4 text-center md:text-left mb-6 md:mb-0 md:pr-5 pr-2">
          <p className="font-bold text-primary">{subhead}</p>
          <h2 className="md:text-3xl text-2xl font-extrabold text-base-text my-2">
            {headline}
          </h2>

          <div className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5">
            <span className="text-sm font-medium tracking-wide">
              {voucherCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="bg-white cursor-pointer text-primary font-bold py-2 px-8 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            aria-label={`Salin kode voucher ${voucherCode}`}
          >
            Salin Kode Voucher
          </button>
        </div>

        {/* Kanan (Slider) */}
        <div className="relative z-10 w-full md:w-3/4">
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto pb-4 no-scrollbar"
            >
              {promoProducts.map((product, index) => (
                <div key={index} className="w-40 md:w-48 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll("left")}
              className="absolute top-1/2 -left-3 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 hidden md:block"
              aria-label="Scroll kiri"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute top-1/2 -right-3 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 hidden md:block"
              aria-label="Scroll kanan"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
