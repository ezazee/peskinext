// File: src/features/shared/sections/PromoShowcase.tsx
"use client";

import type { PromoShowcaseProps } from "@shared/types/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { normalizeImageUrl } from "@shared/utils/imageUrl";
import { ChevronLeftIcon, ChevronRightIcon } from "@shared/components/icons";

export default function PromoShowcase({
  title = "Galeri promo spesial",
  carousel,
  tiles,
  autoPlayMs = 4000,
}: PromoShowcaseProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (carousel.length <= 1) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % carousel.length),
      autoPlayMs
    );
    return () => clearInterval(t);
  }, [carousel.length, autoPlayMs]);

  const go = (to: number) => {
    if (!carousel.length) return;
    setIdx(((to % carousel.length) + carousel.length) % carousel.length);
  };

  return (
    <section className="container mx-auto my-8 px-4 md:px-0">
      <h2 className="mb-4 text-xl font-bold text-base-text">{title}</h2>

      {/* --- Tampilan Desktop (Landscape Grid) --- */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {/* Slider kiri */}
        <div className="relative aspect-[19/6] overflow-hidden rounded-xl group">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {carousel.map((b, i) => (
              <a
                key={i}
                href={b.href || "#"}
                aria-label={b.alt}
                className="block min-w-full h-full"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={normalizeImageUrl(b.src)}
                    alt={b.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 0px, 50vw"
                    priority={i === 0}
                  />
                </div>
              </a>
            ))}
          </div>

          {carousel.length > 1 && (
            <>
              <button
                onClick={() => go(idx - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Sebelumnya"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => go(idx + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Berikutnya"
              >
                <ChevronRightIcon />
              </button>

              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
                {carousel.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 4 banner kanan (grid 2x2) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {tiles.slice(0, 4).map((t, i) => (
            <a
              key={i}
              href={t.href || "#"}
              className="relative overflow-hidden rounded-xl group aspect-[19/6]"
              aria-label={t.alt}
            >
              <div className="relative w-full h-full">
                <Image
                  src={normalizeImageUrl(t.src)}
                  alt={t.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 767px) 0px, 25vw"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* --- Tampilan Mobile (Slider + Grid) --- */}
      <div className="space-y-4 md:hidden">
        {/* Slider */}
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {carousel.map((b, i) => (
              <a
                key={i}
                href={b.href || "#"}
                aria-label={b.alt}
                className="block min-w-full"
              >
                <div className="relative aspect-[19/6] w-full">
                  <Image
                    src={normalizeImageUrl(b.src)}
                    alt={b.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, 0px"
                    priority={i === 0}
                  />
                </div>
              </a>
            ))}
          </div>

          {carousel.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
              {carousel.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50"
                    }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Grid 2x2 untuk tiles */}
        <div className="grid grid-cols-2 gap-4">
          {tiles.slice(0, 4).map((t, i) => (
            <a
              key={i}
              href={t.href || "#"}
              className="relative overflow-hidden rounded-xl aspect-[19/6]"
              aria-label={t.alt}
            >
              <div className="relative w-full h-full">
                <Image
                  src={normalizeImageUrl(t.src)}
                  alt={t.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 50vw, 0px"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
