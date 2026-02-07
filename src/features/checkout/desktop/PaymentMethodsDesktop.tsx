"use client";

// import { useState } from "react";

// const METHODS = [
//   {
//     id: "card",
//     label: "Kartu kredit/debit",
//     note: "Bayar penuh atau cicilan 0%",
//   },
//   { id: "va-bca", label: "Virtual Account • Bank BCA" },
//   { id: "qris", label: "QRIS" },
// ];

export default function PaymentMethodsDesktop() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Metode pembayaran</h3>
      </div>

      <div className="space-y-2 text-sm">
        <label
          className="flex items-start gap-3 rounded-xl border px-3 py-3 cursor-pointer border-sky-500 ring-2 ring-sky-200 bg-sky-50/10"
        >
          <input
            type="radio"
            name="paymethod"
            className="mt-0.5 accent-sky-600"
            checked={true}
            readOnly
          />
          <div className="flex-1">
            <div className="font-medium">Online Payment</div>
            <div className="text-xs text-gray-600 mt-0.5">
              Virtual Account, QRIS, Kartu Kredit, E-Wallet (via DOKU)
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
