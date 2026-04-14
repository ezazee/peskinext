"use client";
import { motion } from "framer-motion";
import type { Variant } from "@shared/types/types";

export function VariantChips({
  variants,
  activeId,
  onSelect,
}: {
  variants: Variant[];
  activeId: number;
  onSelect: (v: Variant) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {variants.map((v) => {
        const active = activeId === v.id;
        return (
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            key={v.id}
            onClick={() => onSelect(v)}
            className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium shadow-sm shrink-0 transition-colors ${
              active
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-primary/50"
            }`}
          >
            {v.name}
          </motion.button>
        );
      })}
    </div>
  );
}
