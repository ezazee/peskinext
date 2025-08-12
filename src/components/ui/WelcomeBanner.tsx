"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

interface WelcomeBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeBanner = ({ isOpen, onClose }: WelcomeBannerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-3 right-3 z-10 p-1.5 bg-white/50 rounded-full text-gray-700 hover:bg-white transition-colors"
              aria-label="Tutup Banner"
            >
              <XMarkIcon />
            </button>

            <Link href="/shop" onClick={onClose}>
              <Image
                src="/images/welcome.png"
                alt="Produk PE Skin Pro"
                width={500}
                height={625}
                className="w-full h-auto"
              />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
