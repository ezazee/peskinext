// NotificationsMobile.tsx
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type NotificationItem } from "@shared/types/types";
const notificationsSeed: NotificationItem[] = [];
import { FilterChips } from "../components/FilterChips";
import {
  filterByConfig,
  groupByDay,
  type FilterConfig
} from "@shared/helpers/notificationFormat";
import { NotificationCard } from "../components/NotificationCard";
import { markAllNotificationsAsRead } from "../notificationActions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckCheck } from "lucide-react";

const listV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};
const rowV = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.22 } },
};

export default function NotificationsMobile({
  data = notificationsSeed,
}: {
  data?: NotificationItem[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterConfig>({ main: "all" });
  const [isMarking, startMarking] = useTransition();
  const filtered = useMemo(() => filterByConfig(data, filter), [data, filter]);
  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const handleMarkAllRead = () => {
    startMarking(async () => {
      await markAllNotificationsAsRead();
      router.refresh();
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 pt-[env(safe-area-inset-top)]">
      {/* Header Title - Scrolls away */}
      {/* Header Title - Scrolls away */}
      <div className="bg-white px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900">Notifikasi</div>
        <button
          onClick={handleMarkAllRead}
          disabled={isMarking}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-all active:scale-95 disabled:opacity-50"
        >
          {isMarking ? (
            <span className="text-[10px] font-medium">...</span>
          ) : (
            <>
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai dibaca</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Chips - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="px-4 pb-3 pt-1">
          <FilterChips data={data} value={filter} onChange={setFilter} scrollable />
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-24 pt-4">
        <AnimatePresence mode="popLayout">
          {grouped.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-sm mb-4 text-primary">
                <span className="text-3xl">🔔</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Belum ada notifikasi</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-[200px] mx-auto">
                Notifikasi terbaru Anda akan muncul di sini.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={filter.main + (filter.sub || "")}
              variants={listV}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6"
            >
              {grouped.map((section) => (
                <motion.section key={section.heading} variants={rowV}>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    {section.heading}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {section.items.map((n) => (
                      <motion.div key={n.id} variants={rowV} layout>
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
    </div>
  );
}
