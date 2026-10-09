import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Playfair_Display, Montserrat, Manrope, Alex_Brush } from "next/font/google";

import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { ScrollProgress } from "@/components/scroll-progress";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex-brush",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gibranandco.example.com"),
  title: {
    default: "GIBRAN & CO. — Fine Dining & Exceptional Culinary Journey",
    template: "%s · GIBRAN & CO.",
  },
  description:
    "Gibran & Co. is a place where beautiful food, thoughtful design and warm hospitality come together to create unforgettable moments.",
  keywords: [
    "Lebanese restaurant",
    "fine dining",
    "Levantine cuisine",
    "Beirut",
    "Abu Dhabi",
    "Bahrain",
    "mezza",
  ],
  authors: [{ name: "Gibran & Co." }],
  openGraph: {
    type: "website",
    title: "GIBRAN & CO. — Fine Dining & Exceptional Culinary Journey",
    description:
      "Beautiful food, thoughtful design and warm hospitality — a place for unforgettable moments.",
    images: ["/images/hero.png"],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GIBRAN & CO.",
    description: "Fine dining & exceptional culinary journey.",
    images: ["/images/hero.png"],
  },
  icons: { icon: "/images/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${montserrat.variable} ${manrope.variable} ${alexBrush.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <SmoothScrollProvider>
          <a
            href="#hero"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-oliveDark focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.16em] focus:text-white"
          >
            Skip to content
          </a>
          <ScrollProgress />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
