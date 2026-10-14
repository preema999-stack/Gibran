import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

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
  icons: { icon: "/images/logo.png" },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <SmoothScrollProvider>
          <a
            href="#hero"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-oliveDark focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.16em] focus:text-white"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <FirebaseAnalytics />
          {children}
          <FloatingWhatsApp />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
