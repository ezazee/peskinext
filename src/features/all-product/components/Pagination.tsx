"use client";

import * as React from "react";

type Props = {
  current: number; // halaman saat ini (1-based)
  total: number; // total halaman
  onPageChange: (page: number) => void;
  className?: string;
};

function PageBtn({
  active,
  disabled,
  children,
  onClick,
  ariaLabel,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[
        "min-w-8 h-8 rounded-md px-2 text-sm cursor-pointer font-medium transition-colors",
        active
          ? "bg-primary text-white"
          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Pagination({
  current,
  total,
  onPageChange,
  className,
}: Props) {
  if (total <= 1) return null;

  // window halaman sederhana: 1 ... (curr-1,curr,curr+1) ... total
  const pages: Array<number | "dots"> = [];
  const push = (v: number | "dots") => pages.push(v);

  const addRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) push(i);
  };

  push(1);
  if (current > 3) push("dots");
  addRange(Math.max(2, current - 1), Math.min(total - 1, current + 1));
  if (current < total - 2) push("dots");
  if (total > 1) push(total);

  return (
    <nav
      className={[
        "mt-6 flex items-center justify-center gap-2",
        className ?? "",
      ].join(" ")}
      aria-label="Pagination"
    >
      <PageBtn
        ariaLabel="Previous page"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
      >
        Prev
      </PageBtn>

      {pages.map((p, idx) =>
        p === "dots" ? (
          <span key={`d${idx}`} className="px-2 text-slate-400 select-none">
            …
          </span>
        ) : (
          <PageBtn
            key={p}
            active={p === current}
            onClick={() => onPageChange(p)}
            ariaLabel={`Go to page ${p}`}
          >
            {p}
          </PageBtn>
        )
      )}

      <PageBtn
        ariaLabel="Next page"
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
      >
        Next
      </PageBtn>
    </nav>
  );
}
