"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartData, Voucher, VoucherSelection } from "@shared/types/types";
import { useCartState } from "@features/cart/hooks/useCartState";
import MobileCartItem from "./mobile/MobileCartItem";
import MobileBottomBar from "./mobile/MobileBottomBar";
import VoucherModalMobile from "./mobile/VoucherModalMobile";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { productsData } from "@data/products";
import { promoVouchers, shippingVouchers } from "@data/voucher";
import { useToast } from "@shared/components/ui/Toaster";

/* ====================== helper (tanpa any) ====================== */
type MinimalProduct = {
  name?: string;
  isPackage?: boolean;
  tags?: ReadonlyArray<string>;
};
type LineLike = { selected?: boolean; product?: MinimalProduct };
function isLineLike(v: unknown): v is LineLike {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  const p = o.product as unknown;
  const productOk =
    p === undefined ||
    (typeof p === "object" &&
      p !== null &&
      (() => {
        const po = p as Record<string, unknown>;
        const okName = po.name === undefined || typeof po.name === "string";
        const okFlag =
          po.isPackage === undefined || typeof po.isPackage === "boolean";
        const okTags = po.tags === undefined || Array.isArray(po.tags);
        return okName && okFlag && okTags;
      })());
  return (
    (o.selected === undefined || typeof o.selected === "boolean") && productOk
  );
}
function computeHasPackage(items: ReadonlyArray<unknown>): boolean {
  return items.some((it) => {
    if (!isLineLike(it) || !it.selected || !it.product) return false;
    const p = it.product;
    return (
      p.isPackage === true ||
      (Array.isArray(p.tags) && p.tags.includes("package")) ||
      (typeof p.name === "string" && /paket|bundle/i.test(p.name))
    );
  });
}

/* -------- syarat voucher -------- */
type VoucherConditions = {
  minSubtotal?: number;
  minSelectedItems?: number;
  regions?: string[];
  requirePackage?: boolean;
  validFrom?: string;
};
type VoucherWithConditions = Voucher & { conditions?: VoucherConditions };
type CartCtx = {
  subtotal: number;
  selectedCount: number;
  regionTag?: string;
  hasPackage?: boolean;
  now?: Date;
};
type EvalResult = { enabled: boolean; reason?: string };

function evaluateVoucher(
  v: Omit<VoucherWithConditions, "enabled">,
  ctx: CartCtx
): EvalResult {
  const c = v.conditions ?? {};
  const nowMs = (ctx.now ?? new Date()).getTime();
  if (v.validTo) {
    const end = new Date(v.validTo).getTime();
    if (Number.isFinite(end) && nowMs > end)
      return { enabled: false, reason: "Voucher sudah tidak berlaku" };
  }
  if (c.validFrom) {
    const start = new Date(c.validFrom).getTime();
    if (Number.isFinite(start) && nowMs < start)
      return { enabled: false, reason: "Voucher belum aktif" };
  }
  if (typeof c.minSubtotal === "number" && ctx.subtotal < c.minSubtotal)
    return {
      enabled: false,
      reason: `Min. belanja Rp${c.minSubtotal.toLocaleString("id-ID")}`,
    };
  if (
    typeof c.minSelectedItems === "number" &&
    ctx.selectedCount < c.minSelectedItems
  )
    return {
      enabled: false,
      reason: `Pilih minimal ${c.minSelectedItems} produk`,
    };
  if (c.regions?.length && ctx.regionTag && !c.regions.includes(ctx.regionTag))
    return { enabled: false, reason: `Hanya untuk ${c.regions.join(", ")}` };
  if (c.requirePackage && !ctx.hasPackage)
    return { enabled: false, reason: "Hanya berlaku untuk pembelian paket" };
  return { enabled: true };
}

type DecoratedVoucher = Voucher & { _reason?: string };
function decorateVouchers(
  src: Voucher[],
  ctx: {
    subtotal: number;
    selectedCount: number;
    regionTag?: string;
    hasPackage?: boolean;
  }
): DecoratedVoucher[] {
  return src.map((v) => {
    const res = evaluateVoucher(v, ctx);
    return {
      ...v,
      enabled: res.enabled,
      _reason: res.reason,
      subtitle: !res.enabled && res.reason ? res.reason : v.subtitle,
    };
  });
}

