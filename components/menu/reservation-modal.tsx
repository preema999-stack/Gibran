"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon, MailIcon, CopyIcon, CheckIcon } from "@/components/icons";
import { useSmoothScroll } from "@/components/smooth-scroll-provider";
import {
  createWhatsAppUrl,
  createEmailUrl,
  formatReservationMessage,
} from "@/lib/reservation-utils";
import {
  getSelectedDishes,
  removeDishFromSelection,
  SELECTION_UPDATED_EVENT,
  type SelectedDishItem,
} from "@/lib/table-selection";

export function ReservationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { lenis } = useSmoothScroll();
  const modalCardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [location, setLocation] = useState("Bahrain — Block 338 Adliya");
  const [guests, setGuests] = useState("2 Guests");
  const [date, setDate] = useState("Tonight");
  const [time, setTime] = useState("8:00 PM");
  const [seating, setSeating] = useState("Main Dining Salon");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notifyChannel, setNotifyChannel] = useState<"whatsapp" | "email" | "both">("both");
  const [copied, setCopied] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [selectedDishes, setSelectedDishes] = useState<SelectedDishItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDishes(getSelectedDishes());
    }
    const onUpdate = () => setSelectedDishes(getSelectedDishes());
    window.addEventListener(SELECTION_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(SELECTION_UPDATED_EVENT, onUpdate);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    lenis?.stop();
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.paddingRight = prevPadding;
      lenis?.start();
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const el = modalCardRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `GIB-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(code);
    setStep("confirmed");
  };

  const handleReset = () => {
    setStep("form");
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overscroll-contain"
      >
        {/* Backdrop */}
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="absolute inset-0 bg-[#161D15]/80 backdrop-blur-sm overscroll-contain"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalCardRef}
          data-lenis-prevent="true"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl border border-[#ECE5D6] bg-[#FAF8F5] p-5 shadow-2xl sm:p-8"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleReset}
            aria-label="Close reservation modal"
            className="absolute right-4 top-4 sm:right-5 sm:top-5 rounded-full p-2 text-[#6E7569] hover:bg-[#EDE7DA] hover:text-[#1C241B] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#C5A880]">
                  Gibran &amp; Co. Reservations
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1C241B] sm:text-3xl">
                  Reserve Your Table
                </h3>
                <p className="mt-1 text-xs text-[#6E7569]">
                  Experience Levantine fine dining with unhurried hospitality.
                </p>
              </div>

              {/* Table Selection from Menu */}
              {selectedDishes.length > 0 && (
                <div className="rounded-2xl border border-[#DCD5C6] bg-white p-3.5 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6d7835]">
                      🍽️ Added to Table Selection ({selectedDishes.reduce((a, b) => a + b.quantity, 0)})
                    </span>
                    <span className="text-xs font-bold text-[#1C241B] tabular-nums">
                      AED {selectedDishes.reduce((sum, d) => sum + d.price * d.quantity, 0)}
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1.5 divide-y divide-[#F0ECE1] pr-1">
                    {selectedDishes.map((dish) => (
                      <div key={dish.id} className="flex items-center justify-between pt-1.5 first:pt-0 text-xs">
                        <span className="text-[#1C241B] font-medium">{dish.quantity}x {dish.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#7B8475] tabular-nums">AED {dish.price * dish.quantity}</span>
                          <button
                            type="button"
                            onClick={() => removeDishFromSelection(dish.id)}
                            className="text-[#99A293] hover:text-red-500 text-[10px] px-1"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#DCD5C6] bg-white px-3.5 py-2.5 text-xs text-[#1C241B] focus:border-[#1C241B] focus:ring-0"
                >
                  <option>Bahrain — Block 338 Adliya</option>
                  <option>Abu Dhabi — Al Maryah Island</option>
                  <option>Beirut — Saifi Village</option>
                </select>
              </div>

              {/* Guests and Date */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DCD5C6] bg-white px-3.5 py-2.5 text-xs text-[#1C241B] focus:border-[#1C241B] focus:ring-0"
                  >
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>8+ Private Dining</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                    Time Slot
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DCD5C6] bg-white px-3.5 py-2.5 text-xs text-[#1C241B] focus:border-[#1C241B] focus:ring-0"
                  >
                    <option>12:30 PM (Lunch)</option>
                    <option>2:00 PM (Lunch)</option>
                    <option>7:00 PM (Dinner)</option>
                    <option>8:00 PM (Dinner)</option>
                    <option>9:30 PM (Late Dinner)</option>
                  </select>
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                  Seating Experience
                </label>
                <div className="mt-1.5 grid grid-cols-1 xs:grid-cols-3 gap-1.5 sm:gap-2">
                  {["Main Dining Salon", "Olive Terrace", "Chef's Table"].map((seat) => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => setSeating(seat)}
                      className={`rounded-xl px-2 py-2 text-center text-[10px] sm:text-[11px] font-medium transition-all ${
                        seating === seat
                          ? "bg-[#1C241B] text-white shadow-sm"
                          : "border border-[#DCD5C6] bg-white text-[#4A5346] hover:bg-[#F2ECE0]"
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Alexander Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#DCD5C6] bg-white px-3.5 py-2.5 text-xs text-[#1C241B] focus:border-[#1C241B] focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+973 3900 1234"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#DCD5C6] bg-white px-3.5 py-2.5 text-xs text-[#1C241B] focus:border-[#1C241B] focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                    Email Address (Optional — for confirmation)
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DCD5C6] bg-white px-3.5 py-2.5 text-xs text-[#1C241B] focus:border-[#1C241B] focus:ring-0"
                  />
                </div>

                {/* Send booked message preference */}
                <div className="rounded-xl border border-[#DCD5C6] bg-[#F7F2E7]/80 p-2.5 space-y-1.5">
                  <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#7B8475]">
                    Send Booked Message Via:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNotifyChannel("whatsapp")}
                      className={`flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[10.5px] font-medium transition-all ${
                        notifyChannel === "whatsapp"
                          ? "bg-[#25D366] text-white shadow-xs font-semibold"
                          : "bg-white text-[#4A5346] border border-[#DCD5C6]"
                      }`}
                    >
                      <WhatsAppIcon className="h-3 w-3 fill-current" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyChannel("email")}
                      className={`flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[10.5px] font-medium transition-all ${
                        notifyChannel === "email"
                          ? "bg-[#1C241B] text-white shadow-xs font-semibold"
                          : "bg-white text-[#4A5346] border border-[#DCD5C6]"
                      }`}
                    >
                      <MailIcon className="h-3 w-3" />
                      <span>Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyChannel("both")}
                      className={`flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[10.5px] font-medium transition-all ${
                        notifyChannel === "both"
                          ? "bg-[#6d7835] text-white shadow-xs font-semibold"
                          : "bg-white text-[#4A5346] border border-[#DCD5C6]"
                      }`}
                    >
                      <span>Both</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#6d7835] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:bg-[#5b642c] transition-all"
                >
                  Confirm Table Reservation
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#6d7835] text-white">
                <svg className="h-6 w-6 stroke-current" fill="none" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C5A880]">
                Reservation Confirmed
              </span>
              <h3 className="font-serif text-3xl font-normal text-[#1C241B]">
                We Look Forward to Welcoming You
              </h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-[#6E7569]">
                Your table for <strong>{guests}</strong> at <strong>{location}</strong> has been secured for <strong>{time}</strong> ({seating}).
              </p>

              <div className="mx-auto inline-block rounded-2xl border border-dashed border-[#C5A880] bg-[#F7F2E7] px-6 py-3">
                <span className="block text-[9px] font-semibold uppercase tracking-widest text-[#7B8475]">
                  Reservation Code
                </span>
                <span className="font-mono text-base font-bold tracking-widest text-[#1C241B]">
                  {confirmationCode}
                </span>
              </div>

              {/* Selected Dishes Summary in Confirmation */}
              {selectedDishes.length > 0 && (
                <div className="mx-auto max-w-sm rounded-xl border border-[#DCD5C6] bg-white p-3 text-left space-y-1.5 shadow-xs">
                  <div className="flex justify-between text-xs font-bold text-[#1C241B] border-b border-[#F0ECE1] pb-1.5">
                    <span>Table Selection ({selectedDishes.reduce((a, b) => a + b.quantity, 0)} items)</span>
                    <span className="text-[#6d7835]">AED {selectedDishes.reduce((sum, d) => sum + d.price * d.quantity, 0)}</span>
                  </div>
                  <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] text-[#4A5346] pr-1">
                    {selectedDishes.map((dish) => (
                      <div key={dish.id} className="flex justify-between">
                        <span>{dish.quantity}x {dish.name}</span>
                        <span className="tabular-nums">AED {dish.price * dish.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Details to Cafe */}
              <div className="mx-auto max-w-sm rounded-2xl border border-[#DCD5C6] bg-white p-3.5 space-y-2.5 shadow-xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C241B]">
                    Send Details to Cafe
                  </span>
                  <span className="text-[9.5px] text-[#7B8475]">
                    WhatsApp: +91 79941 29471
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={createWhatsAppUrl(
                      {
                        bookingCode: confirmationCode,
                        name,
                        phone,
                        email,
                        guests,
                        time,
                        date,
                        location,
                        seating,
                        selectedDishes: selectedDishes.map((d) => ({
                          name: d.name,
                          quantity: d.quantity,
                          price: d.price,
                        })),
                      },
                      "917994129471"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const msg = formatReservationMessage({
                        bookingCode: confirmationCode,
                        name,
                        phone,
                        email,
                        guests,
                        time,
                        date,
                        location,
                        seating,
                        selectedDishes: selectedDishes.map((d) => ({
                          name: d.name,
                          quantity: d.quantity,
                          price: d.price,
                        })),
                      });
                      navigator.clipboard?.writeText(msg).catch(() => {});
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#20ba59] transition-all"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-white" />
                    <span>Send to Cafe WhatsApp</span>
                  </a>
                  <a
                    href={createEmailUrl(
                      {
                        bookingCode: confirmationCode,
                        name,
                        phone,
                        email,
                        guests,
                        time,
                        date,
                        location,
                        seating,
                        selectedDishes: selectedDishes.map((d) => ({
                          name: d.name,
                          quantity: d.quantity,
                          price: d.price,
                        })),
                      }
                    )}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1C241B] px-3 py-2.5 text-xs font-semibold text-[#FAF7F0] shadow-xs hover:bg-[#2e3a2c] transition-all"
                  >
                    <MailIcon className="h-3.5 w-3.5" />
                    <span>Email Cafe</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const msg = formatReservationMessage({
                      bookingCode: confirmationCode,
                      name,
                      phone,
                      email,
                      guests,
                      time,
                      date,
                      location,
                      seating,
                      selectedDishes: selectedDishes.map((d) => ({
                        name: d.name,
                        quantity: d.quantity,
                        price: d.price,
                      })),
                    });
                    navigator.clipboard.writeText(msg).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    });
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#DCD5C6] bg-[#FAF8F5] py-1.5 text-[10px] font-medium text-[#4A5346] hover:bg-[#F2ECE0] transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3 w-3 text-[#25D366]" />
                      <span className="text-[#25D366] font-semibold">Booking Details Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3 w-3" />
                      <span>Copy Reservation Details</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-[#6d7835] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:bg-[#5b642c] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
