"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { pillars, restaurantLocations } from "@/lib/data";
import {
  iconMap,
  PinIcon,
  ClockIcon,
  PhoneIcon,
  ArrowRightIcon,
  NavigationIcon,
} from "@/components/icons";
import { EASE_EDITORIAL, usePrefersReducedMotion } from "@/components/motion-primitives";

export function Pillars() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="about"
      className="grain relative border-b border-[#ECE7DC] bg-[#FAF7F0] py-16 lg:py-24 scroll-mt-20"
    >
      <span id="pillars" aria-hidden="true" className="absolute -top-24 pointer-events-none" />
      <div className="shell space-y-16 lg:space-y-20">
        {/* About Section Header */}
        <motion.div
          className="mx-auto max-w-3xl text-center space-y-4"
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: EASE_EDITORIAL }}
        >
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-warmGold" />
            <span className="eyebrow !text-warmGold">About Gibran &amp; Co.</span>
            <span className="h-px w-8 bg-warmGold" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-oliveDark">
            A Heritage of Taste, Hospitality &amp; Soul
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-base font-light leading-relaxed text-oliveMuted/90 tracking-wide">
            Rooted in the rich culinary artistry of the Levant, Gibran &amp; Co. gathers
            market-fresh ingredients, ancestral recipes, and thoughtful design into an
            unhurried dining experience across our iconic regional houses.
          </p>
        </motion.div>

        {/* 4 Brand Pillars Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8"
          initial={reduced ? undefined : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={{ once: true, margin: "-70px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon];
            return (
              <motion.article
                key={pillar.title}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.85, ease: EASE_EDITORIAL },
                  },
                }}
                whileHover={reduced ? undefined : { y: -6 }}
                className="group flex flex-col items-center rounded-2xl border border-[#ECE7DC]/60 bg-[#F6F2E8]/70 p-5 text-center transition-all duration-500 hover:border-warmGold/40 hover:bg-[#F2ECE0] hover:shadow-sm"
              >
                <div className="relative mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#EAE4D5] text-oliveDark">
                  {/* Ring that draws itself in on hover */}
                  <span className="absolute inset-0 rounded-full border border-warmGold/0 transition-colors duration-500 group-hover:border-warmGold/60" />
                  <Icon className="relative h-5 w-5 transition-transform duration-700 ease-editorial group-hover:rotate-[18deg] group-hover:scale-110" />
                </div>

                <h4 className="font-serif text-lg font-semibold text-oliveDark">
                  {pillar.title}
                </h4>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-oliveMuted">
                  {pillar.caption}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Locations Section Showcase */}
        <div className="pt-6 border-t border-[#ECE7DC]/70">
          <motion.div
            className="mx-auto mb-10 max-w-2xl text-center space-y-3"
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
          >
            <div className="inline-flex items-center justify-center gap-2 text-oliveDark">
              <PinIcon className="h-4 w-4 text-warmGold" />
              <span className="eyebrow !text-oliveDark">Our Locations</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-oliveDark">
              Visit Us in Bahrain, Abu Dhabi &amp; Beirut
            </h3>

            <p className="text-xs sm:text-sm font-light text-oliveMuted leading-relaxed">
              Each destination captures our signature Levantine warmth, paired with
              distinctive architectural elegance tailored to its city.
            </p>
          </motion.div>

          {/* 3 Location Cards */}
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
            initial={reduced ? undefined : "hidden"}
            whileInView={reduced ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {restaurantLocations.map((loc) => (
              <motion.article
                key={loc.id}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: EASE_EDITORIAL },
                  },
                }}
                whileHover={reduced ? undefined : { y: -5 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ECE7DC] bg-white/80 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(28,36,27,0.05)] backdrop-blur-sm transition-all duration-500 hover:border-warmGold/60 hover:bg-white hover:shadow-[0_12px_32px_-8px_rgba(43,51,41,0.12)]"
              >
                {/* Top decorative accent */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-warmGold/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div>
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8A9A86] block">
                        {loc.country}
                      </span>
                      <h4 className="font-serif text-2xl lg:text-3xl font-semibold text-oliveDark mt-0.5">
                        {loc.city}
                      </h4>
                      <p className="text-xs font-medium text-warmGold tracking-wide mt-0.5">
                        {loc.district}
                      </p>
                    </div>

                    {loc.badge && (
                      <span className="rounded-full border border-warmGold/30 bg-[#FAF7F0] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-oliveDark shrink-0">
                        {loc.badge}
                      </span>
                    )}
                  </div>

                  {/* Location Meta Details */}
                  <div className="space-y-3.5 border-t border-[#ECE7DC]/60 pt-4 text-xs text-oliveMuted">
                    <div className="flex items-start gap-2.5">
                      <PinIcon className="h-4 w-4 shrink-0 text-warmGold mt-0.5" />
                      <span className="leading-snug text-oliveDark/90">
                        {loc.address}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <ClockIcon className="h-4 w-4 shrink-0 text-warmGold" />
                      <span className="text-oliveDark/80">{loc.hours}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <PhoneIcon className="h-4 w-4 shrink-0 text-warmGold" />
                      <a
                        href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                        className="font-medium text-oliveDark hover:text-warmGold transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-5 border-t border-[#ECE7DC]/60 flex items-center justify-between gap-3">
                  <Link
                    href={`/reservation?location=${encodeURIComponent(loc.city)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-oliveDark px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#6d7835] hover:shadow-sm"
                  >
                    <span>Reserve</span>
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>

                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-oliveMuted hover:text-oliveDark transition-colors group/link"
                  >
                    <span>Directions</span>
                    <NavigationIcon className="h-3 w-3 text-warmGold transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
