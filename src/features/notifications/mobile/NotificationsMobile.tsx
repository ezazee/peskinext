// NotificationsMobile.tsx
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type NotificationItem } from "@shared/types/types";
const notificationsSeed: NotificationItem[] = [];
import { FilterChips } from "../components/FilterChips";
import { filterByKind, groupByDay } from "@shared/helpers/notificationFormat";
import { NotificationCard } from "../components/NotificationCard";

type Kind = Parameters<typeof filterByKind>[1];

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
  const [kind, setKind] = useState<Kind>("transaksi");
  const filtered = useMemo(() => filterByKind(data, kind), [data, kind]);
  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  return (
    // Jadikan ini SCROLLER halaman → sticky akan nempel di sini
    // 👇 SATU-SATUNYA PERUBAHAN ADA DI BARIS INI
    <div className="h-[100dvh] bg-white pt-[env(safe-area-inset-top)]">
      {/* Header benar-benar sticky di scroller di atas */}
      <div className="sticky top-0 z-40 border-b bg-white/90 supports-[backdrop-filter]:bg-white/60 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="text-base font-semibold">Notifikasi</div>
        </div>
        <div className="px-0 pb-3">
          <FilterChips data={data} value={kind} onChange={setKind} scrollable />
        </div>
      </div>

      {/* Banner status */}
      {kind === "transaksi" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pt-3"
        >
          <div className="mb-3 flex gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Transaksi berlangsung
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              Menunggu pembayaran
            </span>
          </div>
        </motion.div>
      )}

      {/* List */}
      <div className="px-4 pb-6 pt-5">
        <AnimatePresence mode="popLayout">
          {grouped.length === 0 ? (
            <motion.div
              key="empty-m"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500"
            >
              Tidak ada notifikasi.
            </motion.div>
          ) : (
            <motion.div
              key={kind}
              variants={listV}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6"
            >
              {grouped.map((section) => (
                <motion.section key={section.heading} variants={rowV}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
