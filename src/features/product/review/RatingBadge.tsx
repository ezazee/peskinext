// File: src/features/review/components/RatingBadge.tsx
"use client";

import { IoStar } from "react-icons/io5";
import { useProductRating } from "../hooks/useProductRating";

type Props = {
  sku?: string;
  slug?: string;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
};

const nfID = (n: number) => n.toLocaleString("id-ID");

function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const filled = Math.round(value); // 0..5
  const cls = size === "sm" ? "text-[14px]" : "text-[18px]";
  return (
    <span className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <IoStar
          key={i}
          className={`${cls} ${
            i < filled ? "text-yellow-400" : "text-gray-300"
          }`}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function RatingBadge({
  sku,
  slug,
  size = "sm",
  showCount = true,
  className,
}: Props) {
  const { average, count, loading } = useProductRating({ sku, slug });

  if (loading) {
    // skeleton kecil, biar rapih
    return (
      <span className={`inline-flex items-center gap-1 ${className ?? ""}`}>
        <span className="h-3 w-16 rounded bg-gray-200" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-gray-700 ${
        size === "sm" ? "text-xs" : "text-sm"
      } ${className ?? ""}`}
      aria-label={`Rating ${average.toFixed(1)} dari 5${
        showCount ? `, ${count} ulasan` : ""
      }`}
    >
      <Stars value={average} size={size} />
      <span className="font-medium">{average.toFixed(1)}</span>
      {showCount && <span className="text-gray-400">({nfID(count)})</span>}
    </span>
  );
}
