"use client";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

type LoaderModule<P extends object> = { default: ComponentType<P> };
type Loader<P extends object> = () => Promise<LoaderModule<P> | ComponentType<P>>;

export interface OnViewProps<P extends object> {
  load: Loader<P>;
  props: P;
  fallback?: ReactNode;
  rootMargin?: string;          // default '300px'
  once?: boolean;               // default true
  minHeight?: number | string;  // cegah layout shift
}

export function OnView<P extends object>({
  load,
  props,
  fallback = null,
  rootMargin = "300px",
  once = true,
  minHeight,
}: OnViewProps<P>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [Comp, setComp] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    if (!ref.current || visible) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin, once, visible]);

  useEffect(() => {
    let cancelled = false;
    if (visible && !Comp) {
      (async () => {
        const mod = await load();
        const C = (typeof mod === "function" ? mod : mod.default) as ComponentType<P>;
        if (!cancelled) setComp(() => C);
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [visible, Comp, load]);

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {Comp ? <Comp {...props} /> : fallback}
    </div>
  );
}
