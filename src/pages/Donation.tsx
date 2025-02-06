
import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationStories } from "@/components/donation/DonationStories";
import { DonationPartners } from "@/components/donation/DonationPartners";
import { DonationFAQ } from "@/components/donation/DonationFAQ";
import { DonationJoinMovement } from "@/components/donation/DonationJoinMovement";
import { DonationHeroContent, DonationImpactContent, DonationFormContent, DonationStoriesContent, DonationPartnersContent, DonationFAQContent, DonationJoinMovementContent } from "@/types/content-blocks";

const defaultHeroContent: DonationHeroContent = {
  title: "Make a Difference Today",
  description: "Your support helps us create positive change",
  buttonText: "Donate Now"
};

const defaultImpactContent: DonationImpactContent = {
  title: "Your Impact",
  description: "See how your donation makes a difference",
  impacts: []
};

const defaultFormContent: DonationFormContent = {
  title: "Donation Form",
  subtitle: "Choose your donation amount",
  buttonText: "Submit Donation"
};

const defaultStoriesContent: DonationStoriesContent = {
  title: "Impact Stories",
  subtitle: "Real stories of change",
  stories: []
};

const defaultPartnersContent: DonationPartnersContent = {
  title: "Our Partners",
  subtitle: "Working together for change",
  partners: []
};

const defaultFAQContent: DonationFAQContent = {
  title: "Frequently Asked Questions",
  subtitle: "Get answers to common questions",
  faqs: []
};

const defaultJoinMovementContent: DonationJoinMovementContent = {
  title: "Join Our Movement",
  description: "Be part of something bigger",
  buttonText: "Join Now"
};

const Donation = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <DonationHero content={defaultHeroContent} />
        <DonationImpact content={defaultImpactContent} />
        <DonationForm content={defaultFormContent} />
        <DonationStories content={defaultStoriesContent} />
        <DonationPartners content={defaultPartnersContent} />
        <DonationFAQ content={defaultFAQContent} />
        <DonationJoinMovement content={defaultJoinMovementContent} />
      </main>
    </div>
  );
};

export default Donation;
