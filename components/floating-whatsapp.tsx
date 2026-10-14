"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons";
import { RESTAURANT_WHATSAPP_NUMBER, RESTAURANT_WHATSAPP_DISPLAY } from "@/lib/reservation-utils";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Do not render on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const defaultText = "Hello Gibran & Co., I would like to inquire about a reservation.";
  const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    defaultText
  )}`;

  return (
    <aside
      aria-label="WhatsApp Concierge"
      className="fixed bottom-6 right-6 z-40 flex items-center sm:bottom-8 sm:right-8"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mr-3 hidden items-center gap-2 rounded-2xl border border-[#25D366]/30 bg-[#162115]/95 px-3.5 py-2 text-left shadow-2xl backdrop-blur-md sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
            </span>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A6B8A2]">
                Concierge Online
              </p>
              <p className="font-sans text-xs font-semibold text-white">
                Chat on WhatsApp • {RESTAURANT_WHATSAPP_DISPLAY}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Gibran & Co. Concierge on WhatsApp at ${RESTAURANT_WHATSAPP_DISPLAY}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/25 transition-colors hover:bg-[#20ba59]"
      >
        {/* Soft pulse glow effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-pulse" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="relative h-7 w-7 fill-white transition-transform duration-300 group-hover:scale-110" />

        {/* Online Indicator Badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-[#10B981] shadow-xs" />
      </motion.a>
    </aside>
  );
}
