"use client";

import { withSkeleton } from "@shared/components/ui/SkeletonLoading";
import CartDesktopSkeleton from "./CartDesktop.skeleton";
import { CartDesktop } from "@features/cart/desktop/CartDesktop";

export const CartDesktopWithSkeleton = withSkeleton(CartDesktop, CartDesktopSkeleton);
