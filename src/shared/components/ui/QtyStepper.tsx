"use client";

import { IconMinus, IconPlus } from "@shared/components/icons";
import { cn } from "@shared/libs/utils";

type QtyStepperProps = {
  value: number;
  max: number;
  onChange: (n: number) => void;
  /**
   * Size variant:
   * - "sm": 32px (mobile-friendly)
   * - "md": 36px (desktop default)
   */
  size?: "sm" | "md";
  className?: string;
};

export default function QtyStepper({
  value,
  max,
  onChange,
  size = "md",
  className
}: QtyStepperProps) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const inputSize = size === "sm" ? "h-8" : "h-9";
  const inputTextSize = size === "sm" ? "text-sm" : "";

  return (
    <div className={cn(
      "inline-flex items-center rounded border border-gray-300 overflow-hidden",
      className
    )}>
      <button
        type="button"
        className={cn(
          buttonSize,
          "grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        )}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Kurangi"
      >
        <IconMinus />
      </button>
      <input
        type="number"
        className={cn(
          inputSize,
          inputTextSize,
          "w-12 text-center outline-none"
        )}
        value={value}
        min={1}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        className={cn(
          buttonSize,
          "grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        )}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tambah"
      >
        <IconPlus />
      </button>
    </div>
  );
}
