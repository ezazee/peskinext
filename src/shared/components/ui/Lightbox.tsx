"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";

type Props = {
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

const fade = { duration: 0.2, ease: easeInOut };

export default function Lightbox({ images, startIndex = 0, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const total = images.length;

  // preload next/prev
  const preload = useMemo(() => {
    if (total <= 1) return [];
    const next = images[(idx + 1) % total];
    const prev = images[(idx - 1 + total) % total];
    return [next, prev];
  }, [idx, images, total]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((p) => (p > 0 ? p - 1 : total - 1));
      if (e.key === "ArrowRight") setIdx((p) => (p < total - 1 ? p + 1 : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: fade }}
        exit={{ opacity: 0, transition: fade }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-[min(92vw,700px)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: fade }}
          exit={{ opacity: 0, transition: fade }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stage */}
          <div className="relative h-[min(70vh,520px)] rounded-lg overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: fade }}
                exit={{ opacity: 0, transition: fade }}
              >
                <Image
                  src={images[idx]}
                  alt={`Foto ${idx + 1}`}
                  fill
                  className="object-contain select-none"
                  sizes="(max-width:768px) 92vw, 700px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label="Tutup"
            className="absolute cursor-pointer -top-12 right-0 rounded-full p-2 bg-black/70 text-white"
            onClick={onClose}
          >
            <IoClose size={22} />
          </motion.button>

          {/* Controls */}
          {total > 1 && (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                aria-label="Sebelumnya"
                className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-100"
                onClick={() => setIdx((p) => (p > 0 ? p - 1 : total - 1))}
              >
                <IoChevronBack size={22} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                aria-label="Berikutnya"
                className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-100"
                onClick={() => setIdx((p) => (p < total - 1 ? p + 1 : 0))}
              >
                <IoChevronForward size={22} />
              </motion.button>
            </>
          )}

          {/* Indicator */}
          {total > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? "w-6 bg-white/80" : "w-3 bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Preload hidden */}
          <div className="sr-only">
            {Array.from(new Set(preload))
              .filter(Boolean)
              .map((src, i) => (
                <Image
                  key={`${src}-${i}`}
                  src={src!}
                  alt=""
                  width={10}
                  height={10}
                />
              ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
