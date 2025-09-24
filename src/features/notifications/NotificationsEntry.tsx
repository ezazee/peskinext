// src/features/notifications/NotificationsEntry.tsx
"use client";

import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import NotificationsDesktopSkeleton from "./skeleton/NotificationsDesktopSkeleton";
import NotificationsMobileSkeleton from "./skeleton/NotificationsMobileSkeleton";
import NotificationsDesktop from "./desktop/NotificationsDesktop";
import NotificationsMobile from "./mobile/NotificationsMobile";

export default function NotificationsEntry({}: { loading?: boolean }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // cegah flicker saat SSR/CSR mismatch
    return isDesktop ? (
      <NotificationsDesktopSkeleton />
    ) : (
      <NotificationsMobileSkeleton />
    );
  }

  return isDesktop ? <NotificationsDesktop /> : <NotificationsMobile />;
}
