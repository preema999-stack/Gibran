"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { OliveBranchBotanical } from "@/components/olive-branch-botanical";
import { EASE_EDITORIAL, usePrefersReducedMotion } from "@/components/motion-primitives";
import { pillars, restaurantLocations } from "@/lib/data";
import {
  iconMap,
  PinIcon,
  ClockIcon,
  PhoneIcon,
  ArrowRightIcon,
  NavigationIcon,
} from "@/components/icons";

export function AboutView() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-[#FAF7F0] text-oliveDark">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER WITH CASCADING BOTANICAL OLIVE BRANCH DRAPE
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[58vh] sm:min-h-[64vh] lg:min-h-[72vh] w-full overflow-hidden bg-[#182317] text-[#FAF7F0] flex flex-col justify-center">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/reservation-dining.jpg"
            alt="Gibran & Co. architectural dining hall"
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center opacity-45 brightness-75 transition-transform duration-1000 scale-105"
          />
          {/* Moody olive gradient veil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172316] via-[#172316]/85 to-[#172316]/50" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#182317] via-transparent to-[#182317]/60" />
        </div>

        {/* BOTTOM-LEFT ACCENT BRANCH */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-4 -left-4 z-10 select-none opacity-80 sm:bottom-8 sm:left-2 lg:bottom-12 lg:left-4"
        >
          <OliveBranchBotanical variant={1} className="h-44 w-44 sm:h-56 sm:w-56 lg:h-64 lg:w-64" />
        </motion.div>

        {/* CASCADING BOTANICAL OLIVE BRANCH DRAPE (Matching natural ceiling garland) */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0], rotate: [8, 9.5, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="pointer-events-none absolute -top-2 right-[2%] z-10 select-none opacity-95 sm:-top-3 sm:right-[6%] md:-top-4 md:right-[10%] lg:-top-5 lg:right-[13%] xl:-top-6 xl:right-[15%]"
        >
          <OliveBranchBotanical
            variant="drape"
            className="h-64 w-52 sm:h-80 sm:w-64 md:h-[400px] md:w-[320px] lg:h-[480px] lg:w-[380px] xl:h-[540px] xl:w-[420px]"
          />
        </motion.div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-warmGold" />
              <span className="text-xs uppercase tracking-[0.25em] text-warmGold font-medium">
                Our Story &amp; Heritage
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-[#FAF7F0]">
              A Sanctuary of <br />
              <span className="italic font-light text-warmGold">Levantine Soul</span> &amp; Artistry
            </h1>

            <p className="text-sm sm:text-base lg:text-lg font-light leading-relaxed text-[#FAF7F0]/85 tracking-wide max-w-xl">
              Rooted in ancestral Mediterranean traditions, Gibran &amp; Co. is a poetic tribute to
              market-fresh harvests, age-old recipes, and the timeless warmth of Levantine hospitality.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 rounded-full bg-warmGold px-6 py-3 text-xs uppercase tracking-wider text-forestDark font-medium transition-all duration-300 hover:bg-[#E5C178] hover:shadow-lg hover:shadow-warmGold/20"
              >
                Book a Table
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs uppercase tracking-wider text-[#FAF7F0] transition-colors duration-300 hover:border-warmGold hover:text-warmGold"
              >
                Explore Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PHILOSOPHY & BOTANICAL INSPIRATION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Narrative Column */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: EASE_EDITORIAL }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-warmGold" />
              <span className="eyebrow !text-warmGold">The Olive Grove Philosophy</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-oliveDark">
              Honoring the Ancient Olive Trees of the Mediterranean
            </h2>

            <p className="text-sm sm:text-base font-light leading-relaxed text-oliveMuted/95 tracking-wide">
              For generations, the olive branch has symbolized peace, friendship, and enduring abundance.
              At Gibran &amp; Co., every dish begins with the fruit of ancient groves — cold-pressed extra
              virgin oils, hand-harvested wild za&apos;atar, and aromatic herbs cultivated under the sunlit
              terroir of the Levant.
            </p>

            <p className="text-sm sm:text-base font-light leading-relaxed text-oliveMuted/95 tracking-wide">
              From our slow-fermented hearth breads to our sand-brewed cardamom coffees, our tables are
              curated to bring friends and families together in unhurried celebration.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#ECE7DC]">
              <div>
                <p className="font-serif text-3xl sm:text-4xl font-normal text-oliveDark">100%</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-oliveMuted">
                  Cold-Pressed Virgin Olive Oils
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl sm:text-4xl font-normal text-oliveDark">3</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-oliveMuted">
                  Iconic Regional Houses
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual Showcase Card */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#ECE7DC] shadow-xl">
              <Image
                src="/images/truffle-bruschetta.jpg"
                alt="Levantine culinary artistry"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="eyebrow !text-warmGold mb-1 block">Artisanal Craft</span>
                <p className="font-serif text-xl sm:text-2xl font-normal">
                  Wood-Fired &amp; Handcrafted Daily
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. BRAND PILLARS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative border-y border-[#ECE7DC] bg-[#F6F2E8]/60 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <div className="inline-flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-warmGold" />
              <span className="eyebrow !text-warmGold">Our Pillars</span>
              <span className="h-px w-8 bg-warmGold" />
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal text-oliveDark">
              The Cornerstones of Our Hospitality
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
            {pillars.map((pillar) => {
              const Icon = iconMap[pillar.icon];
              return (
                <article
                  key={pillar.title}
                  className="flex flex-col items-center rounded-2xl border border-[#ECE7DC] bg-[#FAF7F0] p-5 text-center shadow-sm transition-all duration-300 hover:border-warmGold/50 hover:-translate-y-1"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAE4D5] text-oliveDark">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-oliveDark">
                    {pillar.title}
                  </h4>
                  <p className="mt-1 text-xs uppercase tracking-wider text-oliveMuted">
                    {pillar.caption}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. REGIONAL HOUSES & LOCATIONS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-12">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-oliveDark">
            <PinIcon className="h-4 w-4 text-warmGold" />
            <span className="eyebrow !text-oliveDark">Our Destinations</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-normal text-oliveDark">
            Visit Us in Bahrain, Abu Dhabi &amp; Beirut
          </h3>
          <p className="text-xs sm:text-sm font-light text-oliveMuted leading-relaxed">
            Each house reflects the cultural soul of its neighborhood, designed with natural stone,
            botanical foliage, and candlelit courtyard majlis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {restaurantLocations.map((loc) => (
            <div
              key={loc.id}
              className="flex flex-col justify-between rounded-3xl border border-[#ECE7DC] bg-[#FAF7F0] p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-warmGold/40"
            >
              <div className="space-y-4">
                <span className="eyebrow !text-warmGold block">{loc.city}</span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-oliveDark">
                  {loc.district}
                </h4>
                <p className="text-xs sm:text-sm text-oliveMuted leading-relaxed">
                  {loc.address}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#ECE7DC]/80 text-xs text-oliveMuted">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-3.5 w-3.5 text-warmGold" />
                    <span>{loc.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-3.5 w-3.5 text-warmGold" />
                    <span>{loc.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/reservation"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forestDark py-3 text-xs uppercase tracking-wider text-[#FAF7F0] transition-colors duration-300 hover:bg-forestDark/80"
                >
                  Reserve a Table
                  <ArrowRightIcon className="h-3.5 w-3.5 text-warmGold" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
