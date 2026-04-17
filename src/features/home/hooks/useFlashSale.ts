"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveFlashSale } from "@features/home/services/flashSaleService";

export function useFlashSale() {
    return useQuery({
        queryKey: ["active-flash-sale"],
        queryFn: getActiveFlashSale,
    });
}
