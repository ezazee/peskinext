"use client";

import { useState } from "react";

const METHODS = [
  {
    id: "card",
    label: "Kartu kredit/debit",
    note: "Bayar penuh atau cicilan 0%",
  },
  { id: "va-bca", label: "Virtual Account • Bank BCA" },
  { id: "qris", label: "QRIS" },
];

export default function PaymentMethodsDesktop() {
  const [method, setMethod] = useState("card");

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Metode pembayaran</h3>
        <button className="text-sm text-primary cursor-pointer hover:underline">
          Lihat semua
        </button>
      </div>

      <div className="space-y-2 text-sm">
        {METHODS.map((m) => (
          <label
            key={m.id}
            className={`flex items-start gap-3 rounded-xl border px-3 py-3 cursor-pointer transition
              ${
                method === m.id
                  ? "border-sky-500 ring-2 ring-sky-200"
                  : "border-gray-200/70 hover:border-gray-300"
              }`}
          >
            <input
              type="radio"
              name="paymethod"
              className="mt-0.5 accent-sky-600"
              checked={method === m.id}
              onChange={() => setMethod(m.id)}
            />
            <div className="flex-1">
              <div className="font-medium">{m.label}</div>
              {m.note && (
                <div className="text-xs text-gray-600 mt-0.5">{m.note}</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
