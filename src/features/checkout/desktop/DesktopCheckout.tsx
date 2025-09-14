// src/features/checkout/desktop/DesktopCheckout.tsx
"use client";

import { useMemo, useState } from "react";
import type {
  CartData,
  Voucher,
  VoucherSelection,
  VoucherConditions,
} from "@shared/types/types";
import AddressCard from "./AddressCard";
import SellerCartCard from "./SellerCartCard";
import PaymentMethodsDesktop from "./PaymentMethodsDesktop";
import OrderSummaryDesktop from "./OrderSummaryDesktop";

import VoucherCard from "@features/cart/desktop/VoucherCard";
import VoucherModal from "@features/cart/desktop/VoucherModal";
import { promoVouchers, shippingVouchers } from "@data/voucher";
import { evaluateVoucher } from "@features/cart/lib/voucher";
import {
  redeemWithFallback,
  type CartCtx,
} from "@features/cart/utils/redeemWithFallback";

type VoucherWithConditions = Voucher & { conditions?: VoucherConditions };
type DecoratedVoucher = Voucher & { _reason?: string };
function decorateVouchers(src: Voucher[], ctx: CartCtx): DecoratedVoucher[] {
  return src.map((v) => {
    const res = evaluateVoucher(v as VoucherWithConditions, ctx);
    return {
      ...v,
      enabled: res.enabled,
      _reason: res.reason,
      subtitle: !res.enabled && res.reason ? res.reason : v.subtitle,
    };
  });
}

// ⬇️ initialCart dibuat OPSIONAL dan diberi default agar selalu defined
export default function DesktopCheckout({
  initialCart = { items: [] },
}: {
  initialCart?: CartData;
}) {
  // Aman walau initialCart belum dikirim: selalu kerjakan dari array aman
  const safeItems = (initialCart?.items ?? []).filter((i) => i.qty > 0);

  // Kalau ada yang selected, pakai itu. Kalau tidak ada, pakai semua supaya tidak kosong.
  const selectedItems = useMemo(() => {
    const chosen = safeItems.filter((i) => i.selected);
    return chosen.length > 0 ? chosen : safeItems;
  }, [initialCart]);

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of selectedItems) {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      const unit =
        typeof v?.price === "number"
          ? v.price
          : Number((line.product.price || "0").replace(/[^\d]/g, "")) || 0;
      sum += unit * line.qty;
    }
    return sum;
  }, [selectedItems]);

  const selectedCount = selectedItems.length;
  const regionTag = "Jabodetabek";
  const hasPackage = false;

  const [openVoucher, setOpenVoucher] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherSelection>({
    shippingId: null,
    promoId: null,
    code: undefined,
  });
  const [codeVoucher, setCodeVoucher] = useState<Voucher | null>(null);

  const ctx = useMemo<CartCtx>(
    () => ({ subtotal, selectedCount, regionTag, hasPackage }),
    [subtotal, selectedCount, regionTag, hasPackage]
  );

  const availableShipping = useMemo(
    () => decorateVouchers(shippingVouchers, ctx),
    [ctx]
  );
  const availablePromos = useMemo(
    () => decorateVouchers(promoVouchers, ctx),
    [ctx]
  );

  const appliedCount =
    (selectedVoucher.shippingId ? 1 : 0) +
    (selectedVoucher.promoId ? 1 : 0) +
    (selectedVoucher.code?.trim() ? 1 : 0);

  const savingText = useMemo(() => {
    const labels: string[] = [];
    if (selectedVoucher.shippingId) {
      const s = availableShipping.find(
        (v) => v.id === selectedVoucher.shippingId
      );
      if (s?.savingLabel) labels.push(s.savingLabel);
    }
    if (selectedVoucher.promoId) {
      const p = availablePromos.find((v) => v.id === selectedVoucher.promoId);
      if (p?.savingLabel) labels.push(p.savingLabel);
    }
    if (selectedVoucher.code && codeVoucher?.savingLabel)
      labels.push(codeVoucher.savingLabel);
    return labels.length ? labels.join(" + ") : undefined;
  }, [selectedVoucher, availableShipping, availablePromos, codeVoucher]);

  async function onRedeemCode(codeUpper: string) {
    const res = await redeemWithFallback(codeUpper, ctx);
    if (res.ok) setCodeVoucher(res.voucher);
    return res;
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-gray-200/70 bg-white">
            <AddressCard />
          </div>
          <div className="rounded-2xl border border-gray-200/70 bg-white">
            {/* ⬇️ items kini selalu array aman */}
            <SellerCartCard items={selectedItems} />
          </div>
        </section>

        {/* RIGHT */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
              <VoucherCard
                selectable={selectedCount > 0}
                onOpen={() => setOpenVoucher(true)}
                loading={voucherLoading}
                appliedCount={appliedCount}
                savingText={savingText}
              />
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white">
              <PaymentMethodsDesktop />
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white">
              <OrderSummaryDesktop />
            </div>
          </div>
        </aside>
      </div>

      {/* Voucher Modal */}
      <VoucherModal
        open={openVoucher}
        onClose={() => setOpenVoucher(false)}
        loading={voucherLoading}
        shipping={availableShipping}
        promos={availablePromos}
        initialSelected={selectedVoucher}
        onRedeemCode={onRedeemCode}
        onApply={(payload) => {
          const shipOk =
            !payload.shippingId ||
            availableShipping.some(
              (v) => v.id === payload.shippingId && v.enabled
            );
          const promoOk =
            !payload.promoId ||
            availablePromos.some((v) => v.id === payload.promoId && v.enabled);
          if (!shipOk || !promoOk) return;
          setVoucherLoading(true);
          setTimeout(() => {
            setSelectedVoucher(payload);
            setVoucherLoading(false);
            setOpenVoucher(false);
          }, 220);
        }}
      />
    </>
  );
}
