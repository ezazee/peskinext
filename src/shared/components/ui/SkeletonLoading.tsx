import * as React from "react";

type Size = number | string;

function toCssSize(v?: Size) {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

export type SkeletonProps = {
  /** width & height: contoh 120, "100%", "2rem" */
  width?: Size;
  height?: Size;
  /** border radius: contoh 8, "9999px" */
  radius?: Size;
  /** aktifkan shimmer (default true) */
  shimmer?: boolean;
  /** className tambahan */
  className?: string;
  /** ARIA label (untuk screen reader), default "Memuat..." */
  ariaLabel?: string;
  /** render sebagai element lain */
  as?: keyof React.JSX.IntrinsicElements;
  /** inline-block? default block */
  inline?: boolean;
  /** children opsional (jarang diperlukan) */
  children?: React.ReactNode;
};

export function Skeleton({
  width,
  height,
  radius,
  shimmer = true,
  className = "",
  ariaLabel = "Memuat...",
  as: Tag = "div",
  inline = false,
  children,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: toCssSize(width) ?? (inline ? undefined : "100%"),
    height: toCssSize(height) ?? (inline ? undefined : "1rem"),
    borderRadius: toCssSize(radius),
  };

  return (
    <Tag
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
      className={[
        "skeleton-base",
        shimmer ? "skeleton-shimmer" : "animate-pulse",
        inline ? "inline-block" : "block",
        "rounded", // default rounded
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ---------- Variants ---------- */

type TextProps = {
  lines?: number;
  gap?: Size;
  lineHeight?: Size;
  /** contoh: [100, "90%", "70%"] utk kontrol lebar masing2 line */
  widths?: Size[];
  /** kalau true dan widths tidak diset, line terakhir disingkat ~60% */
  trimLast?: boolean;
  className?: string;
  shimmer?: boolean;
};

Skeleton.Text = function Text({
  lines = 3,
  gap = 8,
  lineHeight = 16,
  widths,
  trimLast = true,
  className = "",
  shimmer,
}: TextProps) {
  const arr = Array.from({ length: Math.max(1, lines) });
  return (
    <div
      className={className}
      style={{ display: "grid", rowGap: toCssSize(gap) }}
    >
      {arr.map((_, i) => {
        const isLast = i === arr.length - 1;
        const w = widths?.[i] ?? (trimLast && isLast ? "60%" : "100%");
        return (
          <Skeleton
            key={i}
            width={w}
            height={lineHeight}
            shimmer={shimmer}
            className="rounded"
          />
        );
      })}
    </div>
  );
};

type CircleProps = Omit<SkeletonProps, "radius" | "height" | "width"> & {
  size?: Size;
};

Skeleton.Circle = function Circle({
  size = 32,
  shimmer,
  className = "",
}: CircleProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      radius="9999px"
      shimmer={shimmer}
      className={className}
      inline
    />
  );
};

type BlockProps = Omit<SkeletonProps, "radius"> & { radius?: Size };
Skeleton.Block = function Block({ radius = 8, ...rest }: BlockProps) {
  return <Skeleton radius={radius} {...rest} />;
};

type ListProps = {
  /** render skeleton item */
  renderItem: (i: number) => React.ReactNode;
  count?: number;
  gap?: Size;
  className?: string;
};
Skeleton.List = function List({
  renderItem,
  count = 6,
  gap = 16,
  className = "",
}: ListProps) {
  return (
    <div
      className={className}
      style={{ display: "grid", rowGap: toCssSize(gap) }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderItem(i)}</React.Fragment>
      ))}
    </div>
  );
};

/* ---------- HOC: withSkeleton ---------- */
/** Bungkus komponen agar punya state loading konsisten di seluruh app */
export function withSkeleton<P>(
  Component: React.ComponentType<P>,
  SkeletonFallback: React.ComponentType | React.FC
) {
  return function Wrapped(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props as P & { loading?: boolean };
    if (loading) return <SkeletonFallback />;
    // @ts-expect-error rest tanpa loading
    return <Component {...(rest as P)} />;
  };
}
