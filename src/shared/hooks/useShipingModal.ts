// File: src/hooks/useShippingModal.ts
"use client";

import type { ShippingOption } from "@shared/types/types";
import { useState } from "react";

export function useShippingModal() {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  const openShippingModal = () => {
    setIsShippingModalOpen(true);
  };

  const closeShippingModal = () => {
    setIsShippingModalOpen(false);
  };

  const selectShipping = (option: ShippingOption) => {
    setSelectedShipping(option);
  };

  return {
    isShippingModalOpen,
    selectedShipping,
    openShippingModal,
    closeShippingModal,
    selectShipping,
  };
}
