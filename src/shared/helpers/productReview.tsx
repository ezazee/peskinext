"use client";
import type { Review } from "@shared/types/types";
import { useMemo } from "react";
import { IoStar } from "react-icons/io5";

export function useRatingSummary(reviews: Review[]) {
  return useMemo(() => {
    const total = reviews.length;
    const counts: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let sum = 0;
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      counts[star] += 1;
      sum += r.rating;
    });
    const avg = total ? sum / total : 0;
    const satisfied = total ? ((counts[4] + counts[5]) / total) * 100 : 0;
    return { total, avg, counts, satisfied };
  }, [reviews]);
}

/** Bintang yang nyaman dilihat: full/half/empty */
export function StarsClean({
  value,
  size = 24,
  gap = 2,
  className = "",
}: {
  value: number;
  size?: number;
  gap?: number;
  className?: string;
}) {
  const base = Math.floor(value);
  const frac = value - base;
  const hasHalf = frac >= 0.25 && frac < 0.75;
  const roundedUp = frac >= 0.75 ? 1 : 0;
  const fullCount = Math.min(5, base + roundedUp);
  const emptyCount = Math.max(0, 5 - fullCount - (hasHalf ? 1 : 0));
  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    marginRight: gap,
  };
  return (
    <span className={`inline-flex items-center ${className}`}>
      {Array.from({ length: fullCount }).map((_, i) => (
        <IoStar key={`f-${i}`} style={iconStyle} className="text-yellow-400" />
      ))}
      {hasHalf && <HalfStar size={size} gap={gap} />}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <IoStar key={`e-${i}`} style={iconStyle} className="text-gray-300" />
      ))}
    </span>
  );
}

export function HalfStar({ size, gap = 2 }: { size: number; gap?: number }) {
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size, marginRight: gap }}
      aria-hidden
    >
      <IoStar
        style={{ width: size, height: size }}
        className="text-gray-300 absolute inset-0"
      />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: size / 2 }}
      >
        <IoStar
          style={{ width: size, height: size }}
          className="text-yellow-400"
        />
      </span>
    </span>
  );
}


export const nfID = (n: number) => n.toLocaleString("id-ID");