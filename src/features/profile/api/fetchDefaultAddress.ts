"use client";

export type UserAddress = { cityCode: string; label?: string };

const LS_KEY = "destCityCode";

export async function fetchDefaultAddress(): Promise<UserAddress | null> {
  await new Promise((r) => setTimeout(r, 400));
  if (typeof window !== "undefined") {
    try {
      const fromLS = localStorage.getItem(LS_KEY);
      if (fromLS) return { cityCode: fromLS };
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }
  return { cityCode: "SUB" }; // default awal
}

export function saveDefaultAddress(cityCode: string) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LS_KEY, cityCode);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }
}
