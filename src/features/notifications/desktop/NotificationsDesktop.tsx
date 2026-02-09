"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type NotificationItem } from "@shared/types/types";
const notificationsSeed: NotificationItem[] = [];
import { FilterChips } from "../components/FilterChips";
import { filterByConfig, groupByDay, type FilterConfig } from "@shared/helpers/notificationFormat";
import { NotificationCard } from "../components/NotificationCard";
import { markAllNotificationsAsRead } from "../notificationActions";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";


const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};
const itemV = {
  hidden: { y: 8, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export default function NotificationsDesktop({
  data = notificationsSeed,
}: {
  data?: NotificationItem[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterConfig>({ main: "all" });
  const [isMarking, startMarking] = useTransition(); // Reuse transition or new one
  const filtered = useMemo(() => filterByConfig(data, filter), [data, filter]);
  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const handleMarkAllRead = () => {
    startMarking(async () => {
      await markAllNotificationsAsRead();
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Header + filter */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifikasi</h1>
          <button
            onClick={handleMarkAllRead}
            disabled={isMarking}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            title="Tandai semua telah dibaca"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{isMarking ? "Memproses..." : "Tandai semua dibaca"}</span>
          </button>
        </div>
        <FilterChips data={data} value={filter} onChange={setFilter} />
      </header>

      {/* List */}
      <AnimatePresence mode="popLayout">
        {grouped.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 text-primary">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Belum ada notifikasi</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
              Notifikasi terbaru Anda akan muncul di sini. Cek kembali nanti ya!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={filter.main + (filter.sub || "")}
            variants={containerV}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
          >
            {grouped.map((section) => (
              <motion.section key={section.heading} variants={itemV}>
                <div className="sticky top-[70px] z-10 -mx-4 mb-4 bg-gray-50/95 px-4 py-2 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-50/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {section.heading}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {section.items.map((n) => (
                    <motion.div key={n.id} variants={itemV} layout>
                      <NotificationCard n={n} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
