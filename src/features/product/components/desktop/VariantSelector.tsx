"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Variant } from "@shared/types/types";

interface VariantSelectorProps {
  variants: Variant[];
  selectedId: number;
  onSelect: (v: Variant) => void;
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {variants.map((v) => {
        const isActive = selectedId === v.id;
        return (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(v)}
            className={`
              relative px-4 py-2 text-sm font-medium border rounded-full transition-all duration-300
              ${isActive 
                ? "bg-primary text-white border-transparent shadow-md" 
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50"
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="variant-bg"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {v.name}
          </motion.button>
        );
      })}
    </div>
  );
}
