"use client";

import React, { type JSX } from "react";
import type { AddressItem } from "@shared/types/types";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AddressListMobile({
  items,
  primaryId,
  onSetPrimary,
  onRemove,
}: {
  items: ReadonlyArray<AddressItem>;
  primaryId: string | null;
  onSetPrimary: (id: string) => void;
  onRemove: (id: string) => void;
}): JSX.Element {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-base font-semibold">List Alamat</h1>
        <Link
          href="/account/address/new"
          className="h-9 inline-flex items-center justify-center rounded-lg bg-primary px-3 text-white text-sm font-semibold hover:opacity-90"
        >
          Tambah
        </Link>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {items.map((a) => {
          const isPrimary = a.id === primaryId || a.isPrimary;

          return (
            <article
              key={a.id}
              className={[
                "rounded-xl p-4 shadow-sm",
                isPrimary
                  ? "bg-sky-100/80 ring-1 ring-sky-200"
                  : "bg-white",
              ].join(" ")}
            >
              {/* Title & badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold truncate">{a.label}</h2>
                    {isPrimary && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/80 text-sky-700 ring-1 ring-sky-300">
                        <CheckCircle2 size={12} />
                        Utama
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mt-0.5">
                    {a.recipient} · {a.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {a.line1}, {a.city}, {a.province} {a.postalCode}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                {!isPrimary && (
                  <button
                    onClick={() => onSetPrimary(a.id)}
                    className={btnClass("ghost")}
                  >
                    Jadikan Utama
                  </button>
                )}
                <Link
                  href={`/account/address/edit/${a.id}`}
                  className={btnClass("ghost")}
                >
                  Edit
                </Link>
                <button
                  onClick={() => onRemove(a.id)}
                  className={btnClass("danger") + " ml-auto"}
                >
                  Hapus
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA tambah full-width (opsional, jika ingin juga di bawah) */}
      {/* <div className="mt-4">
        <Link
          href="/account/address/new"
          className="h-11 w-full inline-flex items-center justify-center rounded-lg bg-primary text-white font-semibold hover:opacity-90"
        >
          Tambah Alamat
        </Link>
      </div> */}
    </div>
  );
}

/* ===== helpers ===== */

type BtnVariant = "ghost" | "danger";

function btnClass(variant: BtnVariant): string {
  const base =
    "inline-flex items-center justify-center h-9 px-3 rounded-lg text-sm font-medium leading-none";
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-300";
  const ring = "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]";

  if (variant === "danger") {
    return [
      base,
      focus,
      "border border-red-200 text-red-600 hover:bg-red-50",
      ring,
    ].join(" ");
  }

  // ghost
  return [base, focus, "border border-gray-200 hover:bg-gray-50", ring].join(
    " "
  );
}
