// File: src/features/shared/components/layout/transition/RouteTransition.tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useEffect, useState } from "react";

export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const doAnimate = mounted && isMobile;

  const variants: Variants = {
    hidden: { opacity: 0, x: 100 },
    enter: {
      opacity: 1,
      x: "0%",
      transition: {
        x: { type: "spring", stiffness: 360, damping: 36, mass: 0.9 },
        opacity: { duration: 0.18, ease: "easeOut" },
      },
    },
    exit: {
      opacity: 0,
      x: "-100%",
      transition: {
        x: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
        opacity: { duration: 0.14, ease: "easeIn" },
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial={false}
        animate={doAnimate ? "enter" : undefined}
        exit={doAnimate ? "exit" : undefined}
        style={doAnimate ? undefined : undefined}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
