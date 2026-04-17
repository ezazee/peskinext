"use client";

import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@features/home/services/bannerService";
import type { BannersResponse } from "@shared/types/types";

export function useBanners() {
    return useQuery<BannersResponse>({
        queryKey: ["banners"],
        queryFn: getBanners,
    });
}
