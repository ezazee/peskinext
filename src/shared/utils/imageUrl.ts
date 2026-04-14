import { config } from "@shared/config";

/**
 * Normalizes image URLs to ensure they are accessible.
 * - Replacements 'localhost' with '127.0.0.1' to avoid IPv6 issues.
 * - Prefixes relative paths (like /uploads) with the backend base URL.
 */
export function normalizeImageUrl(url?: string): string {
    if (!url) return "";

    let finalUrl = url;

    // Handle relative paths from backend (e.g. /uploads/branding/logo.webp)
    if (url.startsWith("/uploads") || url.startsWith("uploads")) {
        const baseUrl = config.apiUrl.replace("/api/v1", "");
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        finalUrl = `${baseUrl}${cleanPath}`;
    }

    // Replace localhost with 127.0.0.1 to force IPv4
    if (finalUrl.includes("localhost")) {
        return finalUrl.replace("localhost", "127.0.0.1");
    }

    return finalUrl;
}
