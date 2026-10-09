"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
// `gsap/dist/*` is the SSR-safe entry — the bare ESM path breaks the server build.
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

/** Shared viewport flags so every animation honours the user's OS setting. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      // Honour the OS preference: no virtual scroll, native behaviour.
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = instance;
    setLenis(instance);

    // Drive Lenis from GSAP's ticker so ScrollTrigger stays perfectly in sync.
    const onUpdate = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onUpdate);
    gsap.ticker.lagSmoothing(0);

    // Bridge Lenis' scroll events into ScrollTrigger so triggers fire on the
    // interpolated position, not only on native scroll ticks.
    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    // Recalculate trigger positions as layout settles: after first paint,
    // after webfonts resolve, and again once every image has loaded.
    const refresh = () => ScrollTrigger.refresh();
    const settle = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      instance.off("scroll", onScroll);
      gsap.ticker.remove(onUpdate);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const pathname = usePathname();

  // Reset scroll to top on page route changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const scrollTo = (target: string | number | HTMLElement, offset = -96) => {
    const instance = lenisRef.current;
    if (!instance) {
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (typeof el === "number") window.scrollTo({ top: el });
      else if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
      return;
    }
    instance.scrollTo(target, { offset, duration: 1.4 });
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
