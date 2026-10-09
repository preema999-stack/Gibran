"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { usePrefersReducedMotion, useSmoothScroll } from "@/components/smooth-scroll-provider";
import { EASE_EDITORIAL, Magnetic, SplitText } from "@/components/motion-primitives";
import { ArrowRightIcon } from "@/components/icons";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  // Background drifts slower than the page → depth.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={section}
      id="hero"
      className="grain relative overflow-hidden border-b border-[#ECE7DC] bg-[#FAF7F0]"
    >
      <div className="relative flex min-h-[560px] items-center overflow-hidden sm:min-h-[600px] lg:min-h-[660px] xl:min-h-[720px] 2xl:min-h-[780px]">
        {/* Background image */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 select-none"
          style={reduced ? undefined : { y: bgY, scale: bgScale }}
        >
          <Image
            src="/images/heroimage2.png"
            alt="Luxury Mediterranean dining room with grand arched windows and olive trees"
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgb(250,247,240) 0%, rgba(250,247,240,0.95) 24%, rgba(250,247,240,0.6) 42%, rgba(250,247,240,0.15) 58%, transparent 72%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-20"
            style={{
              background:
                "linear-gradient(to top, rgb(250,247,240) 0%, rgba(250,247,240,0.25) 40%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          className="relative z-10 w-full"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <div className="shell py-14 sm:py-16 lg:py-24 2xl:py-28">
            <div className="max-w-xl space-y-6 lg:space-y-7">
              <motion.span
                className="eyebrow !tracking-[0.25em] !font-medium"
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_EDITORIAL, delay: 0.15 }}
              >
                Good Food • Good Vibes • Great Company
              </motion.span>

              <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-tight text-oliveDark sm:text-6xl lg:text-[72px]">
                <SplitText text="More Than" as="span" delay={0.25} immediate />
                <br />
                <SplitText
                  text="Just a Meal"
                  as="span"
                  delay={0.4}
                  immediate
                  wordClassName="italic font-light"
                />
              </h1>

              <motion.p
                className="max-w-md text-sm font-light leading-relaxed tracking-wide text-oliveMuted/90 sm:text-base"
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.75 }}
              >
                Gibran &amp; Co. is a place where beautiful food, thoughtful design
                and warm hospitality come together to create unforgettable moments.
              </motion.p>

              <motion.div
                className="pt-2"
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.9 }}
              >
                <Magnetic strength={0.24}>
                  <button
                    type="button"
                    onClick={() => scrollTo("#about", -88)}
                    className="btn-ink group"
                  >
                    Discover Our Story
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
                  </button>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Handwritten accent */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: 24 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE_EDITORIAL, delay: 1.1 }}
          className="pointer-events-none absolute bottom-8 right-8 z-10 hidden select-none text-right md:block lg:right-16"
        >
          <span className="block font-script text-3xl leading-tight text-white/95 drop-shadow-md sm:text-4xl lg:text-5xl">
            Unwind,
            <br />
            Relax,
            <br />
            Repeat
          </span>
        </motion.div>
      </div>
    </section>
  );
}
