import { useState } from "react";
import { Features } from "@/components/Features";
import { HomeHero } from "@/components/home/HomeHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContentBlock, FeaturesContent, HeroContent, ContactFormContent } from "@/types/content-blocks";

const BulkOrders = () => {
  const [loading] = useState(false);

  const heroContent: HeroContent = {
    title: "Bulk Orders",
    subtitle: "Get the best deals for your business",
    shopNowText: "Contact Us",
    learnMoreText: "Learn More"
  };

  const featuresContent: FeaturesContent = {
    title: "Why Choose Bulk Orders?",
    subtitle: "Benefits of ordering in bulk",
    features: [
      {
        icon: "Package",
        title: "Wholesale Pricing",
        description: "Get the best prices with bulk orders"
      },
      {
        icon: "Truck",
        title: "Free Shipping",
        description: "Free shipping on bulk orders"
      },
      {
        icon: "Clock",
        title: "Fast Delivery",
        description: "Quick delivery for bulk orders"
      }
    ]
  };

  const contactContent: ContactFormContent = {
    title: "Contact Us",
    subtitle: "Get in touch for bulk orders",
    submitText: "Send Request"
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex-grow">
      <HomeHero content={heroContent} />
      <Features content={featuresContent} />
      <ContactForm content={contactContent} />
    </main>
  );
};

export default BulkOrders;