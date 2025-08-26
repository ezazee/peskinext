export function discountPercent(oldPrice?: number, price?: number) {
  if (!oldPrice || !price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
