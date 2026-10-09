"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline brass progress bar pinned to the very top of the viewport.
 * Driven by Framer Motion's `useScroll` so it stays in step with Lenis.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-oliveDark via-sageGreen to-warmGold"
    />
  );
}
