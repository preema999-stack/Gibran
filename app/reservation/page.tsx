import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ReservationView } from "@/components/reservation/reservation-view";

export const metadata = {
  title: "Reserve Your Table · GIBRAN & CO. Haute Cuisine",
  description:
    "Indulge in an unforgettable dining experience. Book your table in advance and let us take care of the rest.",
};

export default function ReservationPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-[#182317]">
        <ReservationView />
      </main>
      <Footer />
    </>
  );
}
