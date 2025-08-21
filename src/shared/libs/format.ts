// Helper: "Rp136.900" -> 136900
export const parseRupiahToNumber = (v?: string) =>
  v ? Number(v.replace(/[^\d]/g, "")) : 0;


export const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
}
