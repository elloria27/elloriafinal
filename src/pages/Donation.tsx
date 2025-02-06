import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationStories } from "@/components/donation/DonationStories";
import { DonationPartners } from "@/components/donation/DonationPartners";
import { DonationFAQ } from "@/components/donation/DonationFAQ";
import { DonationJoinMovement } from "@/components/donation/DonationJoinMovement";

const Donation = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <DonationHero />
        <DonationImpact />
        <DonationForm />
        <DonationStories />
        <DonationPartners />
        <DonationFAQ />
        <DonationJoinMovement />
      </main>
    </div>
  );
};

export default Donation;