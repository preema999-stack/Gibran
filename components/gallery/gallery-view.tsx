"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { galleryItems, GalleryItem } from "@/lib/gallery-data";

const categories = [
  { id: "all", label: "All" },
  { id: "architecture", label: "Architecture" },
  { id: "culinary", label: "Culinary" },
  { id: "majlis", label: "Majlis" },
  { id: "roastery", label: "Roastery" },
] as const;

export function GalleryView() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const selectedIndex = selectedItem
    ? filteredItems.findIndex((it) => it.id === selectedItem.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (selectedIndex === -1) return;
    const prev = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prev]);
  }, [selectedIndex, filteredItems]);

  const handleNext = useCallback(() => {
    if (selectedIndex === -1) return;
    const next = (selectedIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[next]);
  }, [selectedIndex, filteredItems]);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedItem, handleClose, handlePrev, handleNext]);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] text-[#1C241B]">
      {/* 1. ULTRA-MINIMAL HEADER */}
      <header className="mx-auto max-w-4xl px-6 pt-24 pb-8 text-center sm:pt-32 sm:pb-12">
        <h1 className="font-serif text-3xl font-light tracking-wide text-[#1C241B] sm:text-4xl md:text-5xl">
          Gallery
        </h1>

        {/* Minimal text-only filters with refined underline */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-[0.22em] text-[#586255] sm:gap-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? "font-semibold text-[#1C241B]"
                    : "text-[#586255]/70 hover:text-[#1C241B]"
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute -bottom-0.5 inset-x-0 h-px bg-[#1C241B]"
                    transition={{ duration: 0.25 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* 2. AIRY, BORDERLESS PHOTOGRAPHY GRID */}
      <main className="mx-auto max-w-6xl px-6 pb-28 sm:px-8">
        <motion.div
          layout
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 sm:gap-10 lg:gap-12"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer"
              >
                {/* Pure photography without cards or boxes */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#EAE6DF]">
                  <Image
                    src={item.src}
                    alt={item.headline}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>

                {/* Subtle, single-line caption */}
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h2 className="font-serif text-sm font-light text-[#1C241B]/90 transition-colors group-hover:text-[#1C241B]">
                    {item.headline}
                  </h2>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* 3. PURE FULLSCREEN LIGHTBOX (DISTRACTION-FREE) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
            onClick={handleClose}
          >
            {/* Minimal Header: Counter & Close */}
            <div
              className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-5 text-white/70"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-xs tracking-widest text-[#C5A880]">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(filteredItems.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 transition-colors hover:text-white sm:left-6"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 transition-colors hover:text-white sm:right-6"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Lightbox Image & Clean Title */}
            <div
              className="relative flex max-h-[85vh] max-w-4xl flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.src}
                alt={selectedItem.headline}
                className="max-h-[75vh] w-auto max-w-[90vw] rounded object-contain shadow-2xl"
              />
              <p className="mt-4 font-serif text-base font-light text-white/90">
                {selectedItem.headline}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
