// Parser nominal rupiah yang robust: "Rp 15.000", "150rb", "15 ribu", "15k", "1jt", "1 juta"
export function parseRupiahFlexible(text?: string): number {
  if (!text) return 0;
  const s = text.replace(/\s+/g, " ").trim().toLowerCase();

  // "rp 150rb" / "rp150.000" / "150rb" / "150.000"
  let m = s.match(/(?:rp)?\s*([\d.]+)\s*(rb|ribu|k|jt|juta)?/i);
  if (m) {
    const base = parseInt(m[1].replace(/\./g, ""), 10) || 0;
    const suf = (m[2] || "").toLowerCase();
    if (suf === "rb" || suf === "ribu" || suf === "k") return base * 1_000;
    if (suf === "jt" || suf === "juta") return base * 1_000_000;
    return base;
  }

  // “25rb” / “1jt” tanpa "rp" di depan
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m) {
    const n = parseInt(m[1], 10) || 0;
    const suf = m[2].toLowerCase();
    return suf === "rb" || suf === "ribu" || suf === "k"
      ? n * 1_000
      : n * 1_000_000;
  }
  return 0;
}
