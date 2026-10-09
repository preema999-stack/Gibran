"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItem } from "@/lib/full-menu-data";

export function DishModal({
  dish,
  onClose,
  onAddToSelection,
}: {
  dish: MenuItem | null;
  onClose: () => void;
  onAddToSelection: (dish: MenuItem) => void;
}) {
  if (!dish) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#161D15]/75 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-[#ECE5D6] bg-[#FAF8F5] shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Dish Image */}
          <div className="relative h-64 w-full bg-[#EFE9DC]">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover"
            />
            {dish.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold tracking-widest text-[#1C241B] uppercase shadow-md backdrop-blur-sm">
                {dish.badge}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent h-20 bottom-0 top-auto" />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
                  Gourmet Selection
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1C241B] sm:text-3xl">
                  {dish.name}
                </h3>
              </div>
              <span className="font-sans text-xl sm:text-2xl font-bold tabular-nums tracking-normal text-[#1C241B]">
                AED {dish.price}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#6E7569]">
              {dish.description}
            </p>

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="mt-5 border-t border-[#ECE5D6] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C241B]">
                  Key Ingredients &amp; Provenance
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dish.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full bg-[#EDE7DA] px-2.5 py-1 text-[11px] font-medium text-[#3A4337]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Wine Pairing */}
            {dish.winePairing && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E7DFCD] bg-[#F4EFE5] p-3 text-xs text-[#2E372B]">
                <span className="text-base">🍷</span>
                <div>
                  <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#C5A880]">
                    Sommelier Pairing
                  </span>
                  <p className="font-medium">{dish.winePairing}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between gap-4 pt-2">
              <span className="text-xs text-[#8A9283]">
                {dish.calories ? `${dish.calories} • ` : ""}Fresh to Order
              </span>
              <button
                type="button"
                onClick={() => {
                  onAddToSelection(dish);
                  onClose();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#6d7835] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:bg-[#5b642c] hover:scale-[1.02] transition-all"
              >
                Add to Table Selection
                <span>+</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
