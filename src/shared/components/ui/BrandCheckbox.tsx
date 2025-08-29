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
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
  size?: number;
  color?: string;
  fillChecked?: string;
}) {
  const boxStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: checked ? color : "#D1D5DB" /* gray-300 */,
    backgroundColor: checked ? fillChecked : "#FFFFFF",
    display: "grid",
    placeItems: "center",
    position: "relative",
    transition: "background-color 150ms, border-color 150ms",
  };

  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      {/* input asli untuk a11y */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
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
            stroke={color}
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
