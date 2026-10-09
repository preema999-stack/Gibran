"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { EASE_EDITORIAL, SplitText, usePrefersReducedMotion } from "@/components/motion-primitives";
import { PlayIcon } from "@/components/icons";

const counterStats = [
  { value: 12, suffix: "", label: "Years of Service" },
  { value: 40, suffix: "+", label: "Seasonal Dishes" },
  { value: 18, suffix: "", label: "Cellar Wines" },
];

export function MoodSection() {
  const section = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.3]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["22%", "-22%"]);

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-[#131912] py-24 text-white lg:py-28"
    >
      {/* Candlelit background with depth */}
      <motion.div
        className="absolute inset-0 select-none"
        style={reduced ? undefined : { y: bgY, scale: bgScale }}
      >
        <Image
          src="/images/candlelight.jpg"
          alt="Romantic ambient candlelight dinner table setting"
          fill
          sizes="100vw"
          className="h-full w-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #131912 0%, rgba(19,25,18,0.72) 45%, rgba(19,25,18,0.9) 100%)",
          }}
        />
      </motion.div>

      <div className="relative z-10">
        <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <motion.span
              className="block text-xs font-semibold uppercase tracking-[0.28em] text-[#A8B7A4]"
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            >
              Fine Dining Reimagined
            </motion.span>

            <h2 className="font-serif text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">
              <SplitText text="Immerse Yourself in an" as="span" />
              <br />
              <SplitText
                text="Atmosphere"
                as="span"
                delay={0.2}
                wordClassName="italic text-[#E8ECE6]"
              />{" "}
              <SplitText text="of Elegance" as="span" delay={0.3} />
            </h2>

            <motion.p
              className="max-w-lg text-sm font-light leading-relaxed text-[#B5BFB2] sm:text-base"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.45 }}
            >
              Immerse yourself in a world of rich flavors, tailored wine pairings,
              and impeccable service. Welcome to the sanctuary of Gibran &amp; Co.
            </motion.p>

            <motion.div
              className="pt-2"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.6 }}
            >
              <button type="button" className="btn-ghost group">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white pl-0.5 text-oliveDark transition-transform duration-500 ease-editorial group-hover:scale-110">
                  <PlayIcon className="h-3 w-3" />
                </span>
                Watch Our Story
              </button>
            </motion.div>

            {/* Animated stat counters */}
            <motion.dl
              className="grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } },
              }}
            >
              {counterStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease: EASE_EDITORIAL },
                    },
                  }}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-serif text-3xl text-warmGold sm:text-4xl">
                      <Counter to={stat.value} reduced={reduced} />
                      {stat.suffix}
                    </span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-[#9FA89D]">
                      {stat.label}
                    </span>
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>

          {/* Floating quote card — drifts against the scroll */}
          <motion.div
            className="flex flex-col items-center text-center lg:col-span-5 lg:items-end lg:text-right"
            style={reduced ? undefined : { y: cardY }}
          >
            <motion.div
              initial={reduced ? undefined : { opacity: 0, scale: 0.9, y: 40 }}
              whileInView={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: EASE_EDITORIAL }}
              whileHover={reduced ? undefined : { scale: 1.02 }}
              className="glass-dark w-full max-w-md rounded-2xl p-8"
            >
              <p className="font-script text-4xl text-warmGold sm:text-5xl">
                Good Food, Happy People
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#9FA89D]">
                Unforgettable Evenings • Curated Wines
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Counts up to `to` the first time it scrolls into view.
 * Reduced-motion users get the final value immediately.
 */
function Counter({ to, reduced }: { to: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;

    let frame = 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to]);

  return <span ref={ref}>{value}</span>;
}
