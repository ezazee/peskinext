// @data/notifications.ts
export type NotifKind = "transaksi" | "update" | "promo" | "info" | "feed";
export type NotifStatus =
  | "ongoing"
  | "pending_payment"
  | "delivered"
  | "completed";

export type NotificationItem = {
  id: string;
  kind: NotifKind;
  status?: NotifStatus;
  title: string;
  message: string;
  date: string;
  badge?: string;
  action?: { label: string; href: string };
};

export const notificationsSeed: NotificationItem[] = [
  {
    id: "n1",
    kind: "transaksi",
    status: "completed",
    badge: "Belanja",
    title: "Pesananmu sudah selesai, beri ulasan yuk 🎉",
    message:
      "Terima kasih kamu tetap aman di rumah jaga kesehatan diri dan keluarga 💚",
    date: "2025-09-20T10:15:00+07:00",
  },
  {
    id: "n2",
    kind: "transaksi",
    status: "delivered",
    badge: "Belanja",
    title: "Pesananmu sudah sampai, nih! 🏠",
    message:
      "“USB Hub Converter Type C...” sudah sampai. Transaksi akan otomatis selesai pada 19 September 2025.",
    date: "2025-09-13T14:12:00+07:00",
    action: { label: "Selengkapnya", href: "/orders/123" },
  },
  {
    id: "n3",
    kind: "transaksi",
    status: "ongoing",
    badge: "Belanja",
    title: "Pesananmu dalam perjalanan! 🚚",
    message: "Paket dikirim oleh penjual. Lacak barang pesananmu di sini!",
    date: "2025-09-12T09:01:00+07:00",
    action: { label: "Lacak", href: "/orders/123/track" },
  },
  {
    id: "n4",
    kind: "info",
    badge: "Info",
    title: "Pembayaranmu sudah terverifikasi",
    message: "Pembayaran sudah kami terima, mohon ditunggu konfirmasi penjual.",
    date: "2025-09-11T19:40:00+07:00",
  },
  {
    id: "n5",
    kind: "promo",
    badge: "Promo",
    title: "DISKON 17% • PEMERDEKA17",
    message: "Rayakan kemerdekaan! Klaim voucher sebelum habis.",
    date: "2025-09-07T08:00:00+07:00",
    action: { label: "Klaim", href: "/promo/merdeka" },
  },
];
