"use client";
import { useCallback, useEffect, useState } from "react";

export function useAutoCarousel(length: number, delay = 4000) {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((p) => (p + 1) % length), [length]);
  const prev = useCallback(() => setIndex((p) => (p - 1 + length) % length), [length]);

  useEffect(() => {
    if (!length) return;
    const t = setInterval(next, delay);
    return () => clearInterval(t);
  }, [next, delay, length]);

  return { index, setIndex, next, prev };
}
