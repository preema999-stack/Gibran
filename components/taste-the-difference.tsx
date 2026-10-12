"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { menuCategories } from "@/lib/data";
import { EASE_EDITORIAL, SplitText, usePrefersReducedMotion } from "@/components/motion-primitives";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";

export function TasteTheDifference() {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const category = menuCategories[active];

  return (
    <section id="menu" className="grain relative w-full max-w-full overflow-hidden bg-[#F4EFE6] py-16 sm:py-20 lg:py-28">
      <div className="shell">
        {/* Split hero */}
        <div className="mb-12 sm:mb-16 grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <motion.span
              className="eyebrow !font-semibold"
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            >
              Our Menu
            </motion.span>

            <h2 className="font-serif text-3xl font-normal leading-tight text-oliveDark sm:text-5xl lg:text-6xl">
              <SplitText text="Taste" as="span" />
              <br />
              <SplitText
                text="The Difference"
                as="span"
                delay={0.15}
                wordClassName="italic"
              />
            </h2>

            <motion.p
              className="max-w-lg text-sm font-light leading-relaxed text-oliveMuted sm:text-base"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.4 }}
            >
              From freshly sourced ingredients to international gourmet flavors,
              our menu is crafted to delight every palate with precision and soul.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 pt-2"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.55 }}
            >
              <Link
                href={`/menu?category=${category.id}`}
                id="view-full-menu-button"
                className="btn-ink group"
              >
                View Full Menu
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
              </Link>
              <a
                href="#signature"
                id="view-signature-dishes-button"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("signature");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="group inline-flex items-center gap-2 rounded-full border border-oliveDark/20 bg-white/70 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-oliveDark transition-all duration-300 hover:border-oliveDark hover:bg-white hover:shadow-xs"
              >
                <span>Signature Dishes</span>
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>

          {/* Artisanal Soup Bowl Showcase */}
          <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
              className="relative w-full max-w-lg select-none"
            >
              {/* Perfectly fitted two-layer bowl: 1. Rotating soup underneath; 2. Ceramic rim overlay on top */}
              <div className="relative aspect-[491/508] w-full">
                {/* 1. Soup liquid rotating clockwise smoothly inside the bowl cavity */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    left: "49.49%",
                    top: "50.20%",
                    width: "53.77%",
                    height: "51.97%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="soup-swirl-motion h-full w-full"
                    style={{
                      animation: "soupClockwise 36s linear infinite",
                      WebkitAnimation: "soupClockwise 36s linear infinite",
                      transformOrigin: "50% 50%",
                      WebkitTransformOrigin: "50% 50%",
                    }}
                  >
                    <Image
                      src="/images/soup_liquid.png"
                      alt="Velvety green pea and herb soup swirling gently"
                      width={264}
                      height={264}
                      priority
                      className="h-full w-full object-contain pointer-events-none"
                    />
                  </div>
                </div>

                {/* 2. Pristine ceramic bowl rim overlay with spoon, olive leaves, and herbs layered in front */}
                <Image
                  src="/images/bowl_rim_overlay.png"
                  alt="Artisanal ceramic bowl of velvety green pea and herb soup with cream swirl, pumpkin seeds and microgreens"
                  width={491}
                  height={508}
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  priority
                  className="relative z-10 h-full w-full object-contain pointer-events-none select-none"
                />
              </div>

              {/* Fresh • Seasonal • Local Badge */}
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.9 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_EDITORIAL }}
                className="absolute -bottom-2 left-2 z-20 flex max-w-[calc(100%-1rem)] items-center gap-2 whitespace-nowrap rounded-full border border-[#ECE7DC] bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-6 sm:py-2.5"
              >
                <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-oliveDark" />
                <span className="font-script text-base sm:text-2xl tracking-wide text-oliveDark truncate">
                  Fresh • Seasonal • Local
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Compact preview tabs */}
        <motion.div
          key="compact-menu-tabs"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
        >
          {/* Category tabs */}
          <div
            className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6"
            role="tablist"
            aria-label="Menu categories"
          >
            {menuCategories.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setActive(i)}
                  className={`relative flex items-center justify-center gap-1 sm:gap-2 rounded-xl px-1.5 py-2 sm:px-3 sm:py-3 text-[10px] sm:text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isActive
                    ? "text-white shadow-sm"
                    : "border border-[#E4DECF] bg-white/80 text-oliveDark hover:bg-white"
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="menu-tab-pill"
                      className="absolute inset-0 rounded-xl bg-[#6d7835]"
                      transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-center">
                    {i === 0 && <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />}
                    <span className="truncate sm:overflow-visible">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab panel — real content, swapped with AnimatePresence */}
          <div className="mx-auto mt-10 max-w-4xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={category.id}
                role="tabpanel"
                id={`panel-${category.id}`}
                aria-labelledby={`tab-${category.id}`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
              >
                <motion.p
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6 text-center text-sm font-light italic text-oliveMuted"
                >
                  {category.intro}
                </motion.p>

                <ul className="grid grid-cols-1 gap-x-12 gap-y-2 lg:grid-cols-2">
                  {category.items.map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.12 + i * 0.07,
                        ease: EASE_EDITORIAL,
                      }}
                      className="group border-b border-dashed border-[#DCD5C6] py-3.5 sm:py-4"
                    >
                      {/* Heading Row: Dish name on left, hairline leader, price on right */}
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-lg sm:text-xl font-normal text-oliveDark transition-colors duration-300 group-hover:text-warmGold min-w-0">
                          {item.name}
                        </h3>
                        <span className="h-px flex-1 translate-y-[-3px] bg-[#DCD5C6] min-w-[12px]" />
                        <span className="shrink-0 font-serif text-lg sm:text-xl font-bold text-oliveDark">
                          ${item.price}
                        </span>
                      </div>
                      {/* Ingredients directly under the heading */}
                      <p className="mt-1 text-xs uppercase tracking-wider text-oliveMuted leading-relaxed">
                        {item.note}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Bottom link to separate /menu page */}
            <div className="mt-12 flex justify-center">
              <Link
                href={`/menu?category=${category.id}`}
                id="view-full-menu-bottom-button"
                className="btn-ink group text-xs"
              >
                View {category.label}
                <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
