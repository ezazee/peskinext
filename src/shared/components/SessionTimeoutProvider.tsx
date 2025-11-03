"use client";

import { useSessionTimeout } from "@shared/hooks/useSessionTimeout";

/**
 * Provider untuk auto logout setelah 5 jam inactivity
 * Harus dipasang di root layout atau site layout
 */
export function SessionTimeoutProvider() {
  useSessionTimeout();
  return null;
}
