"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

// Re-exported so animation components can pull every motion hook from one place.
export { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";

/* ------------------------------------------------------------------ *
 * Shared easing — matches the original .3s cubic-bezier(0.16, 1, 0.3, 1)
 * ------------------------------------------------------------------ */
export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_EDITORIAL },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

export const staggerParent = (stagger = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/* ------------------------------------------------------------------ *
 * Reveal — fades + lifts its children in on scroll
 * ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  as?: ElementType;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.9,
  once = true,
  as = "div",
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px 0px -80px 0px" }}
      transition={{ duration, delay, ease: EASE_EDITORIAL }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ *
 * SplitText — word-by-word rise out of a clipped mask
 * ------------------------------------------------------------------ */
type SplitTextProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  once?: boolean;
  /**
   * Animate on mount instead of on scroll-into-view. Required for
   * above-the-fold copy: it is already on screen at load, so a
   * scroll-triggered observer can never be relied on to reveal it.
   */
  immediate?: boolean;
};

export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  as = "span",
  once = true,
  immediate = false,
}: SplitTextProps) {
  const reduced = usePrefersReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  if (reduced) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className={wordClassName}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  const revealed = { y: "0%", opacity: 1, rotate: 0 };
  const hidden = { y: "110%", opacity: 0, rotate: 2 };

  const wordVariants = {
    hidden,
    show: revealed,
  };

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        // The scroll trigger MUST live on the unclipped mask, never on the
        // word itself: the word starts pushed fully outside this
        // `overflow-hidden` box, and IntersectionObserver accounts for
        // clipping ancestors — so an inner trigger reports "not visible"
        // forever and the reveal never runs.
        <motion.span
          // eslint-disable-next-line react/no-array-index-key -- words repeat by design
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          initial="hidden"
          {...(immediate
            ? { animate: "show" }
            : { whileInView: "show", viewport: { once, amount: 0.2 } })}
        >
          <motion.span
            className={`inline-block ${wordClassName ?? ""}`}
            variants={wordVariants}
            transition={{
              duration: 1,
              delay: delay + i * stagger,
              ease: EASE_EDITORIAL,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Magnetic — element drifts toward the cursor (desktop pointers only)
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const el = event.currentTarget;
        el.style.transition = "none";
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      }}
      onPointerLeave={(event) => {
        const el = event.currentTarget;
        // Ease back to rest only on exit so the follow stays 1:1 while moving.
        el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "translate3d(0, 0, 0)";
      }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
