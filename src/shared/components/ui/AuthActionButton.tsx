"use client";
import { type ReactNode } from "react";

export function AuthActionButton({
  isLoggedIn,
  openAuthModal,
  onClick,
  children,
  className = "",
}: {
  isLoggedIn: boolean;
  openAuthModal: () => void;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={() => (!isLoggedIn ? openAuthModal() : onClick())}
      className={className}
    >
      {children}
    </button>
  );
}
