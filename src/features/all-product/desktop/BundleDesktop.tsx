"use client";

import * as React from "react";
import type { Product } from "@shared/types/types";
import { motion, AnimatePresence } from "framer-motion";
import ProductGridSkeleton from "../components/skeleton/ProductGridSkeleton";
import { ProductCard } from "@shared/components/layout/header/mobile/product/ProductCard";

type Props = {
  products: ReadonlyArray<Product>;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  animKey?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function BundleDesktop({
  products,
  loading = false,
  animKey,
}: Props) {
  return (
    <div className="hidden w-full md:block">

      {loading ? (
        <ProductGridSkeleton columns={4} />
      ) : products.length === 0 ? (
        // empty ...
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">
            Tidak ada produk yang cocok dengan filter.
          </p>
        </section>
      ) : (
        <AnimatePresence mode="wait">
          <motion.section
            key={animKey ?? products.map((p) => p.id).join("-")} // ← pakai animKey
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={itemVariants} className="h-full">
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.section>
        </AnimatePresence>
      )}
    </div>
  );
}
