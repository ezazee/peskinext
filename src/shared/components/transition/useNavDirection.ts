// src/shared/components/transition/useNavDirection.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useNavDirection() {
  const [direction, setDirection] = useState<1 | -1 | 0>(0); // 1=push, -1=back, 0=initial
  const lastIdxRef = useRef<number | null>(null);

  useEffect(() => {
    // ambil index saat ini dari browser history (Next mengisinya)
    type HistoryStateWithIdx = { idx?: number } | null;
    const state = history.state as HistoryStateWithIdx;
    const idx = (state && state.idx) ?? 0;

    if (lastIdxRef.current === null) {
      // render pertama: jangan animasi
      lastIdxRef.current = idx;
      setDirection(0);
      return;
    }

    if (idx > lastIdxRef.current) setDirection(1);       // push / forward
    else if (idx < lastIdxRef.current) setDirection(-1); // back
    else setDirection(0);                                // replace / refresh

    lastIdxRef.current = idx;
  }, []);

  return {
    direction,                  // -1 back, 1 push, 0 initial
    isBack: direction === -1,
    isPush: direction === 1,
  };
}