/* -------- parser & kalkulasi potongan -------- */
function parseRupiahFlexible(text?: string): number {
  if (!text) return 0;
  const m1 = text.match(/Rp\s*([\d.]+)/i);
  if (m1) return parseInt(m1[1].replace(/\./g, ""), 10) || 0;
  const m2 = text.match(/(\d+)\s*rb/i);
  if (m2) return (parseInt(m2[1], 10) || 0) * 1_000;
  const m3 = text.match(/(\d+)\s*jt/i);
  if (m3) return (parseInt(m3[1], 10) || 0) * 1_000_000;
  return 0;
}
function parsePercent(text?: string): number | null {
  if (!text) return null;
  const m = text.match(/(\d{1,3})\s*%/);
  return m ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : null;
}
function pickFirst<T>(...vals: Array<T | null | undefined>): T | undefined {
  return vals.find((v) => v !== null && v !== undefined) as T | undefined;
}

function computeShippingDiscountFrom(v: Voucher | null | undefined): number {
  if (!v) return 0;
  const cap =
    pickFirst(
      parseRupiahFlexible(v.title),
      parseRupiahFlexible(v.subtitle),
      parseRupiahFlexible(v.savingLabel)
    ) ?? 0;
  return Math.max(0, cap);
}
function computePromoDiscountFrom(
  v: Voucher | null | undefined,
  subtotal: number
): number {
  if (!v) return 0;
  const pct =
    pickFirst(
      parsePercent(v.title),
      parsePercent(v.subtitle),
      parsePercent(v.savingLabel)
    ) ?? 0;
  const cap =
    pickFirst(
      parseRupiahFlexible(v.subtitle),
      parseRupiahFlexible(v.savingLabel)
    ) ?? Number.POSITIVE_INFINITY;
  if (pct <= 0) return 0;
  const raw = Math.floor((subtotal * pct) / 100);
  return Math.max(0, Math.min(raw, cap, subtotal));
}

function resolveSelectedVoucherById(
  id: string | null | undefined,
  lists: ReadonlyArray<Voucher>,
  codeVoucher: Voucher | null
): Voucher | null {
  if (!id) return null;
  const local = lists.find((x) => x.id === id);
  if (local) return local;
  if (codeVoucher && codeVoucher.id === id) return codeVoucher;
  return null;
}

/* NEW: bila id kosong tapi ada code voucher, pakai codeVoucher sesuai tipenya */
function pickActiveVouchers(
  selected: VoucherSelection,
  codeVoucher: Voucher | null,
  shippingList: ReadonlyArray<Voucher>,
  promoList: ReadonlyArray<Voucher>
) {
  let ship: Voucher | null = null;
  let pro: Voucher | null = null;

  if (selected.shippingId) {
    ship = resolveSelectedVoucherById(selected.shippingId, shippingList, codeVoucher);
  }
  if (selected.promoId) {
    pro = resolveSelectedVoucherById(selected.promoId, promoList, codeVoucher);
  }

  if (!ship && selected.code && codeVoucher?.type === "shipping") ship = codeVoucher;
  if (!pro && selected.code && codeVoucher?.type === "promo") pro = codeVoucher;

  return { ship, pro };
}

/* -------- redeem kode (API + fallback) -------- */
type RedeemResult =
  | { ok: true; voucher: Voucher }
  | { ok: false; reason: string };

async function redeemWithFallback(
  codeUpper: string,
  ctx: CartCtx
): Promise<RedeemResult> {
  try {
    const res = await fetch("/api/vouchers/redeem", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code: codeUpper,
        ctx: {
          subtotal: ctx.subtotal,
          selectedCount: ctx.selectedCount,
          regionTag: ctx.regionTag,
          hasPackage: ctx.hasPackage,
          now: new Date().toISOString(),
        },
      }),
    });
    if (res.ok) {
      const json: {
        found: boolean;
        eligible?: boolean;
        reason?: string;
        voucher?: Voucher;
      } = await res.json();
      if (!json.found) return { ok: false, reason: "Kode tidak ditemukan" };
      if (json.eligible && json.voucher)
        return { ok: true, voucher: { ...json.voucher, enabled: true } };
      return { ok: false, reason: json.reason ?? "Syarat tidak terpenuhi" };
    }
  } catch {
    /* ignore */
  }

  const DB: Record<string, Omit<Voucher, "enabled">> = {
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
  };
  const base = DB[codeUpper];
  if (!base) return { ok: false, reason: "Kode tidak ditemukan" };
  const { enabled, reason } = evaluateVoucher(base, ctx);
  if (!enabled) return { ok: false, reason: reason ?? "Syarat tidak terpenuhi" };
  return { ok: true, voucher: { ...base, enabled: true } };
}

