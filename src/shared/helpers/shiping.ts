import type { ShippingDetailData } from "@data/index";

export function getCheapestShipping(data: ShippingDetailData) {
  let minPrice = Infinity,
    eta = "",
    group = "";
  data.groups.forEach((g) =>
    g.items.forEach((it) => {
      if (it.price < minPrice) {
        minPrice = it.price;
        eta = it.eta;
        group = g.label;
      }
    })
  );
  return isFinite(minPrice) ? { price: minPrice, eta, group } : null;
}
