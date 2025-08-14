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
    if (touchStartX.current - touchEndX.current > swipeThreshold) {
      goToNext();
    }

    if (touchEndX.current - touchStartX.current > swipeThreshold) {
      goToPrevious();
    }
  };

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const sliderInterval = setInterval(goToNext, 5000);
    return () => clearInterval(sliderInterval);
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
          {slides.map((slide) => (
            <Image
              key={slide.alt + "-desktop"}
              src={slide.desktopImage}
              alt={slide.alt}
              width={1200}
              height={300}
              className="w-full h-full object-cover flex-shrink-0"
              priority={true}
            />
          ))}
        </div>
        {/* Mobile Slider */}
        <div
          className="md:hidden flex h-full transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.alt + "-mobile"}
              className="relative w-full h-full flex-shrink-0"
            >
              <Image
                src={slide.mobileImage}
                alt={slide.alt}
                width={600}
                height={400}
                className="w-full h-full object-cover"
                priority={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div
        className="hidden group-hover:md:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={goToPrevious}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </div>
      <div
        className="hidden group-hover:md:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={goToNext}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`cursor-pointer h-2 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};
