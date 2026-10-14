"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "@/components/icons";
import { EASE_EDITORIAL } from "@/components/motion-primitives";
import { useSmoothScroll } from "@/components/smooth-scroll-provider";

type StoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export function StoryModal({
  isOpen,
  onClose,
  title = "The Gibran Story • Culinary Odyssey",
}: StoryModalProps) {
  const { lenis } = useSmoothScroll();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape & handle body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    lenis?.stop();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevPadding = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
    };
  }, [isOpen, onClose, lenis]);

  // Handle play / pause when modal opens / closes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isOpen) {
      video.currentTime = 0;
      video.play().catch(() => {
        // Autoplay policy fallback: user can click native play button
      });
    } else {
      video.pause();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#121612] shadow-2xl"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-3.5">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
                <span className="h-2 w-2 rounded-full bg-warmGold animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#FAF8F5]/90 truncate">
                  {title}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close story video"
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:text-white"
              >
                <CloseIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                playsInline
                controls
                className="h-full w-full object-contain"
              >
                <source src="/video/Gibraan%20story.mp4" type="video/mp4" />
                <source src="/video/gibran-story.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
