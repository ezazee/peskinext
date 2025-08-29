"use client";

import { withSkeleton } from "@shared/components/ui/SkeletonLoading";
import CartDesktopSkeleton from "./CartDesktop.skeleton";
import { CartDesktop } from "@features/cart/DesktopCart";

export const CartDesktopWithSkeleton = withSkeleton(CartDesktop, CartDesktopSkeleton);
