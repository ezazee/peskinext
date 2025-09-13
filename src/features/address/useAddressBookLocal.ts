// File: src/features/address/useAddressBookLocal.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AddressItem, AddressListEntry } from "@shared/types/types";
import { addressBook as seedAddresses } from "@data/address";

const LS_KEY = "addr_book_v1";
const BUS = "addrbook:changed";
const DATA_VERSION = 2; // ← bump: paksa re-seed dari daftar yang kamu kasih

type State = { addresses: AddressItem[]; primaryId: string | null };
type Persisted = { v: number; state: State };

type BusPayload = { state: State; eid: number };

function coerceSeed(): State {
  const primaryFromSeed = seedAddresses.find((a) => a.isPrimary)?.id ?? seedAddresses[0]?.id ?? null;
  const normalized = seedAddresses.map((a) => ({ ...a, isPrimary: a.id === primaryFromSeed }));
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
  const base: State = input && Array.isArray(input.addresses) ? input : coerceSeed();
  const addrs = base.addresses.filter(isAddressItem);
  const primaryId =
    base.primaryId && addrs.some((a) => a.id === base.primaryId)
      ? base.primaryId
      : addrs[0]?.id ?? null;
  const normalized = addrs.map((a) => ({ ...a, isPrimary: a.id === primaryId }));
  return { addresses: normalized, primaryId };
}

function readFromLS(): State {
  try {
    if (typeof window === "undefined") return coerceSeed();
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return coerceSeed();
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || typeof parsed.v !== "number" || parsed.v !== DATA_VERSION) {
      // versi beda → re-seed dengan data terbaru
      return coerceSeed();
    }
    return sanitize(parsed.state);
  } catch {
    return coerceSeed();
  }
}

function writeToLS(state: State) {
  try {
    const payload: Persisted = { v: DATA_VERSION, state: sanitize(state) };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch { /* ignore */ }
}

// Emit setelah commit
let EID = 0;
function scheduleEmit(payload: BusPayload) {
  setTimeout(() => {
    try {
      window.dispatchEvent(new CustomEvent<BusPayload>(BUS, { detail: payload }));
    } catch { /* ignore */ }
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

  // persist & broadcast post-commit
  useEffect(() => {
    writeToLS(state);
    if (suppressNextEmitRef.current) {
      suppressNextEmitRef.current = false;
      return;
    }
    const eid = ++EID;
    scheduleEmit({ state, eid });
  }, [state]);

  // sync antar-tab & intra-tab
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== LS_KEY) return;
      setState(readFromLS());
    }
    function onBus(e: Event) {
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
    return state.addresses.find((a) => a.id === id) ?? state.addresses[0] ?? null;
  }, [state]);

  const listEntries = useMemo<ReadonlyArray<AddressListEntry>>(
    () => state.addresses.map(toListEntry),
    [state.addresses]
  );

  function updateState(mutate: (prev: State) => State) {
    setState((prev) => sanitize(mutate(prev)));
  }

  function selectPrimary(id: string) {
    updateState((prev) => {
      if (!prev.addresses.some((a) => a.id === id)) return prev;
      const addresses = prev.addresses.map((a) => ({ ...a, isPrimary: a.id === id }));
      return { addresses, primaryId: id };
    });
  }

  // Biarkan ada, tapi kamu nggak usah pakai untuk mock ini
  function addAddress(_input: Omit<AddressItem, "id" | "isPrimary">, _makePrimary = false) {
    // sengaja dikosongin untuk mock ini
  }

  function resetToSeed() {
    setState(coerceSeed());
  }

  return {
    primary,
    addresses: state.addresses,
    listEntries,
    selectPrimary,
    addAddress,   // tidak dipakai di UI mock
    resetToSeed,  // berguna kalau mau paksa balik ke seed
  };
}
