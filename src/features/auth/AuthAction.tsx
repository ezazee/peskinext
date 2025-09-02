"use client";

import type { ReactNode, MouseEvent, JSX } from "react";
import { useRouter } from "next/navigation";

type AuthActionProps = {
  isLoggedIn: boolean;
  /** Nama baru yang lebih generic */
  onRequireAuth?: () => void;
  /** Alias lama untuk kompatibilitas */
  openAuthModal?: () => void;
  href?: string;
  onAuthedClick?: (e: MouseEvent) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  as?: keyof JSX.IntrinsicElements;
};

export function AuthAction({
  isLoggedIn,
  onRequireAuth,
  openAuthModal,
  href,
  onAuthedClick,
  children,
  className,
  disabled,
  as: As = "div",
}: AuthActionProps) {
  const router = useRouter();

  // pakai yang ada: onRequireAuth > openAuthModal
  const requireAuth = onRequireAuth ?? openAuthModal ?? (() => {});

  const handleClick = (e: MouseEvent) => {
    if (disabled) return;

    if (!isLoggedIn) {
      e.preventDefault();
      requireAuth();
      return;
    }

    if (onAuthedClick) {
      onAuthedClick(e);
      return;
    }

    if (href) router.push(href);
  };

  return (
    <As onClick={handleClick} className={className} aria-disabled={disabled}>
      {children}
    </As>
  );
}
