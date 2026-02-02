"use client";

import React, { type JSX } from "react";
import AccountSidebar from "@features/account/AccountSidebar";
// import { transactionsMock } from "@data/transaction";
import type { UserTransaction } from "@shared/types/types";
const transactionsMock: UserTransaction[] = [];
import { getCurrentUser } from "@features/auth/action";

import TransactionListDesktop from "@features/transaction/desktop/TransactionListDesktop";
import TransactionListMobile from "@features/transaction/mobile/TransactionListMobile";
import TransactionSkeletonDesktop from "@features/transaction/skeleton/TransactionSkeletonDesktop";
import TransactionSkeletonMobile from "@features/transaction/skeleton/TransactionSkeletonMobile";

import TransactionFiltersMobile, {
  type DateFilter as MobileDateFilter,
} from "@features/transaction/mobile/TransactionFiltersMobile";

import TransactionFiltersDesktop, {
  type StatusGroup,
  type DateFilter as DesktopDateFilter,
} from "@features/transaction/desktop/TransactionFiltersDesktop";
import type { TxFilter } from "@features/transaction/TransactionFilters";

type DateFilter = MobileDateFilter | DesktopDateFilter;

export default function TransactionPageClient(): JSX.Element {
  const [profile, setProfile] = React.useState<{
    name: string;
    email: string;
    avatarUrl: string;
  }>({
    name: "Guest",
    email: "",
    avatarUrl: "/images/avatar/default-avatar.png",
  });

  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);

    // Fetch user profile
    async function loadProfile() {
      const user = await getCurrentUser();
      if (user) {
        setProfile({
          name: user.name,
          email: user.email || "",
          avatarUrl: "/images/avatar/default-avatar.png",
        });
      }
    }

    loadProfile();
  }, []);

  /* ====== State filters ====== */
  // desktop pills group
  const [group, setGroup] = React.useState<StatusGroup>("all");
  // mobile exact status
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
    // 1) group (desktop)
    let base: ReadonlyArray<UserTransaction> = transactionsMock;
    if (group !== "all") {
      const allow: ReadonlyArray<TxFilter> =
        group === "progress"
          ? ["pending", "paid", "shipped"]
          : group === "success"
            ? ["delivered"]
            : ["cancelled"]; // failed
      base = base.filter((t) => allow.includes(t.status));
    }

    // 2) exact status (mobile)
    if (status !== "all") {
      base = base.filter((t) => t.status === status);
    }

    // 3) product
    if (product !== "all") {
      base = base.filter((t) =>
        t.items.some((it) => it.product.name === product)
      );
    }

    // 4) search
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.items.some((it) => it.product.name.toLowerCase().includes(q))
      );
    }

    // 5) date
    base = applyDateFilter(base);
    return base;
  }, [group, status, product, search, applyDateFilter]);

  function handleReset(): void {
    setGroup("all");
    setStatus("all");
    setProduct("all");
    setSearch("");
    setDate({ kind: "all" });
  }

  return (
    <div className="container mx-auto px-3 md:px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] items-start gap-4 md:gap-6">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block">
          <AccountSidebar
            profile={{
              name: profile.name,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
            }}
            active="transaction"
          />
        </div>

        <main className="p-0">
          {/* DESKTOP Filter */}
          <div className="hidden md:block">
            <TransactionFiltersDesktop
              data={transactionsMock}
              product={product}
              onProductChange={setProduct}
              search={search}
              onSearchChange={setSearch}
              date={date}
              onDateChange={setDate}
              group={group}
              onGroupChange={setGroup}
              onReset={handleReset}
            />
          </div>

          {/* MOBILE Filter (pills + bottom-sheets) */}
          <div className="mb-3 block md:hidden">
            <TransactionFiltersMobile
              data={transactionsMock}
              status={status}
              onStatusChange={setStatus}
              product={product}
              onProductChange={setProduct}
              date={date}
              onDateChange={setDate}
            />
          </div>

          {/* LIST */}
          <div className="hidden md:block">
            {!hydrated ? (
              <TransactionSkeletonDesktop />
            ) : (
              <TransactionListDesktop data={[...filtered]} />
            )}
          </div>
          <div className="block md:hidden">
            {!hydrated ? (
              <TransactionSkeletonMobile />
            ) : (
              <TransactionListMobile data={[...filtered]} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
