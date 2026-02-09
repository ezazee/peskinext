// @shared/helpers/notificationFormat.ts

import type { NotificationItem } from "@shared/types/types";

export function formatDayHeading(d: Date): string {
  const today = new Date();
  const dd = (x: Date) => x.toDateString();
  if (dd(d) === dd(today)) return "Hari ini";
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  if (dd(d) === dd(y)) return "Kemarin";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export type Grouped = { heading: string; items: NotificationItem[] };

export function groupByDay(items: NotificationItem[]): Grouped[] {
  const map = new Map<string, NotificationItem[]>();
  for (const it of items) {
    const d = new Date(it.date);
    const key = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).toISOString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  const rows = Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, arr]) => ({
      heading: formatDayHeading(new Date(key)),
      items: arr.sort((x, y) => (x.date < y.date ? 1 : -1)),
    }));
  return rows;
}

export type FilterType = "all" | "transaksi" | "update" | "info";
export type FilterConfig = {
  main: FilterType;
  sub?: string; // For transaction status or other sub-filters
};

export function filterByConfig(
  items: NotificationItem[],
  config: FilterConfig
): NotificationItem[] {
  const { main, sub } = config;

  if (main === "all") return items;

  if (main === "transaksi") {
    let filtered = items.filter((i) => i.kind === "transaksi");
    if (sub && sub !== "all") {
      // Map UI filter to NotifStatus
      // "berhasil" -> "completed"
      // "pending" -> "pending_payment"
      // "batal" -> "cancelled"
      // "dikirim" -> "ongoing" (or "delivered" based on context, here assuming ongoing for shipping)
      // Let's assume the UI sends the actual NotifStatus or we map it here.
      // Ideally UI sends "pending_payment", "completed", etc.
      filtered = filtered.filter(i => i.status === sub);
    }
    return filtered;
  }

  if (main === "update") {
    if (sub && sub !== "all") {
      return items.filter((i) => i.kind === sub);
    }
    // Update includes 'promo' and 'feed'
    return items.filter((i) => i.kind === "promo" || i.kind === "feed" || i.kind === "update");
  }

  if (main === "info") {
    // Info includes 'info' kind AND maybe transaction updates that are informational?
    // User said: "ketika user bayar itu jga ada notif tapi masuk ke info"
    // This suggests duplicate visibility or 'info' type notifications about payments.
    // For simplicity, we filter by kind 'info' logic. If backend creates 'info' notifications for payments, they will appear here.
    return items.filter((i) => i.kind === "info");
  }

  return items;
}

export function getCounts(items: NotificationItem[]) {
  return {
    all: items.length,
    transaksi: items.filter((i) => i.kind === "transaksi").length,
    update: items.filter((i) => ["promo", "feed", "update"].includes(i.kind)).length,
    info: items.filter((i) => i.kind === "info").length,
  };
}
