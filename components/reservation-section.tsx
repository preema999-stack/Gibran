"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ClockIcon, PhoneIcon } from "@/components/icons";
import { EASE_EDITORIAL, Magnetic, SplitText, usePrefersReducedMotion } from "@/components/motion-primitives";

export function ReservationSection() {
  const reduced = usePrefersReducedMotion();

  const highlights = [
    { label: "Instant Confirmation", note: "Immediate table reservation" },
    { label: "Curated Pairings", note: "Cellar selections & mezza" },
    { label: "Private Salons", note: "Bespoke events & dining" },
  ];

  return (
    <section
      id="reservations"
      className="grain relative border-b border-white/10 bg-[#161D15] py-20 text-[#FAF8F5] lg:py-28"
    >
      <div className="shell relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="inline-flex items-center justify-center gap-3"
          >
            <span className="h-px w-8 bg-warmGold" />
            <span className="eyebrow !text-warmGold">Table Reservations</span>
            <span className="h-px w-8 bg-warmGold" />
          </motion.div>

          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight tracking-tight text-white">
            <SplitText text="Reserve Your Table for" as="span" />
            <br />
            <SplitText
              text="An Evening of Distinction"
              as="span"
              delay={0.15}
              wordClassName="italic text-warmGold font-light"
            />
          </h2>

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: EASE_EDITORIAL, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-sm sm:text-base font-light leading-relaxed text-[#BCC6B8] tracking-wide"
          >
            Step into an atmosphere of unhurried elegance, candlelit ambiance, and
            Levantine culinary poise. Reserve your table in advance for lunch or dinner
            service across our regional houses.
          </motion.p>

          {/* Highlights grid */}
          <motion.div
            initial={reduced ? undefined : "hidden"}
            whileInView={reduced ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
            }}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: EASE_EDITORIAL },
                  },
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-colors hover:border-warmGold/40 hover:bg-white/[0.07]"
              >
                <span className="block font-serif text-base font-semibold text-white">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs font-light text-[#9FA89D]">
                  {item.note}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: EASE_EDITORIAL, delay: 0.45 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Magnetic strength={0.22}>
              <Link
                href="/reservation"
                className="btn-pill group bg-[#6d7835] text-white shadow-xl hover:bg-[#5b642c] hover:scale-[1.02]"
              >
                <span>Book a Table Online</span>
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
              </Link>
            </Magnetic>

            <a
              href="tel:+9731234567"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#FAF8F5] backdrop-blur-md transition-all duration-300 hover:border-warmGold hover:bg-white/10 hover:text-warmGold"
            >
              <PhoneIcon className="h-4 w-4 text-warmGold transition-transform duration-300 group-hover:scale-110" />
              <span>Call Concierge: +973 123 4567</span>
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-[#8A9588]"
          >
            <ClockIcon className="h-3.5 w-3.5 text-warmGold" />
            <span>Open Daily • 12:00 PM – 11:00 PM across all houses</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
