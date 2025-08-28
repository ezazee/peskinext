// src/shared/utils/lazyOnView.tsx
"use client";
import type { ComponentType, ReactNode } from "react";
import { OnView, type OnViewProps } from "./OnView";

export interface LazyOptions {
  fallback?: ReactNode;
  rootMargin?: string;
  once?: boolean;
  minHeight?: number | string;
}

export function lazyOnView<P extends object>(
  load: OnViewProps<P>["load"],
  options?: LazyOptions
): ComponentType<P> {
  const { fallback, rootMargin, once, minHeight } = options ?? {};
  const Comp = (props: P) => (
    <OnView<P>
      load={load}
      props={props}
      fallback={fallback ?? <div className="animate-pulse bg-gray-100 w-full" style={{ minHeight }} />}
      rootMargin={rootMargin ?? "400px"}
      once={once ?? true}
      minHeight={minHeight ?? 240}
    />
  );
  Comp.displayName = "LazyOnView";
  return Comp as ComponentType<P>;
}

/** Lazy untuk modul yang mengekspor **named export** */
export function lazyOnViewNamed<P extends object, N extends string>(
  importer: () => Promise<{ default?: ComponentType<P> } & { [K in N]?: ComponentType<P> }>,
  name: N,
  options?: LazyOptions
): ComponentType<P> {
  return lazyOnView<P>(
    () =>
      importer().then((mod) => {
        const picked = mod.default ?? mod[name];
        if (!picked) throw new Error(`Component '${name}' not found in module`);
        return picked;
      }),
    options
  );
}
