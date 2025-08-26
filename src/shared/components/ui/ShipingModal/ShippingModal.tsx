"use client";

import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import type { ShippingQueryParams } from "@features/shiping/api/fetchQuotes";
import ShippingModalDesktopContainer from "./desktop/ShippingModalDesktopContainer";
import ShippingModalMobileContainer from "./mobile/ShippingModalMobileContainer";

type Props = {
  open: boolean;
  params?: ShippingQueryParams | null;
  initialData?: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModal({
  open,
  params,
  initialData,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <ShippingModalDesktopContainer
      open={open}
      params={params}
      initialData={initialData}
      selectedId={selectedId}
      onSelect={onSelect}
      onClose={onClose}
    />
  ) : (
    <ShippingModalMobileContainer
      open={open}
      params={params}
      initialData={initialData}
      selectedId={selectedId}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
