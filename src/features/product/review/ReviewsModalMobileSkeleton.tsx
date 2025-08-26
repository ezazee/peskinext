"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = { open: boolean; onClose: () => void };

import type { Variants } from "framer-motion";

const variants: Variants = {
  overlayHidden: { opacity: 0 },
  overlayVisible: { opacity: 1 },
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
  exit: { y: "100%", transition: { duration: 0.2 } },
};

function Bar({
  w = "100%",
  h = 14,
  className = "",
}: {
  w?: number | string;
  h?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      style={{ width: typeof w === "number" ? `${w}px` : w, height: `${h}px` }}
    />
  );
}

export default function ReviewsModalMobileSkeleton({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[89] bg-black/30 md:hidden"
            initial="overlayHidden"
            animate="overlayVisible"
            exit="overlayHidden"
            variants={variants}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-2xl md:hidden
                       flex max-h-[85vh] flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Memuat Ulasan"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* grabber */}
            <div className="pt-2">
              <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-gray-300/80" />
            </div>

            {/* header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pb-2">
              <div className="flex items-center gap-3 py-2">
                <div className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100">
                  <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                </div>
                <Bar w={140} h={18} />
              </div>

              {/* controls */}
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Bar key={i} w={56} h={24} className="rounded-full" />
                  ))}
                </div>
                <Bar w={110} h={24} className="rounded" />
              </div>
              <div className="mt-1">
                <Bar w={160} h={12} />
              </div>
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-3"
                >
                  <div className="flex items-start justify-between">
                    <Bar w={120} h={14} />
                    <div className="flex items-center gap-2">
                      <Bar w={80} h={12} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Bar w={90} h={12} />
                    <Bar w={36} h={12} />
                  </div>
                  <div className="mt-1">
                    <Bar w={100} h={12} />
                  </div>
                  <div className="mt-2 space-y-2">
                    <Bar w="95%" h={12} />
                    <Bar w="70%" h={12} />
                  </div>
                  <div className="mt-2">
                    <Bar w={96} h={96} className="rounded-lg" />
                  </div>
                </div>
              ))}
              <div className="h-2" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
