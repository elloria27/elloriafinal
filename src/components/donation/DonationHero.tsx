import { DonationHeroProps } from "@/types/content-blocks";

export const DonationHero = ({ content }: DonationHeroProps) => {
  return (
    <div className="donation-hero">
      <h1 className="text-2xl font-bold">{content.title}</h1>
      <p className="mt-2">{content.description}</p>
      <a href={content.donationLink} className="btn btn-primary mt-4">
        Donate Now
      </a>
    </div>
  );
};
