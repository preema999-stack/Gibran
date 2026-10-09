"use client";

import { motion } from "framer-motion";
import { ClockIcon, HeartIcon, PhoneIcon } from "@/components/icons";
import { EASE_EDITORIAL, usePrefersReducedMotion } from "@/components/motion-primitives";

export function ContactSection() {
  const reduced = usePrefersReducedMotion();

  const contactCards = [
    {
      title: "Direct Reservations",
      caption: "Telephone Hotline",
      value: "+973 123 4567",
      href: "tel:+9731234567",
      icon: PhoneIcon,
      note: "Available daily 11:00 AM – 11:00 PM",
    },
    {
      title: "Concierge Desk",
      caption: "Email Inquiries",
      value: "concierge@gibran.com",
      href: "mailto:concierge@gibran.com",
      icon: HeartIcon,
      note: "Inquiries responded within 2 hours",
    },
    {
      title: "Private Dining & Events",
      caption: "Special Celebrations",
      value: "events@gibran.com",
      href: "mailto:events@gibran.com",
      icon: HeartIcon,
      note: "Custom salon menus and private buyouts",
    },
    {
      title: "Dining Hours",
      caption: "Lunch & Dinner",
      value: "12:00 PM – 11:00 PM",
      icon: ClockIcon,
      note: "Open seven days a week across all houses",
    },
  ];

  return (
    <section
      id="contact"
      className="grain relative border-b border-[#ECE7DC] bg-[#FAF7F0] py-16 lg:py-24"
    >
      <div className="shell">
        <motion.div
          className="mx-auto max-w-2xl text-center space-y-4"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        >
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-warmGold" />
            <span className="eyebrow !text-warmGold">Contact Us &amp; Concierge</span>
            <span className="h-px w-8 bg-warmGold" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-oliveDark">
            We Look Forward to Welcoming You
          </h2>

          <p className="text-sm sm:text-base font-light text-oliveMuted leading-relaxed">
            Our guest concierge team is dedicated to providing tailored hospitality,
            whether reserving an intimate table or planning an exclusive private gathering.
          </p>
        </motion.div>

        {/* 4 Contact cards */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduced ? undefined : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.75, ease: EASE_EDITORIAL },
                  },
                }}
                whileHover={reduced ? undefined : { y: -4 }}
                className="group flex flex-col justify-between rounded-2xl border border-[#ECE7DC] bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-warmGold/50 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF7F0] border border-[#ECE7DC] text-oliveDark transition-colors group-hover:border-warmGold/60 group-hover:text-warmGold">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-oliveMuted">
                    {card.caption}
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-oliveDark">
                    {card.title}
                  </h3>

                  {card.href ? (
                    <a
                      href={card.href}
                      className="mt-2 block text-sm font-semibold text-warmGold hover:underline"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-oliveDark">
                      {card.value}
                    </p>
                  )}
                </div>

                <p className="mt-4 border-t border-[#ECE7DC]/60 pt-3 text-[11px] font-light text-oliveMuted">
                  {card.note}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
