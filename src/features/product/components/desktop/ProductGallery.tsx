"use client";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@shared/components/icons";
import { useAutoCarousel } from "@features/product/hooks/useAutoCarousel";

export function ProductGallery({
  name,
  images,
  discountPercent: disc = 0,
}: {
  name: string;
  images: string[];
  discountPercent?: number;
}) {
  const { index, setIndex, next, prev } = useAutoCarousel(images.length, 4000);

  return (
    <div className="sticky top-40 rounded-xl">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white group">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image
                src={src}
                alt={`${name} – gambar ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Sebelumnya"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Berikutnya"
        >
          <ChevronRightIcon />
        </button>

        {disc > 0 && (
          <span className="absolute left-3 top-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {disc}%
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative w-full aspect-square rounded-md overflow-hidden border-2 transition-colors ${
              index === i
                ? "border-primary"
                : "border-gray-200 hover:border-gray-400"
            }`}
            aria-label={`Pilih gambar ${i + 1}`}
          >
            <Image src={src} alt={`thumb-${i}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
