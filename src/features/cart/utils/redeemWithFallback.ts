// File: src/features/cart/utils/redeemWithFallback.ts
"use client";

import type {
  RedeemResult,
  Voucher,
  VoucherConditions,
} from "@shared/types/types";

/* ------------ local extra codes for offline test ------------- */
const localExtraCodes: Record<string, Omit<Voucher, "enabled">> = {
  RAHASIA50: {
    id: "srv-promo-rahasia50",
    title: "Diskon 50% Rahasia",
    subtitle: "Maks diskon Rp100.000",
    type: "promo",
    savingLabel: "Hemat s/d Rp100rb",
    code: "RAHASIA50",
    validTo: "2025-12-31",
    conditions: { minSelectedItems: 1, minSubtotal: 100_000 },
  },
  ONGKIRXTRA: {
    id: "srv-ship-ongkirxtra",
    title: "Gratis Ongkir XTRA",
    subtitle: "Min. belanja Rp250.000, khusus Jabodetabek",
    type: "shipping",
    savingLabel: "Hemat ongkir",
    code: "ONGKIRXTRA",
    validTo: "2025-12-31",
    conditions: {
      minSubtotal: 250_000,
      minSelectedItems: 1,
      regions: ["Jabodetabek"],
    },
  },
};

export type CartCtx = {
  subtotal: number;
  selectedCount: number;
  regionTag?: string;
  hasPackage?: boolean;
  now?: Date;
};

/* ------------ tiny evaluator (same rules as server) ----------- */
function evaluate(
  v: Omit<Voucher, "enabled">,
  ctx: CartCtx
): { eligible: boolean; reason?: string } {
  const c: VoucherConditions = v.conditions ?? {};
  const nowMs = (ctx.now ?? new Date()).getTime();

  if (v.validTo) {
    const end = new Date(v.validTo).getTime();
    if (Number.isFinite(end) && nowMs > end) {
      return { eligible: false, reason: "Voucher sudah tidak berlaku" };
    }
  }
  if (c.validFrom) {
    const start = new Date(c.validFrom).getTime();
    if (Number.isFinite(start) && nowMs < start) {
      return { eligible: false, reason: "Voucher belum aktif" };
    }
  }
  if (typeof c.minSubtotal === "number" && ctx.subtotal < c.minSubtotal) {
    return {
      eligible: false,
      reason: `Min. belanja Rp${c.minSubtotal.toLocaleString("id-ID")}`,
    };
  }
  if (
    typeof c.minSelectedItems === "number" &&
    ctx.selectedCount < c.minSelectedItems
  ) {
    return {
      eligible: false,
      reason: `Pilih minimal ${c.minSelectedItems} produk`,
    };
  }
  if (
    c.regions?.length &&
    ctx.regionTag &&
    !c.regions.includes(ctx.regionTag)
  ) {
    return { eligible: false, reason: `Hanya untuk ${c.regions.join(", ")}` };
  }
  if (c.requirePackage && !ctx.hasPackage) {
    return { eligible: false, reason: "Hanya berlaku untuk pembelian paket" };
  }
  return { eligible: true };
}

/* ------------ public API (tries /api then local) -------------- */
export async function redeemWithFallback(
  codeUpper: string,
  ctx: CartCtx
): Promise<RedeemResult> {
  // 1) try API if you have route.ts
  try {
    const res = await fetch("/api/vouchers/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: codeUpper,
        ctx: { ...ctx, now: new Date().toISOString() },
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        found: boolean;
        eligible?: boolean;
        reason?: string;
        voucher?: Voucher;
      };
      if (!data.found) return { ok: false, reason: "Kode tidak ditemukan" };
      if (!data.voucher) {
        return { ok: false, reason: data.reason ?? "Kode tidak valid" };
      }
      const v: Voucher = {
        ...data.voucher,
        enabled: Boolean(data.eligible),
      };
      return data.eligible
        ? { ok: true, voucher: v }
        : { ok: false, reason: data.reason ?? "Syarat tidak terpenuhi" };
    }
    // fall through to local if 4xx/5xx
  } catch {
    // ignore -> use local
  }

  // 2) local fallback codes
  const base = localExtraCodes[codeUpper];
  if (!base) return { ok: false, reason: "Kode tidak ditemukan" };

  const { eligible, reason } = evaluate(base, ctx);
  const v: Voucher = { ...base, enabled: eligible };
  return eligible
    ? { ok: true, voucher: v }
    : { ok: false, reason: reason ?? "Syarat tidak terpenuhi" };
}
