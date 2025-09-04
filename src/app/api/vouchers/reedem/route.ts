import type { Voucher, VoucherConditions } from "@shared/types/types"; // ganti import

import { NextResponse } from "next/server";

export type CartCtxDTO = {
  subtotal: number;
  selectedCount: number;
  regionTag?: string;
  hasPackage?: boolean;
  now?: string; // ISO
};

export type RedeemRequestDTO = { code: string; ctx: CartCtxDTO };
export type RedeemResponseDTO = {
  found: boolean;
  eligible?: boolean;
  reason?: string;
  voucher?: Voucher; // enabled sudah disesuaikan
};

// mock DB tetap sama…
const mockCodeDB: Record<string, Omit<Voucher, "enabled">> = {
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

function evaluateVoucher(v: Omit<Voucher, "enabled">, ctx: CartCtxDTO) {
  const c: VoucherConditions = v.conditions ?? {};
  const nowMs = (ctx.now ? new Date(ctx.now) : new Date()).getTime();
  if (v.validTo) {
    const end = new Date(v.validTo).getTime();
    if (Number.isFinite(end) && nowMs > end)
      return { eligible: false, reason: "Voucher sudah tidak berlaku" };
  }
  if (c.validFrom) {
    const start = new Date(c.validFrom).getTime();
    if (Number.isFinite(start) && nowMs < start)
      return { eligible: false, reason: "Voucher belum aktif" };
  }
  if (typeof c.minSubtotal === "number" && ctx.subtotal < c.minSubtotal)
    return {
      eligible: false,
      reason: `Min. belanja Rp${c.minSubtotal.toLocaleString("id-ID")}`,
    };
  if (
    typeof c.minSelectedItems === "number" &&
    ctx.selectedCount < c.minSelectedItems
  )
    return {
      eligible: false,
      reason: `Pilih minimal ${c.minSelectedItems} produk`,
    };
  if (c.regions?.length && ctx.regionTag && !c.regions.includes(ctx.regionTag))
    return { eligible: false, reason: `Hanya untuk ${c.regions.join(", ")}` };
  if (c.requirePackage && !ctx.hasPackage)
    return { eligible: false, reason: "Hanya berlaku untuk pembelian paket" };
  return { eligible: true };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RedeemRequestDTO;
    const code = body.code?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json<RedeemResponseDTO>({
        found: false,
        reason: "Kode tidak valid.",
      });
    }
    const base = mockCodeDB[code];
    if (!base) {
      return NextResponse.json<RedeemResponseDTO>({ found: false });
    }
    const { eligible, reason } = evaluateVoucher(base, body.ctx);
    const voucher: Voucher = { ...base, enabled: eligible };
    return NextResponse.json<RedeemResponseDTO>({
      found: true,
      eligible,
      reason,
      voucher,
    });
  } catch {
    // tetap balas JSON agar fetch tidak melempar network error
    return NextResponse.json<RedeemResponseDTO>(
      { found: false, reason: "Server error" },
      { status: 200 }
    );
  }
}
