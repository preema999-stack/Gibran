"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FULL_MENU_CATEGORIES, type MenuItem, type MenuCategoryData } from "@/lib/full-menu-data";
import { useSmoothScroll } from "@/components/smooth-scroll-provider";

export function SearchModal({
  isOpen,
  onClose,
  onSelectDish,
  categories = FULL_MENU_CATEGORIES,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: MenuItem) => void;
  categories?: MenuCategoryData[];
}) {
  const { lenis } = useSmoothScroll();
  const modalCardRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    lenis?.stop();
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.paddingRight = prevPadding;
      lenis?.start();
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const el = modalCardRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const allItems: MenuItem[] = (categories || FULL_MENU_CATEGORIES).flatMap((c) => c.items);
  // remove duplicates by id
  const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values());

  const filtered = query.trim()
    ? uniqueItems.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query.toLowerCase()) ||
          dish.description.toLowerCase().includes(query.toLowerCase()) ||
          dish.ingredients?.some((ing) => ing.toLowerCase().includes(query.toLowerCase())) ||
          dish.dietary.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : uniqueItems.slice(0, 6);

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 sm:p-4 sm:pt-28 overscroll-contain"
      >
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#161D15]/80 backdrop-blur-sm overscroll-contain"
        />

        <motion.div
          ref={modalCardRef}
          data-lenis-prevent="true"
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden overscroll-contain rounded-2xl sm:rounded-3xl border border-[#ECE5D6] bg-[#FAF8F5] p-4 sm:p-6 shadow-2xl"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Header search bar */}
          <div className="relative flex items-center border-b border-[#ECE5D6] pb-4">
            <svg
              className="h-5 w-5 text-[#868E81]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              autoFocus
              placeholder="Search dishes, ingredients (truffle, za'atar, lamb)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-3 flex-1 border-none bg-transparent p-0 text-base font-normal text-[#1C241B] placeholder-[#8C9387] focus:ring-0"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-[#868E81] hover:bg-[#EAE4D7] hover:text-[#1C241B]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Filter suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9FA69B]">
              Suggestions:
            </span>
            {["Truffle", "Bruschetta", "Calamari", "Wings", "Lamb", "Vegetarian"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="rounded-full bg-[#EFE9DD] px-3 py-1 text-[11px] font-medium text-[#2E372B] hover:bg-[#6d7835] hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Dish list */}
          <div className="mt-4 max-h-[50vh] sm:max-h-[380px] overflow-y-auto pr-1 space-y-2.5">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectDish(item);
                    onClose();
                  }}
                  className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#EDE7D9] bg-white p-3 shadow-xs hover:border-[#1C241B]/30 hover:bg-[#F6F2E8] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EFE9DD]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#1C241B] group-hover:text-[#C5A880] transition-colors">
                        {item.name}
                      </h4>
                      <p className="line-clamp-1 text-[11px] text-[#767E71]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-xs sm:text-sm font-bold tabular-nums tracking-normal text-[#1C241B]">
                      AED {item.price}
                    </span>
                    {item.badge && (
                      <span className="block text-[8.5px] font-bold uppercase tracking-wider text-[#C5A880]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-[#868E81]">
                No culinary creations matched &ldquo;{query}&rdquo;. Try another ingredient or category.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
