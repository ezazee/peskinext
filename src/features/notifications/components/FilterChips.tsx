"use client";

import type { NotificationItem } from "@shared/types/types";
import { getCounts, type FilterConfig, type FilterType } from "@shared/helpers/notificationFormat";
import clsx from "clsx";

export function FilterChips({
  data,
  value,
  onChange,
  className,
  scrollable = false,
}: {
  data: NotificationItem[];
  value: FilterConfig;
  onChange: (v: FilterConfig) => void;
  className?: string;
  scrollable?: boolean;
}) {
  const c = getCounts(data);
  const mainChips: { key: FilterType; label: string; count?: number }[] = [
    { key: "all", label: "Semua", count: c.all },
    { key: "transaksi", label: "Transaksi", count: c.transaksi },
    { key: "update", label: "Update", count: c.update },
    { key: "info", label: "Info", count: c.info },
  ];

  const subChipsTransaction = [
    { key: "all", label: "Semua Status" },
    { key: "pending_payment", label: "Pending" },
    { key: "completed", label: "Berhasil" },
    { key: "ongoing", label: "Dikirim" },
    { key: "cancelled", label: "Batal" },
  ];

  const subChipsUpdate = [
    { key: "all", label: "Semua" },
    { key: "promo", label: "Promo" },
    { key: "feed", label: "Feed" },
  ];

  const handleMainChange = (key: FilterType) => {
    onChange({ main: key, sub: (key === 'transaksi' || key === 'update') ? 'all' : undefined });
  }

  const handleSubChange = (subKey: string) => {
    onChange({ ...value, sub: subKey });
  }

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      {/* Main Level */}
      <div
        className={clsx(
          "flex gap-2.5",
          scrollable && "overflow-x-auto no-scrollbar -mx-4 px-4 pb-1"
        )}
      >
        {mainChips.map((chip) => {
          const active = value.main === chip.key;
          return (
            <button
              key={chip.key}
              onClick={() => handleMainChange(chip.key)}
              className={clsx(
                "relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-white shadow-md shadow-primary/20 border border-primary"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {chip.label}
                {typeof chip.count === "number" && chip.count > 0 && (
                  <span
                    className={clsx(
                      "flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px]",
                      active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {chip.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub Level (Only for Transaksi) */}
      {value.main === 'transaksi' && (
        <div
          className={clsx(
            "flex gap-2",
            scrollable && "overflow-x-auto no-scrollbar -mx-4 px-4 pb-1"
          )}
        >
          {subChipsTransaction.map((sub) => {
            const active = value.sub === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => handleSubChange(sub.key)}
                className={clsx(
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                  active
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                )}
              >
                {sub.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Sub Level (Only for Update) */}
      {value.main === 'update' && (
        <div
          className={clsx(
            "flex gap-2",
            scrollable && "overflow-x-auto no-scrollbar -mx-4 px-4 pb-1"
          )}
        >
          {subChipsUpdate.map((sub) => {
            const active = value.sub === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => handleSubChange(sub.key)}
                className={clsx(
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                  active
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                )}
              >
                {sub.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
