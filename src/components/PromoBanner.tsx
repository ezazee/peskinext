"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const slides = [
  {
    desktopImage:
      "https://placehold.co/1200x300/A855F7/FFFFFF?text=Promo+Spesial+1",
    mobileImage: "https://placehold.co/600x400/F87171/FFFFFF?text=",
    alt: "Promo Banner 1",
    mobileTitle: "Nikmatin diskon pengguna baru",
    mobileSubtitle: "Diskon sd 40% Hemat hingga 30k",
    timer: "11 : 48 : 48",
  },
  {
    desktopImage:
      "https://placehold.co/1200x300/22C55E/FFFFFF?text=Cashback+Terbesar",
    mobileImage: "https://placehold.co/600x400/34D399/FFFFFF?text=",
    alt: "Promo Banner 2",
    mobileTitle: "Cashback s.d 100 Ribu!",
    mobileSubtitle: "Untuk semua produk elektronik",
    timer: "02 : 15 : 30",
  },
  {
    desktopImage:
      "https://placehold.co/1200x300/3B82F6/FFFFFF?text=Gratis+Ongkir+Sepuasnya",
    mobileImage: "https://placehold.co/600x400/60A5FA/FFFFFF?text=",
    alt: "Promo Banner 3",
    mobileTitle: "Bebas Ongkir Tanpa Batas",
    mobileSubtitle: "Nikmati belanja tanpa biaya kirim",
    timer: "23 : 59 : 59",
  },
];

export const PromoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

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
    <div className="relative w-full h-[200px] md:h-[300px] mb-0 md:mb-6 group">
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
              <div className="absolute top-4 left-4 text-white">
                <h2 className="font-bold text-xl">{slide.mobileTitle}</h2>
                <p className="text-sm bg-white/30 px-2 py-1 rounded-md inline-block mt-1">
                  {slide.mobileSubtitle}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 p-1 px-2 rounded-lg flex items-center gap-2">
                <span className="text-red-500 font-bold text-sm">
                  {slide.timer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
