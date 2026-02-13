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
  disabled?: boolean;
};

export default function QtyStepper({
  value,
  max,
  onChange,
  size = "md",
  className,
  disabled = false,
}: QtyStepperProps) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const inputSize = size === "sm" ? "h-8" : "h-9";
  const inputTextSize = size === "sm" ? "text-sm" : "";

  return (
    <div className={cn(
      "inline-flex items-center rounded border border-gray-300 overflow-hidden",
      disabled && "opacity-60 cursor-not-allowed",
      className
    )}>
      <button
        type="button"
        className={cn(
          buttonSize,
          "grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        )}
        onClick={() => !disabled && onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Kurangi"
      >
        <IconMinus />
      </button>
      <input
        type="number"
        className={cn(
          inputSize,
          inputTextSize,
          "w-12 text-center outline-none bg-transparent"
        )}
        value={value}
        min={1}
        max={max}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        disabled={disabled}
      />
      <button
        type="button"
        className={cn(
          buttonSize,
          "grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        )}
        onClick={() => !disabled && onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Tambah"
      >
        <IconPlus />
      </button>
    </div>
  );
}
