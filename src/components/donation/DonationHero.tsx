import { Json } from "@/integrations/supabase/types";

interface DonationHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
  };
}

export const DonationHero = ({ content }: DonationHeroProps) => {
  return (
    <div className="donation-hero" style={{ backgroundImage: `url(${content.backgroundImage})` }}>
      <h1>{content.title}</h1>
      <h2>{content.subtitle}</h2>
    </div>
  );
};
