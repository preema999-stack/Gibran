"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FULL_MENU_CATEGORIES,
  type DietaryTag,
  type MenuItem,
} from "@/lib/full-menu-data";
import { categoryIconMap } from "@/components/menu/category-icons";
import { MenuHeader } from "@/components/menu/menu-header";
import { MenuFooter } from "@/components/menu/menu-footer";
import { DishModal } from "@/components/menu/dish-modal";
import { ReservationModal } from "@/components/menu/reservation-modal";
import { SearchModal } from "@/components/menu/search-modal";

const DIETARY_FILTERS: DietaryTag[] = [
  "All",
  "Vegetarian",
  "Non-Vegetarian",
  "Gluten-Free",
  "Chef's Selection",
];

export function FullMenuView({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState("starters");
  const [activeDietary, setActiveDietary] = useState<DietaryTag>("All");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingBannerVideo, setIsPlayingBannerVideo] = useState(false);

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
    }, 3200);
  };

  const handleAddToSelection = (dish: MenuItem) => {
    showToast(`Added ${dish.name} to your table selection`);
  };

  const containerClasses = isModal
    ? "fixed inset-0 z-50 overflow-y-auto bg-[#FAF7F0] font-sans text-[#1C241B]"
    : "min-h-screen bg-[#FAF7F0] font-sans text-[#1C241B]";

  return (
    <div className={containerClasses}>
      {/* Optional Modal Top Bar */}
      {isModal && (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-[#ECE5D6] bg-[#FAF7F0] px-6 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#1C241B]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E7569]">
              Haute Cuisine Interactive Menu View
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#6d7835] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#5b642c] transition-all"
            >
              <span>✕</span> Close
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <MenuHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Main Menu Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          {/* LEFT SIDEBAR: CULINARY CURATION */}
          <aside className="w-full shrink-0 lg:w-[260px] xl:w-[280px]">
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
                Our Menu
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#6E7569]">
                A curated selection of authentic Mediterranean and Levantine
                flavors for every refined palate.
              </p>

              {/* Category Nav List */}
              <nav className="mt-6 flex flex-col space-y-1.5">
                {FULL_MENU_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  const Icon = categoryIconMap[cat.icon];

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        setActiveDietary("All");
                      }}
                      className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-[#6d7835] font-semibold text-white shadow-sm"
                          : "text-[#3A4337] hover:bg-white/60 hover:text-[#1C241B]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 ${
                            isActive ? "text-white" : "text-[#586255] group-hover:text-[#1C241B]"
                          }`}
                        />
                        <span>{cat.label}</span>
                      </span>

                      {isActive ? (
                        <svg
                          className="h-3.5 w-3.5 stroke-white/80"
                          fill="none"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      ) : (
                        <span className="text-[11px] font-medium text-[#868E81] group-hover:text-[#3A4337]">
                          {cat.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Script Signature */}
              <div className="mt-8 flex items-center justify-between border-t border-[#EAE3D4] pt-4">
                <span className="font-script text-lg text-[#6E7569]/80">
                  Seasonal organic produce
                </span>
                <span className="text-xs text-[#8A9A86]">🍃</span>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* FEATURED CATEGORY HERO BANNER */}
            <div className="relative min-h-[220px] overflow-hidden rounded-[1.75rem] border border-[#ECE5D6]/30 bg-[#161D15] text-white shadow-md sm:min-h-[240px]">
              {/* Background Plate / Visual */}
              <div className="absolute inset-y-0 right-0 z-0 w-full sm:w-3/5 lg:w-7/12">
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
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                )}
                {/* Dark gradient fade over the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#161D15] via-[#161D15]/85 to-transparent sm:w-2/3" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161D15] via-transparent to-transparent h-20 bottom-0 top-auto sm:hidden" />
              </div>

              {/* Play Button (Top Right) */}
              <button
                type="button"
                onClick={() => setIsPlayingBannerVideo(!isPlayingBannerVideo)}
                aria-label="Toggle motion preview"
                className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#6d7835] text-white shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-[#5b642c]"
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
              </button>

              {/* "Motion Preview Active" Badge (Bottom Right) */}
              <div className="absolute bottom-4 right-5 z-20 hidden items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium tracking-wider text-white/90 backdrop-blur-md sm:flex">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#C5A880]" />
                <span className="uppercase text-[9.5px]">Motion Preview Active</span>
              </div>

              {/* Banner Left Copy */}
              <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:max-w-md sm:p-8 lg:p-9">
                <span className="inline-block self-start rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                  {activeCategory.collectionBadge}
                </span>

                <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#C5A880]">
                  {activeCategory.eyebrow}
                </span>

                <h1 className="mt-1 font-serif text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-[42px]">
                  {activeCategory.title}
                </h1>

                <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                  {activeCategory.subtitle}
                </p>
              </div>
            </div>

            {/* DIETARY FILTERS ROW + CAROUSEL ARROWS */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              {/* Dietary Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {DIETARY_FILTERS.map((tag) => {
                  const isActive = activeDietary === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveDietary(tag)}
                      className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-[#6d7835] font-semibold text-white shadow-xs"
                          : "bg-[#EBE5D8] font-medium text-[#3A4337] hover:bg-[#E2DBCC]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Carousel Next/Prev Arrow Controls */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <button
                  type="button"
                  aria-label="Previous dishes"
                  onClick={() => {
                    const currentIndex = FULL_MENU_CATEGORIES.findIndex(
                      (c) => c.id === activeCategoryId
                    );
                    const prevIndex =
                      (currentIndex - 1 + FULL_MENU_CATEGORIES.length) %
                      FULL_MENU_CATEGORIES.length;
                    setActiveCategoryId(FULL_MENU_CATEGORIES[prevIndex].id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C6] bg-transparent text-xs text-[#20291E] transition-colors hover:bg-white"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  aria-label="Next dishes"
                  onClick={() => {
                    const currentIndex = FULL_MENU_CATEGORIES.findIndex(
                      (c) => c.id === activeCategoryId
                    );
                    const nextIndex =
                      (currentIndex + 1) % FULL_MENU_CATEGORIES.length;
                    setActiveCategoryId(FULL_MENU_CATEGORIES[nextIndex].id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C6] bg-transparent text-xs text-[#20291E] transition-colors hover:bg-white"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* 3-COLUMN DISH CARDS GRID */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((dish) => (
                <article
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#ECE5D6] bg-white p-3.5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#D5CDBC]"
                >
                  {/* Dish Image Container */}
                  <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl bg-[#F2EDE2] sm:h-48">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                    />

                    {/* Top Left Badge */}
                    {dish.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#1C241B] uppercase shadow-xs backdrop-blur-sm">
                        {dish.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="min-h-[72px]">
                    <h3 className="font-serif text-base font-semibold leading-snug text-[#1C241B] group-hover:text-[#C5A880] transition-colors">
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToSelection(dish);
                      }}
                      aria-label={`Add ${dish.name} to selection`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6d7835] bg-[#6d7835] text-xs font-bold text-white shadow-xs transition-all hover:bg-[#5b642c]"
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <MenuFooter />

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#D5CDBC] bg-[#1C241B] px-6 py-3 text-xs font-medium text-white shadow-2xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
