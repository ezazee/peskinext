// File: src/features/shared/hooks/useMediaQuery.ts
"use client";

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  // Initialize with a function to avoid SSR mismatch
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);

    // Update initial state if needed
    setMatches(mediaQueryList.matches);

    // Use the MediaQueryList API's change event instead of window resize
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(listener);
      return () => mediaQueryList.removeListener(listener);
    }
  }, [query]); // Only depend on query, not matches

  return matches;
};
