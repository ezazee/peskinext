"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CartData,
  CartItem,
  Product,
  Variant,
  Voucher,
  VoucherSelection,
  VoucherConditions,
} from "@shared/types/types";

import { AddressModal } from "@shared/components/ui/AddressModal";
import { useAddressBookLocal } from "@features/address/useAddressBookLocal";

import AddressCardMobile from "./AddressCardMobile";
import SellerCartCardMobile from "./SellerCartCardMobile";
import OrderSummaryMobile from "./OrderSummaryMobile";

import ShippingModal from "@features/checkout/desktop/ShippingModal";
import { buildMockShippingData } from "@data/shipingData";
import type { ShippingDetailData, ShippingOption } from "@data/shipingData";

import VoucherModal from "@features/cart/desktop/VoucherModal";
import { promoVouchers, shippingVouchers } from "@data/voucher";
import { evaluateVoucher } from "@features/cart/lib/voucher";
import {
  redeemWithFallback,
  type CartCtx,
} from "@features/cart/utils/redeemWithFallback";

/* ---- util price ---- */
function priceFrom(p: Product, v?: Variant) {
  const unit =
    typeof v?.price === "number"
      ? v.price
      : Number((p.price || "0").replace(/[^\d]/g, "")) || 0;
  return unit;
}

/* ---- voucher helpers (sama seperti desktop) ---- */
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
function parseRupiahFlexible(text?: string): number {
  if (!text) return 0;
  const s = text.replace(/\s+/g, " ").trim().toLowerCase();
  let m = s.match(/(?:rp)?\s*([\d.]+)\s*(rb|ribu|k|jt|juta)?/i);
  if (m) {
    const base = parseInt(m[1].replace(/\./g, ""), 10) || 0;
    const suf = (m[2] || "").toLowerCase();
    if (suf === "rb" || suf === "ribu" || suf === "k") return base * 1_000;
    if (suf === "jt" || suf === "juta") return base * 1_000_000;
    return base;
  }
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m) {
    const n = parseInt(m[1], 10) || 0;
    const suf = m[2].toLowerCase();
    return suf === "rb" || suf === "ribu" || suf === "k"
      ? n * 1_000
      : n * 1_000_000;
  }
  return 0;
}
function parsePercent(text?: string): number | null {
  if (!text) return null;
  const m = text.match(/(\d{1,3})\s*%/);
  return m ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : null;
}
const looksLikeDiscount = (t?: string) =>
  !!t && /(hemat|potong|s\/d|sd|gratis|ongkir|diskon)/i.test(t);

function computeShippingDiscountFrom(v?: Voucher | null): number {
  if (!v) return 0;
  const tryTexts: (string | undefined)[] = [
    v.savingLabel,
    v.title,
    looksLikeDiscount(v.subtitle) ? v.subtitle : undefined,
  ];
  for (const t of tryTexts) {
    const n = parseRupiahFlexible(t);
    if (n > 0) return n;
  }
  return 0;
}
function computePromoDiscountFrom(
  v: Voucher | null | undefined,
  subtotal: number
): number {
  if (!v) return 0;
  const pct =
    parsePercent(v.title) ??
    parsePercent(v.subtitle) ??
    parsePercent(v.savingLabel) ??
    0;
  const cap =
    parseRupiahFlexible(v.subtitle) ||
    parseRupiahFlexible(v.savingLabel) ||
    Number.POSITIVE_INFINITY;
  if (pct <= 0) return 0;
  const raw = Math.floor((subtotal * pct) / 100);
  return Math.max(0, Math.min(raw, cap, subtotal));
}

