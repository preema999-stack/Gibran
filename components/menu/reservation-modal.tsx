"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ReservationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [location, setLocation] = useState("Bahrain — Block 338 Adliya");
  const [guests, setGuests] = useState("2 Guests");
  const [date, setDate] = useState("Tonight");
  const [time, setTime] = useState("8:00 PM");
  const [seating, setSeating] = useState("Main Dining Salon");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `GIB-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(code);
    setStep("confirmed");
  };

  const handleReset = () => {
    setStep("form");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="absolute inset-0 bg-[#161D15]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE5D6] bg-[#FAF8F5] p-6 shadow-2xl sm:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleReset}
            aria-label="Close reservation modal"
            className="absolute right-5 top-5 rounded-full p-2 text-[#6E7569] hover:bg-[#EDE7DA] hover:text-[#1C241B] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-3">
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
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {["Main Dining Salon", "Olive Terrace", "Chef's Table"].map((seat) => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => setSeating(seat)}
                      className={`rounded-xl px-2.5 py-2 text-center text-[11px] font-medium transition-all ${
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
              <div className="grid grid-cols-2 gap-3 pt-1">
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
                    Phone Number
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

              <div className="pt-4">
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
