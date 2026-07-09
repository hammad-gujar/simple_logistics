"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Reduced-motion note: these components intentionally do NOT branch on
 * useReducedMotion() — that produces different SSR and first-client renders
 * (hydration mismatch) for users with reduced motion enabled. Instead the
 * markup is deterministic and a `prefers-reduced-motion` CSS override in
 * globals.css pins [data-motion-reveal] elements to their visible state.
 */

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Slide distance in px; set 0 for a pure fade. */
  y?: number;
}

/** Fade-and-rise once the element enters the viewport. */
export function Reveal({ children, delay = 0, className, y = 28 }: RevealProps) {
  return (
    <motion.div
      data-motion-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div data-motion-reveal className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
