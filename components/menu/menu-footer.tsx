"use client";

import Link from "next/link";

export function MenuFooter() {
  return (
    <footer className="mt-16 border-t border-[#EAE3D4] bg-[#FAF7F0] pt-14 pb-12 text-[#1C241B]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Narrative */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold tracking-[0.2em] text-[#1C241B]">
              GIBRAN &amp; CO.
            </h4>
            <p className="max-w-xs text-xs leading-relaxed text-[#6E7569]">
              Where every dish tells a story of heritage, fire, and culinary craftsmanship.
            </p>
          </div>

          {/* Col 2: Location */}
          <div className="space-y-2">
            <span className="block text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#1C241B]">
              Location
            </span>
            <p className="text-xs leading-relaxed text-[#6E7569]">
              Building 204, Road 3803
              <br />
              Block 338, Adliya, Kingdom of Bahrain
            </p>
          </div>

          {/* Col 3: Dining Hours */}
          <div className="space-y-2">
            <span className="block text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#1C241B]">
              Dining Hours
            </span>
            <p className="text-xs leading-relaxed text-[#6E7569]">
              Lunch: 12:00 PM – 4:00 PM
              <br />
              Dinner: 6:30 PM – Midnight
            </p>
          </div>

          {/* Col 4: Direct Contact */}
          <div className="space-y-2">
            <span className="block text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#1C241B]">
              Direct Contact
            </span>
            <p className="text-xs leading-relaxed text-[#6E7569]">
              +973 1729 4488
              <br />
              concierge@gibranandco.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#ECE5D6] pt-6 text-[11px] text-[#868E81] sm:flex-row">
          <p>© 2026 Gibran &amp; Co. Haute Dining. All rights reserved.</p>
          <div className="mt-3 flex items-center gap-6 sm:mt-0">
            <Link href="#" className="hover:text-[#1C241B] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#1C241B] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-[#1C241B] transition-colors">
              Allergen Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
