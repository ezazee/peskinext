// File: src/features/product/components/ProductTabs.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ProductTabsProps = {
  description: string;
  ingredients: string[];
  howToUse: string[];
};

const ExpandableContent = ({
  content,
  limit = 250,
}: {
  content: string;
  limit?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const safe = content?.trim() || "-";
  const isTruncated = safe.length > limit;

  return (
    <div>
      <p style={{ whiteSpace: "pre-line" }}>
        {isExpanded
          ? safe
          : `${safe.substring(0, limit)}${isTruncated ? "..." : ""}`}
      </p>
      {isTruncated && (
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="text-primary cursor-pointer font-semibold hover:underline mt-2"
        >
          {isExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
        </button>
      )}
    </div>
  );
};

// --- List (array string) dengan "Lihat Selengkapnya" ---
const ExpandableList = ({
  items,
  initialCount = 6,
}: {
  items: string[];
  initialCount?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const safe = Array.isArray(items) ? items.filter(Boolean) : [];
  const showToggle = safe.length > initialCount;
  const visibleItems = isExpanded ? safe : safe.slice(0, initialCount);

  if (safe.length === 0) {
    return <p className="text-gray-500">-</p>;
  }

  return (
    <div>
      <ul className="list-disc pl-5 space-y-1">
        {visibleItems.map((it, idx) => (
          <li key={idx} className="text-gray-700">
            {it}
          </li>
        ))}
      </ul>
      {showToggle && (
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="text-primary cursor-pointer font-semibold hover:underline mt-2"
        >
          {isExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
        </button>
      )}
    </div>
  );
};

export default function ProductTabs({
  description,
  ingredients,
  howToUse,
}: ProductTabsProps) {
  const tabs = {
    description: { title: "Deskripsi" },
    ingredients: { title: "Ingredients" },
    howToUse: { title: "Cara Pakai" },
  } as const;

  const [activeTab, setActiveTab] = useState<keyof typeof tabs>("description");

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-200">
        {(Object.keys(tabs) as Array<keyof typeof tabs>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 cursor-pointer -mb-px border-b-2 transition text-sm md:text-base ${
              activeTab === key
                ? "border-primary text-primary font-medium"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tabs[key].title}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="pt-4 text-sm leading-relaxed text-gray-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "description" && (
              <ExpandableContent content={description || "-"} />
            )}

            {activeTab === "ingredients" && (
              <ExpandableList items={ingredients || []} initialCount={8} />
            )}

            {activeTab === "howToUse" && (
              <ExpandableList items={howToUse || []} initialCount={6} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
