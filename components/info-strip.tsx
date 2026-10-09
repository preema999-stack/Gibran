"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { infoStrip } from "@/lib/data";
import { iconMap } from "@/components/icons";
import { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";
import { EASE_EDITORIAL } from "@/components/motion-primitives";
import { ArrowRightIcon } from "@/components/icons";

export function InfoStrip() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="reservations"
      className="grain border-t border-white/10 bg-[#242F22] py-10 text-[#FAF8F5]"
    >
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-4">
          {infoStrip.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.label}
                id={item.id}
                className="flex items-start gap-4"
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_EDITORIAL }}
              >
                <div className="flex-shrink-0 rounded-full bg-white/10 p-2.5 text-warmGold transition-transform duration-500 ease-editorial hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium uppercase tracking-[0.2em] text-[#A4B2A1]">
                    {item.label}
                  </span>
                  <p className="mt-0.5 text-sm font-semibold">{item.value}</p>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            className="flex md:justify-end"
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_EDITORIAL }}
          >
            <Link
              href="/reservation"
              className="btn-pill group w-full bg-[#6d7835] text-white shadow-md hover:bg-[#5b642c] hover:scale-[1.02] md:w-auto"
            >
              Book a Table
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
