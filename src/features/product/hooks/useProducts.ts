"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/types/types";

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });
}
