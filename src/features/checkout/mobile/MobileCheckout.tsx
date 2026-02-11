"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  CartData,
  CartItem,
  Voucher,
  VoucherSelection,
  VoucherConditions,
  CheckoutSession,
} from "@shared/types/types";
import { PaymentTimer } from "@features/transaction/components/PaymentTimer";


import { AddressModal } from "@shared/components/ui/AddressModal";
import { useAddressBook } from "@features/address/useAddressBook";
import PaymentMethodsMobile from "./PaymentMethodsMobile";

import AddressCardMobile from "./AddressCardMobile";
import SellerCartCard from "../components/SellerCartCard";
import OrderSummaryMobile from "./OrderSummaryMobile";

import ShippingModal from "@features/checkout/desktop/ShippingModal";
import type { ShippingOption } from "@shared/types/types";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import { getCurrentUser } from "@features/auth/action";
import type { ShippingQueryParams } from "@features/shiping/hooks/useShippingParamsForProduct";

import VoucherModal from "@features/checkout/desktop/VoucherModal";
import { evaluateVoucher } from "@features/cart/lib/voucher";
import { getVouchers, checkVoucherCode } from "@features/voucher/action";
import {
  type CartCtx,
} from "@features/cart/utils/redeemWithFallback";

import { getProductPrice } from "@shared/helpers/product";

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
  if (m && m[1]) {
    const base = parseInt(m[1].replace(/\./g, ""), 10) || 0;
    const suf = (m[2] || "").toLowerCase();
    if (suf === "rb" || suf === "ribu" || suf === "k") return base * 1_000;
    if (suf === "jt" || suf === "juta") return base * 1_000_000;
    return base;
  }
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m && m[1] && m[2]) {
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
  return m && m[1] ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : null;
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
  checkoutSession,
}: {
  initialCart?: CartData;
  checkoutSession?: CheckoutSession | null;
}) {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUserId(u.id);
    });
  }, []);

  /* Convert checkoutSession.lines to cart items format if session exists */
  const items: CartItem[] = useMemo(() => {
    if (checkoutSession?.lines) {
      // Convert CheckoutLine[] to CartItem[] format
      return checkoutSession.lines.map((line) => ({
        id: `checkout-${line.productId}-${line.variantId}`,
        product: {
          id: line.productId,
          name: line.name.split(' - ')[0] || line.name,
          slug: line.productId,
          img: line.image,
          price: `Rp${line.price.toLocaleString('id-ID')}`,
          variants: [{
            id: Number(line.variantId),
            name: line.name.split(' - ')[1] || 'Default',
            price: line.price,
            stock: 999
          }],
          // Dummy fields required by Product type
          description: '',
          ingredients: [],
          howToUse: [],
          category: '',
          sku: '',
          imgHover: line.image,
          galleryImages: [line.image],
          isFlashSale: false,
          isEvent: false,
          type: 'single' as const,
          weightGr: line.weight || 100,
        },
        variantId: Number(line.variantId),
        qty: line.qty,
        selected: true,
      }));
    }

    // Fallback to cart items
    const safeItems = (initialCart?.items ?? []).filter((i) => i.qty > 0);
    const chosen = safeItems.filter((i) => i.selected);
    return chosen.length ? chosen : safeItems;
  }, [checkoutSession, initialCart]);

  const itemsCount = items.length;
  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of items) {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      sum += getProductPrice(line.product, v) * line.qty;
    }
    return sum;
  }, [items]);

  /* alamat */
  const { primary, listEntries, selectPrimary } = useAddressBook();
  const [openAddress, setOpenAddress] = useState(false);
  const addressLabel = primary
    ? `${primary.label} ${primary.city}`
    : "Pilih alamat";

  /* shipping */
  const [openShipping, setOpenShipping] = useState(false);
  const [shippingCurrent, setShippingCurrent] = useState<ShippingOption | null>(null);

  const totalWeightGr = useMemo(() => {
    return items.reduce((acc, item) => {
      // Check if weight is number or comes from backend handling
      const w = item.product.weightGr || 1000;
      return acc + (w * item.qty);
    }, 0);
  }, [items]);

  // Prepare shipping params
  const shippingParams: ShippingQueryParams | null = useMemo(() => {
    if (!primary || !userId || items.length === 0) return null;
    return {
      origin: "Jakarta",
      destination: primary.city,
      destinationType: "city",
      weightGr: totalWeightGr,
      items: items.map(i => ({
        name: i.product.name,
        variant_name: i.product.variants[0]?.name,
        price: typeof i.product.price === 'string' ? parseInt(i.product.price.replace(/[^\d]/g, "") || "0") : i.product.price || 0,
        weight: i.product.weightGr || 1000,
        quantity: i.qty
      }))
    };
  }, [primary, userId, items, totalWeightGr]);

  // Items for API (match structure)
  const shippingItems = useMemo(() => {
    return items.map(i => ({
      name: i.product.name,
      variant: { name: i.product.variants[0]?.name },
      price: typeof i.product.price === 'string' ? parseInt(i.product.price.replace(/[^\d]/g, "") || "0") : i.product.price || 0,
      weight: i.product.weightGr || 1000,
      quantity: i.qty
    }));
  }, [items]);

  const { data: shippingData, loading: shippingLoading } = useShippingQuotes(
    !!shippingParams,
    shippingParams,
    userId,
    shippingItems
  );

  useEffect(() => {
    if (shippingData && !shippingCurrent) {
      const flat = shippingData.groups.flatMap((g) => g.items);
      const cheapest = flat.length
        ? [...flat].sort((a, b) => a.price - b.price)[0]
        : null;
      if (cheapest) setShippingCurrent(cheapest);
    }
  }, [shippingData, shippingCurrent]);

  const [paymentId, setPaymentId] = useState<string>("qris"); // default QRIS

  /* voucher */
  const selectedCount = itemsCount;
  const regionTag = "Jabodetabek";
  const hasPackage = false;

  const [promoVouchers, setPromoVouchers] = useState<Voucher[]>([]);
  const [shippingVouchers, setShippingVouchers] = useState<Voucher[]>([]);

  const [openVoucher, setOpenVoucher] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherSelection>({
    shippingId: null,
    promoId: null,
    code: undefined,
  });
  const [codeVoucher, setCodeVoucher] = useState<Voucher | null>(null);

  // Load vouchers on mount
  useEffect(() => {
    getVouchers().then((res) => {
      if (res.success && res.data) {
        setPromoVouchers(res.data.filter(v => v.type === 'promo'));
        setShippingVouchers(res.data.filter(v => v.type === 'shipping'));
      }
    });
  }, []);

  const ctx = useMemo<CartCtx>(
    () => ({ subtotal, selectedCount, regionTag, hasPackage }),
    [subtotal, selectedCount, regionTag, hasPackage]
  );
  const availableShipping = useMemo(
    () => decorateVouchers(shippingVouchers, ctx),
    [shippingVouchers, ctx]
  );
  const availablePromos = useMemo(
    () => decorateVouchers(promoVouchers, ctx),
    [promoVouchers, ctx]
  );

  async function onRedeemCode(codeUpper: string) {
    const res = await checkVoucherCode(codeUpper, subtotal, items);
    if (res.success && res.voucher) {
      setCodeVoucher(res.voucher);
      return { ok: true as const, voucher: res.voucher };
    }
    return { ok: false as const, reason: res.message || "Kode tidak valid" };
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
      (!selectedVoucher.promoId || selectedVoucher.promoId !== codeVoucher.id);

    return codeIsPromoNotInList
      ? computePromoDiscountFrom(codeVoucher, subtotal)
      : 0;
  }, [selectedVoucher.code, selectedVoucher.promoId, codeVoucher, subtotal]);

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
        {checkoutSession?.orderExpiresAt && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-orange-800 font-medium">Batas Waktu:</span>
            <PaymentTimer expiresAt={checkoutSession.orderExpiresAt} />
          </div>
        )}

        <SellerCartCard
          items={items}
          current={shippingCurrent}
          loading={shippingLoading}
          openShipping={() => setOpenShipping(true)}
          variant="mobile"
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

        <PaymentMethodsMobile selectedId={paymentId} onChange={setPaymentId} />

        <OrderSummaryMobile
          itemsCount={itemsCount}
          subtotal={subtotal}
          shippingFee={shippingFee}
          shippingLoading={shippingLoading}
          shippingDiscount={shippingDiscountCapped}
          promoDiscountList={promoDiscountList}
          promoDiscountCode={promoDiscountCode}
          grandTotal={grandTotal}
          onCheckout={async () => {
            try {
              if (!userId || !shippingCurrent || !primary) {
                alert("Mohon lengkapi alamat dan pengiriman");
                return;
              }

              // 1. Get existing order ID from URL params
              const orderId = searchParams.get('oid');
              if (!orderId) {
                alert("Order tidak ditemukan. Silakan checkout ulang dari cart.");
                return;
              }

              console.log("✅ Using existing order:", orderId);

              // 2. Update order with complete address and shipping info
              const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

              const updatePayload = {
                address_id: primary.id,
                courier: shippingCurrent.courier,
                shipping_service: shippingCurrent.service,
                shipping_cost: shippingAfter, // Net cost after discount
                original_shipping_cost: shippingCurrent.price, // Base price before discount
                discount: promoDiscountList + promoDiscountCode, // Total promo discount
                total_amount: grandTotal
              };

              const updateRes = await fetch(`${API_URL}/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload)
              });

              if (!updateRes.ok) throw new Error("Gagal update order");
              console.log("✅ Order updated with shipping info");

              // 3. Create Payment
              const { createPayment } = await import("@features/payment/services/paymentService");
              const paymentRes = await createPayment(orderId);

              // 4. Redirect to DOKU
              if (paymentRes.payment_url) {
                // Clear order ID from sessionStorage after successful payment creation
                sessionStorage.removeItem('pending_order_id');
                window.location.href = paymentRes.payment_url;
              } else {
                alert("Gagal mendapatkan link pembayaran");
              }

            } catch (e: unknown) {
              if (e instanceof Error) {
                alert(e.message);
              } else {
                alert("Terjadi kesalahan tidak diketahui");
              }
            }
          }}
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


