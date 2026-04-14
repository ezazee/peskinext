"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService, GeneralSettings } from "./settingsService";

/**
 * Hook to get general settings with caching
 */
export function useSettings() {
    return useQuery<GeneralSettings>({
        queryKey: ["general-settings"],
        queryFn: () => settingsService.getSettings(),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}
