"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/smooth-scroll-provider";

const VIDEO_SRC = "/video/cake.mp4";

/**
 * The crossfaded clip is built to open on source frame 11 (frames 11..60
 * blended with 1..10), so this is the exact still the video's first frame
 * shows — the poster hands over to playback without a visible jump.
 */
const VIDEO_POSTER = "/Exquisite/ezgif-frame-011.jpg";

/** Warm ground behind the poster, and the reduced-motion end state. */
const FALLBACK =
  "linear-gradient(120deg, #1d241b 0%, #2b3329 45%, #4a3f2c 100%)";

/**
 * Looping background plate for the pinned journey section.
 *
 * The footage is a seamless 2.08s crossfade loop cut from public/cake.mp4
 * (see scripts/make-video.mjs), so it can cycle indefinitely with no visible
 * seam. It is decorative, hence muted + inline + no controls: that combination
 * is what browsers permit to autoplay without a user gesture.
 */
export function JourneyPlate({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (reduced) {
      video.pause();
      return;
    }

    let cancelled = false;
    const attempt = video.play();

    if (attempt) {
      attempt
        .then(() => {
          if (!cancelled) setPlaying(true);
        })
        .catch(() => {
          // Autoplay refused (low-power mode, data saver). The poster and the
          // gradient ground stay put, so this degrades quietly.
        });
    } else {
      setPlaying(true);
    }

    return () => {
      cancelled = true;
    };
  }, [reduced]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Gradient ground. Sits behind everything and remains the visible
          state whenever the video cannot play. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: FALLBACK }}
      />

      <video
        ref={ref}
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
