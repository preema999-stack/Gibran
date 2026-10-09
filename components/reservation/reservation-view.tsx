"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PinIcon,
  ClockIcon,
  PhoneIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  UserIcon,
  WhatsAppIcon,
  MailIcon,
  CopyIcon,
  CheckIcon,
} from "@/components/icons";
import { EASE_EDITORIAL, SplitText, Magnetic } from "@/components/motion-primitives";
import {
  createWhatsAppUrl,
  createEmailUrl,
  formatReservationMessage,
} from "@/lib/reservation-utils";

interface ReservationData {
  name: string;
  phone: string;
  email?: string;
  location: string;
  date: string;
  time: string;
  guests: string;
  seating?: string;
  notes?: string;
}

const locationOptions = [
  "Bahrain — Block 338 Adliya",
  "Abu Dhabi — Al Maryah Island",
  "Beirut — Saifi Village",
];

export function ReservationView() {
  const [formData, setFormData] = useState<ReservationData>({
    name: "",
    phone: "",
    email: "",
    location: "Bahrain — Block 338 Adliya",
    date: "",
    time: "7:00 PM",
    guests: "2 Guests",
    seating: "Main Dining Hall",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [notifyChannel, setNotifyChannel] = useState<"whatsapp" | "email" | "both">("both");
  const [copied, setCopied] = useState(false);
  const [isPlayingBgVideo, setIsPlayingBgVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => setIsPlayingBgVideo(true))
        .catch(() => {
          setIsPlayingBgVideo(false);
        });
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const locParam = params.get("location");
      if (locParam) {
        const match = locationOptions.find((loc) =>
          loc.toLowerCase().includes(locParam.toLowerCase())
        );
        if (match) {
          setFormData((prev) => ({ ...prev, location: match }));
        }
      }
    }
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setIsPlayingBgVideo(false);
    } else {
      video
        .play()
        .then(() => setIsPlayingBgVideo(true))
        .catch((err) => {
          console.warn("Video playback interrupted or restricted:", err);
          setIsPlayingBgVideo(false);
        });
    }
  };

  const timeSlots = [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
  ];

  const guestOptions = [
    "1 Guest",
    "2 Guests",
    "3 Guests",
    "4 Guests",
    "5 Guests",
    "6 Guests",
    "7 Guests",
    "8 Guests",
    "10+ Guests (Group)",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingRef(`GC-${Math.floor(10000 + Math.random() * 90000)}`);
      setIsConfirmed(true);
    }, 700);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setCopied(false);
    setFormData((prev) => ({
      name: "",
      phone: "",
      email: "",
      location: prev.location || locationOptions[0],
      date: "",
      time: "7:00 PM",
      guests: "2 Guests",
      seating: "Main Dining Hall",
      notes: "",
    }));
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-[#182317] text-[#FAF7F0] flex flex-col justify-between">
      {/* FULL BACKGROUND RESTAURANT IMAGE & LIVE VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* High-res static image backdrop */}
        <Image
          src="/images/reservation-dining.jpg"
          alt="Gibran & Co. candlelit fine dining room"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-right lg:object-center transition-transform duration-1000"
        />

        {/* Ambient video that plays seamlessly in the background */}
        <video
          ref={videoRef}
          src="/video/gemini_generated_video_5d903c52.mp4"
          poster="/images/reservation-dining.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlay={() => setIsPlayingBgVideo(true)}
          onPause={() => setIsPlayingBgVideo(false)}
          className="absolute inset-0 h-full w-full object-cover object-right lg:object-center transition-opacity duration-700 ease-in-out opacity-100"
        />

        {/* Sophisticated dark olive gradient mask matching the reference image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172316] via-[#172316]/90 to-[#172316]/20 hidden lg:block" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#172316] via-[#172316]/92 to-[#172316]/75 lg:hidden" />
      </div>

      {/* BOTANICAL SILHOUETTES (Corner accents matching reference screenshot) */}
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 1.2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-12 left-4 z-10 select-none opacity-35 sm:bottom-16 sm:left-10 lg:bottom-20 lg:left-12"
      >
        <svg
          className="h-28 w-28 text-[#7A9176] sm:h-36 sm:w-36 lg:h-44 lg:w-44"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M10 90 Q 30 65 50 45 T 80 15" strokeLinecap="round" />
          <path d="M30 65 C 20 60 18 45 28 48 C 38 51 32 63 30 65 Z" fill="currentColor" fillOpacity="0.4" />
          <path d="M45 50 C 42 38 52 35 55 42 C 58 49 48 50 45 50 Z" fill="currentColor" fillOpacity="0.4" />
          <path d="M60 35 C 50 30 52 18 62 20 C 72 22 64 33 60 35 Z" fill="currentColor" fillOpacity="0.4" />
          <path d="M72 23 C 68 12 78 10 82 18 C 86 26 75 24 72 23 Z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, -1.2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute right-4 top-24 z-10 select-none opacity-25 sm:right-8 lg:right-10"
      >
        <svg
          className="h-24 w-24 text-[#8BA487] sm:h-32 sm:w-32"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M90 10 Q 70 35 50 55 T 20 85" strokeLinecap="round" />
          <path d="M70 35 C 80 40 82 55 72 52 C 62 49 68 37 70 35 Z" fill="currentColor" fillOpacity="0.35" />
          <path d="M55 50 C 58 62 48 65 45 58 C 42 51 52 50 55 50 Z" fill="currentColor" fillOpacity="0.35" />
          <path d="M40 65 C 50 70 48 82 38 80 C 28 78 36 67 40 65 Z" fill="currentColor" fillOpacity="0.35" />
        </svg>
      </motion.div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT FORM COLUMN */}
          <div className="lg:col-span-6 xl:col-span-5">
            <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div
                  key="reservation-form"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: EASE_EDITORIAL } }}
                  transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
                  className="space-y-6"
                >
                  {/* Eyebrow & Mobile Video Toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: EASE_EDITORIAL }}
                    className="flex items-center justify-between"
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C5A880]">
                      RESERVATION
                    </span>

                    {/* Mobile Atmosphere Motion Pill */}
                    <button
                      type="button"
                      onClick={toggleVideo}
                      className="inline-flex lg:hidden items-center gap-2 rounded-full border border-[#6d7835] bg-[#6d7835] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-md active:scale-95 transition-all hover:bg-[#5b642c]"
                    >
                      {isPlayingBgVideo ? (
                        <>
                          <PauseIcon className="h-3 w-3 fill-white" />
                          <span>Playing</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-3 w-3 fill-white translate-x-0.5" />
                          <span>Play Atmosphere</span>
                        </>
                      )}
                    </button>
                  </motion.div>

                  {/* Heading with flowing word-by-word SplitText */}
                  <h1 className="font-serif text-4xl font-normal leading-[1.12] text-[#FAF7F0] sm:text-5xl lg:text-[54px] xl:text-6xl">
                    <SplitText text="Reserve Your" as="span" delay={0.18} immediate />
                    <br />
                    <SplitText text="Table" as="span" delay={0.32} immediate />
                  </h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.42, ease: EASE_EDITORIAL }}
                    className="max-w-md text-xs font-light leading-relaxed text-[#D2DCD0] sm:text-sm"
                  >
                    Indulge in an unforgettable dining experience. Book your table
                    in advance and let us take care of the rest.
                  </motion.p>

                  {/* Form with flowing staggered inputs */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Row 1: Name, Phone & Email */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: EASE_EDITORIAL }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-[#C5A880]">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                            className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 pl-11 pr-5 text-xs font-light text-white placeholder-white/55 backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                          />
                        </div>

                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-[#C5A880]">
                            <PhoneIcon className="h-4 w-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Phone Number (WhatsApp)"
                            className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 pl-11 pr-5 text-xs font-light text-white placeholder-white/55 backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-[#C5A880]">
                          <MailIcon className="h-4 w-4" />
                        </div>
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Email Address (Optional — for confirmation)"
                          className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 pl-11 pr-5 text-xs font-light text-white placeholder-white/55 backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                        />
                      </div>
                    </motion.div>

                    {/* Row 2: Destination Location */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.55, ease: EASE_EDITORIAL }}
                      className="relative"
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-[#C5A880]">
                        <PinIcon className="h-4 w-4" />
                      </div>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 pl-11 pr-10 text-xs font-light text-white backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                      >
                        {locationOptions.map((loc) => (
                          <option key={loc} value={loc} className="bg-[#1C261A] text-white">
                            {loc}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Row 3: Date & Time */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: EASE_EDITORIAL }}
                      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2"
                    >
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 px-5 text-xs font-light text-white placeholder-white/55 backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880] [color-scheme:dark]"
                        />
                      </div>

                      <div className="relative">
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 pl-5 pr-10 text-xs font-light text-white backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot} className="bg-[#1C261A] text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>

                    {/* Row 3: Guests count */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7, ease: EASE_EDITORIAL }}
                      className="relative"
                    >
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full rounded-full border border-white/25 bg-black/20 py-3.5 pl-5 pr-10 text-xs font-light text-white backdrop-blur-md transition-all focus:border-[#C5A880] focus:bg-black/35 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                      >
                        {guestOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#1C261A] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Send booked confirmation preference */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.75, ease: EASE_EDITORIAL }}
                      className="rounded-2xl border border-white/15 bg-black/30 p-3.5 space-y-2 backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
                          Send Booked Message Via:
                        </span>
                        <span className="text-[10px] text-white/50">
                          Instant delivery
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setNotifyChannel("whatsapp")}
                          className={`flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-[11px] font-medium transition-all ${
                            notifyChannel === "whatsapp"
                              ? "bg-[#25D366] text-white shadow-md font-semibold ring-2 ring-white/20"
                              : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifyChannel("email")}
                          className={`flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-[11px] font-medium transition-all ${
                            notifyChannel === "email"
                              ? "bg-[#C5A880] text-[#1C241B] shadow-md font-semibold ring-2 ring-white/20"
                              : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <MailIcon className="h-3.5 w-3.5" />
                          <span>Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifyChannel("both")}
                          className={`flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-[11px] font-medium transition-all ${
                            notifyChannel === "both"
                              ? "bg-white text-[#1C241B] shadow-md font-semibold ring-2 ring-white/20"
                              : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <span>Both</span>
                        </button>
                      </div>
                    </motion.div>

                    {/* Action button */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8, ease: EASE_EDITORIAL }}
                      className="pt-2"
                    >
                      <Magnetic strength={0.22}>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center gap-3 rounded-full bg-[#6d7835] px-9 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-xl transition-all duration-300 hover:bg-[#5b642c] hover:shadow-2xl active:scale-95 disabled:opacity-60"
                        >
                          <span>{isSubmitting ? "Reserving..." : "Book Now"}</span>
                          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
                        </button>
                      </Magnetic>
                    </motion.div>
                  </form>
                </motion.div>
              ) : (
                /* CONFIRMATION CARD */
                <motion.div
                  key="confirmation-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-3xl border border-white/25 bg-black/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6d7835] text-white text-lg font-bold">
                      ✓
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                        Confirmed Reservation
                      </span>
                      <h2 className="font-serif text-2xl font-semibold text-white">
                        Table Reserved
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs font-light leading-relaxed text-white/80">
                    Thank you, <strong className="font-semibold text-white">{formData.name}</strong>.
                    Your table has been reserved with Haute Cuisine concierge.
                  </p>

                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Booking Code:</span>
                      <span className="font-mono font-bold text-[#C5A880]">{bookingRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Guests:</span>
                      <span className="font-medium text-white">{formData.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Time & Date:</span>
                      <span className="font-medium text-white">
                        {formData.time} • {formData.date || "Tonight"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Location:</span>
                      <span className="font-medium text-white">{formData.location}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Phone:</span>
                        <span className="font-medium text-white">{formData.phone}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Email:</span>
                        <span className="font-medium text-white">{formData.email}</span>
                      </div>
                    )}
                  </div>

                  {/* SEND BOOKED MESSAGE OPTIONS */}
                  <div className="rounded-2xl border border-white/20 bg-black/40 p-4 space-y-3 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                        Send Booked Message
                      </span>
                      <span className="text-[10px] text-white/60">
                        1-Click Share
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {/* WhatsApp Button */}
                      <a
                        href={createWhatsAppUrl(
                          {
                            bookingCode: bookingRef,
                            name: formData.name,
                            phone: formData.phone,
                            email: formData.email,
                            guests: formData.guests,
                            time: formData.time,
                            date: formData.date,
                            location: formData.location,
                            seating: formData.seating,
                            notes: formData.notes,
                          },
                          formData.phone
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#20ba59] hover:shadow-lg active:scale-[0.98]"
                      >
                        <WhatsAppIcon className="h-4 w-4 fill-white transition-transform group-hover:scale-110" />
                        <span>Send to WhatsApp</span>
                      </a>

                      {/* Email Button */}
                      <a
                        href={createEmailUrl(
                          {
                            bookingCode: bookingRef,
                            name: formData.name,
                            phone: formData.phone,
                            email: formData.email,
                            guests: formData.guests,
                            time: formData.time,
                            date: formData.date,
                            location: formData.location,
                            seating: formData.seating,
                            notes: formData.notes,
                          },
                          formData.email
                        )}
                        className="group flex items-center justify-center gap-2 rounded-xl border border-[#C5A880]/60 bg-[#C5A880]/20 px-4 py-3 text-xs font-semibold text-[#FAF7F0] shadow-md transition-all hover:bg-[#C5A880] hover:text-[#1C241B] hover:shadow-lg active:scale-[0.98]"
                      >
                        <MailIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>Send via Email</span>
                      </a>
                    </div>

                    {/* Copy to clipboard button */}
                    <button
                      type="button"
                      onClick={() => {
                        const msg = formatReservationMessage({
                          bookingCode: bookingRef,
                          name: formData.name,
                          phone: formData.phone,
                          email: formData.email,
                          guests: formData.guests,
                          time: formData.time,
                          date: formData.date,
                          location: formData.location,
                          seating: formData.seating,
                          notes: formData.notes,
                        });
                        navigator.clipboard.writeText(msg).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2500);
                        });
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5 text-[#25D366]" />
                          <span className="text-[#25D366] font-semibold">Booking Details Copied!</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-3.5 w-3.5" />
                          <span>Copy Confirmation Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full bg-[#6d7835] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#5b642c] transition-all shadow-md"
                    >
                      Book Another Table
                    </button>
                    <Link
                      href="/"
                      className="rounded-full bg-[#6d7835] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#5b642c] transition-all shadow-md"
                    >
                      Return to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT CINEMATIC HERO OVERLAY CONTROLS */}
          <div className="relative hidden lg:col-span-6 lg:flex xl:col-span-7 h-full min-h-[460px] flex-col items-center justify-center">
            {/* Center Glowing Play / Pause Button with flowing entrance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.48, ease: EASE_EDITORIAL }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVideo}
                aria-label={isPlayingBgVideo ? "Pause background atmosphere motion" : "Play background atmosphere motion"}
                className={`group relative z-20 flex h-20 w-20 items-center justify-center rounded-full border backdrop-blur-md shadow-2xl transition-all duration-300 ${
                  isPlayingBgVideo
                    ? "border-[#6d7835] bg-[#6d7835] ring-4 ring-[#6d7835]/40 text-white"
                    : "border-[#6d7835] bg-[#6d7835] text-white hover:bg-[#5b642c] hover:border-[#5b642c]"
                }`}
              >
                {!isPlayingBgVideo && (
                  <span className="absolute inset-0 rounded-full bg-[#6d7835]/40 animate-ping" />
                )}
                {isPlayingBgVideo ? (
                  <PauseIcon className="h-7 w-7 fill-white" />
                ) : (
                  <PlayIcon className="h-7 w-7 fill-white translate-x-0.5 transition-transform group-hover:scale-110" />
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM INFO DOCK with flowing entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.65, ease: EASE_EDITORIAL }}
        className="relative z-10 w-full px-4 pb-6 pt-2 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl rounded-2xl sm:rounded-full border border-white/15 bg-[#141C13]/85 px-6 py-4 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Item 1: Location */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A880]/30 bg-[#C5A880]/15 text-[#C5A880]">
                <PinIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A6B8A2]">
                  Location
                </span>
                <span className="font-serif text-sm font-medium text-white sm:text-base">
                  {formData.location.split("—")[0].trim() || "Bahrain"}
                </span>
              </div>
            </div>

            {/* Item 2: Open Hours */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A880]/30 bg-[#C5A880]/15 text-[#C5A880]">
                <ClockIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A6B8A2]">
                  Open Hours
                </span>
                <span className="font-serif text-sm font-medium text-white sm:text-base">
                  12:00 PM – 11:00 PM
                </span>
              </div>
            </div>

            {/* Item 3: Call Us */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A880]/30 bg-[#C5A880]/15 text-[#C5A880]">
                <PhoneIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A6B8A2]">
                  Call Us
                </span>
                <a
                  href="tel:+97317294488"
                  className="font-serif text-sm font-medium text-white hover:text-[#C5A880] transition-colors sm:text-base"
                >
                  +973 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
