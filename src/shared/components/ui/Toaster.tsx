"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type Variant = "info" | "success" | "warning" | "error";

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: Variant;
  duration?: number; // ms
};

type ToastCtx = {
  push: (opts: ToastOptions) => void;
  info: (desc: string, title?: string) => void;
  success: (desc: string, title?: string) => void;
  warning: (desc: string, title?: string) => void;
  error: (desc: string, title?: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

type T = Required<ToastOptions>;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<T[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (opts: ToastOptions) => {
      const id = opts.id ?? Math.random().toString(36).slice(2);
      const t: T = {
        id,
        title: opts.title ?? "",
        description: opts.description ?? "",
        variant: opts.variant ?? "info",
        duration: opts.duration ?? 3500,
      };
      setToasts((prev) => [...prev, t]);
      window.setTimeout(() => remove(id), t.duration);
    },
    [remove]
  );

  const api = useMemo<ToastCtx>(
    () => ({
      push,
      info: (d, title = "Info") =>
        push({ description: d, title, variant: "info" }),
      success: (d, title = "Berhasil") =>
        push({ description: d, title, variant: "success" }),
      warning: (d, title = "Perhatian") =>
        push({ description: d, title, variant: "warning" }),
      error: (d, title = "Gagal") =>
        push({ description: d, title, variant: "error" }),
    }),
    [push]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {/* Container fixed di kanan-atas */}
      <div className="pointer-events-none fixed top-4 right-4 z-[1000] flex w-[min(92vw,380px)] flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.16 },
              }}
              exit={{
                opacity: 0,
                y: -6,
                scale: 0.98,
                transition: { duration: 0.12 },
              }}
              className={[
                "pointer-events-auto rounded-xl p-3 ring-1 shadow-md bg-white",
                "ring-gray-200",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <VariantIcon variant={t.variant} />
                <div className="min-w-0">
                  {!!t.title && (
                    <div className="font-semibold text-sm">{t.title}</div>
                  )}
                  {!!t.description && (
                    <div className="text-sm text-gray-700 whitespace-pre-line break-words">
                      {t.description}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

function VariantIcon({ variant }: { variant: Variant }) {
  const map: Record<Variant, string> = {
    info: "text-sky-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
    error: "text-rose-600",
  };
  return (
    <svg
      className={map[variant]}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
    >
      {variant === "success" && (
        <path
          d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 14-4-4 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 7z"
          fill="currentColor"
        />
      )}
      {variant === "error" && (
        <path
          d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm1 13h-2v2h2v-2Zm0-8h-2v6h2V7Z"
          fill="currentColor"
        />
      )}
      {variant === "warning" && (
        <path
          d="M1 21h22L12 2 1 21Zm12-2h-2v-2h2v2Zm0-4h-2v-4h2v4Z"
          fill="currentColor"
        />
      )}
      {variant === "info" && (
        <path
          d="M11 17h2v-6h-2v6Zm1-14a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2V6h2v2Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}
