"use client";
import type { Variant } from "@shared/types/types";

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: Variant[];
  selectedId: number;
  onSelect: (v: Variant) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v)}
          className={`cursor-pointer px-3 py-1.5 rounded-full text-sm border transition ${
            selectedId === v.id
              ? "bg-primary/10 text-primary font-bold border-primary"
              : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
          }`}
        >
          {v.name}
        </button>
      ))}
    </div>
  );
}
