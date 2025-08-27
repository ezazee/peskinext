// File: src/features/shared/sections/EventPromo.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { productsData } from "@data/products";
import type { EventPromoProps } from "@shared/types/types";
import { ProductCard } from "../layout/header/mobile/product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { copyText } from "@shared/libs/clipboard"; // ⬅️ gunakan util copy bersama

const promoProducts = productsData.filter((product) => product.isEvent);

export const EventPromo: React.FC<EventPromoProps> = ({
  voucherCode = "PEMERDEKA17",
  headline = "DISCOUNT 17%",
  subhead = "Rayakan Kemerdekaan dengan PE Skinpro!",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showToaster, setShowToaster] = useState(false);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const handleCopyCode = async () => {
    const ok = await copyText(voucherCode); // ⬅️ pakai util
    if (ok) {
      setShowToaster(true);
      setTimeout(() => setShowToaster(false), 3000);
    } else {
      console.error("Gagal menyalin kode voucher");
    }
  };

  if (promoProducts.length === 0) return null;

  return (
    <>
      <section className="container mx-auto my-8 px-4 md:px-0">
        <div className="relative rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center overflow-hidden">
          <Image
            src="/images/landing/eventPromo.png"
            alt="Promo background"
            fill
            className="absolute inset-0 z-0 object-cover"
            quality={100}
            priority
          />

          {/* Konten Kiri */}
          <div className="relative z-10 w-full md:w-1/4 text-center md:text-left mb-6 md:mb-0 md:pr-5 pr-2">
            <p className="font-bold text-primary">{subhead}</p>
            <h2 className="md:text-3xl text-2xl font-extrabold text-base-text my-2">
              {headline}
            </h2>
            <p className="text-md font-medium text-subtle-text mb-4">
              {voucherCode}
            </p>
            <button
              onClick={handleCopyCode}
              className="bg-white cursor-pointer text-primary font-bold py-2 px-8 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              aria-label={`Salin kode voucher ${voucherCode}`}
            >
              Salin Kode Voucher
            </button>
          </div>

          {/* Konten Kanan (Slider) */}
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

      {/* Toaster Notifikasi */}
      <AnimatePresence>
        {showToaster && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg z-[60]"
          >
            Kode telah disalin
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
