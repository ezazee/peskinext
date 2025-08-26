// src/shared/components/ui/ShipingModal/skeleton/ShippingModal.tsx
"use client";
import { motion } from "framer-motion";

export function ShippingModalSkeletonDesktop({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[89] hidden md:block bg-black/40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[90] hidden md:block w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
        </div>
        <div className="px-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-100 px-3 py-3">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded mt-1 animate-pulse" />
          </div>
          <div className="rounded-lg bg-gray-100 px-3 py-3">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded mt-1 animate-pulse" />
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-gray-100" />
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl ring-1 ring-gray-100 p-4">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 h-3 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ShippingModalSkeletonMobile({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[89] bg-black/30 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[90] md:hidden mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-2xl flex max-h-[85vh] flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
      >
        <div className="pt-2">
          <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-gray-300/80" />
        </div>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pb-2">
          <div className="flex items-center gap-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse" />
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded mt-1 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-3">
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
