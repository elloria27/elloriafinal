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
        <DonationHero content={{
          title: "Support Our Mission",
          subtitle: "Help us make a difference in women's lives",
          backgroundImage: "/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"
        }} />
        <DonationImpact content={{
          title: "Your Impact",
          description: "See how your donation makes a difference",
          impacts: [
            {
              icon: "Heart",
              title: "Support Women",
              description: "Help provide essential feminine care products"
            },
            {
              icon: "Leaf",
              title: "Environmental Impact",
              description: "Support sustainable manufacturing practices"
            },
            {
              icon: "Globe",
              title: "Global Reach",
              description: "Help us expand access to feminine care worldwide"
            }
          ]
        }} />
        <DonationForm content={{
          title: "Make a Donation",
          description: "Your contribution helps us continue our mission",
          buttonText: "Donate Now"
        }} />
        <DonationStories content={{
          title: "Impact Stories",
          description: "Read about the lives you've helped change",
          stories: [
            {
              name: "Sarah Johnson",
              role: "Program Beneficiary",
              quote: "The support I received made a real difference in my life.",
              image: "/lovable-uploads/a7e9335a-6251-4ad6-9140-b04479d11e77.png"
            },
            {
              name: "Maria Garcia",
              role: "Community Leader",
              quote: "These programs have transformed our community.",
              image: "/lovable-uploads/bf47f5ff-e31b-4bdc-8ed0-5c0fc3d5f0d1.png"
            }
          ]
        }} />
        <DonationPartners content={{
          title: "Our Partners",
          description: "Working together for positive change",
          partners: [
            "/lovable-uploads/724f13b7-0a36-4896-b19a-e51981befdd3.png",
            "/lovable-uploads/8ed49df6-713a-4e20-84ce-07e61732b507.png",
            "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
            "/lovable-uploads/a8273123-9231-4d63-8d6f-1802dbe5df98.png"
          ]
        }} />
        <DonationFAQ content={{
          title: "Frequently Asked Questions",
          description: "Find answers to common questions about donations",
          faqs: [
            {
              question: "How are donations used?",
              answer: "Your donations directly support our programs providing feminine care products and education."
            },
            {
              question: "Is my donation tax-deductible?",
              answer: "Yes, all donations are tax-deductible to the extent allowed by law."
            },
            {
              question: "Can I make a recurring donation?",
              answer: "Yes, you can set up monthly or annual recurring donations through our donation form."
            }
          ]
        }} />
        <DonationJoinMovement content={{
          title: "Join Our Movement",
          description: "Be part of the change we're making in the world",
          buttonText: "Get Involved"
        }} />
      </main>
    </div>
  );
};

export default Donation;