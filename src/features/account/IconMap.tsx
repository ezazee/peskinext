"use client";

import { MapPin, ReceiptText, LogOut } from "lucide-react";
import type { IconName } from "@shared/types/types";

export function IconByName({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const size = 18;
  switch (name) {
    case "address":
      return <MapPin size={size} className={className} />;
    case "orderHistory":
      return <ReceiptText size={size} className={className} />;
    case "logout":
      return <LogOut size={size} className={className} />;
  }
}