/* ====================== UI: banner ====================== */
function InfoBanner() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3 flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center shrink-0">
        🚚
      </div>
      <div className="text-[13px] text-gray-700">
        Pilih produk dari Bag untuk dapatkan voucher gratis ongkir.
      </div>
    </div>
  );
}
function AppliedBanner({ savingText }: { savingText?: string }) {
  return (
    <div className="relative rounded-xl bg-emerald-50 text-emerald-900 p-3 flex items-start gap-3 border border-emerald-100">
      <div className="h-8 w-8 rounded-full bg-emerald-100 grid place-items-center shrink-0">
        🏷️
      </div>
      <div className="text-[13px]">
        Yay, voucher terpakai{savingText ? ` — ${savingText}` : ""}! Belanja
        lagi biar makin hemat.
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[.12]
        [background-image:radial-gradient(circle_at_12%_18%,#ef4444_2px,transparent_3px),
        radial-gradient(circle_at_78%_22%,#f59e0b_2px,transparent_3px),
        radial-gradient(circle_at_35%_85%,#3b82f6_2px,transparent_3px)]
        [background-size:26px_26px]"
      />
    </div>
  );
}

/* ====================== Component ====================== */
export function CartMobile({ initial }: { initial: CartData }) {
  const toast = useToast();
  const { items, counts, totals, actions } = useCartState(initial);

  const hasSelection = counts.selectedCount > 0;
  const canCheckout = totals.subtotal > 0 && hasSelection;

  const regionTag = "Jabodetabek";
  const hasPackage = useMemo(() => computeHasPackage(items), [items]);

  const [openVoucher, setOpenVoucher] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherSelection>({
    shippingId: null,
    promoId: null,
    code: undefined,
  });
  const [codeVoucher, setCodeVoucher] = useState<Voucher | null>(null);

  const ctx = useMemo(
    () => ({
      subtotal: totals.subtotal,
      selectedCount: counts.selectedCount,
      regionTag,
      hasPackage,
    }),
    [totals.subtotal, counts.selectedCount, regionTag, hasPackage]
  );

  const availableShipping = useMemo<DecoratedVoucher[]>(
    () => decorateVouchers(shippingVouchers, ctx),
    [ctx]
  );
  const availablePromos = useMemo<DecoratedVoucher[]>(
    () => decorateVouchers(promoVouchers, ctx),
    [ctx]
  );

  // AUTO RESET + TOAST (aman)
  useEffect(() => {
    const messages: string[] = [];
    let changed = false;
    let next: VoucherSelection = selectedVoucher;

    if (
      counts.selectedCount === 0 &&
      (selectedVoucher.shippingId ||
        selectedVoucher.promoId ||
        selectedVoucher.code)
    ) {
      next = { shippingId: null, promoId: null, code: undefined };
      setCodeVoucher(null);
      messages.push("Voucher dilepas karena tidak ada produk yang dipilih.");
      changed = true;
    } else {
      if (selectedVoucher.shippingId) {
        const v = availableShipping.find(
          (x) => x.id === selectedVoucher.shippingId
        );
        const isCodeAsShip =
          codeVoucher &&
          codeVoucher.id === selectedVoucher.shippingId &&
          codeVoucher.type === "shipping";
        if ((!v || !v.enabled) && !isCodeAsShip) {
          next = { ...next, shippingId: null };
          messages.push(
            `Voucher ongkir dihapus: ${v?._reason ?? "Syarat tidak terpenuhi."}`
          );
          changed = true;
        }
      }
      if (selectedVoucher.promoId) {
        const v = availablePromos.find((x) => x.id === selectedVoucher.promoId);
        const isCodeAsPromo =
          codeVoucher &&
          codeVoucher.id === selectedVoucher.promoId &&
          codeVoucher.type === "promo";
        if ((!v || !v.enabled) && !isCodeAsPromo) {
          next = { ...next, promoId: null };
          messages.push(
            `Voucher promo dihapus: ${v?._reason ?? "Syarat tidak terpenuhi."}`
          );
          changed = true;
        }
      }
      if (selectedVoucher.code && codeVoucher) {
        const ev = evaluateVoucher(codeVoucher, ctx);
        if (!ev.enabled) {
          next = { ...next, code: undefined };
          setCodeVoucher(null);
          messages.push(
            `Kode voucher dihapus: ${ev.reason ?? "Syarat tidak terpenuhi."}`
          );
          changed = true;
        }
      }
    }
    if (changed) {
      setSelectedVoucher(next);
      if (messages.length)
        toast.warning(messages.join("\n"), "Voucher dilepas");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    counts.selectedCount,
    availableShipping,
    availablePromos,
    ctx.hasPackage,
    ctx.subtotal,
  ]);

  // ringkasan voucher
  const appliedCount = useMemo(
    () =>
      (selectedVoucher.shippingId ? 1 : 0) +
      (selectedVoucher.promoId ? 1 : 0) +
      (selectedVoucher.code?.trim() ? 1 : 0),
    [selectedVoucher]
  );
  const savingText = useMemo(() => {
    const labels: string[] = [];
    const { ship, pro } = pickActiveVouchers(
      selectedVoucher,
      codeVoucher,
      availableShipping,
      availablePromos
    );
    if (ship?.savingLabel) labels.push(ship.savingLabel);
    if (pro?.savingLabel) labels.push(pro.savingLabel);
    return labels.join(" + ");
  }, [selectedVoucher, availableShipping, availablePromos, codeVoucher]);

  /* ========= NEW: kalkulasi final total dengan fallback ke codeVoucher ========= */
  const { promoDiscount, shippingDiscount, grandTotal } = useMemo(() => {
    const { ship, pro } = pickActiveVouchers(
      selectedVoucher,
      codeVoucher,
      availableShipping,
      availablePromos
    );

    const shipDisc = computeShippingDiscountFrom(ship);
    const proDisc = computePromoDiscountFrom(pro, totals.subtotal);

    const totalDisc = Math.min(
      totals.subtotal,
      Math.max(0, shipDisc) + Math.max(0, proDisc)
    );
    const grand = Math.max(0, totals.subtotal - totalDisc);
    return { promoDiscount: proDisc, shippingDiscount: shipDisc, grandTotal: grand };
  }, [
    selectedVoucher,
    availableShipping,
    availablePromos,
    codeVoucher,
    totals.subtotal,
  ]);

  // redeem handler untuk modal mobile
  async function onRedeemCode(codeUpper: string): Promise<RedeemResult> {
    const res = await redeemWithFallback(codeUpper, ctx);
    if (res.ok) setCodeVoucher(res.voucher);
    return res;
  }

  return (
    <div className="pb-36 px-4 pt-3 space-y-3">
      {appliedCount > 0 && hasSelection ? (
        <AppliedBanner savingText={savingText || undefined} />
      ) : (
        <InfoBanner />
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="mb-3 border-b border-gray-200">
          <nav className="flex gap-6">
            <div className="py-3 border-b-2 border-primary font-semibold text-primary">
              Belanja ({counts.itemCount})
            </div>
          </nav>
        </div>

        <div className="space-y-3">
          {items.map((line) => (
            <MobileCartItem
              key={line.id}
              line={line}
              onToggle={(checked) => actions.toggleItem(line.id, checked)}
              onQty={(q) => actions.setQty(line.id, q)}
              onRemove={() => actions.removeItem(line.id)}
            />
          ))}
        </div>

        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-[12px] text-gray-700 flex items-center justify-between">
          <span>
            Masih butuh yang lain? Tambah dari seller ini, mumpung diskon!
          </span>
          <button
            type="button"
            className="text-primary font-semibold text-[12px]"
          >
            Tambah
          </button>
        </div>
      </div>

      <ProductGrid products={productsData} limit={6} />

      {/* kirim GRAND TOTAL ke bottom bar */}
      <MobileBottomBar
        total={grandTotal}
        hasSelection={hasSelection}
        allSelected={counts.allSelected}
        onToggleAll={(checked) => actions.toggleSelectAll(checked)}
        canCheckout={canCheckout}
        onOpenVoucher={() => setOpenVoucher(true)}
        voucherAppliedCount={appliedCount}
        voucherSavingText={hasSelection ? savingText || undefined : undefined}
        voucherLoading={voucherLoading}
      />

      {/* Modal voucher khusus mobile */}
      <VoucherModalMobile
        open={openVoucher}
        onClose={() => setOpenVoucher(false)}
        loading={voucherLoading}
        shipping={availableShipping}
        promos={availablePromos}
        initialSelected={selectedVoucher}
        onRedeemCode={async (upper) => {
          const res = await onRedeemCode(upper);
          if (!res.ok) toast.error(res.reason ?? "Gagal menerapkan kode", "Voucher");
          return res;
        }}
        onApply={(payload) => {
          const reasons: string[] = [];
          if (payload.shippingId) {
            const s = availableShipping.find((v) => v.id === payload.shippingId);
            if (!s?.enabled) reasons.push(`Ongkir: ${s?._reason ?? "Syarat tidak terpenuhi."}`);
          }
          if (payload.promoId) {
            const p = availablePromos.find((v) => v.id === payload.promoId);
            if (!p?.enabled) reasons.push(`Promo: ${p?._reason ?? "Syarat tidak terpenuhi."}`);
          }
          if (reasons.length) {
            toast.error(reasons.join("\n"), "Voucher tidak memenuhi syarat");
            return;
          }

          setVoucherLoading(true);
          setTimeout(() => {
            setSelectedVoucher(payload);
            setVoucherLoading(false);
            setOpenVoucher(false);
            toast.success("Voucher berhasil diterapkan.");
          }, 250);
        }}
      />
    </div>
  );
}
