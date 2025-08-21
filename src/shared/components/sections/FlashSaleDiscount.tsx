"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductCard } from "../layout/header/mobile/product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon, FlashIcon } from "../icons";
import { productsData } from "@data/products";

// Filter produk diskon
const discountProducts = productsData.filter((product) => product.isFlashSale);

export const FlashSaleDiscount = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0,
  });

  // --- LOGIKA TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Hentikan jika habis
              clearInterval(timer);
              return prev;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fungsi scroll
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (discountProducts.length === 0) return null;

  // Format agar 2 digit (misal 08, 09)
  const format = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="my-4 md:my-8 bg-primary rounded-lg p-4">
      {/* Header Flash Sale */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 md:gap-4">
          <FlashIcon />
          <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest">
            PE FLASHSALE
          </h2>
          <div className="flex items-center gap-1 text-white text-sm">
            <span className="bg-gray-800 font-bold p-1 md:p-2 rounded-md">
              {format(timeLeft.hours)}
            </span>
            <span className="hidden md:inline">:</span>
            <span className="bg-gray-800 font-bold p-1 md:p-2 rounded-md">
              {format(timeLeft.minutes)}
            </span>
            <span className="hidden md:inline">:</span>
            <span className="bg-gray-800 font-bold p-1 md:p-2 rounded-md">
              {format(timeLeft.seconds)}
            </span>
          </div>
        </div>
        <a
          href="#"
          className="text-white font-semibold hover:underline text-sm hidden md:block"
        >
          Lihat semua
        </a>
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {discountProducts.map((product, index) => (
            <div key={index} className="w-40 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Slider */}
      <div className="hidden md:block relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-4 no-scrollbar"
        >
          {discountProducts.map((product, index) => (
            <div key={index} className="w-52 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="cursor-pointer absolute top-1/2 -left-5 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={() => scroll("right")}
          className="cursor-pointer absolute top-1/2 -right-5 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};
