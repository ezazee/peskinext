"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CartIcon,
  ChevronDownIcon,
  LocationIcon,
  SearchIcon,
  ArrowLeftIcon,
} from "../../components/icons";

export const MobileHeader = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (isSearchFocused) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSearchFocused]);

  const FullScreenSearchUI = () => (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex flex-col"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
    >
      <div className="flex items-center gap-2 p-2 border-b border-border-color">
        <button
          onClick={() => setIsSearchFocused(false)}
          className="p-2 text-subtle-text cursor-pointer"
        >
          <ArrowLeftIcon />
        </button>
        <div className="flex-grow relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-subtle-text">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Cari di PE Skinpro"
            className="w-full border border-border-color rounded-lg py-2 pl-10 pr-4 bg-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </div>
        <button className="font-semibold text-primary px-3 cursor-pointer">
          Cari
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center p-3 border border-border-color rounded-lg hover:bg-tertiary cursor-pointer">
          <div className="flex items-center gap-3">
            <LocationIcon className="h-5 w-5 text-subtle-text" />
            <span className="text-sm text-subtle-text">
              Tips & Trik Pencarian
            </span>
          </div>
          <a
            href="#"
            className="text-sm font-bold text-primary hover:underline"
          >
            Pelajari
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {isSearchFocused && <FullScreenSearchUI />}
      </AnimatePresence>

      <header className="md:hidden bg-white sticky top-0 z-40 p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex-grow flex items-center relative cursor-pointer"
            onClick={() => setIsSearchFocused(true)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-subtle-text">
              <SearchIcon />
            </div>
            <div className="w-full text-left border border-border-color rounded-lg py-2 pl-10 pr-4 bg-tertiary text-subtle-text">
              Cari Produk PE
            </div>
          </div>
          <CartIcon withBadge />
        </div>
        <div className="flex items-center gap-1.5 pt-3 text-sm text-subtle-text">
          <LocationIcon className="h-4 w-4" />
          <span>
            Dikirim ke{" "}
            <span className="font-bold text-base-text">Rumah Garut Reza</span>
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </header>
    </>
  );
};
