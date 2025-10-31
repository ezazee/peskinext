"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const slides = [
  {
    desktopImage:
      "https://placehold.co/1200x300/A855F7/FFFFFF?text=Promo+Spesial+1",
    mobileImage: "https://placehold.co/600x400/F87171/FFFFFF?text=",
    alt: "Promo Banner 1",
  },
  {
    desktopImage:
      "https://placehold.co/1200x300/22C55E/FFFFFF?text=Cashback+Terbesar",
    mobileImage: "https://placehold.co/600x400/34D399/FFFFFF?text=",
    alt: "Promo Banner 2",
  },
  {
    desktopImage:
      "https://placehold.co/1200x300/3B82F6/FFFFFF?text=Gratis+Ongkir+Sepuasnya",
    mobileImage: "https://placehold.co/600x400/60A5FA/FFFFFF?text=",
    alt: "Promo Banner 3",
  },
];

export const PromoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setCurrentIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  }, []);
  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  }, []);

  useEffect(() => {
    const t = setInterval(goToNext, 5000);
    return () => clearInterval(t);
  }, [goToNext]);

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
          {slides.map((slide, i) => (
            <div
              key={slide.alt + "-desktop"}
              className="relative flex-shrink-0 w-full aspect-[4/1]"
            >
              <Image
                src={slide.desktopImage}
                alt={slide.alt}
                fill
                className="object-cover"
                /* Desktop aktif hanya di >= md: preload hanya slide pertama desktop */
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
          {slides.map((slide, i) => (
            <div
              key={slide.alt + "-mobile"}
              className="relative w-full flex-shrink-0 aspect-[3/2]"
            >
              <Image
                src={slide.mobileImage}
                alt={slide.alt}
                fill
                className="object-cover"
                /* Mobile aktif hanya di < md: preload hanya slide pertama mobile */
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
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              currentIndex === i ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
