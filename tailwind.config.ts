import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: "#F9F7F2",
        ivory: "#FAF8F5",
        sand: "#F3EFE6",
        oliveDark: "#1C241B",
        forestDark: "#161D15",
        oliveMuted: "#586255",
        oliveBtn: "#6d7835",
        oliveBtnHover: "#5b642c",
        sageGreen: "#8A9A86",
        sageLight: "#E8ECE6",
        warmGold: "#C5A880",
        charcoal: "#242624",
      },
      fontFamily: {
        // next/font keeps the real family names, so these resolve directly.
        // Quoted because several are multi-word.
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
        script: ['"Alex Brush"', "cursive"],
        manrope: ["Manrope", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "80rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;
