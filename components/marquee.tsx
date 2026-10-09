"use client";

import { marqueeItems } from "@/lib/data";
import { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";

/**
 * Infinite horizontal ticker. The track holds two identical copies of the
 * content and translates by exactly -50%, so the loop is seamless.
 * Pauses on hover/focus and is disabled entirely for reduced motion.
 */
export function Marquee({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const reduced = usePrefersReducedMotion();

  const styles =
    tone === "light"
      ? {
          root: "border-y border-[#ECE7DC] bg-[#F6F2E8]",
          text: "text-oliveDark/70",
          dot: "bg-warmGold",
          fade: "from-[#F6F2E8]",
        }
      : {
          root: "border-y border-white/10 bg-[#1C241B]",
          text: "text-[#BCC6B8]",
          dot: "bg-warmGold",
          fade: "from-[#1C241B]",
        };

  const row = (
    <div className="flex shrink-0 items-center">
      {marqueeItems.map((item) => (
        <span key={item} className="flex shrink-0 items-center">
          <span
            className={`px-8 font-serif text-2xl italic sm:text-3xl ${styles.text}`}
          >
            {item}
          </span>
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        </span>
      ))}
    </div>
  );

  if (reduced) {
    return (
      <div className={`overflow-hidden ${styles.root} ${className}`}>
        <div className="flex justify-center py-5">{row}</div>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden ${styles.root} ${className}`}
      aria-hidden="true"
    >
      {/* Feather the edges so items enter and leave softly */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r ${styles.fade} to-transparent`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l ${styles.fade} to-transparent`}
      />

      <div className="marquee-track flex w-max animate-marquee py-5 group-hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}
