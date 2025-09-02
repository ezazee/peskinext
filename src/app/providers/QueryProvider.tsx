"use client";

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // matikan semua auto-refetch saat fokus / reconnect / mount
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            // anggap data selalu fresh (ubah bila perlu)
            staleTime: Infinity,
            gcTime: 60 * 60 * 1000, // 1 jam
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  // === OPTIONAL: logger untuk diagnosa; hapus di production ===
  useEffect(() => {
    const onFocus = () => console.log("[RQ] focus event (should NOT refetch)");
    const onVisible = () =>
      console.log("[RQ] visibilitychange:", document.visibilityState);
    const onOnline = () => console.log("[RQ] online event");

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);

    // pastikan react-query tahu status fokus/online dari browser
    focusManager.setEventListener((handleFocus) => {
      const listener = () => handleFocus();
      window.addEventListener("visibilitychange", listener, false);
      window.addEventListener("focus", listener, false);
      return () => {
        window.removeEventListener("visibilitychange", listener);
        window.removeEventListener("focus", listener);
      };
    });
    onlineManager.setEventListener((setOnline) => {
      const listener = () => setOnline(navigator.onLine);
      window.addEventListener("online", listener, false);
      window.addEventListener("offline", listener, false);
      return () => {
        window.removeEventListener("online", listener);
        window.removeEventListener("offline", listener);
      };
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
