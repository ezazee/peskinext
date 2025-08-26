"use client";

export type UserAddress = { cityCode: string; label?: string };

const LS_KEY = "destCityCode";

export async function fetchDefaultAddress(): Promise<UserAddress | null> {
  await new Promise((r) => setTimeout(r, 400));
  if (typeof window !== "undefined") {
    const fromLS = localStorage.getItem(LS_KEY);
    if (fromLS) return { cityCode: fromLS };
  }
  return { cityCode: "SUB" }; // default awal
}

export function saveDefaultAddress(cityCode: string) {
  if (typeof window !== "undefined") localStorage.setItem(LS_KEY, cityCode);
}