/* =================================================== */
export default function MobileCheckout({
  initialCart = { items: [] },
}: {
  initialCart?: CartData;
}) {
  /* items selected */
  const safeItems = (initialCart?.items ?? []).filter((i) => i.qty > 0);
  const items: CartItem[] = useMemo(() => {
    const chosen = safeItems.filter((i) => i.selected);
    return chosen.length ? chosen : safeItems;
  }, [safeItems]);

  const itemsCount = items.length;
  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of items) {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      sum += priceFrom(line.product, v) * line.qty;
    }
    return sum;
  }, [items]);

  /* alamat */
  const { primary, listEntries, selectPrimary } = useAddressBookLocal();
  const [openAddress, setOpenAddress] = useState(false);
  const addressLabel = primary
    ? `${primary.label} ${primary.city}`
    : "Pilih alamat";

  /* shipping */
  const [openShipping, setOpenShipping] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingDetailData>(() =>
    buildMockShippingData({
      origin: "Gudang Pusat",
      destination: addressLabel,
      weightGr: 800,
    })
  );
  const [shippingCurrent, setShippingCurrent] = useState<ShippingOption | null>(
    null
  );
  const [shippingLoading, setShippingLoading] = useState(true);

  useEffect(() => {
    setShippingLoading(true);
    setShippingData(
      buildMockShippingData({
        origin: "Gudang Pusat",
        destination: addressLabel,
        weightGr: 800,
      })
    );
    const t = setTimeout(() => {
      const flat = shippingData.groups.flatMap((g) => g.items);
      const cheapest = flat.length
        ? [...flat].sort((a, b) => a.price - b.price)[0]
        : null;
      setShippingCurrent(cheapest ?? null);
      setShippingLoading(false);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary?.id]);

  /* voucher */
  const selectedCount = itemsCount;
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

  async function onRedeemCode(codeUpper: string) {
    const res = await redeemWithFallback(codeUpper, ctx);
    if (res.ok) setCodeVoucher(res.voucher);
    return res;
  }

  /* totals */
  const shippingDiscount = useMemo(() => {
    let ship: Voucher | null = null;
    if (selectedVoucher.shippingId) {
      ship =
        availableShipping.find((x) => x.id === selectedVoucher.shippingId) ??
        (codeVoucher?.type === "shipping" &&
        codeVoucher.id === selectedVoucher.shippingId
          ? codeVoucher
          : null);
    }
    if (!ship && selectedVoucher.code && codeVoucher?.type === "shipping") {
      ship = codeVoucher;
    }
    return computeShippingDiscountFrom(ship);
  }, [selectedVoucher, availableShipping, codeVoucher]);

  const promoDiscountList = useMemo(() => {
    const promoFromList = selectedVoucher.promoId
      ? availablePromos.find((x) => x.id === selectedVoucher.promoId) ?? null
      : null;
    return computePromoDiscountFrom(promoFromList, subtotal);
  }, [selectedVoucher.promoId, availablePromos, subtotal]);

  const promoDiscountCode = useMemo(() => {
    const codeIsPromoNotInList =
      !!selectedVoucher.code &&
      codeVoucher?.type === "promo" &&
      !availablePromos.some((p) => p.id === codeVoucher.id);

    return codeIsPromoNotInList
      ? computePromoDiscountFrom(codeVoucher, subtotal)
      : 0;
  }, [selectedVoucher.code, codeVoucher, availablePromos, subtotal]);

  // >>> Shipping fee & grand total (CAP diskon ongkir)
  const shippingFee = shippingCurrent?.price ?? 0;

  // diskon ongkir yang dihitung dari voucher (bisa > fee)
  // -- cap agar tidak melebihi ongkir yang dibayar
  const shippingDiscountCapped = Math.min(
    Math.max(0, shippingDiscount),
    shippingFee
  );

  const shippingAfter = Math.max(0, shippingFee - shippingDiscountCapped);

  const grandTotal = Math.max(
    0,
    subtotal + shippingAfter - promoDiscountList - promoDiscountCode
  );

  /* UI compose */
  return (
    <>
      <AddressCardMobile
        label={addressLabel}
        onOpen={() => setOpenAddress(true)}
      />

      <main className="px-4 py-4 space-y-4">
        <SellerCartCardMobile
          items={items}
          current={shippingCurrent}
          loading={shippingLoading}
          openShipping={() => setOpenShipping(true)}
        />

        <section className="rounded-xl border border-gray-200 bg-white">
          <button
            onClick={() => setOpenVoucher(true)}
            className="w-full px-4 py-3 text-left flex items-center justify-between"
          >
            <span className="text-sm font-semibold">Voucher & Promo</span>
            <span className="text-xs text-gray-600">
              {(selectedVoucher.shippingId ? 1 : 0) +
                (selectedVoucher.promoId ? 1 : 0) +
                (selectedVoucher.code?.trim() ? 1 : 0)}{" "}
              terpakai
            </span>
          </button>
        </section>

        <OrderSummaryMobile
          itemsCount={itemsCount}
          subtotal={subtotal}
          shippingFee={shippingFee}
          shippingLoading={shippingLoading}
          shippingDiscount={shippingDiscountCapped}
          promoDiscountList={promoDiscountList}
          promoDiscountCode={promoDiscountCode}
          grandTotal={grandTotal}
          onCheckout={() => alert("Checkout (demo)")}
        />

        <div className="h-24" />
      </main>

      {/* Modals: Address / Shipping / Voucher (tanpa perubahan) */}
      <AddressModal
        isOpen={openAddress}
        onClose={() => setOpenAddress(false)}
        options={listEntries}
        selectedId={primary?.id ?? null}
        onConfirm={(id) => {
          selectPrimary(id);
          setOpenAddress(false);
        }}
        onAddNew={() => alert("Form tambah alamat (demo)")}
      />

      <ShippingModal
        open={openShipping}
        onClose={() => setOpenShipping(false)}
        data={shippingData}
        selectedId={shippingCurrent?.id ?? null}
        onConfirm={(opt) => {
          setShippingCurrent(opt);
          setOpenShipping(false);
        }}
      />

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
