import { config } from "@shared/config";

/**
 * Normalizes image URLs to ensure they are accessible.
 * - Replacements 'localhost' with '127.0.0.1' to avoid IPv6 issues.
 * - Prefixes relative paths (like /uploads) with the backend base URL.
 */
export function normalizeImageUrl(url?: string): string {
    if (!url) return "";

    let finalUrl = url;

    // Force redirect any local/traefik links to the public sslip.io HTTPS address
    if (finalUrl.includes("traefik.me") || finalUrl.includes("localhost") || finalUrl.includes("127.0.0.1")) {
        // Replace the entire origin part with the production Minio URL
        finalUrl = finalUrl.replace(/http:\/\/.*?(traefik\.me|localhost|127\.0\.0\.1)/g, "https://peskin-minio.103.85.59.38.sslip.io");
    }

    // Handle relative paths from backend
    if (url.startsWith("/uploads") || url.startsWith("uploads")) {
        const baseUrl = config.apiUrl.replace("/api/v1", "");
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        finalUrl = `${baseUrl}${cleanPath}`;
    }

    return finalUrl;
}
