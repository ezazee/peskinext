"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService } from "./settingsService";
import type { GeneralSettings } from "@features/settings/settingsService";

/**
 * Hook to get general settings with caching
 */
export function useSettings() {
    return useQuery<GeneralSettings>({
        queryKey: ["settings"],
        queryFn: () => settingsService.getSettings(),
    });
}
