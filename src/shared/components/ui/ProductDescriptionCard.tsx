"use client";
import { motion } from "framer-motion";
import React from "react";

export function ProductDescriptionCard({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false);
  const content = text?.trim() ? text : "Tidak ada deskripsi.";
  const WORD_LIMIT = 30;

  const words = content.split(/\s+/).filter(Boolean);
  const hasMore = words.length > WORD_LIMIT;
  const short = hasMore ? words.slice(0, WORD_LIMIT).join(" ") : content;

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white shadow-sm"
    >
      <div className="px-4 py-3 bg-gray-50 rounded-t-xl font-semibold">
        Deskripsi produk
      </div>

      <div className="px-4 pt-3 pb-2 text-sm leading-relaxed text-gray-800 whitespace-pre-line">
        <motion.p
          key={open ? "full" : "short"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {open ? content : `${short}${hasMore ? "…" : ""}`}
        </motion.p>

        {hasMore && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen((s) => !s)}
            className="mt-2 text-sm font-semibold text-primary"
          >
            {open ? "Tutup" : "Baca Selengkapnya"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
