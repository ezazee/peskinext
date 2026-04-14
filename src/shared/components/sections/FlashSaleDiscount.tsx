"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductCard } from "../layout/header/mobile/product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon, FlashIcon } from "../icons";
import type { Product } from "@shared/types/types";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

export interface FlashSaleCampaign {
  id: string;
  name: string;
  end_time: string;
  bg_type?: "color" | "image";
  bg_color?: string;
  bg_image_desktop?: string;
  bg_image_mobile?: string;
  items: {
    product_id: string;
    variant_id: number;
    flash_sale_price: number;
    stock_limit: number;
    sold_count: number;
    product: Product;
    variant?: {
      id: number;
      variant_name: string;
      stock: number;
      prices?: {
        price: number;
        price_strikethrough?: number;
        channel: string;
      }[];
    };
  }[];
}

export const FlashSaleDiscount = ({ campaign }: { campaign?: FlashSaleCampaign | null }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mapping produk dari campaign items
  const discountProducts = (campaign?.items || []).map(item => {
      // Ambil harga asli dari variant (Live Sync Backend menggunakan channel default)
      const variantPrices = item.variant?.prices;
      const originalPrice = variantPrices?.[0]?.price || 0;
      
      return {
          ...item.product,
          img: (item.product as any).front_image,
          price: `Rp${Number(item.flash_sale_price).toLocaleString("id-ID")}`,
          oldPrice: originalPrice > 0 ? `Rp${Number(originalPrice).toLocaleString("id-ID")}` : undefined,
          isFlashSale: true
      }
  });

  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // --- LOGIKA TIMER DINAMIS ---
  useEffect(() => {
    if (!campaign?.end_time) return;

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const end = new Date(campaign.end_time).getTime();
        const diff = end - now;

        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        
        if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
            clearInterval(timer);
        }
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign?.end_time]);

  // Fungsi scroll
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // --- RESPONSIVE BACKGROUND LOGIC ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getBackgroundStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      backgroundColor: campaign?.bg_color || "var(--primary)", // Fallback to brand blue
      transition: "all 0.5s ease-in-out"
    };

    const bgImage = isMobile ? campaign?.bg_image_mobile : campaign?.bg_image_desktop;

    if (campaign?.bg_type === "image" && bgImage) {
      styles.backgroundImage = `url(${normalizeImageUrl(bgImage)})`;
      styles.backgroundSize = "cover";
      styles.backgroundPosition = "center";
      styles.backgroundRepeat = "no-repeat";
    }

    return styles;
  };

  if (discountProducts.length === 0) return null;

  // Format agar 2 digit (misal 08, 09)
  const format = (num: number) => String(num).padStart(2, "0");

  return (
    <div 
      className="my-4 md:my-8 rounded-2xl p-5 md:p-8 shadow-2xl relative overflow-hidden"
      style={getBackgroundStyles()}
    >
      {/* Overlay for better text readability if background image exists and mode is image */}
      {campaign?.bg_type === "image" && (campaign?.bg_image_desktop || campaign?.bg_image_mobile) && (
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      )}

      {/* Header Flash Sale */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 animate-pulse">
                <FlashIcon />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-widest uppercase mb-0 drop-shadow-md">
                {campaign?.name || "PE FLASHSALE"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2.5 md:gap-3 text-white justify-center md:justify-start">
            {timeLeft.days > 0 && (
              <>
                <div className="flex flex-col items-center group">
                  <div className="bg-white text-primary font-black px-3 py-2 md:px-5 md:py-3 rounded-2xl min-w-[48px] md:min-w-[60px] text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-lg md:text-2xl transform transition-all hover:-translate-y-1">
                    {timeLeft.days}
                  </div>
                  <span className="text-[10px] md:text-[11px] font-black mt-2 text-white drop-shadow-md uppercase tracking-[0.1em] opacity-90">Hari</span>
                </div>
                <span className="font-black text-white/40 text-2xl md:text-3xl animate-pulse self-start mt-2">:</span>
              </>
            )}
            <div className="flex flex-col items-center">
              <div className="bg-white text-primary font-black px-3 py-2 md:px-5 md:py-3 rounded-2xl min-w-[48px] md:min-w-[60px] text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-lg md:text-2xl transform transition-all hover:-translate-y-1">
                {format(timeLeft.hours)}
              </div>
              <span className="text-[10px] md:text-[11px] font-black mt-2 text-white drop-shadow-md uppercase tracking-[0.1em] opacity-90">Jam</span>
            </div>
            <span className="font-black text-white/40 text-2xl md:text-3xl animate-pulse self-start mt-2">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white text-primary font-black px-3 py-2 md:px-5 md:py-3 rounded-2xl min-w-[48px] md:min-w-[60px] text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-lg md:text-2xl transform transition-all hover:-translate-y-1">
                {format(timeLeft.minutes)}
              </div>
              <span className="text-[10px] md:text-[11px] font-black mt-2 text-white drop-shadow-md uppercase tracking-[0.1em] opacity-90">Min</span>
            </div>
            <span className="font-black text-white/40 text-2xl md:text-3xl animate-pulse self-start mt-2">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white text-primary font-black px-3 py-2 md:px-5 md:py-3 rounded-2xl min-w-[48px] md:min-w-[60px] text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-lg md:text-2xl transform transition-all hover:-translate-y-1 italic">
                {format(timeLeft.seconds)}
              </div>
              <span className="text-[10px] md:text-[11px] font-black mt-2 text-white drop-shadow-md uppercase tracking-[0.1em] opacity-90">Det</span>
            </div>
          </div>
        </div>
        
        {/* Tombol Lihat Semua dihapus */}
      </div>

      {/* Slider Container */}
      <div className="relative z-10">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-6 no-scrollbar snap-x"
        >
          {discountProducts.map((product, index) => (
            <div key={index} className="w-[160px] md:w-[220px] flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons (Desktop only for better clean look) */}
        <div className="hidden md:block">
            <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-2xl text-primary hover:bg-white transition-all transform hover:scale-110 active:scale-90 z-20"
            >
            <ChevronLeftIcon />
            </button>
            <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-2xl text-primary hover:bg-white transition-all transform hover:scale-110 active:scale-90 z-20"
            >
            <ChevronRightIcon />
            </button>
        </div>
      </div>
    </div>
  );
};
