// File: src/features/address/addressSwitchBus.ts
"use client";

import { useEffect, useState } from "react";

const EVT = "addrbook:switching";

type Payload = { on: boolean };

export function startAddressSwitch(durationMs = 700) {
  // trigger on
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent<Payload>(EVT, { detail: { on: true } })
    );
  }, 0);
  // turn off after duration
  window.setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent<Payload>(EVT, { detail: { on: false } })
    );
  }, durationMs);
}

export function useAddressSwitching() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Payload>;
      setOn(!!ce.detail?.on);
    };
    window.addEventListener(EVT, handler as EventListener);
    return () => window.removeEventListener(EVT, handler as EventListener);
  }, []);
  return on;
}
