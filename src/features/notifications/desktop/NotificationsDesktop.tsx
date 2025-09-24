"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationsSeed, type NotificationItem } from "@data/notification";
import { FilterChips } from "../components/FilterChips";
import { filterByKind, groupByDay } from "@shared/helpers/notificationFormat";
import { NotificationCard } from "../components/NotificationCard";

type Kind = Parameters<typeof filterByKind>[1];

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
  const [kind, setKind] = useState<Kind>("transaksi");
  const filtered = useMemo(() => filterByKind(data, kind), [data, kind]);
  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      {/* Header + filter */}
      <header className="mb-4 flex flex-wrap items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Notifikasi</h1>
        <FilterChips data={data} value={kind} onChange={setKind} />
      </header>

      {/* Banner status */}
      {kind === "transaksi" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap gap-2"
        >
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Transaksi berlangsung
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Menunggu pembayaran
          </span>
        </motion.div>
      )}

      {/* List */}
      <AnimatePresence mode="popLayout">
        {grouped.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500"
          >
            Tidak ada notifikasi.
          </motion.div>
        ) : (
          <motion.div
            key={kind}
            variants={containerV}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
          >
            {grouped.map((section) => (
              <motion.section key={section.heading} variants={itemV}>
                <h3 className="mb-3 text-sm font-semibold text-gray-500">
                  {section.heading}
                </h3>
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
