"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import React from "react";

export function CollapseCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white shadow-sm"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-xl font-semibold"
      >
        <span>{title}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="px-4 overflow-hidden"
          >
            <div className="py-3 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
