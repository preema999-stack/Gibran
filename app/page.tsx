import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Marquee } from "@/components/marquee";
import { SignatureDishes } from "@/components/signature-dishes";
import { TasteTheDifference } from "@/components/taste-the-difference";
import { MoodSection } from "@/components/mood-section";
import { ReservationSection } from "@/components/reservation-section";
import { Pillars } from "@/components/pillars";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Journey />
        <SignatureDishes />
        <Marquee />
        <TasteTheDifference />
        <MoodSection />
        <ReservationSection />
        <Pillars />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
