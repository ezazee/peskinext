"use client";
import { ToastProvider } from "@shared/components/ui/Toaster";
export default function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
