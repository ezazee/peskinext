// src/features/address/useAddressBookLocal.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AddressItem, AddressListEntry } from "@shared/types/types";
import { addressBook as seedAddresses } from "@data/address";

const LS_KEY = "addr_book_v1";
const BUS = "addrbook:changed";
const DATA_VERSION = 2;

type State = { addresses: AddressItem[]; primaryId: string | null };
type Persisted = { v: number; state: State };
type BusPayload = { state: State; eid: number };

function coerceSeed(): State {
  const primaryFromSeed =
    seedAddresses.find((a) => a.isPrimary)?.id ?? seedAddresses[0]?.id ?? null;
  const normalized = seedAddresses.map((a) => ({
    ...a,
    isPrimary: a.id === primaryFromSeed,
  }));
  return { addresses: normalized, primaryId: primaryFromSeed };
}

function isAddressItem(a: unknown): a is AddressItem {
  if (typeof a !== "object" || a === null) return false;
  const o = a as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.label === "string" &&
    typeof o.recipient === "string" &&
    typeof o.phone === "string" &&
    typeof o.line1 === "string" &&
    typeof o.city === "string" &&
    typeof o.province === "string" &&
    typeof o.postalCode === "string" &&
    typeof o.isPrimary === "boolean"
  );
}

function sanitize(input: State | null | undefined): State {
  const base: State =
    input && Array.isArray(input.addresses) ? input : coerceSeed();
  const addrs = base.addresses.filter(isAddressItem);
  const primaryId =
    base.primaryId && addrs.some((a) => a.id === base.primaryId)
      ? base.primaryId
      : addrs[0]?.id ?? null;
  const normalized = addrs.map((a) => ({
    ...a,
    isPrimary: a.id === primaryId,
  }));
  return { addresses: normalized, primaryId };
}

function readFromLS(): State {
  try {
    if (typeof window === "undefined") return coerceSeed();
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return coerceSeed();
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || typeof parsed.v !== "number" || parsed.v !== DATA_VERSION)
      return coerceSeed();
    return sanitize(parsed.state);
  } catch {
    return coerceSeed();
  }
}

function writeToLS(state: State): void {
  try {
    const payload: Persisted = { v: DATA_VERSION, state: sanitize(state) };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

// --- event bus kecil ---
let EID = 0;
function scheduleEmit(payload: BusPayload): void {
  setTimeout(() => {
    try {
      window.dispatchEvent(
        new CustomEvent<BusPayload>(BUS, { detail: payload })
      );
    } catch {
      /* ignore */
    }
  }, 0);
}

function toListEntry(a: AddressItem): AddressListEntry {
  return {
    id: a.id,
    label: a.label,
    address: `${a.line1}, ${a.city}, ${a.province} ${a.postalCode}`,
    isPrimary: a.isPrimary,
  };
}

export function useAddressBookLocal() {
  const [state, setState] = useState<State>(() => readFromLS());

  const suppressNextEmitRef = useRef(false);
  const lastEidRef = useRef(0);

  useEffect(() => {
    writeToLS(state);
    if (suppressNextEmitRef.current) {
      suppressNextEmitRef.current = false;
      return;
    }
    const eid = ++EID;
    scheduleEmit({ state, eid });
  }, [state]);

  useEffect(() => {
    function onStorage(e: StorageEvent): void {
      if (e.key !== LS_KEY) return;
      setState(readFromLS());
    }
    function onBus(e: Event): void {
      const ce = e as CustomEvent<BusPayload>;
      const detail = ce.detail;
      if (!detail) return;
      if (detail.eid <= lastEidRef.current) return;
      lastEidRef.current = detail.eid;
      suppressNextEmitRef.current = true;
      setState(sanitize(detail.state));
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener(BUS, onBus as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(BUS, onBus as EventListener);
    };
  }, []);

  const primary = useMemo<AddressItem | null>(() => {
    const id = state.primaryId;
    return (
      state.addresses.find((a) => a.id === id) ?? state.addresses[0] ?? null
    );
  }, [state]);

  const listEntries = useMemo<ReadonlyArray<AddressListEntry>>(
    () => state.addresses.map(toListEntry),
    [state.addresses]
  );

  function updateState(mutate: (prev: State) => State): void {
    setState((prev) => sanitize(mutate(prev)));
  }

  function selectPrimary(id: string): void {
    updateState((prev) => {
      if (!prev.addresses.some((a) => a.id === id)) return prev;
      const addresses = prev.addresses.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }));
      return { addresses, primaryId: id };
    });
  }

  // === CRUD ===

  // CREATE: terima AddressItem penuh (dari form create)
  function addAddress(input: AddressItem, makePrimary = false): void {
    updateState((prev) => {
      const willPrimary =
        makePrimary || input.isPrimary || prev.primaryId === null;
      const nextPrimaryId = willPrimary ? input.id : prev.primaryId;

      const normalizedExisting = willPrimary
        ? prev.addresses.map((a) => ({ ...a, isPrimary: false }))
        : prev.addresses;

      const newItem: AddressItem = { ...input, isPrimary: willPrimary };

      return {
        addresses: [...normalizedExisting, newItem],
        primaryId: nextPrimaryId,
      };
    });
  }

  // UPDATE: patch sebagian field; jika isPrimary -> set primary
  function updateAddress(
    id: string,
    patch: Partial<Omit<AddressItem, "id">>
  ): void {
    updateState((prev) => {
      if (!prev.addresses.some((a) => a.id === id)) return prev;

      const willPrimary = patch.isPrimary === true;
      const nextAddresses = prev.addresses.map((a) =>
        a.id === id
          ? { ...a, ...patch, isPrimary: willPrimary ? true : a.isPrimary }
          : a
      );

      const finalAddresses = willPrimary
        ? nextAddresses.map((a) =>
            a.id === id ? a : { ...a, isPrimary: false }
          )
        : nextAddresses;

      const nextPrimaryId = willPrimary ? id : prev.primaryId;

      return { addresses: finalAddresses, primaryId: nextPrimaryId };
    });
  }

  // DELETE
  function removeAddress(id: string): void {
    updateState((prev) => {
      const remaining = prev.addresses.filter((a) => a.id !== id);
      if (remaining.length === 0) return { addresses: [], primaryId: null };

      // jika yang dihapus adalah primary -> set yang pertama jadi primary
      const removedWasPrimary = prev.primaryId === id;
      const nextPrimaryId = removedWasPrimary
        ? remaining[0].id
        : prev.primaryId;

      const normalized = remaining.map((a) => ({
        ...a,
        isPrimary: a.id === nextPrimaryId,
      }));
      return { addresses: normalized, primaryId: nextPrimaryId };
    });
  }

  function resetToSeed(): void {
    setState(coerceSeed());
  }

  return {
    primary,
    addresses: state.addresses,
    listEntries,
    selectPrimary,
    addAddress,
    updateAddress, // <-- sekarang tersedia
    removeAddress, // <-- jika butuh hapus di halaman edit
    resetToSeed,
  };
}
