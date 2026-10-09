"use client";

import { motion, useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

import { journeySlides } from "@/lib/data";
import { JourneyPlate } from "@/components/journey-plate";
import { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";
import { EASE_EDITORIAL, Magnetic } from "@/components/motion-primitives";
import { ArrowRightIcon, PlayIcon } from "@/components/icons";

/** Scroll length allotted to each slide, on top of the pinned viewport. */
const SCROLL_PER_SLIDE_VH = 62;

export function Journey() {
  const section = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const count = journeySlides.length;

  // Pinned range: progress 0 when the section top meets the viewport top,
  // 1 when the section bottom meets the viewport bottom.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const active = useActiveSlide(scrollYProgress, count);

  return (
    <section
      ref={section}
      id="culinary-journey"
      className="relative border-b border-white/10 bg-[#181D17] text-white"
      style={{ height: `${count * SCROLL_PER_SLIDE_VH + 100}vh` }}
    >
      {/* Pinned viewport. `overflow-hidden` lives here, never on an ancestor
          of a sticky element, or the pin silently fails. */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Plate + its scrims. The scrims MUST stay nested inside the plate:
            `lg:w-1/2` then means half the plate (half of 3/5), so the footage
            dissolves into the ground exactly at the plate's left edge. As a
            sibling of the plate it would measure against the viewport instead,
            leaving an unscrimmed band where the plate still shows. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full origin-right lg:w-3/5"
        >
          <JourneyPlate className="z-0" />

          <div className="absolute inset-0 z-10 w-full bg-gradient-to-r from-[#181D17] via-[#181D17]/85 to-transparent lg:w-1/2" />
          {/* `inset-x-0 bottom-0`, not `inset-0 … bottom-0`: with top, height
              and bottom all set, `bottom` is ignored and the fade would sit at
              the top of the plate. */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 h-28"
            style={{
              background:
                "linear-gradient(to top, #181D17 0%, rgba(24,29,23,0.4) 45%, transparent 100%)",
            }}
          />
        </div>

        {/* Header clearance, then centre the copy in what remains. */}
        <div className="relative z-10 flex h-full items-center pb-10 pt-[var(--header-h)]">
          <div className="shell w-full">
            <div className="max-w-xl space-y-6 lg:space-y-7">
              {/* Copy block — all slides share one grid cell so swapping
                  never shifts the layout. */}
              <div className="grid">
                {journeySlides.map((slide, i) => (
                  <Slide
                    key={slide.line1 + slide.line2}
                    slide={slide}
                    active={i === active}
                    reduced={reduced}
                  />
                ))}
              </div>

              {/* Actions stay put across slides, as in the original design. */}
              <div className="flex flex-wrap items-center gap-6 pt-3">
                <Magnetic strength={0.2}>
                  <Link
                    href="/gallery"
                    className="btn-paper group"
                  >
                    Explore Gallery
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
                  </Link>
                </Magnetic>

                <button
                  type="button"
                  className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#FAF8F5]/80 transition-colors hover:text-warmGold"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 pl-0.5 backdrop-blur-md transition-all duration-500 ease-editorial group-hover:scale-110 group-hover:border-warmGold/60">
                    <PlayIcon className="h-3 w-3" />
                  </span>
                  Watch Story
                </button>
              </div>

              <JourneyIndicator
                active={active}
                count={count}
                label={journeySlides[active].label}
                progress={scrollYProgress}
                reduced={reduced}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Slide — masked rise on the way in, masked fall on the way out.
 * The masked element is the direct motion child so variants propagate
 * to it; the plain span inside only carries typography.
 * ------------------------------------------------------------------ */
function Slide({
  slide,
  active,
  reduced,
}: {
  slide: (typeof journeySlides)[number];
  active: boolean;
  reduced: boolean;
}) {
  if (reduced) {
    // No scrubbing, no motion: show the opening slide only.
    return active ? (
      <div className="[grid-area:1/1]">
        <SlideCopy slide={slide} />
      </div>
    ) : null;
  }

  return (
    <motion.div
      className="[grid-area:1/1]"
      // Mount hidden so the opening slide rises in on load; `initial={false}`
      // would skip straight to the target state and lose the entrance.
      initial="hidden"
      animate={active ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
      }}
      aria-hidden={!active}
      {...(!active ? { inert: true as const } : {})}
    >
      <SlideCopy slide={slide} />
    </motion.div>
  );
}

function SlideCopy({ slide }: { slide: (typeof journeySlides)[number] }) {
  return (
    <>
      <MaskLine>
        <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-warmGold">
          <span className="inline-block h-px w-8 bg-warmGold" />
          {slide.eyebrow}
        </span>
      </MaskLine>

      <h2 className="font-serif text-4xl font-normal leading-[1.08] tracking-tight text-[#FAF8F5] sm:text-5xl lg:text-[62px]">
        <MaskLine>
          <span className="block">{slide.line1}</span>
        </MaskLine>
        <MaskLine>
          <span className="block italic font-light text-warmGold">{slide.line2}</span>
        </MaskLine>
      </h2>

      <motion.p
        className="max-w-lg text-sm font-light leading-relaxed tracking-wide text-[#BCC6B8] sm:text-base"
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: EASE_EDITORIAL },
          },
        }}
      >
        {slide.body}
      </motion.p>
    </>
  );
}

/** Overflow-hidden line whose content rises into view on variant change. */
function MaskLine({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="block overflow-hidden"
      variants={{
        hidden: { y: "115%", opacity: 0 },
        show: {
          y: "0%",
          opacity: 1,
          transition: { duration: 0.85, ease: EASE_EDITORIAL },
        },
      }}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ *
 * Indicator — same layout as before, now driven by the active slide.
 * ------------------------------------------------------------------ */
function JourneyIndicator({
  active,
  count,
  label,
  progress,
  reduced,
}: {
  active: number;
  count: number;
  label: string;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  return (
    <div className="mt-4 flex items-center gap-8 border-t border-white/10 pt-8 text-xs text-[#9FA89D]">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-warmGold">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-8 bg-white/20" />
        <span className="text-white/40">{String(count).padStart(2, "0")}</span>
      </div>

      <motion.span
        key={label}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
        className="inline-flex items-center gap-2"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-warmGold" />
        <span className="text-[11px] uppercase tracking-wider text-[#B5BFB2]">
          {label}
        </span>
      </motion.span>

      {/* Scroll-linked hairline */}
      <div className="ml-auto hidden h-px w-32 bg-white/15 sm:block">
        <motion.div
          className="h-full origin-left bg-warmGold"
          style={reduced ? { scaleX: 1 } : { scaleX: progress }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Which slide is in view, derived from scroll progress.
 * ------------------------------------------------------------------ */
function useActiveSlide(progress: MotionValue<number>, count: number) {
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(value * count)));
    setActive((current) => (current === next ? current : next));
  });

  return active;
}
