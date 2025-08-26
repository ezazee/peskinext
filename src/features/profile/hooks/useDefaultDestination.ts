"use client";
import { useEffect, useState } from "react";
import type { UserAddress } from "../api/fetchDefaultAddress";
import { fetchDefaultAddress, saveDefaultAddress } from "../api/fetchDefaultAddress";

export function useDefaultDestination() {
  const [destination, setDestination] = useState<UserAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const addr = await fetchDefaultAddress();
      if (alive) { setDestination(addr); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const updateDestination = (cityCode: string) => {
    setDestination({ cityCode });
    saveDefaultAddress(cityCode);
  };

  return { destination, loading, updateDestination };
}
