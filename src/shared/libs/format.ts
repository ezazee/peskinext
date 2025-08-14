// Helper: "Rp136.900" -> 136900
export const parseRupiahToNumber = (v?: string) =>
  v ? Number(v.replace(/[^\d]/g, "")) : 0;
