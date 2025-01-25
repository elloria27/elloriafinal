import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
import { DonationForm } from "@/components/donation/DonationForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Donation = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <DonationHero />
        <DonationImpact />
        <DonationForm />
      </main>
      <Footer />
    </div>
  );
};

export default Donation;