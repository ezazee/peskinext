"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

import type { Banner } from "@shared/types/types";

interface PromoBannerProps {
  banners: Banner[];
}

export const PromoBanner = ({ banners }: PromoBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pisahkan banner berdasarkan section (Hasil dari perbaikan Backend tadi)
  const desktopSlides = banners.filter(b => b.section === "promo_desktop" || b.section === "main");
  const mobileSlides = banners.filter(b => b.section === "promo_mobile");

  // Logika Fallback: Jika salah satu kosong, pakai yang ada
  const activeDesktop = desktopSlides.length > 0 ? desktopSlides : (mobileSlides.length > 0 ? mobileSlides : banners);
  const activeMobile = mobileSlides.length > 0 ? mobileSlides : (desktopSlides.length > 0 ? desktopSlides : banners);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const swipeThreshold = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > swipeThreshold) goToNext();
    if (touchEndX.current - touchStartX.current > swipeThreshold)
      goToPrevious();
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? activeDesktop.length - 1 : i - 1));
  }, [activeDesktop.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i === activeDesktop.length - 1 ? 0 : i + 1));
  }, [activeDesktop.length]);

  useEffect(() => {
    const t = setInterval(goToNext, 5000);
    return () => clearInterval(t);
  }, [goToNext]);

  if (!banners || banners.length === 0) return null;

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-auto md:h-[300px] lg:h-[400px] mb-0 md:mb-6 group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full rounded-none md:rounded-xl overflow-hidden">
        {/* SLIDER DESKTOP (Muncul di Laptop) */}
        <div
          className="hidden md:flex h-full transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeDesktop.map((slide, i) => (
            <div
              key={slide.id || i + "-desktop"}
              className="relative flex-shrink-0 w-full h-full bg-gray-100"
            >
              <Image
                src={normalizeImageUrl(slide.src)}
                alt={slide.alt || "Promo PE Skinpro"}
                fill
                className={`${(slide.src === "" || slide.src?.includes("logo")) ? 'object-contain p-20' : 'object-cover'}`}
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* SLIDER MOBILE (Muncul di HP) */}
        <div
          className="md:hidden flex h-full transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeMobile.map((slide, i) => (
            <div
              key={slide.id || i + "-mobile"}
              className="relative w-full flex-shrink-0 aspect-[16/9] bg-gray-100"
            >
              <Image
                src={normalizeImageUrl(slide.src)}
                alt={slide.alt || "Promo PE Skinpro"}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigasi Panah */}
      <button
        className="hidden group-hover:md:block absolute top-1/2 -translate-y-1/2 left-5 rounded-full p-2 bg-black/20 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        className="hidden group-hover:md:block absolute top-1/2 -translate-y-1/2 right-5 rounded-full p-2 bg-black/20 text-white"
        onClick={goToNext}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Titik Indikator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2">
        {activeDesktop.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${currentIndex === i ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};
