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
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: true,
            staleTime: 0,
            gcTime: 5 * 60 * 1000,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  // Setup react-query focus and online managers
  useEffect(() => {
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
  }, []);

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
