"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="rounded-xl bg-white shadow-sm"
    >
      <div className="px-4 py-3 bg-gray-50 rounded-t-xl font-semibold">
        {title}
      </div>
      <div className="px-4 py-2">{children}</div>
    </motion.div>
  );
}
export const Divider = () => <div className="h-px bg-gray-100 my-2" />;
export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}
