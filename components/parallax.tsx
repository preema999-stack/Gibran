"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";

type ParallaxProps = {
  children: React.ReactNode;
  /** Total vertical travel in px while the section crosses the viewport. */
  speed?: number;
  className?: string;
  /** Over-scale so the parallax travel never exposes an image edge. */
  scale?: number;
  scrub?: number;
};

/**
 * GSAP ScrollTrigger parallax. Adds depth the flat CDN markup could not have.
 */
export function Parallax({
  children,
  speed = 120,
  className = "",
  scale = 1.15,
  scrub = 1,
}: ParallaxProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !wrapper.current || !inner.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: 0, scale },
        {
          yPercent: (speed / 2 / 100) * 100,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper.current,
            start: "top bottom",
            end: "bottom top",
            scrub,
            invalidateOnRefresh: true,
          },
        }
      );
    }, wrapper);

    return () => ctx.revert();
  }, [speed, scale, scrub, reduced]);

  return (
    <div ref={wrapper} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/**
 * Scroll-linked scale + rotate settle — used for editorial image cards.
 */
export function ScrollReveal({
  children,
  className = "",
  rotate = -1.5,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: 0.93, opacity: 0, rotate, y: 40 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced, rotate]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
