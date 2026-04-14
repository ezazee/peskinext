"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveFlashSale } from "@features/home/services/flashSaleService";

export function useFlashSale() {
    return useQuery<any>({
        queryKey: ["active-flash-sale"],
        queryFn: getActiveFlashSale,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}
