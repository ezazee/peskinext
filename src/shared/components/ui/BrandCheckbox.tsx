"use client";
import React from "react";

export function BrandCheckbox({
  checked,
  onChange,
  ariaLabel,
  className = "",
  size = 16,
  color = "#38BDF8",
  fillChecked = "#E6F7FE",
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
  size?: number;
  color?: string;
  fillChecked?: string;
  disabled?: boolean;
}) {
  const boxStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: checked ? color : "#D1D5DB" /* gray-300 */,
    backgroundColor: disabled ? "#F3F4F6" : checked ? fillChecked : "#FFFFFF",
    display: "grid",
    placeItems: "center",
    position: "relative",
    transition: "background-color 150ms, border-color 150ms",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <label className={`inline-flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      {/* input asli untuk a11y */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
      />

      {/* kotak visual */}
      <span style={boxStyle}>
        {checked && (
          <svg
            viewBox="0 0 24 24"
            style={{
              width: Math.max(10, size - 6),
              height: Math.max(10, size - 6),
              display: "block",
            }}
            fill="none"
            stroke={disabled ? "#9CA3AF" : color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
    </label>
  );
}
