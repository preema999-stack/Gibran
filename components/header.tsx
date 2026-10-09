"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import { navLinks } from "@/lib/data";
import { usePrefersReducedMotion, useSmoothScroll } from "@/components/smooth-scroll-provider";
import { EASE_EDITORIAL, Magnetic } from "@/components/motion-primitives";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#hero");

  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  /* Automatically highlight active page in navbar */
  useEffect(() => {
    if (pathname === "/menu") {
      setActive("#menu");
    } else if (pathname === "/gallery") {
      setActive("#signature");
    } else if (
      pathname === "/reservation" ||
      pathname === "/reservations" ||
      pathname === "/book-a-table"
    ) {
      setActive("#reservations");
    }
  }, [pathname]);

  /* Hide on scroll-down, reveal on scroll-up. */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (open) return;
    if (latest > previous && latest > 220) setHidden(true);
    else setHidden(false);
  });

  /* Scroll-spy: highlight the section currently occupying the viewport on home. */
  useEffect(() => {
    if (pathname !== "/") return;

    const ids = navLinks.map((link) => link.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  /* Lock body scroll while the drawer is open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);

    if (href === "#menu") {
      if (pathname === "/") {
        window.setTimeout(() => scrollTo("#menu", -88), open ? 260 : 0);
        return;
      }
      router.push("/menu");
      return;
    }

    if (href === "#signature" || href === "/gallery") {
      if (pathname !== "/gallery") {
        router.push("/gallery");
      }
      return;
    }

    if (href === "#reservations") {
      if (pathname !== "/") {
        router.push("/#reservations");
        return;
      }
      window.setTimeout(() => scrollTo("#reservations", -88), open ? 260 : 0);
      return;
    }

    if (pathname !== "/" && href.startsWith("#")) {
      router.push("/" + href);
      return;
    }

    // Let the drawer finish closing before Lenis takes over the scroll.
    window.setTimeout(() => scrollTo(href, -88), open ? 260 : 0);
  };

  const headerMotion = reduced
    ? {}
    : {
        y: hidden ? "-110%" : "0%",
        transition: { duration: 0.5, ease: EASE_EDITORIAL },
      };

  return (
    <>
      <motion.header
        {...headerMotion}
        className="sticky top-0 z-50 w-full border-b transition-colors duration-500"
        style={{
          backgroundColor: scrolled
            ? "rgba(250, 247, 240, 0.86)"
            : "rgba(250, 247, 240, 0.95)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(12px)",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "blur(12px)",
          borderBottomColor: scrolled
            ? "rgba(236, 231, 220, 0.9)"
            : "rgba(236, 231, 220, 0.6)",
        }}
      >
        <div className="shell flex h-24 items-center justify-between lg:h-28">
          {/* Brand */}
          <Link
            href="/"
            onClick={(event) => {
              if (pathname === "/") {
                event.preventDefault();
                go("#hero");
              }
            }}
            className="group flex items-center gap-3.5 sm:gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 shrink-0 items-center justify-center transition-all duration-500 ease-editorial group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Gibran & Co. logo"
                  width={80}
                  height={80}
                  priority
                  className="h-full w-full object-contain transition-transform duration-500 ease-editorial group-hover:scale-110 group-hover:rotate-6"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-none tracking-[0.22em] text-oliveDark transition-colors">
                  GIBRAN &amp; CO.
                </span>
                <span className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.28em] text-warmGold transition-colors">
                  Fine Dining • Est. 2018
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.18em] text-oliveDark/80 transition-colors md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => go(link.href)}
                  className={`group relative transition-colors duration-300 hover:text-oliveDark ${
                    isActive ? "font-semibold text-oliveDark" : ""
                  }`}
                >
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-[1.5px] w-full bg-oliveDark"
                      transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
                    />
                  ) : (
                    <span className="absolute -bottom-1.5 left-0 h-[1.5px] w-0 bg-oliveDark transition-all duration-500 ease-editorial group-hover:w-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-5">
            <button
              type="button"
              aria-label="Search"
              className="group hidden p-2 text-oliveDark transition-colors hover:text-[#C5A880] sm:block"
            >
              <SearchIcon className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:rotate-12" />
            </button>

            <Magnetic strength={0.18} className="hidden sm:block">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center rounded-full bg-[#6d7835] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-[#5b642c] hover:shadow-lg"
              >
                Book a Table
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="rounded-full p-2 text-oliveDark transition-colors hover:text-warmGold md:hidden"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full bg-oliveDark/40 backdrop-blur-sm"
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
              className="absolute right-0 top-0 flex h-full w-[min(22rem,88vw)] flex-col justify-between bg-[#FAF8F5] px-8 pb-10 pt-16 shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="mb-6 flex items-center gap-3.5 border-b border-[#ECE7DC] pb-6">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <Image
                      src="/images/logo.png"
                      alt="Gibran & Co. logo"
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold tracking-[0.2em] text-oliveDark leading-none">
                      GIBRAN &amp; CO.
                    </span>
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-warmGold">
                      Fine Dining • Est. 2018
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.12 + index * 0.06,
                      duration: 0.5,
                      ease: EASE_EDITORIAL,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => go(link.href)}
                      className="group flex w-full items-baseline gap-3 border-b border-[#ECE7DC] py-4 text-left"
                    >
                      <span className="font-serif text-xs text-warmGold">
                        0{index + 1}
                      </span>
                      <span className="font-serif text-3xl text-oliveDark transition-transform duration-500 ease-editorial group-hover:translate-x-1">
                        {link.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="space-y-4"
              >
                <Link
                  href="/reservation"
                  onClick={() => setOpen(false)}
                  className="btn-ink w-full justify-center text-center"
                >
                  Book a Table
                </Link>
                <p className="text-[11px] uppercase tracking-[0.2em] text-oliveMuted">
                  +973 123 4567
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
