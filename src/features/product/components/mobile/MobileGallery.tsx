// src/features/product/components/mobile/MobileGallery.tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAutoCarousel } from "@features/product/hooks/useAutoCarousel";
import { useRef, useState } from "react";

export function MobileGallery({
  name,
  images,
  discountPercent = 0,
}: {
  name: string;
  images: string[];
  discountPercent?: number;
}) {
  const { index, setIndex, next, prev } = useAutoCarousel(images.length, 4000);

  // ===== Swipe gesture (tanpa chevron) =====
  const wrapRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length !== 1) return;
    startXRef.current = e.touches[0].clientX;
    setDragging(true);
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || startXRef.current == null) return;
    const dx = e.touches[0].clientX - startXRef.current;
    setDragX(dx);
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!dragging) return;
    const width = wrapRef.current?.clientWidth ?? 1;
    const threshold = Math.max(60, width * 0.12); // 12% lebar atau minimal 60px
    if (Math.abs(dragX) > threshold) {
      if (dragX < 0) next();
      else prev();
    }
    setDragging(false);
    setDragX(0);
    startXRef.current = null;
  };

  return (
    <motion.div
      ref={wrapRef}
      className="relative w-full aspect-square bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // penting: biar scroll vertikal tetap jalan, tapi kita ambil gerakan horizontal
      style={{ touchAction: "pan-y" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        className={`flex h-full transition-transform ease-out ${
          dragging ? "duration-0" : "duration-500"
        }`}
        style={{
          // geser ke index aktif + offset drag saat jari menggeser
          transform: `translateX(calc(-${index * 100}% + ${dragX}px))`,
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            <Image
              src={src}
              alt={`${name} – gambar ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {discountPercent > 0 && (
        <motion.span
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute left-3 top-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
        >
          {discountPercent}%
        </motion.span>
      )}

      {/* dots (tetap) */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 w-4 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
