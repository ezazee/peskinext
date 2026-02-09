"use client";

import type { NotificationItem } from "@shared/types/types";
import {
  ShoppingBag,
  Info,
  Tag,
  Bell,
  RefreshCcw,
  ChevronRight
} from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { markNotificationAsRead } from "../notificationActions";
import { useTransition } from "react";

const getIcon = (kind: NotificationItem["kind"]) => {
  switch (kind) {
    case "transaksi":
      return <ShoppingBag className="h-5 w-5 text-primary" />;
    case "promo":
      return <Tag className="h-5 w-5 text-rose-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    case "update":
      return <RefreshCcw className="h-5 w-5 text-amber-500" />;
    default:
      return <Bell className="h-5 w-5 text-primary" />;
  }
};

const getBgColor = (kind: NotificationItem["kind"]) => {
  switch (kind) {
    case "transaksi":
      return "bg-primary/10";
    case "promo":
      return "bg-rose-50";
    case "info":
      return "bg-blue-50";
    case "update":
      return "bg-amber-50";
    default:
      return "bg-primary/5";
  }
};

// Helper function to pretty-print the kind, assuming it's meant to capitalize or translate
const pKind = (kind: NotificationItem["kind"]) => {
  switch (kind) {
    case "transaksi":
      return "Transaksi";
    case "promo":
      return "Promo";
    case "info":
      return "Info";
    case "update":
      return "Update";
    default:
      return kind; // Fallback to original kind if not explicitly handled
  }
};

export function NotificationCard({ n }: { n: NotificationItem }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const isUnread = n.active; // 'active' means unread in our type mapping

  const handleClick = () => {
    // Prevent double triggering if clicking the link explicitly
    // (though we might want the link to also trigger likely)
    // For now, let's just trigger read on card click

    if (isUnread) {
      startTransition(async () => {
        await markNotificationAsRead(n.id);
        router.refresh();
        if (n.action?.href) {
          router.push(n.action.href);
        }
      });
    } else if (n.action?.href) {
      router.push(n.action.href);
    }
  };


  return (
    <div
      onClick={handleClick}
      role="button"
      className={clsx(
        "group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 text-left w-full",
        "hover:shadow-md hover:border-primary/30",
        isUnread ? "bg-blue-50/50 border-blue-100" : "bg-white border-gray-100 opacity-90"
      )}
    >
      {/* Unread Indicator */}
      {isUnread && (
        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}

      {/* Icon Box */}
      <div className={clsx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
        getBgColor(n.kind)
      )}>
        {getIcon(n.kind)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={clsx(
                "inline-flex items-center text-[11px] font-semibold uppercase tracking-wider",
                n.kind === "promo" ? "text-rose-600" :
                  n.kind === "transaksi" ? "text-primary" :
                    "text-gray-500"
              )}>
                {n.badge ?? pKind(n.kind)}
              </span>
              <span className="text-[10px] text-gray-300">•</span>
              <span className="text-xs text-gray-400">
                {new Date(n.date).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <h4 className="mt-1 text-[15px] font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {n.title}
            </h4>
          </div>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-gray-600 line-clamp-2">
          {n.message}
        </p>

        {n.action && (
          <div className="mt-3">
            <span
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
            >
              {n.action.label}
              <ChevronRight className="ml-0.5 h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
