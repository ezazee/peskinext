"use client";

import { useState } from "react";

export default function ProductTabs() {
  const [tab, setTab] = useState<"detail" | "spes" | "info">("detail");

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {[
          { key: "detail", label: "Detail" },
          { key: "spes", label: "Spesifikasi" },
          { key: "info", label: "Info Penting" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 -mb-px border-b-2 transition text-sm md:text-base ${
              tab === t.key
                ? "border-emerald-600 text-emerald-700 font-medium"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-4 text-sm leading-relaxed text-gray-700">
        {tab === "detail" && (
          <div className="space-y-2">
            <p>Kondisi: <b>Baru</b></p>
            <p>Min. Pemesanan: <b>1 Buah</b></p>
            <p>
              PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:
              <b> NA18232000362</b>
              PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:PREMIERE BEAUTE • VISIBLE COLLAGEN • Anti-Aging Essence. BPOM:
            </p>
            <p className="text-emerald-700 font-medium hover:underline cursor-pointer">
              Lihat Selengkapnya
            </p>
          </div>
        )}
        {tab === "spes" && (
          <ul className="list-disc list-inside space-y-1">
            <li>Rebuild Skin Barrier</li>
            <li>More Natural, No Skin Irritations</li>
            <li>Isi bersih 100 ml</li>
          </ul>
        )}
        {tab === "info" && (
          <div className="space-y-1">
            <p>• Simpan di tempat sejuk dan kering.</p>
            <p>• Hentikan pemakaian bila terjadi iritasi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
