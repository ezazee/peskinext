// src/features/notifications/NotificationsEntry.tsx
"use client";

import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import NotificationsDesktopSkeleton from "./skeleton/NotificationsDesktopSkeleton";
import NotificationsMobileSkeleton from "./skeleton/NotificationsMobileSkeleton";
import NotificationsDesktop from "./desktop/NotificationsDesktop";
import NotificationsMobile from "./mobile/NotificationsMobile";
import { getNotificationsList } from "./notificationActions";
import type { NotificationItem } from "@shared/types/types";

export default function NotificationsEntry() {
  const isDesktopMatch = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(false);
  // Force isDesktop to false during SSR/Hydration to match server request
  const isDesktop = mounted ? isDesktopMatch : false;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    getNotificationsList().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  if (!mounted || loading) {
    return isDesktop ? (
      <NotificationsDesktopSkeleton />
    ) : (
      <NotificationsMobileSkeleton />
    );
  }

  return isDesktop ? (
    <NotificationsDesktop data={notifications} />
  ) : (
    <NotificationsMobile data={notifications} />
  );
}
