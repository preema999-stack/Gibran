"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/lib/data";
import { usePrefersReducedMotion, useSmoothScroll } from "@/components/smooth-scroll-provider";
import { EASE_EDITORIAL } from "@/components/motion-primitives";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const router = useRouter();

  const go = (href: string) => {
    if (href === "#menu") {
      router.push("/menu");
      return;
    }
    if (href === "#signature" || href === "/gallery") {
      router.push("/gallery");
      return;
    }
    if (pathname !== "/" && href.startsWith("#")) {
      router.push("/" + href);
      return;
    }
    scrollTo(href, -88);
  };

  return (
    <footer className="border-t border-white/5 bg-forestDark py-16 text-[#A4B0A0]">
      <div className="shell flex flex-col items-center text-center">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.85, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
          className="group relative mb-6 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center transition-all duration-700 hover:scale-105"
        >
          <Image
            src="/images/logo-gold.png"
            alt="Gibran & Co. logo"
            width={112}
            height={112}
            className="h-full w-full object-contain transition-transform duration-700 ease-editorial group-hover:rotate-6 group-hover:scale-105"
          />
        </motion.div>

        <motion.p
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-[0.25em] text-white"
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL }}
        >
          GIBRAN &amp; CO.
        </motion.p>

        <motion.p
          className="mt-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-warmGold font-medium"
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Classic Cuisine • Modern Touch
        </motion.p>

        <motion.p
          className="mt-6 max-w-md text-xs leading-relaxed text-[#9AA596]"
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_EDITORIAL }}
        >
          We bring people together over extraordinary food, crafted with care and
          served with timeless warmth.
        </motion.p>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest text-[#BCC6B8] sm:gap-8">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.href}
              type="button"
              onClick={() => go(link.href)}
              className="link-brass !text-[#BCC6B8] hover:!text-white"
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.36 + i * 0.06, ease: EASE_EDITORIAL }}
            >
              {link.label}
            </motion.button>
          ))}
        </nav>

        <div className="mt-12 flex w-full flex-col items-center justify-between border-t border-white/10 pt-6 text-[11px] text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} GIBRAN &amp; CO. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">
            Designed with passion for exceptional hospitality.
          </p>
        </div>
      </div>
    </footer>
  );
}
