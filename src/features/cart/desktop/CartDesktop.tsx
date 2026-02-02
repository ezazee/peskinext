"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartData, Voucher, VoucherSelection } from "@shared/types/types";
import { useCartState } from "@features/cart/hooks/useCartState";
import CartItemCard from "./CartItemCard";
// import { promoVouchers, shippingVouchers } from "@data/voucher";
const promoVouchers: Voucher[] = [];
const shippingVouchers: Voucher[] = [];
import { useToast } from "@shared/components/ui/Toaster";
import SummaryCard from "./SummaryCard";

/* =====================================================================================
 *  Type guards & helpers (NO any)
 * ===================================================================================== */

type MinimalProduct = {
  name?: string;
  isPackage?: boolean;
  tags?: ReadonlyArray<string>;
};
type LineLike = { selected?: boolean; product?: MinimalProduct };

function isLineLike(v: unknown): v is LineLike {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  const p = obj.product as unknown;
  const okSelected =
    obj.selected === undefined || typeof obj.selected === "boolean";
  const okProduct =
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
  return okSelected && okProduct;
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

/* ----- Voucher evaluation (syarat) ----- */

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
function decorateVouchers(src: Voucher[], ctx: CartCtx): DecoratedVoucher[] {
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

/* =====================================================================================
 *  Component
 * ===================================================================================== */

export function CartDesktop({ initial, isLoggedIn = false }: { initial: CartData; isLoggedIn?: boolean }) {
  const toast = useToast();
  const { items, counts, totals, actions } = useCartState(initial);
  const hasSelection = counts.selectedCount > 0;
  const canCheckout = totals.subtotal > 0 && hasSelection;
  const regionTag = "Jabodetabek";
  const hasPackage = useMemo(() => computeHasPackage(items), [items]);

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherSelection>({
    shippingId: null,
    promoId: null,
    code: undefined,
  });
  const [codeVoucher, setCodeVoucher] = useState<Voucher | null>(null);

  const ctx = useMemo<CartCtx>(
    () => ({
      subtotal: totals.subtotal,
      selectedCount: counts.selectedCount,
      regionTag,
      hasPackage,
    }),
    [totals.subtotal, counts.selectedCount, regionTag, hasPackage]
  );

  const availableShipping = useMemo(
    () => decorateVouchers(shippingVouchers, ctx),
    [ctx]
  );
  const availablePromos = useMemo(
    () => decorateVouchers(promoVouchers, ctx),
    [ctx]
  );

  useEffect(() => {
    let changed = false;
    const msgs: string[] = [];
    let next: VoucherSelection = { ...selectedVoucher };

    if (counts.selectedCount === 0) {
      if (
        selectedVoucher.shippingId ||
        selectedVoucher.promoId ||
        selectedVoucher.code
      ) {
        next = { shippingId: null, promoId: null, code: undefined };
        setCodeVoucher(null);
        changed = true;
        msgs.push("Voucher dilepas karena tidak ada produk yang dipilih.");
      }
    } else {
      if (
        selectedVoucher.shippingId &&
        !availableShipping.some(
          (v) => v.id === selectedVoucher.shippingId && v.enabled
        )
      ) {
        next.shippingId = null;
        changed = true;
        msgs.push("Voucher ongkir dihapus: syarat tidak terpenuhi.");
      }
      if (
        selectedVoucher.promoId &&
        !availablePromos.some(
          (v) => v.id === selectedVoucher.promoId && v.enabled
        )
      ) {
        next.promoId = null;
        changed = true;
        msgs.push("Voucher promo dihapus: syarat tidak terpenuhi.");
      }
      if (selectedVoucher.code && codeVoucher) {
        const ev = evaluateVoucher(codeVoucher, ctx);
        if (!ev.enabled) {
          next.code = undefined;
          setCodeVoucher(null);
          changed = true;
          msgs.push(
            `Kode voucher dilepas: ${ev.reason ?? "syarat tidak terpenuhi."}`
          );
        }
      }
    }

    if (changed) {
      setSelectedVoucher(next);
      if (msgs.length) toast.warning(msgs.join("\n"), "Voucher dilepas");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    counts.selectedCount,
    availableShipping,
    availablePromos,
    ctx.hasPackage,
    ctx.subtotal,
  ]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-8">
          <div className="mb-3 border-b border-gray-200">
            <nav className="flex gap-6">
              <div className="py-3 border-b-2 border-primary font-semibold text-primary">
                Belanja ({counts.itemCount})
              </div>
            </nav>
          </div>

          <div className="space-y-4">
            {items.map((line) => (
              <CartItemCard
                key={line.id}
                line={line}
                onToggle={(checked) => actions.toggleItem(line.id, checked)}
                onQty={(q) => actions.setQty(line.id, q)}
                onRemove={() => actions.removeItem(line.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <aside className="col-span-4">
          <div className="sticky top-20 space-y-4">
            <SummaryCard
              subtotal={totals.subtotal}
              shippingFee={0}
              canCheckout={canCheckout}
              selected={selectedVoucher}
              shipping={availableShipping}
              promos={availablePromos}
              redeemedVoucher={codeVoucher}
              isLoggedIn={isLoggedIn}
              cartItems={items}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
