"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

const fade = { duration: 0.2, ease: easeInOut };

export default function Lightbox({ images, startIndex = 0, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const total = images.length;

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  // preload next/prev (only images)
  const preload = useMemo(() => {
    if (total <= 1) return [];
    const next = images[(idx + 1) % total];
    const prev = images[(idx - 1 + total) % total];
    return [next, prev].filter(url => !isVideo(url));
  }, [idx, images, total]);

  // key board navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((p) => (p > 0 ? p - 1 : total - 1));
      if (e.key === "ArrowRight") setIdx((p) => (p < total - 1 ? p + 1 : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  const currentMedia = images[idx];
  const currentIsVideo = isVideo(currentMedia);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: fade }}
        exit={{ opacity: 0, transition: fade }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-[min(92vw,1000px)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: fade }}
          exit={{ opacity: 0, transition: fade }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stage */}
          <div className="relative h-[min(85vh,700px)] rounded-2xl overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                className="absolute inset-0 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: fade }}
                exit={{ opacity: 0, scale: 0.95, transition: fade }}
              >
                {currentIsVideo ? (
                  <video 
                    src={currentMedia} 
                    controls 
                    autoPlay 
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={currentMedia}
                      alt={`Foto ${idx + 1}`}
                      fill
                      className="object-contain select-none"
                      sizes="(max-width:768px) 92vw, 1000px"
                      priority
                    />
                  </div>
                )}
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
            <X size={22} />
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
                <ChevronLeft size={22} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                aria-label="Berikutnya"
                className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-100"
                onClick={() => setIdx((p) => (p < total - 1 ? p + 1 : 0))}
              >
                <ChevronRight size={22} />
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
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white/80" : "w-3 bg-white/30"
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
