import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AboutView } from "@/components/about/about-view";

export const metadata: Metadata = {
  title: "About Us & Levantine Heritage | Gibran & Co.",
  description:
    "Discover the story of Gibran & Co. — where ancient olive grove traditions, Levantine culinary artistry, and warm Mediterranean hospitality come together.",
  keywords: [
    "About Gibran & Co.",
    "Levantine Restaurant Heritage",
    "Adliya Bahrain Fine Dining",
    "Ancient Olive Tree Tradition",
    "Gibran Hospitality",
  ],
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main">
        <AboutView />
      </main>
      <Footer />
    </>
  );
}
