/**
 * Normalizes image URLs to ensure they are accessible.
 * Specifically replaces 'localhost' with '127.0.0.1' to avoid IPv6 resolution issues (::1)
 * when the backend is listening on IPv4 (127.0.0.1).
 */
export function normalizeImageUrl(url?: string): string {
    if (!url) return "";

    // Replace localhost with 127.0.0.1 to force IPv4
    if (url.includes("localhost")) {
        return url.replace("localhost", "127.0.0.1");
    }

    return url;
}
