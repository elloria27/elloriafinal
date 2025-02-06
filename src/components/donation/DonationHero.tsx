import { DonationHeroProps } from "./types";

export const DonationHero = ({ content }: DonationHeroProps) => {
  return (
    <div className="relative py-20 px-4">
      {content.backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${content.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {content.title || "Support Our Cause"}
        </h1>
        <p className="text-xl text-gray-600">
          {content.subtitle || "Join us in making a difference"}
        </p>
      </div>
    </div>
  );
};