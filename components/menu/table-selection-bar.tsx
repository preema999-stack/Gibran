"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSelectedDishes,
  updateDishQuantity,
  removeDishFromSelection,
  clearTableSelection,
  SELECTION_UPDATED_EVENT,
  type SelectedDishItem,
} from "@/lib/table-selection";

interface TableSelectionBarProps {
  onReserveClick?: () => void;
}

export function TableSelectionBar({ onReserveClick }: TableSelectionBarProps) {
  const router = useRouter();
  const [items, setItems] = useState<SelectedDishItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setItems(getSelectedDishes());
    const handleUpdate = () => {
      setItems(getSelectedDishes());
    };
    window.addEventListener(SELECTION_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SELECTION_UPDATED_EVENT, handleUpdate);
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  const handleProceed = () => {
    if (onReserveClick) {
      onReserveClick();
    } else {
      router.push("/reservation");
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 max-w-xl w-[calc(100%-1.5rem)] sm:w-auto">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mb-2.5 max-h-72 overflow-y-auto rounded-2xl border border-white/20 bg-[#162115]/95 p-3.5 sm:p-4 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                  Table Selection
                </span>
                <span className="text-[11px] text-white/60">
                  ({totalCount} items)
                </span>
              </div>
              <button
                type="button"
                onClick={clearTableSelection}
                className="text-[11px] text-red-400/90 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-white/5 py-1">
              {items.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between gap-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {dish.imageUrl ? (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white/10">
                        <Image
                          src={dish.imageUrl}
                          alt={dish.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs">
                        🍽️
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{dish.name}</p>
                      <p className="text-[10px] text-white/60 tabular-nums">
                        AED {dish.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center rounded-lg border border-white/15 bg-white/10">
                      <button
                        type="button"
                        onClick={() => updateDishQuantity(dish.id, -1)}
                        className="px-2 py-0.5 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 text-[11px] font-bold text-white tabular-nums">
                        {dish.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateDishQuantity(dish.id, 1)}
                        className="px-2 py-0.5 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="w-16 text-right font-semibold text-[#C5A880] tabular-nums">
                      AED {dish.price * dish.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDishFromSelection(dish.id)}
                      className="p-1 text-white/40 hover:text-white"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating dock */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        className="flex items-center justify-between gap-3 sm:gap-5 rounded-2xl border border-white/20 bg-[#162115]/95 px-3.5 sm:px-5 py-2.5 sm:py-3 text-white shadow-2xl backdrop-blur-xl ring-1 ring-black/20"
      >
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2.5 sm:gap-3 text-left group"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#6d7835] text-white font-bold text-xs sm:text-sm shadow-md transition-transform group-hover:scale-105">
            {totalCount}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                Table Selection
              </span>
              <span className="text-[10px] text-white/60">
                {isExpanded ? "▲ Hide" : "▼ Review"}
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm font-semibold text-white">
              {items.length} {items.length === 1 ? "dish" : "dishes"} • AED {totalPrice}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#6d7835] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#5b642c] active:scale-95 transition-all shrink-0"
        >
          <span>Reserve Table</span>
          <span className="text-sm font-bold transition-transform group-hover:translate-x-1">→</span>
        </button>
      </motion.div>
    </div>
  );
}
