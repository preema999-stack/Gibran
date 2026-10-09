"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FULL_MENU_CATEGORIES,
  type DietaryTag,
  type MenuItem,
} from "@/lib/full-menu-data";
import { categoryIconMap } from "@/components/menu/category-icons";
import { DishModal } from "@/components/menu/dish-modal";
import { ReservationModal } from "@/components/menu/reservation-modal";
import { SearchModal } from "@/components/menu/search-modal";
import { EASE_EDITORIAL, SplitText, Magnetic } from "@/components/motion-primitives";

const DIETARY_FILTERS: DietaryTag[] = [
  "All",
  "Vegetarian",
  "Non-Vegetarian",
  "Gluten-Free",
  "Chef's Selection",
];

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASE_EDITORIAL,
    },
  },
};

function resolveCategoryId(param: string | null | undefined): string {
  if (!param) return "starters";
  const clean = param.toLowerCase().trim().replace(/^#/, "");
  const matched = FULL_MENU_CATEGORIES.find((c) => c.id.toLowerCase() === clean);
  if (matched) return matched.id;
  if (clean.includes("strat") || clean.includes("start") || clean.includes("appetiz") || clean.includes("mezze")) return "starters";
  if (clean.includes("main")) return "mains";
  if (clean.includes("pasta") || clean.includes("risotto")) return "pasta";
  if (clean.includes("pizza")) return "pizza";
  if (clean.includes("salad")) return "salads";
  if (clean.includes("dessert") || clean.includes("sweet")) return "desserts";
  if (clean.includes("beverage") || clean.includes("drink") || clean.includes("coffee") || clean.includes("wine")) return "beverages";
  return "starters";
}

export function MenuContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategoryId, setActiveCategoryId] = useState(() => {
    return resolveCategoryId(categoryParam);
  });
  const [activeDietary, setActiveDietary] = useState<DietaryTag>("All");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingBannerVideo, setIsPlayingBannerVideo] = useState(false);
  const [tableCount, setTableCount] = useState(0);

  // Sync category state when URL search param or hash changes
  useEffect(() => {
    const rawCategory = categoryParam || (typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : null);
    if (rawCategory) {
      const resolved = resolveCategoryId(rawCategory);
      setActiveCategoryId(resolved);
      setActiveDietary("All");

      // Smoothly scroll to the menu container when arriving with a category
      window.requestAnimationFrame(() => {
        const target = document.getElementById("menu-category-banner");
        if (target) {
          const rect = target.getBoundingClientRect();
          if (rect.top < 0 || rect.top > window.innerHeight) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    }
  }, [categoryParam]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        const resolved = resolveCategoryId(hash);
        setActiveCategoryId(resolved);
        setActiveDietary("All");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const activeCategory =
    FULL_MENU_CATEGORIES.find((c) => c.id === activeCategoryId) ||
    FULL_MENU_CATEGORIES[0];

  const filteredItems = activeCategory.items.filter((item) => {
    if (activeDietary === "All") return true;
    return item.dietary.includes(activeDietary);
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3000);
  };

  const handleAddToSelection = (dish: MenuItem) => {
    setTableCount((prev) => prev + 1);
    showToast(`Added ${dish.name} to your table selection`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Animated Return to Home Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7569] hover:text-[#6d7835] transition-colors group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1.5 text-sm">←</span>
            <span>Return to Home</span>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          {/* LEFT SIDEBAR: CULINARY CURATION */}
          <motion.aside
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="w-full shrink-0 lg:w-[260px] xl:w-[280px]"
          >
            <div className="relative rounded-[1.75rem] border border-[#ECE5D6] bg-[#F4EFE6] p-5 shadow-xs sm:p-6">
              {/* Subtle top-right decorative watermark */}
              <div className="pointer-events-none absolute right-4 top-4 select-none opacity-10">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>

              {/* Tag / Eyebrow */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E7569]">
                <span className="text-xs">🌿</span>
                <span>Culinary Curation</span>
              </div>

              {/* Title & Description */}
              <h2 className="mt-2 font-serif text-3xl font-normal leading-tight text-[#1C241B]">
                <SplitText text="Our Menu" as="span" delay={0.15} immediate />
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#6E7569]">
                A curated selection of authentic Mediterranean and Levantine
                flavors for every refined palate.
              </p>

              {/* Category Nav List with animated gliding pill */}
              <nav className="mt-6 flex flex-col space-y-1.5">
                {FULL_MENU_CATEGORIES.map((cat, idx) => {
                  const isActive = cat.id === activeCategoryId;
                  const Icon = categoryIconMap[cat.icon];

                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.22 + idx * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ x: isActive ? 0 : 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        setActiveDietary("All");
                        if (typeof window !== "undefined") {
                          window.history.replaceState(null, "", `/menu?category=${cat.id}`);
                        }
                      }}
                      className={`relative group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors duration-200 ${
                        isActive
                          ? "font-semibold text-white shadow-sm"
                          : "text-[#3A4337] hover:bg-white/60 hover:text-[#1C241B]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-category-pill"
                          className="absolute inset-0 rounded-xl bg-[#6d7835] shadow-md shadow-[#6d7835]/25"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      <span className="relative z-10 flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive ? "text-white" : "text-[#586255] group-hover:text-[#1C241B]"
                          }`}
                        />
                        <span>{cat.label}</span>
                      </span>

                      {isActive ? (
                        <motion.svg
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative z-10 h-3.5 w-3.5 stroke-white/90"
                          fill="none"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </motion.svg>
                      ) : (
                        <span className="relative z-10 text-[11px] font-medium text-[#868E81] group-hover:text-[#3A4337]">
                          {cat.items.length}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom Script Signature */}
              <div className="mt-8 flex items-center justify-between border-t border-[#EAE3D4] pt-4">
                <span className="font-script text-xl text-[#7A8A76]">
                  Seasonal organic produce
                </span>
                <span className="text-sm text-[#8A9A86]">🍃</span>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT CONTENT AREA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 flex-1 space-y-6"
          >
            {/* FEATURED CATEGORY HERO BANNER WITH FLUID ANIMATIONS */}
            <div
              id="menu-category-banner"
              className="relative min-h-[220px] overflow-hidden rounded-[1.75rem] border border-[#ECE5D6]/30 bg-[#161D15] text-white shadow-md sm:min-h-[240px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full"
                >
                  {/* Background Plate / Visual */}
                  <div className="absolute inset-y-0 right-0 z-0 w-full sm:w-3/5 lg:w-7/12 overflow-hidden">
                    {isPlayingBannerVideo ? (
                      <video
                        src="/video/cake.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={activeCategory.bannerImage}
                        alt={activeCategory.title}
                        fill
                        priority
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-1000 ease-editorial hover:scale-108"
                      />
                    )}
                    {/* Dark gradient fade over the image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#161D15] via-[#161D15]/85 to-transparent sm:w-2/3" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161D15] via-transparent to-transparent h-20 bottom-0 top-auto sm:hidden" />
                  </div>

                  {/* Play Button (Top Right) */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsPlayingBannerVideo(!isPlayingBannerVideo)}
                    aria-label="Toggle motion preview"
                    className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#6d7835] text-white shadow-md backdrop-blur-md transition-all hover:bg-[#5b642c]"
                  >
                    {isPlayingBannerVideo ? (
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </motion.button>

                  {/* "Motion Preview Active" Badge (Bottom Right) */}
                  <div className="absolute bottom-4 right-5 z-20 hidden items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium tracking-wider text-white/90 backdrop-blur-md sm:flex">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#C5A880]" />
                    <span className="uppercase text-[9.5px]">Motion Preview Active</span>
                  </div>

                  {/* Banner Left Copy with slow, staggered entrance */}
                  <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:max-w-md sm:p-8 lg:p-9">
                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block self-start rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm"
                    >
                      {activeCategory.collectionBadge}
                    </motion.span>

                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#C5A880]"
                    >
                      {activeCategory.eyebrow}
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-1 font-serif text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-[42px]"
                    >
                      {activeCategory.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm"
                    >
                      {activeCategory.subtitle}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DIETARY FILTERS ROW + CAROUSEL ARROWS */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-between gap-4 pt-1"
            >
              {/* Dietary Filter Pills with Gliding Indicator */}
              <div className="flex flex-wrap items-center gap-2">
                {DIETARY_FILTERS.map((tag) => {
                  const isActive = activeDietary === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveDietary(tag)}
                      className={`relative rounded-full px-4 py-1.5 text-xs transition-colors duration-200 ${
                        isActive
                          ? "font-semibold text-white"
                          : "bg-[#EBE5D8] font-medium text-[#3A4337] hover:bg-[#E2DBCC]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-dietary-pill"
                          className="absolute inset-0 rounded-full bg-[#6d7835] shadow-xs"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* Carousel Next/Prev Arrow Controls */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, backgroundColor: "#ffffff" }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous category"
                  onClick={() => {
                    const currentIndex = FULL_MENU_CATEGORIES.findIndex(
                      (c) => c.id === activeCategoryId
                    );
                    const prevIndex =
                      (currentIndex - 1 + FULL_MENU_CATEGORIES.length) %
                      FULL_MENU_CATEGORIES.length;
                    setActiveCategoryId(FULL_MENU_CATEGORIES[prevIndex].id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C6] bg-transparent text-xs text-[#20291E] transition-colors"
                >
                  &larr;
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, backgroundColor: "#ffffff" }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next category"
                  onClick={() => {
                    const currentIndex = FULL_MENU_CATEGORIES.findIndex(
                      (c) => c.id === activeCategoryId
                    );
                    const nextIndex =
                      (currentIndex + 1) % FULL_MENU_CATEGORIES.length;
                    setActiveCategoryId(FULL_MENU_CATEGORIES[nextIndex].id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C6] bg-transparent text-xs text-[#20291E] transition-colors"
                >
                  &rarr;
                </motion.button>
              </div>
            </motion.div>

            {/* 3-COLUMN DISH CARDS GRID WITH STAGGER ENTRANCE ANIMATION */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategoryId + "-" + activeDietary}
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE_EDITORIAL } }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredItems.map((dish) => (
                  <motion.article
                    key={dish.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, transition: { duration: 0.45, ease: EASE_EDITORIAL } }}
                    onClick={() => setSelectedDish(dish)}
                    className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#ECE5D6] bg-white p-3.5 shadow-xs transition-shadow duration-300 hover:shadow-xl hover:border-[#D5CDBC]"
                  >
                    {/* Dish Image Container */}
                    <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl bg-[#F2EDE2] sm:h-48">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-108"
                      />

                      {/* Top Left Badge */}
                      {dish.badge && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#1C241B] uppercase shadow-xs backdrop-blur-sm"
                        >
                          {dish.badge}
                        </motion.span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="min-h-[72px]">
                      <h3 className="font-serif text-base font-semibold leading-snug text-[#1C241B] group-hover:text-[#6d7835] transition-colors">
                        {dish.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6E7569]">
                        {dish.description}
                      </p>
                    </div>

                    {/* Bottom Row: Price & + Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#F2ECE0] pt-3">
                      <span className="font-sans text-sm sm:text-base font-bold tabular-nums tracking-normal text-[#1C241B]">
                        AED {dish.price}
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.18, backgroundColor: "#5b642c" }}
                        whileTap={{ scale: 0.88 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToSelection(dish);
                        }}
                        aria-label={`Add ${dish.name} to selection`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6d7835] bg-[#6d7835] text-xs font-bold text-white shadow-xs transition-colors"
                      >
                        +
                      </motion.button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* FLOATING TABLE SELECTION DOCK */}
      <AnimatePresence>
        {tableCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-4 rounded-full border border-white/20 bg-[#162115]/90 px-6 py-3 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6d7835] text-xs font-bold text-white">
                {tableCount}
              </span>
              <span className="text-xs font-medium text-white/90">
                Dishes Selected
              </span>
            </div>
            <Link
              href="/reservation"
              className="rounded-full bg-[#6d7835] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#5b642c] transition-all"
            >
              Reserve Table &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Modals */}
      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToSelection={handleAddToSelection}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDish={(dish) => setSelectedDish(dish)}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-[#6d7835]/40 bg-[#162115] px-6 py-3 text-xs font-medium text-white shadow-2xl backdrop-blur-md"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6d7835] text-[10px] font-bold text-white">
              ✓
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
