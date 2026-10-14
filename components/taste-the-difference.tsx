"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { menuCategories } from "@/lib/data";
import { subscribeToFirebaseMenu, MenuDataState } from "@/lib/firebase-menu";
import { EASE_EDITORIAL, SplitText, usePrefersReducedMotion } from "@/components/motion-primitives";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";

export function TasteTheDifference() {
  const [active, setActive] = useState(0);
  const [menuState, setMenuState] = useState<MenuDataState | null>(null);
  const reduced = usePrefersReducedMotion();

  // Real-time synchronization directly with Firebase Firestore / Admin updates
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseMenu((updated) => {
      if (updated && Array.isArray(updated.groups)) {
        setMenuState(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  // Compute categories dynamically from admin / Firestore dishes
  const dynamicCategories = useMemo(() => {
    if (!menuState || !menuState.items || menuState.items.length === 0) {
      return menuCategories
        .filter((cat) => cat.id !== "signatures")
        .map((cat) => ({
          id: cat.id,
          label: cat.label,
          intro: cat.intro,
          items: cat.items.map((it) => ({
            name: it.name,
            note: it.note,
            price: it.price.startsWith("AED") ? it.price : `AED ${it.price}`,
          })),
        }));
    }

    const cats: {
      id: string;
      label: string;
      intro: string;
      items: { name: string; note: string; price: string; id?: string }[];
    }[] = [];

    // Subgroups from Firebase with active dishes
    menuState.subgroups.forEach((sub) => {
      const subItems = menuState.items.filter(
        (it) => it.subgroupId === sub.id || (!it.subgroupId && it.groupId === sub.groupId)
      );
      if (subItems.length > 0) {
        cats.push({
          id: sub.id,
          label: sub.name,
          intro: sub.description || `Curated selections from our ${sub.name.toLowerCase()}.`,
          items: subItems.map((it) => ({
            id: it.id,
            name: it.name,
            note: it.description || (it.dietary && it.dietary.join(" • ")) || "",
            price: `AED ${it.price}`,
          })),
        });
      }
    });

    // 3. Fallback tab if dishes were added without assigned subgroups
    if (cats.length === 0 && menuState.items.length > 0) {
      cats.push({
        id: "all",
        label: "Curated Menu",
        intro: "Fresh, seasonal creations from our kitchen.",
        items: menuState.items.map((it) => ({
          id: it.id,
          name: it.name,
          note: it.description || it.groupName || "",
          price: `AED ${it.price}`,
        })),
      });
    }

    return cats;
  }, [menuState]);

  const activeIndex = Math.min(active, Math.max(0, dynamicCategories.length - 1));
  const category = dynamicCategories[activeIndex] || dynamicCategories[0];

  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth scroll back to top of dish list whenever switching categories
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeIndex]);

  const leftCol = useMemo(
    () => (category?.items ? category.items.filter((_, i) => i % 2 === 0) : []),
    [category]
  );
  const rightCol = useMemo(
    () => (category?.items ? category.items.filter((_, i) => i % 2 !== 0) : []),
    [category]
  );

  const renderDishItem = (
    item: { name: string; note: string; price: string; id?: string },
    i: number
  ) => (
    <motion.li
      key={(item.id || item.name) + "-" + i}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(0.25, 0.04 + (i % 6) * 0.03),
        ease: EASE_EDITORIAL,
      }}
      className="group py-3.5 sm:py-4 transition-colors duration-200"
    >
      {/* Heading Row: Dish name on left, hairline dashed leader line, price on right */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/menu?dish=${encodeURIComponent(item.name)}`}
          className="font-serif text-lg sm:text-xl font-normal text-oliveDark transition-colors duration-300 group-hover:text-warmGold min-w-0"
        >
          {item.name}
        </Link>
        <span className="h-[1px] flex-1 border-b border-dashed border-[#C5BCAD]/80 min-w-[14px]" />
        <span className="shrink-0 font-sans text-base sm:text-lg font-bold tabular-nums text-oliveDark">
          {item.price.startsWith("AED") ? item.price : `AED ${item.price}`}
        </span>
      </div>
      {/* Ingredients directly under heading: normal case, sentence flow, line-clamped for clean alignment */}
      {item.note && (
        <p className="mt-1 text-xs sm:text-[13px] font-light leading-relaxed text-oliveMuted normal-case line-clamp-2">
          {item.note}
        </p>
      )}
    </motion.li>
  );

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
                href="/menu"
                id="view-full-menu-button"
                className="btn-ink group"
              >
                View Full Menu
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
              </Link>
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
          {/* Category tabs — responsive pill bar with wrap on desktop and smooth scroll on mobile */}
          <div className="relative mx-auto max-w-5xl px-2">
            <div
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto sm:flex-wrap justify-start sm:justify-center py-2 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
              role="tablist"
              aria-label="Menu categories"
            >
              {dynamicCategories.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`tab-${item.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${item.id}`}
                    onClick={() => setActive(i)}
                    className={`relative shrink-0 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isActive
                      ? "text-white shadow-sm"
                      : "border border-[#E4DECF] bg-white/80 text-oliveDark hover:border-oliveDark/40 hover:bg-white"
                      }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="menu-tab-pill"
                        className="absolute inset-0 rounded-full bg-[#6d7835]"
                        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab panel — real content, swapped with AnimatePresence */}
          <div className="mx-auto mt-8 max-w-4xl">
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

                {/* Luxury scrollable card container */}
                <div className="relative rounded-2xl border border-[#E4DECF] bg-white/50 p-4 sm:p-7 shadow-[0_4px_24px_-10px_rgba(28,36,27,0.06)] backdrop-blur-sm">
                  {category.items.length === 0 ? (
                    <div className="py-12 text-center text-sm font-light italic text-oliveMuted">
                      No dishes currently listed in this category.
                    </div>
                  ) : (
                    <>
                      {/* Scrollable dishes list */}
                      <div
                        ref={scrollRef}
                        className="max-h-[460px] sm:max-h-[500px] overflow-y-auto pr-2 sm:pr-4 scroll-smooth [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-oliveDark/20 hover:scrollbar-thumb-oliveDark/40 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-black/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#6d7835]/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#6d7835]/70"
                      >
                        {/* Mobile view: single continuous list */}
                        <ul className="divide-y divide-dashed divide-[#DCD5C6] lg:hidden">
                          {category.items.map((item, i) => renderDishItem(item, i))}
                        </ul>

                        {/* Desktop view: two balanced, independent columns */}
                        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-12">
                          <ul className="divide-y divide-dashed divide-[#DCD5C6]">
                            {leftCol.map((item, i) => renderDishItem(item, i * 2))}
                          </ul>
                          <ul className="divide-y divide-dashed divide-[#DCD5C6]">
                            {rightCol.map((item, i) => renderDishItem(item, i * 2 + 1))}
                          </ul>
                        </div>
                      </div>

                      {/* Subtle counter / scroll cue if category has many items */}
                      {category.items.length > 6 && (
                        <div className="mt-4 flex items-center justify-between border-t border-[#E8E2D5] pt-3 text-[11px] font-medium text-oliveMuted/70">
                          <span>{category.items.length} dishes in this category</span>
                          <span className="italic">Scroll to explore all items ↓</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom dynamic link to view that particular group on the full menu page */}
            <div className="mt-10 flex justify-center">
              <Link
                href={`/menu?category=${encodeURIComponent(category.id || category.label)}`}
                id="view-particular-group-bottom-button"
                className="btn-ink group text-xs shadow-md transition-all duration-300"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={category.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    View {category.label}
                  </motion.span>
                </AnimatePresence>
                <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
