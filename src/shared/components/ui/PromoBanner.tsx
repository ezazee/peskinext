"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import type { Banner } from "@shared/types/types";

interface PromoBannerProps {
  banners: Banner[];
}

export const PromoBanner = ({ banners }: PromoBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const swipeThreshold = 50;

  // Map to existing structure if needed, or just usage
  // The component logic relies on slides array.
  // We can just use banners directly if we adjust properties.

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
    setCurrentIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  }, [banners.length]);
  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i === banners.length - 1 ? 0 : i + 1));
  }, [banners.length]);

  useEffect(() => {
    const t = setInterval(goToNext, 5000);
    return () => clearInterval(t);
  }, [goToNext]);

  if (!banners || banners.length === 0) return null;

  return (
    <div
      className="relative w-full h-[200px] md:h-[300px] mb-0 md:mb-6 group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full rounded-none md:rounded-xl overflow-hidden">
        {/* Desktop Slider */}
        <div
          className="hidden md:flex h-full transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((slide, i) => (
            <div
              key={slide.alt + "-desktop"}
              className="relative flex-shrink-0 w-full aspect-[4/1]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 0px, 100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div
          className="md:hidden flex h-full transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((slide, i) => (
            <div
              key={slide.alt + "-mobile"}
              className="relative w-full flex-shrink-0 aspect-[3/2]"
            >
              <Image
                src={slide.mobileSrc || slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 0px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        className="hidden group-hover:md:block absolute top-1/2 -translate-y-1/2 left-5 rounded-full p-2 bg-black/20 text-white"
        onClick={goToPrevious}
        aria-label="Sebelumnya"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        className="hidden group-hover:md:block absolute top-1/2 -translate-y-1/2 right-5 rounded-full p-2 bg-black/20 text-white"
        onClick={goToNext}
        aria-label="Berikutnya"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${currentIndex === i ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};
