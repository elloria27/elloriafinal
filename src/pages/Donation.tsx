import { Helmet } from "react-helmet-async";
import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationStories } from "@/components/donation/DonationStories";
import { DonationPartners } from "@/components/donation/DonationPartners";
import { DonationFAQ } from "@/components/donation/DonationFAQ";
import { DonationJoinMovement } from "@/components/donation/DonationJoinMovement";

const defaultContent = {
  hero: {
    title: "Make a Difference Today",
    subtitle: "Your donation helps provide essential feminine care products to those in need",
    backgroundImage: "/lovable-uploads/7a6b700f-4122-4c0b-ae5b-519bbf08e94a.png",
    donationLink: "#donate"
  },
  impact: {
    title: "Your Impact",
    description: "See how your donation makes a difference",
    impacts: [
      {
        icon: "Heart",
        title: "Lives Changed",
        description: "Providing dignity and comfort",
        value: "10,000+"
      }
    ]
  },
  form: {
    fixedAmounts: [10, 25, 50, 100],
    buttonText: "Donate Now",
    successMessage: "Thank you for your donation!",
    errorMessage: "Something went wrong. Please try again."
  },
  stories: {
    title: "Impact Stories",
    description: "Real stories from those we've helped",
    stories: []
  },
  partners: {
    title: "Our Partners",
    description: "Organizations we work with",
    partners: []
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Common questions about donations",
    faqs: []
  },
  joinMovement: {
    title: "Join Our Movement",
    description: "Be part of something bigger",
    buttonText: "Make a Difference Now",
    link: "#donate"
  }
};

export default function Donation() {
  return (
    <>
      <Helmet>
        <title>Donate | Elloria</title>
      </Helmet>
      <DonationHero content={defaultContent.hero} />
      <DonationImpact content={defaultContent.impact} />
      <DonationForm content={defaultContent.form} />
      <DonationStories content={defaultContent.stories} />
      <DonationPartners content={defaultContent.partners} />
      <DonationFAQ content={defaultContent.faq} />
      <DonationJoinMovement content={defaultContent.joinMovement} />
    </>
  );
}