"use client";
import { type ReactNode } from "react";

export function AuthActionButton({
  isLoggedIn,
  openAuthModal,
  onClick,
  children,
  className = "",
  disabled,
}: {
  isLoggedIn: boolean;
  openAuthModal: () => void;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => (!isLoggedIn ? openAuthModal() : onClick())}
      className={`${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
