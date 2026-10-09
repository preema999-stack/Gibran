"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { signatureDishes } from "@/lib/data";
import { EASE_EDITORIAL, SplitText } from "@/components/motion-primitives";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

export function SignatureDishes() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  /* How many cards fit at the current breakpoint. */
  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      setPerView(width < 640 ? 1 : width < 1024 ? 2 : 4);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const maxIndex = Math.max(0, signatureDishes.length - perView);

  const scrollToCard = useCallback(
    (next: number) => {
      const clamped = Math.min(maxIndex, Math.max(0, next));
      setIndex(clamped);
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[clamped] as HTMLElement | undefined;
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    },
    [maxIndex]
  );

  /* Arrow-key support while the carousel has focus. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToCard(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToCard(index - 1);
    }
  };

  return (
    <section
      id="signature"
      className="grain relative border-b border-[#ECE7DC] bg-[#FAF7F0] py-20 lg:py-24"
    >
      <div className="shell">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.span
              className="eyebrow mb-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            >
              Artisanal Flavors
            </motion.span>
            <h2 className="font-serif text-3xl font-normal leading-tight text-oliveDark sm:text-4xl lg:text-5xl">
              <SplitText text="Our Signature Dishes" as="span" />
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <CarouselButton
              label="Previous dishes"
              onClick={() => scrollToCard(index - 1)}
              disabled={index === 0}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </CarouselButton>
            <CarouselButton
              label="Next dishes"
              onClick={() => scrollToCard(index + 1)}
              disabled={index >= maxIndex}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </CarouselButton>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Signature dishes"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 outline-none scroll-smooth lg:-mx-12 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {signatureDishes.map((dish, i) => (
            <motion.article
              key={dish.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${signatureDishes.length}`}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: i * 0.09, ease: EASE_EDITORIAL }}
              whileHover="hover"
              className="group flex w-[84vw] shrink-0 snap-start flex-col justify-between rounded-2xl border border-[#ECE7DC] bg-white p-4 dish-shadow transition-shadow duration-500 ease-editorial hover:shadow-[0_18px_30px_-8px_rgba(28,36,27,0.14)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
            >
              <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl bg-sand">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 84vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
                />
                <AnimatePresence>
                  {dish.tag && (
                    <motion.span
                      initial={{ opacity: 0, y: -8 }}
                      variants={{ hover: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
                      className="absolute left-3 top-3 rounded-full bg-[#FAF8F5]/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-oliveDark backdrop-blur-sm"
                    >
                      {dish.tag}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h3 className="font-serif text-xl font-semibold leading-snug text-oliveDark">
                  {dish.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-oliveMuted">
                  {dish.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F0ECE1] pt-3">
                <span className="font-serif text-xl font-bold text-oliveDark">
                  {dish.price}
                </span>
                <button
                  type="button"
                  className="group/order inline-flex items-center gap-1.5 rounded-full bg-[#6d7835] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#5b642c]"
                >
                  Order
                  <ArrowRightIcon className="h-3 w-3 transition-transform duration-500 ease-editorial group-hover/order:translate-x-1" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Progress rail */}
        {maxIndex > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#ECE7DC]">
              <motion.div
                className="h-full origin-left bg-warmGold"
                animate={{ scaleX: maxIndex === 0 ? 1 : (index + 1) / (maxIndex + 1) }}
                transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
              />
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-oliveMuted">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(maxIndex + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-oliveDark/20 text-oliveDark transition-all duration-300 ease-editorial hover:border-[#6d7835] hover:bg-[#6d7835] hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      <span className="transition-transform duration-500 ease-editorial group-hover:-translate-x-0.5 group-active:scale-90">
        {children}
      </span>
    </button>
  );
}
