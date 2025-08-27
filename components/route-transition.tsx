"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.6 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
