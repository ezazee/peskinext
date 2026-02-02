"use client";

import type { NotificationItem, NotifKind } from "@shared/types/types";
import { chipCounts } from "@shared/helpers/notificationFormat";
import clsx from "clsx";

type KindExt = NotifKind | "all";

export function FilterChips({
  data,
  value,
  onChange,
  className,
  scrollable = false,
}: {
  data: NotificationItem[];
  value: KindExt;
  onChange: (v: KindExt) => void;
  className?: string;
  scrollable?: boolean;
}) {
  const c = chipCounts(data);
  const chips: { key: KindExt; label: string; count?: number }[] = [
    { key: "transaksi", label: "Transaksi", count: c.transaksi },
    { key: "update", label: "Update", count: c.update },
    { key: "promo", label: "Promo", count: c.promo },
    { key: "info", label: "Info", count: c.info },
    { key: "feed", label: "Feed", count: c.feed },
  ];

  return (
    <div
      className={clsx(
        "flex gap-2",
        scrollable && "overflow-x-auto no-scrollbar -mx-4 px-4",
        className
      )}
    >
      {chips.map((chip) => {
        const active = value === chip.key;
        return (
          <button
            key={chip.key}
            className={clsx(
              "whitespace-nowrap rounded-full border px-3 py-1 text-sm",
              active
                ? "border-sky-600 bg-sky-50 text-sky-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            )}
            onClick={() => onChange(chip.key)}
          >
            {chip.label}
            {typeof chip.count === "number" ? (
              <span
                className={clsx(
                  "ml-2 rounded-full px-2 py-0.5 text-xs",
                  active ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                {chip.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
