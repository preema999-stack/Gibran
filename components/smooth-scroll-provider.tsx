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
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // If on admin route, completely bypass Lenis so admin has 100% native browser scrolling
    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setLenis(null);
      }
      document.documentElement.classList.remove("lenis", "lenis-stopped", "lenis-smooth");
      document.body.classList.remove("lenis", "lenis-stopped", "lenis-smooth");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
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

    document.documentElement.classList.add("lenis");
    document.documentElement.classList.remove("lenis-stopped");

    // Drive Lenis from GSAP's ticker so ScrollTrigger stays perfectly in sync.
    const onUpdate = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onUpdate);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

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
      document.documentElement.classList.remove("lenis", "lenis-stopped");
    };
  }, [isAdmin]);

  // Route transition scroll reset
  useEffect(() => {
    if (!isAdmin && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, isAdmin]);

  const scrollTo = (target: string | number | HTMLElement, offset = -96) => {
    const instance = lenisRef.current;
    if (!instance) {
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (typeof el === "number") window.scrollTo({ top: el, behavior: "smooth" });
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
