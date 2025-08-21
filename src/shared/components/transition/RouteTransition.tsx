// File: src/features/shared/components/layout/transition/RouteTransition.tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";

export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Varian animasi slide
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
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? "-100%" : "100%", // forward: ke kiri, back: ke kanan
      transition: {
        x: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
        opacity: { duration: 0.14, ease: "easeIn" },
      },
    }),
  };

  // Jika bukan mobile, jangan gunakan transisi
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
