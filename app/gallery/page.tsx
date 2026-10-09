import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GalleryView } from "@/components/gallery/gallery-view";

export const metadata: Metadata = {
  title: "Editorial Gallery & Visual Archive | Gibran & Co.",
  description:
    "Explore the sensory archive of Gibran & Co. — from sunlit limestone colonnades and ancient olive courtyards to Levantine culinary artistry and sand-brewed roastery rituals.",
  keywords: [
    "Gibran & Co. Gallery",
    "Adliya Bahrain Fine Dining",
    "Levantine Gastronomy Archive",
    "Courtyard Dining Bahrain",
    "Artisanal Roastery",
    "Olive Grove Architecture",
  ],
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="grain relative min-h-screen bg-surface">
        <GalleryView />
      </main>
      <Footer />
    </>
  );
}
