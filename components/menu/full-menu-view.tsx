"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FULL_MENU_CATEGORIES,
  type DietaryTag,
  type MenuItem,
  type MenuCategoryData,
} from "@/lib/full-menu-data";
import { subscribeToFirebaseMenu } from "@/lib/firebase-menu";
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
  const [categories, setCategories] = useState<MenuCategoryData[]>(FULL_MENU_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState(() => {
    return categories[0]?.id || "starters";
  });
  const [activeDietary, setActiveDietary] = useState<DietaryTag>("All");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingBannerVideo, setIsPlayingBannerVideo] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToFirebaseMenu((updated) => {
      if (updated?.categories && Array.isArray(updated.categories)) {
        setCategories(updated.categories);
      }
    });
    return () => unsubscribe();
  }, []);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ||
    categories[0] || {
      id: "all",
      label: "Menu",
      icon: "signatures" as const,
      count: 0,
      eyebrow: "CULINARY SELECTION",
      title: "Menu",
      subtitle: "Explore our culinary creations",
      collectionBadge: "GIBRAN MENU",
      bannerImage: "/images/dish-risotto.jpg",
      items: [],
    };

  const filteredItems = (activeCategory.items || []).filter((item) => {
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
            <span className="font-serif text-sm font-semibold tracking-wide">
              GIBRAN &amp; CO.
            </span>
            <span className="text-xs text-[#8A9A86]">• Full Menu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF7F0] text-xs font-bold text-[#1C241B] hover:bg-[#EAE4D5] transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Optional Menu Header Component */}
        <MenuHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* 2-Column Layout */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* LEFT SIDEBAR: CULINARY CATEGORIES */}
          <aside className="w-full shrink-0 lg:w-64 xl:w-72">
            <div className="rounded-3xl border border-[#ECE5D6] bg-[#F4EFE6] p-5 shadow-xs sm:p-6">
              {/* Tag / Eyebrow */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E7569]">
                <span className="text-xs">🌿</span>
                <span>Curated Menu</span>
              </div>

              {/* Title & Description */}
              <h2 className="mt-2 font-serif text-2xl font-normal text-[#1C241B] sm:text-3xl">
                Our Menu
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#6E7569]">
                A curated selection of authentic Mediterranean and Levantine flavors for every refined palate.
              </p>

              {/* Category Nav List */}
              <nav className="mt-6 flex flex-col space-y-1.5">
                {categories.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  const Icon = categoryIconMap[cat.icon] || categoryIconMap["signatures"];

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
                      <span
                        className={`text-[11px] font-medium ${
                          isActive ? "text-white/80" : "text-[#868E81] group-hover:text-[#3A4337]"
                        }`}
                      >
                        {cat.items.length}
                      </span>
                    </button>
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
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="min-w-0 flex-1 space-y-6">
            {/* FEATURED CATEGORY HERO BANNER */}
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-[#ECE5D6]/30 bg-[#161D15] text-white shadow-md sm:min-h-[240px]">
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
                    className="h-full w-full object-cover transition-transform duration-700 ease-editorial hover:scale-105"
                  />
                )}
                {/* Dark gradient fade over the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#161D15] via-[#161D15]/80 to-transparent sm:w-2/3" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161D15] via-transparent to-transparent h-20 bottom-0 top-auto sm:hidden" />
              </div>

              {/* Play Button */}
              <button
                type="button"
                onClick={() => setIsPlayingBannerVideo(!isPlayingBannerVideo)}
                aria-label="Toggle motion video"
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all"
              >
                {isPlayingBannerVideo ? (
                  <span className="text-xs font-mono font-bold">❚❚</span>
                ) : (
                  <span className="text-xs font-mono font-bold">▶</span>
                )}
              </button>

              {/* Banner Text Overlay */}
              <div className="relative z-10 flex min-h-[220px] flex-col justify-between p-6 sm:min-h-[240px] sm:p-8 lg:p-10">
                <div>
                  <span className="inline-block rounded-full bg-[#343F31] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D5CDBC]">
                    {activeCategory.collectionBadge}
                  </span>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                    {activeCategory.eyebrow}
                  </span>
                  <h1 className="mt-1 font-serif text-3xl font-normal text-white sm:text-4xl">
                    {activeCategory.title}
                  </h1>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
                    {activeCategory.subtitle}
                  </p>
                </div>
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
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#6d7835] text-white shadow-xs"
                          : "bg-[#EBE5D8] text-[#3A4337] hover:bg-[#E2DBCC]"
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
                    const currentIndex = categories.findIndex(
                      (c) => c.id === activeCategoryId
                    );
                    const prevIndex =
                      (currentIndex - 1 + categories.length) %
                      categories.length;
                    setActiveCategoryId(categories[prevIndex].id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C6] bg-transparent text-xs text-[#20291E] transition-colors hover:bg-white"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  aria-label="Next dishes"
                  onClick={() => {
                    const currentIndex = categories.findIndex(
                      (c) => c.id === activeCategoryId
                    );
                    const nextIndex =
                      (currentIndex + 1) % categories.length;
                    setActiveCategoryId(categories[nextIndex].id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C6] bg-transparent text-xs text-[#20291E] transition-colors hover:bg-white"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* 3-COLUMN DISH CARDS GRID */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.length === 0 ? (
                <div className="col-span-full rounded-2xl border-2 border-dashed border-[#D5C9B3] bg-white/70 p-12 text-center">
                  <span className="text-3xl block mb-2">🌿</span>
                  <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                    Seasonal Selections Coming Soon
                  </h3>
                  <p className="mt-1 text-xs text-[#7A8374] max-w-sm mx-auto leading-relaxed">
                    Our kitchen team is curating fresh recipes for {activeCategory.title}. Check back shortly or explore our other menu selections.
                  </p>
                </div>
              ) : (
                filteredItems.map((dish) => (
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
                        unoptimized
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
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6d7835] bg-[#6d7835] text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#5b642c]"
                      >
                        +
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <MenuFooter />

      {/* DISH DETAILS MODAL */}
      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToSelection={handleAddToSelection}
      />

      {/* RESERVATION MODAL */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDish={(dish) => {
          setIsSearchOpen(false);
          setSelectedDish(dish);
        }}
        categories={categories}
      />

      {/* TOAST MESSAGE */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#1C241B] px-5 py-3 text-xs font-semibold text-white shadow-xl backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
