"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Ikon X untuk tombol close
const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
        // Div untuk overlay gelap
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose} // Menutup modal saat mengklik overlay
        >
          {/* Konten Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl max-w-md w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalamnya
          >
            {/* Tombol Close */}
            <button 
              onClick={onClose} 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors"
              aria-label="Tutup Banner"
            >
              <XMarkIcon />
            </button>
            
            {/* Gambar Banner */}
            <div className="mb-6">
              {/* Ganti '/banner-image.png' dengan path gambar Anda di folder /public */}
              <Image 
                src="/banner-image.png" 
                alt="Produk PE Skin Pro" 
                width={400} 
                height={300} 
                className="mx-auto"
              />
            </div>
            
            {/* Tombol Aksi */}
            <a 
              href="/shop" // Ganti dengan link halaman produk Anda
              className="inline-block bg-red-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-red-700 transition-colors"
            >
              SHOP NOW
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
