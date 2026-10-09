"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  galleryCategories,
  galleryItems,
  exhibitionReelItems,
  guestSocialStream,
} from "@/lib/gallery-data";
import { SoundscapePlayer } from "@/components/gallery/soundscape-player";
import { LightboxModal } from "@/components/gallery/lightbox-modal";
import { ArrowLeftIcon, ArrowRightIcon, PinIcon, HeartIcon } from "@/components/icons";

type ViewMode = "masonry" | "editorial" | "grid";

export function GalleryView() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [reelIndex, setReelIndex] = useState(0);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Curator's Reel navigation
  const handleShiftReel = (direction: number) => {
    const total = exhibitionReelItems.length;
    setReelIndex((prev) => (prev + direction + total) % total);
  };

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="relative overflow-hidden bg-surface text-on-surface">
      {/* 1. AMBIENT FLOATING BOTANICAL SPRIGS */}
      <div
        className="pointer-events-none absolute -top-10 -left-12 w-64 md:w-96 opacity-20 leaf-float z-0"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrG_NoAwHe6SRInIPW5WxHOHGTj_lil8wRqsw9IgeYPYR-_GDi85nPiKpZJZH2iwVZ8xuV8fyunUiHbGikurLD4HSXm_U1R2ItKYb1f6lx-C85eCES9Y5BwnHNlZvyisXTXiDBhNmKrtFI2S1uigfZqyc5u4iUVbySFkRZIFQOg1dBe9jScHLr6GY4vjKx0D9Jz-FAxWrGZWht8gtwGutaujST_A9OGHuzQKfh-mQtivlj_2PApHVSlz1FDEpBpYix9AY"
          alt="Botanical Olive Sprig"
          className="h-auto w-full -rotate-12 object-contain"
        />
      </div>

      <div
        className="pointer-events-none absolute top-32 -right-16 w-72 md:w-96 opacity-15 leaf-float z-0"
        style={{ animationDelay: "-5s" }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLnVv4GtmXr2IRCZpCmbXIgtQD9FVPykFVtVSVLbaYxwK3kCCFqAZvVihbvpYnTG7jdbBFkvfqS1_4ZRB95w7DrUILfgi-u0801l3y05Mn1BeqLJGGDMQSMLl05Rv3QMNDtz5dS5BI9Au3PWFrk3QLfIrwkJ-wTXZAN1cI4T2VQb76xDtZ8YDppYwx_qQuApzFY-J1wn_OwwtGCAdqvGFmddT-U5tIURVMkg500oV2E1GCMyEPVg3d9RvUifPC0JFzCrw"
          alt="Botanical Olive Branch"
          className="h-auto w-full rotate-45 object-contain"
        />
      </div>

      {/* 2. EDITORIAL HEADER & FILTER PILLS */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-6 pt-16 pb-12 text-center lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary-container bg-secondary-container/60 px-4 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-on-secondary-container">
            Visual Archive • Atmosphere • Culinary Craft
          </span>
        </div>

        <h1 className="mx-auto mb-5 max-w-4xl font-serif text-4xl font-normal leading-tight text-primary sm:text-5xl lg:text-6xl">
          Moments of Warmth, Heritage &amp; Artistry
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base font-light leading-relaxed text-on-surface-variant sm:text-lg">
          Explore the sensory archive of Gibran &amp; Co. — from sunlit limestone colonnades framed by 300-year-old olive trees to the delicate culinary mastery of the Levant.
        </p>

        {/* Dynamic Category Filters */}
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
          {galleryCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-surface shadow-md scale-[1.02]"
                    : "border border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-secondary-container/80"
                }`}
              >
                {cat.label}{" "}
                <span className="ml-1 font-mono text-[11px] opacity-70">
                  ({String(cat.count).padStart(2, "0")})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. CINEMATIC SPOTLIGHT HERO WITH AMBIENT AUDIO EQUALIZER */}
      <section className="relative z-10 mx-auto mb-20 max-w-[1320px] px-6 lg:px-12">
        <div className="group relative w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container shadow-xl">
          <div
            className="relative min-h-[440px] w-full cursor-pointer overflow-hidden aspect-[16/9] md:aspect-[21/9]"
            onClick={() => openLightbox(0)}
          >
            {/* Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlgIambDGnF998SMyTpXGNrNsWW2fW0dRwsV-UMoi9jlDBLDutaFqcdq8D-KJP_6Y6spMnwFhGx38SOheWrRk80bbEkT4xqe_XRMUzYdhdSzjTZLGpRsa_iBqVhG5ZwEcDVn9LI1Qy-KBbR_86nrc91hFrN2qfOrsZJEC-7GM73X8yMK-QRWVFHAhvgcie8TT_wfOTiF8Ucx_p2QzkYotAM7tvQAv0td_vMyFRo8WUl15LEE7OgrV8HCr2AeYJEqO-VL4"
              alt="The Olive Arches Dining Sanctuary"
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-surface/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow backdrop-blur-md">
                <PinIcon className="h-3.5 w-3.5 text-secondary" />
                Bahrain Flagship • The Olive Arches
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-surface backdrop-blur-md">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                Click to Inspect
              </span>
            </div>

            {/* Center Audio Soundscape Widget */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <SoundscapePlayer />
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="pointer-events-none absolute bottom-0 inset-x-0 flex flex-col justify-between gap-4 p-6 text-surface md:flex-row md:items-end md:p-8">
              <div className="max-w-2xl">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-secondary-container">
                  Architectural Sanctuary • Frame 01
                </span>
                <p className="text-sm font-light leading-snug text-surface-container-low md:text-base">
                  Hand-carved limestone colonnades, 300-year-old olive trees, and sun-drenched courtyard dining beneath handwoven khayzaran cane pendants.
                </p>
              </div>

              <div className="flex items-center gap-5 rounded-xl border border-white/10 bg-primary/60 px-5 py-2.5 text-xs backdrop-blur-md">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-secondary-container">
                    Capacity
                  </span>
                  <span className="font-medium">140 Guests</span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-secondary-container">
                    Daily Ambiance
                  </span>
                  <span className="font-medium">12:00 PM – 11:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATOR'S EXHIBITION REEL (HORIZONTAL CAROUSEL SLIDER) */}
      <section className="relative z-10 mx-auto mb-20 max-w-[1320px] px-6 lg:px-12">
        <div className="mb-6 flex items-end justify-between border-b border-outline-variant/40 pb-3">
          <div>
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Seasonal Retrospective
            </span>
            <h2 className="font-serif text-2xl font-normal text-primary md:text-3xl">
              Curator&apos;s Exhibition Reel
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="mr-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              0{reelIndex + 1} / 0{exhibitionReelItems.length}
            </span>
            <button
              type="button"
              onClick={() => handleShiftReel(-1)}
              aria-label="Previous reel slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/70 text-primary transition-colors hover:bg-surface-container"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleShiftReel(1)}
              aria-label="Next reel slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/70 text-primary transition-colors hover:bg-surface-container"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${reelIndex * 100}%)`,
            }}
          >
            {exhibitionReelItems.map((reel) => (
              <div
                key={reel.id}
                className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3"
              >
                <div
                  onClick={() => openLightbox(reel.itemIndex)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reel.src}
                      alt={reel.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      {reel.badge}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-serif text-base font-semibold text-primary group-hover:text-secondary transition-colors">
                        {reel.title}
                      </h3>
                      <span className="font-mono text-xs font-bold text-secondary">
                        {reel.price}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs font-light text-on-surface-variant">
                      {reel.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ASYMMETRICAL EDITORIAL GALLERY WITH VIEW TOGGLES */}
      <section className="relative z-10 mx-auto mb-24 max-w-[1320px] px-6 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-outline-variant/40 pb-4 md:flex-row md:items-end">
          <div>
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Curated Plates &amp; Spaces
            </span>
            <h2 className="font-serif text-3xl font-normal text-primary md:text-4xl">
              The Sensory Collection
            </h2>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container-low p-1.5">
            <button
              type="button"
              onClick={() => setViewMode("masonry")}
              className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                viewMode === "masonry"
                  ? "bg-primary text-surface shadow"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              Masonry
            </button>

            <button
              type="button"
              onClick={() => setViewMode("editorial")}
              className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                viewMode === "editorial"
                  ? "bg-primary text-surface shadow"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="8" />
                <rect x="3" y="13" width="18" height="8" />
              </svg>
              Editorial
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-surface shadow"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Mosaic
            </button>
          </div>
        </div>

        {/* Dynamic Gallery Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + viewMode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className={
              viewMode === "editorial"
                ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                : viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
                : "grid grid-cols-1 md:grid-cols-12 gap-7 items-start"
            }
          >
            {/* When Masonry Mode is Active and Category is "all", display the curated asymmetrical layout */}
            {viewMode === "masonry" && activeCategory === "all" ? (
              <>
                {/* ITEM 1: Lamb Ashta (Tall Portrait col-span-5) */}
                <div
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl md:col-span-5"
                  onClick={() => openLightbox(1)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryItems[1].src}
                      alt={galleryItems[1].headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      Signature Entrée
                    </span>
                    <span className="absolute top-4 right-4 rounded-full bg-primary/70 px-2.5 py-1 font-mono text-[10px] text-surface backdrop-blur-md">
                      PLATE 01
                    </span>

                    {/* Floating Bottom Hover Reveal Bar */}
                    <div className="absolute bottom-4 inset-x-4 flex translate-y-3 items-center justify-between rounded-xl border border-white/40 bg-surface/95 p-3 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Inspect Provenance
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant">
                        Aperture f/2.4
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="font-serif text-xl font-semibold text-primary transition-colors group-hover:text-secondary">
                        {galleryItems[1].headline}
                      </h3>
                      <span className="font-mono text-sm font-bold text-secondary">
                        {galleryItems[1].price}
                      </span>
                    </div>
                    <p className="mb-4 text-xs font-light leading-relaxed text-on-surface-variant sm:text-sm">
                      {galleryItems[1].desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase text-on-secondary-container">
                        Grass-Fed
                      </span>
                      <span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase text-on-surface-variant">
                        Heritage Spices
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT CLUSTER (Col 6-12) */}
                <div className="flex flex-col gap-7 md:col-span-7">
                  {/* ITEM 2: Herb Velouté (Horizontal Layout) */}
                  <div
                    className="group grid cursor-pointer grid-cols-1 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl sm:grid-cols-12"
                    onClick={() => openLightbox(2)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface-container sm:aspect-auto sm:col-span-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={galleryItems[2].src}
                        alt={galleryItems[2].headline}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                        First Course
                      </span>
                    </div>
                    <div className="flex flex-col justify-between p-6 sm:col-span-6">
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-secondary">
                          Cold-Pressed Harvest
                        </span>
                        <h3 className="mb-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-secondary">
                          {galleryItems[2].headline}
                        </h3>
                        <p className="mb-4 text-xs font-light leading-relaxed text-on-surface-variant">
                          {galleryItems[2].desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-surface-container pt-3">
                        <span className="font-mono text-xs font-bold text-secondary">
                          {galleryItems[2].price}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                          Vegan Organic
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ITEM 3: The Sunlit Colonnade */}
                  <div
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl"
                    onClick={() => openLightbox(0)}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={galleryItems[0].src}
                        alt="The Sunlit Colonnade"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      <div className="absolute right-6 bottom-5 left-6 flex items-end justify-between">
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-widest text-secondary-container">
                            Adliya Sanctuary
                          </span>
                          <h3 className="font-serif text-xl font-medium text-surface">
                            The Sunlit Colonnade
                          </h3>
                        </div>
                        <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-primary shadow">
                          Salon 01
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2 OF MASONRY */}
                {/* ITEM 4: Afternoon Light in the Garden */}
                <div
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl md:col-span-4"
                  onClick={() => openLightbox(4)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryItems[4].src}
                      alt={galleryItems[4].headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      Atmosphere
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-secondary">
                      {galleryItems[4].headline}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-on-surface-variant">
                      {galleryItems[4].desc}
                    </p>
                  </div>
                </div>

                {/* ITEM 5: Hearth & Wood-Fired Za'atar */}
                <div
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl md:col-span-4"
                  onClick={() => openLightbox(5)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryItems[5].src}
                      alt={galleryItems[5].headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      From the Hearth
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-secondary">
                      {galleryItems[5].headline}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-on-surface-variant">
                      {galleryItems[5].desc}
                    </p>
                  </div>
                </div>

                {/* ITEM 6: Wine Cellar & Majlis */}
                <div
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl md:col-span-4"
                  onClick={() => openLightbox(3)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryItems[3].src}
                      alt={galleryItems[3].headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      Twilight Evenings
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-secondary">
                      {galleryItems[3].headline}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-on-surface-variant">
                      {galleryItems[3].desc}
                    </p>
                  </div>
                </div>

                {/* ITEM 7: Roastery Cezve */}
                <div
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl md:col-span-6"
                  onClick={() => openLightbox(6)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryItems[6].src}
                      alt={galleryItems[6].headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      Roastery Craft
                    </span>
                    <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl bg-surface/90 p-3 backdrop-blur-md">
                      <span className="font-serif text-sm font-semibold text-primary">
                        Slow Sand-Brewed Cezve
                      </span>
                      <span className="font-mono text-xs font-bold text-secondary">
                        ROAST NO. 12
                      </span>
                    </div>
                  </div>
                </div>

                {/* ITEM 8: Courtyard Olive Grove Arcade */}
                <div
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl md:col-span-6"
                  onClick={() => openLightbox(7)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryItems[7].src}
                      alt={galleryItems[7].headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      Living Heritage
                    </span>
                    <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl bg-surface/90 p-3 backdrop-blur-md">
                      <span className="font-serif text-sm font-semibold text-primary">
                        Centuries-Old Olive Grove
                      </span>
                      <span className="font-mono text-xs font-bold text-secondary">
                        FRAME 08
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Filtered or Alternate Grid View */
              filteredItems.map((item) => {
                const globalIndex = galleryItems.findIndex((g) => g.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => openLightbox(globalIndex >= 0 ? globalIndex : 0)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.src}
                        alt={item.headline}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {item.badge && (
                        <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                          {item.badge}
                        </span>
                      )}
                      {item.price && (
                        <span className="absolute top-4 right-4 rounded-full bg-primary/70 px-2.5 py-1 font-mono text-[11px] font-bold text-surface backdrop-blur-md">
                          {item.price}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-secondary">
                        {item.headline}
                      </h3>
                      <p className="line-clamp-2 text-xs font-light leading-relaxed text-on-surface-variant">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 6. CHEF'S MONOLOGUE & CRAFT FEATURE */}
      <section className="relative z-10 mx-auto mb-24 max-w-[1320px] px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low p-8 md:p-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                  Behind the Pass &amp; Kitchen Hearth
                </span>
              </div>

              <h2 className="font-serif text-3xl font-normal leading-tight text-primary md:text-4xl">
                Crafted by Heritage,<br />
                Refined by Mediterranean Fire
              </h2>

              <p className="text-sm font-light leading-relaxed text-on-surface md:text-base">
                At Gibran &amp; Co., culinary art is an homage to memory. Our kitchen bridges ancient Levantine slow-cooking with contemporary culinary poise. We work strictly with single-estate purveyors who harvest in harmony with natural seasons.
              </p>

              <blockquote className="my-3 border-l-2 border-secondary pl-4 font-serif text-base italic text-primary/80">
                “We do not rush fire. It took centuries for our culinary culture to arrive at this nuance; our dishes honor that patience.”
                <span className="mt-1 block font-sans text-xs font-bold uppercase not-italic tracking-widest text-secondary">
                  — Chef Tariq El-Gibran, Founder
                </span>
              </blockquote>

              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center">
                  <span className="block font-serif text-2xl text-primary">300+</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Old Olive Trees
                  </span>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center">
                  <span className="block font-serif text-2xl text-primary">100%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Stoneware Ceramic
                  </span>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center">
                  <span className="block font-serif text-2xl text-primary">48-Hr</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Wild Ferment
                  </span>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/40 shadow-lg"
                onClick={() => openLightbox(8)}
              >
                <div className="aspect-[4/5] bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_Uel7yy6HX30oMEQJirO1mfUHXRAbKxo6xFW_GxlXOYw0N66sr3ytfJ3g0z0Jg4Fq284NTzMGTnehl9479EH-DBpWjjsU4lWEK8QgU2CuSCo3iL4ixRV8zQZlMy8_jVjjmOv4-0F7Wr2vYJ9jNPWbJ_f2UosAioTmBkPH6_dMH5hF4ZWx1nXE19mInzI6Jp8A3Uwrwu8vZgZBGJcRwcHGtCh5p_-YDp1_HoEvBdLR7gMg9x0F68mXSw"
                    alt="Plating art at the pass"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between rounded-xl border border-white/50 bg-surface/90 p-3 shadow backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-surface shadow">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Chef&apos;s Monologue: The Philosophy of Fire
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-secondary">
                    02:45 MIN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SHARED BY OUR GUESTS (INSTAGRAM STREAM) */}
      <section className="relative z-10 mx-auto mb-24 max-w-[1320px] px-6 lg:px-12">
        <div className="mb-8 flex items-end justify-between border-b border-outline-variant/40 pb-3">
          <div>
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Live Impressions
            </span>
            <h2 className="font-serif text-3xl font-normal text-primary">
              Shared by Our Guests
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary"
          >
            @gibranandco
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {guestSocialStream.map((guest) => (
            <div
              key={guest.handle}
              onClick={() => openLightbox(guest.itemIndex)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guest.src}
                alt={guest.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-primary/40 text-surface opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <HeartIcon className="h-6 w-6 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  {guest.handle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. INVITATION & RESERVATION CTA */}
      <section className="relative z-10 mx-auto mb-20 max-w-[1320px] px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-secondary-container/80 bg-secondary-container/50 px-8 py-16 text-center md:p-20">
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              An Invitation to Linger
            </span>

            <h2 className="font-serif text-3xl font-normal leading-tight text-primary sm:text-4xl lg:text-5xl">
              Experience Gibran &amp; Co. in Person
            </h2>

            <p className="text-sm font-light leading-relaxed text-on-surface-variant md:text-base">
              Whether for an unhurried courtyard lunch, an intimate private evening, or a celebratory banquet, reserve your table at our Adliya sanctuary.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-3 sm:flex-row">
              <Link
                href="/reservation"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-surface shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
              >
                Reserve a Table →
              </Link>

              <Link
                href="/reservation"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-outline-variant/40 bg-surface px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-surface-container"
              >
                Inquire for Private Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        currentIndex={currentLightboxIndex}
        items={galleryItems}
        onClose={closeLightbox}
        onSelectIndex={(idx) => setCurrentLightboxIndex(idx)}
      />
    </div>
  );
}
