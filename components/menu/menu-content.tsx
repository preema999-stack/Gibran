"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDishToSelection,
  updateDishQuantity,
  getSelectedDishes,
  SELECTION_UPDATED_EVENT,
  type SelectedDishItem,
} from "@/lib/table-selection";
import { TableSelectionBar } from "@/components/menu/table-selection-bar";
import {
  DEFAULT_MENU_GROUPS,
  DEFAULT_MENU_SUBGROUPS,
  FULL_MENU_CATEGORIES,
  type DietaryTag,
  type MenuItem,
  type MenuGroup,
  type MenuSubgroup,
} from "@/lib/full-menu-data";
import { subscribeToFirebaseMenu, MenuDataState } from "@/lib/firebase-menu";
import { DishModal } from "@/components/menu/dish-modal";
import { ReservationModal } from "@/components/menu/reservation-modal";
import { SearchModal } from "@/components/menu/search-modal";
import { EASE_EDITORIAL, SplitText } from "@/components/motion-primitives";

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

export function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const dishParam = searchParams.get("dish");

  const [menuState, setMenuState] = useState<MenuDataState>({
    groups: DEFAULT_MENU_GROUPS,
    subgroups: DEFAULT_MENU_SUBGROUPS,
    items: [],
    categories: FULL_MENU_CATEGORIES,
  });

  const [activeGroupId, setActiveGroupId] = useState<string>("food");
  const [activeSubgroupId, setActiveSubgroupId] = useState<string>("all");
  const [openGroupIds, setOpenGroupIds] = useState<Record<string, boolean>>({
    food: true,
    beverages: true,
  });

  const [activeDietary, setActiveDietary] = useState<DietaryTag>("All");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingBannerVideo, setIsPlayingBannerVideo] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<SelectedDishItem[]>([]);

  useEffect(() => {
    setSelectedDishes(getSelectedDishes());
    const handleUpdate = () => {
      setSelectedDishes(getSelectedDishes());
    };
    window.addEventListener(SELECTION_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SELECTION_UPDATED_EVENT, handleUpdate);
  }, []);

  // Real-time synchronization directly with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseMenu((updated) => {
      if (updated && Array.isArray(updated.groups)) {
        setMenuState(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync with URL category parameter if provided
  useEffect(() => {
    if (!categoryParam) return;
    const clean = categoryParam.toLowerCase().trim();

    // Check if matches a group
    const matchedGroup = menuState.groups.find(
      (g) => g.id.toLowerCase() === clean || g.name.toLowerCase().includes(clean)
    );
    if (matchedGroup) {
      setActiveGroupId(matchedGroup.id);
      setActiveSubgroupId("all");
      setOpenGroupIds((prev) => ({ ...prev, [matchedGroup.id]: true }));
      return;
    }

    // Check if matches a subgroup
    const matchedSub = menuState.subgroups.find(
      (s) => s.id.toLowerCase() === clean || s.name.toLowerCase().includes(clean)
    );
    if (matchedSub) {
      setActiveGroupId(matchedSub.groupId);
      setActiveSubgroupId(matchedSub.id);
      setOpenGroupIds((prev) => ({ ...prev, [matchedSub.groupId]: true }));
    }
  }, [categoryParam, menuState.groups, menuState.subgroups]);

  // Deep-linking to dish modal
  useEffect(() => {
    if (dishParam && menuState.items.length > 0) {
      const targetDish = menuState.items.find(
        (item) => item.id.toLowerCase() === dishParam.toLowerCase()
      );
      if (targetDish) {
        setSelectedDish(targetDish);
      }
    }
  }, [dishParam, menuState.items]);

  const toggleGroupOpen = (groupId: string) => {
    setOpenGroupIds((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Active Group object
  const activeGroup = useMemo<MenuGroup>(() => {
    return (
      menuState.groups.find((g) => g.id === activeGroupId) ||
      menuState.groups[0] ||
      DEFAULT_MENU_GROUPS[0]
    );
  }, [menuState.groups, activeGroupId]);

  // Subgroups belonging to active group
  const activeSubgroups = useMemo<MenuSubgroup[]>(() => {
    return menuState.subgroups.filter((s) => s.groupId === activeGroup?.id);
  }, [menuState.subgroups, activeGroup]);

  // Active Subgroup object (if specific subgroup selected)
  const activeSubgroup = useMemo<MenuSubgroup | null>(() => {
    if (activeSubgroupId === "all") return null;
    return menuState.subgroups.find((s) => s.id === activeSubgroupId) || null;
  }, [menuState.subgroups, activeSubgroupId]);

  // Filtered dishes
  const displayedDishes = useMemo(() => {
    return menuState.items.filter((item) => {
      // Group filter
      if (item.groupId && item.groupId !== activeGroup?.id) {
        return false;
      }
      // Subgroup filter
      if (activeSubgroupId !== "all" && item.subgroupId && item.subgroupId !== activeSubgroupId) {
        return false;
      }
      // Dietary filter
      if (activeDietary !== "All") {
        if (!item.dietary || !item.dietary.includes(activeDietary)) {
          return false;
        }
      }
      return true;
    });
  }, [menuState.items, activeGroup, activeSubgroupId, activeDietary]);

  // Dynamic banner image based on selection
  const bannerImage = useMemo(() => {
    if (activeSubgroupId === "starters") return "/assets/gallery/hummus-tahini-mezza.jpg";
    if (activeSubgroupId === "mains") return "/assets/gallery/charred-lamb-chops.jpg";
    if (activeSubgroupId === "desserts") return "/assets/gallery/baklava-ashta.jpg";
    if (activeGroup?.id === "beverages") return "/assets/gallery/principal-dining-hall.jpg";
    return "/images/dish-risotto.jpg";
  }, [activeSubgroupId, activeGroup]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  const handleAddToSelection = (dish: MenuItem) => {
    const updated = addDishToSelection({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      category: dish.subgroupName || dish.groupName,
      imageUrl: dish.image,
    });
    setSelectedDishes(updated);
    const item = updated.find(
      (i) => (dish.id && i.id === dish.id) || i.name.toLowerCase() === dish.name.toLowerCase()
    );
    const qty = item ? item.quantity : 1;
    showToast(`Added "${dish.name}" to table selection (${qty} in table)`);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    const updated = updateDishQuantity(dishId, delta);
    setSelectedDishes(updated);
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
          {/* ============================================================== */}
          {/* LEFT SIDEBAR: GROUPS & SUBGROUPS ACCORDION DROPDOWN (STICKY) */}
          {/* ============================================================== */}
          <aside className="w-full shrink-0 lg:w-[280px] xl:w-[300px] lg:sticky lg:top-24 lg:self-start z-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[1.75rem] border border-[#ECE5D6] bg-[#F4EFE6] p-5 shadow-xs sm:p-6 max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D5C9B3 transparent",
              }}
            >

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
                Browse our menu by category group, then expand each section below.
              </p>

              {/* Group & Subgroups Navigation List */}
              <nav className="mt-6 space-y-3">
                {menuState.groups.map((group) => {
                  const isGroupActive = activeGroupId === group.id;
                  const isExpanded = !!openGroupIds[group.id];
                  const subsForThisGroup = menuState.subgroups.filter(
                    (s) => s.groupId === group.id
                  );
                  const totalGroupDishes = menuState.items.filter(
                    (i) => i.groupId === group.id
                  ).length;

                  return (
                    <div
                      key={group.id}
                      className="rounded-2xl border border-[#ECE5D6] bg-white/60 p-1.5 transition-colors"
                    >
                      {/* GROUP HEADER & DROPDOWN TOGGLE BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveGroupId(group.id);
                          setActiveSubgroupId("all");
                          toggleGroupOpen(group.id);
                        }}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                          isGroupActive
                            ? "bg-[#1C241B] text-white shadow-sm"
                            : "text-[#2C3529] hover:bg-white hover:text-[#1C241B]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">
                            {group.id === "food" ? "🍽️" : group.id === "beverages" ? "🍸" : "✨"}
                          </span>
                          <span className="tracking-wide uppercase text-[11px] font-bold">
                            {group.name}
                          </span>
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                              isGroupActive
                                ? "bg-white/20 text-white"
                                : "bg-[#FAF7F0] text-[#7A8374]"
                            }`}
                          >
                            {totalGroupDishes}
                          </span>
                          <span
                            className={`text-[9px] transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                      </button>

                      {/* SUBGROUPS DROPDOWN ACCORDION (shown below group) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden pl-2 pr-1 pt-1.5 pb-1 space-y-1"
                          >
                            {/* Option 1: View all in this group */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveGroupId(group.id);
                                setActiveSubgroupId("all");
                              }}
                              className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] transition-colors ${
                                isGroupActive && activeSubgroupId === "all"
                                  ? "bg-[#6d7835] font-semibold text-white shadow-xs"
                                  : "text-[#5A6355] hover:bg-white/80 hover:text-[#1C241B]"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                <span>All {group.name}</span>
                              </span>
                              <span className="text-[10px] font-mono opacity-80">
                                {totalGroupDishes}
                              </span>
                            </button>

                            {/* Option 2: Each individual subgroup */}
                            {subsForThisGroup.map((sub) => {
                              const isSubActive =
                                isGroupActive && activeSubgroupId === sub.id;
                              const subCount = menuState.items.filter(
                                (i) => i.subgroupId === sub.id
                              ).length;

                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveGroupId(group.id);
                                    setActiveSubgroupId(sub.id);
                                  }}
                                  className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] transition-colors ${
                                    isSubActive
                                      ? "bg-[#6d7835] font-semibold text-white shadow-xs"
                                      : "text-[#5A6355] hover:bg-white/80 hover:text-[#1C241B]"
                                  }`}
                                >
                                  <span className="flex items-center gap-2 truncate">
                                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                    <span className="truncate">{sub.name}</span>
                                  </span>
                                  <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                                    {subCount}
                                  </span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
            </motion.div>
          </aside>

          {/* ============================================================== */}
          {/* RIGHT CONTENT AREA */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 flex-1 space-y-6"
          >
            {/* FEATURED CATEGORY HERO BANNER */}
            <div
              id="menu-category-banner"
              className="relative min-h-[220px] overflow-hidden rounded-[1.75rem] border border-[#ECE5D6]/30 bg-[#161D15] text-white shadow-md sm:min-h-[240px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeGroupId}-${activeSubgroupId}`}
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
                        src={bannerImage}
                        alt={activeSubgroup?.name || activeGroup.name}
                        fill
                        priority
                        unoptimized
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

                  {/* Banner Left Copy */}
                  <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:max-w-md sm:p-8 lg:p-9">
                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block self-start rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm"
                    >
                      {activeGroup.name}
                    </motion.span>

                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#C5A880]"
                    >
                      {activeSubgroup
                        ? `${activeGroup.name} • ${activeSubgroup.name}`
                        : `CURATED COLLECTION`}
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-1 font-serif text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-[42px]"
                    >
                      {activeSubgroup?.name || activeGroup.name}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm"
                    >
                      {activeSubgroup?.description ||
                        activeGroup.description ||
                        "A refined selection of authentic Levantine specialties."}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ============================================================== */}
            {/* QUICK SELECTION DROPDOWNS BAR (Group & Subgroup Dropdown) */}
            {/* ============================================================== */}
            <div className="rounded-2xl border border-[#ECE5D6] bg-white p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B4F]">
                  Select Menu Section:
                </span>
                <span className="text-xs text-[#7A8374]">
                  Showing <strong className="text-[#1C241B]">{displayedDishes.length}</strong> {displayedDishes.length === 1 ? "dish" : "dishes"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Group Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5446] mb-1">
                    1. Menu Group:
                  </label>
                  <div className="relative">
                    <select
                      value={activeGroupId}
                      onChange={(e) => {
                        const nextG = e.target.value;
                        setActiveGroupId(nextG);
                        setActiveSubgroupId("all");
                        setOpenGroupIds((prev) => ({ ...prev, [nextG]: true }));
                      }}
                      className="w-full appearance-none rounded-xl border border-[#D5C9B3] bg-[#FAF7F0] px-3.5 py-2 text-xs font-semibold text-[#1C241B] focus:border-[#6d7835] focus:bg-white focus:outline-none pr-8 cursor-pointer shadow-xs transition-colors"
                    >
                      {menuState.groups.map((g) => {
                        const cnt = menuState.items.filter((i) => i.groupId === g.id).length;
                        return (
                          <option key={g.id} value={g.id}>
                            {g.name} ({cnt} dishes)
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7A8374]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 2. Subgroup Dropdown (shows directly below / next to group) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5446] mb-1">
                    2. Subgroup:
                  </label>
                  <div className="relative">
                    <select
                      value={activeSubgroupId}
                      onChange={(e) => setActiveSubgroupId(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#D5C9B3] bg-[#FAF7F0] px-3.5 py-2 text-xs font-semibold text-[#1C241B] focus:border-[#6d7835] focus:bg-white focus:outline-none pr-8 cursor-pointer shadow-xs transition-colors"
                    >
                      <option value="all">
                        All Sections in {activeGroup.name} ({menuState.items.filter((i) => i.groupId === activeGroupId).length} dishes)
                      </option>
                      {activeSubgroups.map((sub) => {
                        const cnt = menuState.items.filter((i) => i.subgroupId === sub.id).length;
                        return (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} ({cnt} dishes)
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7A8374]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DIETARY FILTERS ROW */}
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

              {/* Subgroup quick tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {activeSubgroups.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubgroupId(sub.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeSubgroupId === sub.id
                        ? "bg-[#1C241B] text-white"
                        : "bg-white border border-[#D5C9B3] text-[#5A6355] hover:border-[#1C241B]"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 3-COLUMN DISH CARDS GRID */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeGroupId}-${activeSubgroupId}-${activeDietary}`}
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE_EDITORIAL } }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {displayedDishes.length === 0 ? (
                  <div className="col-span-full rounded-2xl border-2 border-dashed border-[#D5C9B3] bg-white/70 p-12 text-center">
                    <span className="text-3xl block mb-2">🌿</span>
                    <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                      No Dishes in this Section Yet
                    </h3>
                    <p className="mt-1 text-xs text-[#7A8374] max-w-sm mx-auto leading-relaxed">
                      {activeSubgroup
                        ? `We are curating fresh creations for ${activeSubgroup.name}. Add new dishes anytime via the Admin Portal.`
                        : `No dishes found for ${activeGroup.name} under current filters.`}
                    </p>
                  </div>
                ) : (
                  displayedDishes.map((dish) => (
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
                          unoptimized
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

                        {/* Bottom Right Subgroup Tag */}
                        {dish.subgroupName && (
                          <span className="absolute bottom-3 right-3 rounded-full bg-[#162115]/80 px-2.5 py-0.5 text-[9px] font-mono tracking-wider text-white backdrop-blur-xs">
                            {dish.subgroupName}
                          </span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-h-[72px]">
                        <h3 className="font-serif text-lg font-normal leading-snug text-[#1C241B] transition-colors group-hover:text-[#6d7835]">
                          {dish.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6E7569]">
                          {dish.description}
                        </p>
                      </div>

                      {/* Dietary Badges */}
                      {dish.dietary && dish.dietary.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {dish.dietary
                            .filter((tag) => tag !== "All")
                            .map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#FAF7F0] border border-[#ECE5D6] px-2 py-0.5 text-[9px] font-medium text-[#586255]"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Price & Add Action */}
                      <div className="mt-3 flex items-center justify-between border-t border-[#F2ECE0] pt-3">
                        <span className="font-sans text-base font-bold tabular-nums text-[#1C241B]">
                          AED {dish.price}
                        </span>

                        {(() => {
                          const selectedItem = selectedDishes.find(
                            (item) =>
                              (dish.id && item.id === dish.id) ||
                              item.name.toLowerCase() === dish.name.toLowerCase()
                          );
                          const currentQty = selectedItem?.quantity || 0;

                          if (currentQty > 0) {
                            return (
                              <div
                                className="flex items-center rounded-full border border-[#6d7835] bg-[#6d7835]/10 p-0.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(selectedItem!.id, -1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#6d7835] text-xs font-bold shadow-xs hover:bg-[#6d7835] hover:text-white transition-colors"
                                  title="Decrease quantity"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-bold text-[#1C241B] tabular-nums">
                                  {currentQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(selectedItem!.id, 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6d7835] text-white text-xs font-bold shadow-xs hover:bg-[#5a642a] transition-colors"
                                  title="Increase quantity"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            );
                          }

                          return (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToSelection(dish);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6d7835] text-white text-xs font-bold shadow-xs hover:bg-[#5a642a] transition-colors"
                              title="Add to table selection"
                              aria-label={`Add ${dish.name} to table selection`}
                            >
                              +
                            </motion.button>
                          );
                        })()}
                      </div>
                    </motion.article>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>



      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#1C241B] text-white px-5 py-2.5 text-xs font-medium shadow-2xl border border-white/15 backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Table Selection Bar */}
      <TableSelectionBar onReserveClick={() => router.push("/reservation")} />

      {/* Modals */}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToSelection={handleAddToSelection}
        />
      )}

      {isReservationOpen && (
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectDish={(dish) => {
            setSelectedDish(dish);
            setIsSearchOpen(false);
          }}
        />
      )}
    </motion.div>
  );
}
