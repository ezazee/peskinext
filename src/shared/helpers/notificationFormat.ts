// @shared/helpers/notificationFormat.ts

import type { NotificationItem, NotifKind } from "@data/notification";

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

export function filterByKind(
  items: NotificationItem[],
  kind: NotifKind | "all"
): NotificationItem[] {
  return kind === "all" ? items : items.filter((i) => i.kind === kind);
}

export function chipCounts(items: NotificationItem[]) {
  return {
    all: items.length,
    transaksi: items.filter((i) => i.kind === "transaksi").length,
    update: items.filter((i) => i.kind === "update").length,
    promo: items.filter((i) => i.kind === "promo").length,
    info: items.filter((i) => i.kind === "info").length,
    feed: items.filter((i) => i.kind === "feed").length,
  };
}
