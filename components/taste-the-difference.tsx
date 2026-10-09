"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { menuCategories } from "@/lib/data";
import { Parallax, ScrollReveal } from "@/components/parallax";
import { EASE_EDITORIAL, SplitText, usePrefersReducedMotion } from "@/components/motion-primitives";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";

export function TasteTheDifference() {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const category = menuCategories[active];

  return (
    <section id="menu" className="grain relative bg-[#F4EFE6] py-24 lg:py-28">
      <div className="shell">
        {/* Split hero */}
        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
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

            <h2 className="font-serif text-4xl font-normal leading-tight text-oliveDark sm:text-5xl lg:text-6xl">
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
                href="/menu"
                id="view-full-menu-button"
                className="btn-ink group"
              >
                View Full Menu
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </div>

          {/* Plate image with parallax */}
          <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
            <ScrollReveal className="group relative w-full max-w-lg lg:max-w-xl">
              <Parallax speed={90} scale={1.16} className="arch rounded-2xl drop-shadow-md">
                <Image
                  src="/images/pea-soup.png"
                  alt="Artisanal ceramic bowl of velvety green pea and herb soup with cream swirl, pumpkin seeds and microgreens"
                  width={1024}
                  height={1058}
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                />
              </Parallax>

              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.9 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_EDITORIAL }}
                className="absolute -bottom-4 -left-4 z-10 flex items-center gap-2 whitespace-nowrap rounded-full border border-[#ECE7DC] bg-white/95 px-6 py-2.5 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4"
              >
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-oliveDark" />
                <span className="font-script text-xl tracking-wide text-oliveDark sm:text-2xl">
                  Fresh • Seasonal • Local
                </span>
              </motion.div>
            </ScrollReveal>
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
                className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
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
                      className={`relative flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                        isActive
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
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {i === 0 && <PlusIcon className="h-4 w-4" />}
                        {item.label}
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

                    <ul className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2">
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
                          className="group flex items-baseline gap-3 border-b border-dashed border-[#DCD5C6] py-3.5"
                        >
                          <span className="font-serif text-base text-oliveDark transition-colors duration-300 group-hover:text-warmGold">
                            {item.name}
                          </span>
                          <span className="h-px flex-1 translate-y-[-3px] bg-[#DCD5C6]" />
                          <span className="shrink-0 text-[11px] uppercase tracking-wider text-oliveMuted">
                            {item.note}
                          </span>
                          <span className="shrink-0 font-serif text-lg font-bold text-oliveDark">
                            ${item.price}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom link to separate /menu page */}
                <div className="mt-12 flex justify-center">
                  <Link
                    href="/menu"
                    className="btn-ink group text-xs"
                  >
                    View Full Menu
                    <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
      </div>
    </section>
  );
}
