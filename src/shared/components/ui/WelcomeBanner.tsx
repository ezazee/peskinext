"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

const XMarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

import { useState } from "react";
import type { Banner } from "@shared/types/types";

interface WelcomeBannerProps {
  isOpen: boolean;
  onClose: (mute: boolean) => void;
  bannerData?: Banner;
}

export const WelcomeBanner = ({ isOpen, onClose, bannerData }: WelcomeBannerProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Jika tidak ada data banner popup, jangan tamplikan apa-apa
  if (!bannerData) return null;

  const handleClose = () => {
    onClose(dontShowAgain);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-xl w-full max-w-lg overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full">
              <button
                onClick={handleClose}
                className="absolute cursor-pointer top-3 right-3 z-10 p-1.5 bg-white/50 rounded-full text-gray-700 hover:bg-white transition-colors"
                aria-label="Tutup Banner"
              >
                <XMarkIcon />
              </button>

              <Link href={bannerData.href || "/shop"} onClick={handleClose}>
                <Image
                  src={normalizeImageUrl(bannerData.src)}
                  alt={bannerData.alt || "Promo Spesial"}
                  width={500}
                  height={625}
                  className="w-full h-auto"
                />
              </Link>
            </div>

            {/* Checkbox Mute */}
            <div className="bg-white w-full p-3 flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="mutePopup"
                className="w-4 h-4 cursor-pointer accent-primary"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <label htmlFor="mutePopup" className="text-sm text-gray-700 cursor-pointer select-none">
                Jangan tampilkan lagi (selama 2 jam)
              </label>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
