"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MenuHeader({
  onOpenSearch,
  onOpenReservation,
}: {
  onOpenSearch: () => void;
  onOpenReservation: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ECE7DC] bg-[#FAF7F0]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:h-28 lg:px-12">
        {/* Brand Logo & Monogram */}
        <Link href="/" className="group flex items-center">
          <div className="relative flex h-16 w-auto sm:h-20 lg:h-24 items-center justify-center transition-all duration-500 ease-editorial group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Gibran & Co. Haute Cuisine"
              width={180}
              height={140}
              priority
              className="h-full w-auto object-contain transition-transform duration-500 ease-editorial group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden items-center space-x-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C241B]/75 md:flex lg:space-x-10">
          <Link
            href="/"
            className="transition-colors hover:text-[#1C241B]"
          >
            Home
          </Link>
          <div className="relative py-1 font-bold text-[#1C241B]">
            <span>Menu</span>
            {/* Active underline bar */}
            <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#1C241B]" />
          </div>
          <Link
            href="/gallery"
            className="transition-colors hover:text-[#1C241B]"
          >
            Gallery
          </Link>
          <button
            type="button"
            onClick={onOpenReservation}
            className="transition-colors hover:text-[#1C241B] uppercase tracking-[0.2em]"
          >
            Reservation
          </button>
          <Link
            href="/#about"
            className="transition-colors hover:text-[#1C241B]"
          >
            About Us
          </Link>
          <Link
            href="/#contact"
            className="transition-colors hover:text-[#1C241B]"
          >
            Contact Us
          </Link>
        </nav>

        {/* Action Buttons: Search & Book a Table */}
        <div className="flex items-center gap-4 lg:gap-5">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search dishes and menu"
            className="p-2 text-[#1C241B] hover:text-[#C5A880] transition-colors"
          >
            <svg
              className="h-4 w-4 stroke-current"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>

          <Link
            href="/reservation"
            className="inline-flex items-center justify-center rounded-full bg-[#6d7835] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-[#5b642c] hover:shadow-md sm:px-6 sm:py-3"
          >
            Book a Table
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-full p-2 text-[#1C241B] md:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-[#ECE7DC] bg-[#FAF7F0] px-6 py-4 md:hidden"
          >
            <nav className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-[#1C241B]">
              <Link href="/" className="py-1">Home</Link>
              <span className="py-1 font-bold text-[#C5A880]">Menu (Active)</span>
              <Link href="/gallery" className="py-1">Gallery</Link>
              <Link href="/reservation" className="py-1 text-left">
                Reservation
              </Link>
              <Link href="/#about" className="py-1">About Us</Link>
              <Link href="/#contact" className="py-1">Contact Us</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
