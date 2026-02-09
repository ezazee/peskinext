"use client";

import React, { type JSX } from "react";
import type { UserTransaction } from "@shared/types/types";

import TransactionListDesktop from "@features/transaction/desktop/TransactionListDesktop";
import TransactionListMobile from "@features/transaction/mobile/TransactionListMobile";
import TransactionSkeletonDesktop from "@features/transaction/skeleton/TransactionSkeletonDesktop";
import TransactionSkeletonMobile from "@features/transaction/skeleton/TransactionSkeletonMobile";

import TransactionFiltersMobile, {
  type DateFilter as MobileDateFilter,
} from "@features/transaction/mobile/TransactionFiltersMobile";

import TransactionFiltersDesktop, {
  type DateFilter as DesktopDateFilter,
} from "@features/transaction/desktop/TransactionFiltersDesktop";
import type { TxFilter } from "@features/transaction/TransactionFilters";

type DateFilter = MobileDateFilter | DesktopDateFilter;

export default function TransactionPageClient({ userId }: { userId: string }): JSX.Element {
  const [transactions, setTransactions] = React.useState<UserTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) {
      console.warn("TransactionPageClient: userId is missing/empty");
      return;
    }
    console.log(`TransactionPageClient: Fetching orders for user ${userId} from ${process.env.NEXT_PUBLIC_API_URL}`);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${userId}`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Orders data received:", data);
        if (Array.isArray(data)) {
          console.log(`Found ${data.length} orders`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: UserTransaction[] = data.map((order: any) => ({
            id: order.id,
            invoiceNumber: `INV/${new Date(order.created_at).toISOString().slice(0, 10).replace(/-/g, "")}/${order.id.split("-")[0].toUpperCase()}`,
            dateISO: order.created_at,
            status: order.status,
            total: parseFloat(order.total_amount),
            shippingCost: parseFloat(order.shipping_cost || 0),
            discount: parseFloat(order.discount || 0),
            addressId: order.address_id,
            courier: order.courier,
            trackingNumber: order.tracking_number,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: (order.items || []).map((item: any) => {
              const product = item.Product || item.product || {};
              return {
                product: {
                  id: product.id || "unknown",
                  name: product.name || "Unknown Product",
                  slug: product.slug || "",
                  img: product.front_image || product.img || "/placeholder.jpg",
                  type: product.type || "single",
                  weightGr: product.weight_gr || product.weightGr || 0
                },
                quantity: item.quantity,
                unitPrice: parseFloat(item.price),
                subtotal: item.quantity * parseFloat(item.price),
                variantId: item.variant_id
              };
            })
          }));
          console.log("Mapped transactions:", mapped);
          setTransactions(mapped);
        } else {
          console.warn("Data is not an array:", data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        console.error("Error details:", err.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  /* ====== State filters ====== */
  // shared status (desktop & mobile)
  const [status, setStatus] = React.useState<TxFilter>("all");
  // shared
  const [product, setProduct] = React.useState<string | "all">("all");
  const [search, setSearch] = React.useState<string>("");
  const [date, setDate] = React.useState<DateFilter>({ kind: "all" });

  const applyDateFilter = React.useCallback(
    (list: ReadonlyArray<UserTransaction>): ReadonlyArray<UserTransaction> => {
      if (date.kind === "all") return list;

      if (date.kind === "last") {
        const now = new Date();
        const from = new Date(now);
        from.setDate(now.getDate() - date.days);
        return list.filter((t) => {
          const d = new Date(t.dateISO);
          return d >= from && d <= now;
        });
      }

      const from = new Date(date.from);
      const to = new Date(date.to);
      return list.filter((t) => {
        const d = new Date(t.dateISO);
        return d >= from && d <= to;
      });
    },
    [date]
  );

  const filtered = React.useMemo<ReadonlyArray<UserTransaction>>(() => {
    let base: ReadonlyArray<UserTransaction> = transactions;

    // 1) status (shared)
    if (status !== "all") {
      base = base.filter((t) => t.status === status);
    }

    // 2) product category (single/bundle)
    if (product !== "all") {
      base = base.filter((t) =>
        t.items.some((it) => it.product.type === product)
      );
    }

    // 3) search
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.items.some((it) => it.product.name.toLowerCase().includes(q))
      );
    }

    // 4) date
    base = applyDateFilter(base);

    return base;
  }, [transactions, status, product, search, applyDateFilter]);

  function handleReset(): void {
    setStatus("all");
    setProduct("all");
    setSearch("");
    setDate({ kind: "all" });
  }

  /* ====== Filtering Effect ====== */
  const [filtering, setFiltering] = React.useState(false);

  React.useEffect(() => {
    setFiltering(true);
    const timer = setTimeout(() => setFiltering(false), 500);
    return () => clearTimeout(timer);
  }, [status, product, search, date]);

  return (
    <div className="w-full">
      {/* MOBILE Filter (pills + bottom-sheets) */}
      <div className="mb-3 block md:hidden">
        <TransactionFiltersMobile
          status={status}
          onStatusChange={setStatus}
          product={product}
          onProductChange={setProduct}
          date={date}
          onDateChange={setDate}
        />
      </div>

      <main className="p-0">
        {/* DESKTOP Filter */}
        <div className="hidden md:block">
          <TransactionFiltersDesktop
            product={product}
            onProductChange={setProduct}
            search={search}
            onSearchChange={setSearch}
            date={date}
            onDateChange={setDate}
            status={status}
            onStatusChange={setStatus}
            onReset={handleReset}
          />
        </div>

        {/* LIST */}
        <div className="hidden md:block">
          {loading || filtering ? (
            <TransactionSkeletonDesktop />
          ) : (
            <TransactionListDesktop data={[...filtered]} />
          )}
        </div>
        <div className="block md:hidden">
          {loading || filtering ? (
            <TransactionSkeletonMobile />
          ) : (
            <TransactionListMobile data={[...filtered]} />
          )}
        </div>
      </main>
    </div>
  );
}
