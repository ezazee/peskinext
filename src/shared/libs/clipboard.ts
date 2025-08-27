// src/shared/libs/clipboard.ts

/** Salin teks ke clipboard dengan fallback untuk http/local dev */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* lanjut ke fallback */
  }

  // Fallback untuk environment non-secure / izin clipboard ditolak
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Bangun URL absolut produk dari slug */
export function buildProductUrl(slug: string): string {
  const path = `/product/${slug}`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  // fallback saat server-side render
  return `https://peskinpro.id${path}`;
}

/** Util utama: salin link produk ke clipboard */
export async function copyProductLink(slug: string): Promise<boolean> {
  const url = buildProductUrl(slug);
  return copyText(url);
}
