"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GalleryItem } from "@/lib/gallery-data";
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { EASE_EDITORIAL, Magnetic } from "@/components/motion-primitives";

interface LightboxModalProps {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItem[];
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function LightboxModal({
  isOpen,
  currentIndex,
  items,
  onClose,
  onSelectIndex,
}: LightboxModalProps) {
  const [copied, setCopied] = useState(false);

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = () => {
    onSelectIndex((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    onSelectIndex((currentIndex + 1) % items.length);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, currentIndex, items.length]);

  return (
    <AnimatePresence>
      {isOpen && currentItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-primary/80 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop zoom out closer */}
          <div
            className="absolute inset-0 cursor-zoom-out"
            onClick={onClose}
            aria-label="Close modal backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
            className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-surface-container-lowest shadow-2xl md:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Image View */}
            <div className="relative flex min-h-[300px] sm:min-h-[360px] md:min-h-[500px] md:w-7/12 items-center justify-center overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentItem.src}
                alt={currentItem.headline}
                key={currentItem.src}
                className="h-full w-full max-h-[85vh] object-contain transition-all duration-500"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous artwork"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-primary shadow backdrop-blur-md transition-all hover:scale-105 hover:bg-surface"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next artwork"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-primary shadow backdrop-blur-md transition-all hover:scale-105 hover:bg-surface"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              {/* Bottom Frame Counter */}
              <div className="absolute bottom-4 left-4 rounded-full bg-primary/75 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-surface backdrop-blur-md">
                {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </div>
            </div>

            {/* Right Curatorial Details */}
            <div className="flex flex-col justify-between overflow-y-auto border-t border-outline-variant/30 bg-surface-container-low p-6 md:w-5/12 md:border-l md:border-t-0 md:p-8">
              <div>
                {/* Header Category and Close */}
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                    {currentItem.categoryLabel || "Archive Record"}
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close lightbox"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-primary shadow-sm transition-colors hover:bg-surface-container"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mb-3 font-serif text-2xl font-normal leading-snug text-primary">
                  {currentItem.headline}
                </h3>

                <div className="mb-4 h-0.5 w-10 bg-secondary" />

                <p className="mb-6 text-xs font-light leading-relaxed text-on-surface-variant sm:text-sm">
                  {currentItem.desc}
                </p>

                {/* Specs / Provenance Box */}
                <div className="space-y-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                      Location
                    </span>
                    <span className="font-medium text-primary">
                      {currentItem.location || "Adliya Block 338, Bahrain"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                      Ambiance
                    </span>
                    <span className="font-medium text-primary">
                      {currentItem.meta || "Natural Light • Flagship"}
                    </span>
                  </div>

                  {currentItem.specs && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Details
                      </span>
                      <span className="font-medium text-primary">
                        {currentItem.specs}
                      </span>
                    </div>
                  )}

                  {currentItem.aperture && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Capture
                      </span>
                      <span className="font-mono text-[11px] text-secondary">
                        {currentItem.aperture}
                      </span>
                    </div>
                  )}

                  {currentItem.price && (
                    <div className="flex items-center justify-between border-t border-surface-container pt-2">
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Price
                      </span>
                      <span className="font-mono font-bold text-secondary">
                        {currentItem.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 flex items-center gap-3 border-t border-outline-variant/30 pt-6">
                <Magnetic strength={0.2} className="flex-1">
                  <Link
                    href="/reservation"
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center rounded-full bg-primary py-3 text-center text-xs font-bold uppercase tracking-wider text-surface shadow transition-all duration-300 ease-editorial hover:bg-primary/90 hover:scale-[1.02]"
                  >
                    Reserve This Experience
                  </Link>
                </Magnetic>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Share archive link"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-sm transition-colors hover:bg-secondary-container"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                  {copied && (
                    <span className="absolute -top-8 right-0 rounded bg-primary px-2 py-0.5 text-[10px] text-surface whitespace-nowrap shadow">
                      Link copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
