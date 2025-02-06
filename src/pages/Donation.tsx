import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationStories } from "@/components/donation/DonationStories";
import { DonationPartners } from "@/components/donation/DonationPartners";
import { DonationFAQ } from "@/components/donation/DonationFAQ";
import { DonationJoinMovement } from "@/components/donation/DonationJoinMovement";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Donation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <DonationHero />
        <DonationImpact />
        <DonationForm />
        <DonationStories />
        <DonationPartners />
        <DonationFAQ />
        <DonationJoinMovement />
      </main>
      <Footer />
    </div>
  );
};

export default Donation;