import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MenuContent } from "@/components/menu/menu-content";

export const metadata = {
  title: "Our Menu · GIBRAN & CO.",
  description:
    "A curated selection of authentic Mediterranean and Levantine flavors for every refined palate.",
};

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className="grain relative min-h-screen bg-[#FAF7F0] pt-6 pb-24">
        <Suspense fallback={<div className="min-h-screen" />}>
          <MenuContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
