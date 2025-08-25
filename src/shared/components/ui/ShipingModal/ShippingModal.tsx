"use client";

import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import ShippingModalMobile from "./ShippingModalMobile";
import ShippingModalDesktop from "./ShippingModalDesktop";

type Props = {
  open: boolean;
  data: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModal(props: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <ShippingModalDesktop {...props} />
  ) : (
    <ShippingModalMobile {...props} />
  );
}
